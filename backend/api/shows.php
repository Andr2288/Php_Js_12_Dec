<?php
// Start session at the beginning
session_start();

require_once __DIR__ . '/../config/database.php';

// CORS Headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $pdo = DatabaseConfig::getConnection();

        // Get optional filters from query params
        $sceneType = $_GET['scene_type'] ?? null;
        $genre = $_GET['genre'] ?? null;
        $dateFrom = $_GET['date_from'] ?? null;
        $showId = $_GET['show_id'] ?? null; // Для отримання конкретної вистави

        if ($showId) {
            // Отримуємо конкретну виставу
            $stmt = $pdo->prepare("SELECT * FROM shows WHERE id = ?");
            $stmt->execute([$showId]);
            $show = $stmt->fetch();

            if ($show) {
                // Записуємо перегляд для авторизованих користувачів
                if (isset($_SESSION['user_id'])) {
                    try {
                        $stmt = $pdo->prepare("
                            INSERT INTO user_interactions (user_id, show_id, interaction_type) 
                            VALUES (?, ?, 'view')
                        ");
                        $stmt->execute([$_SESSION['user_id'], $showId]);
                    } catch (PDOException $e) {
                        // Ігноруємо дублікати та інші помилки
                        error_log("View tracking error: " . $e->getMessage());
                    }
                }

                echo json_encode($show);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Show not found']);
            }
        } else {
            // Отримуємо список вистав з фільтрами
            $sql = "SELECT * FROM shows WHERE 1=1";
            $params = [];

            if ($sceneType) {
                $sql .= " AND scene_type = ?";
                $params[] = $sceneType;
            }

            if ($genre) {
                $sql .= " AND genre LIKE ?";
                $params[] = "%$genre%";
            }

            if ($dateFrom) {
                $sql .= " AND date >= ?";
                $params[] = $dateFrom;
            }

            $sql .= " ORDER BY date ASC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $shows = $stmt->fetchAll();

            echo json_encode($shows);
        }

    } catch (PDOException $e) {
        error_log("Shows fetch error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch shows']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Записати взаємодію користувача (bookmark, attempt_book тощо)

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }

    try {
        // Read raw input with debug logging
        $input = file_get_contents('php://input');
        error_log("POST input: " . $input);

        $data = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log("JSON decode error: " . json_last_error_msg());
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON data']);
            exit;
        }

        $showId = $data['show_id'] ?? null;
        $interactionType = $data['interaction_type'] ?? null;

        error_log("Show ID: $showId, Interaction: $interactionType, User: " . $_SESSION['user_id']);

        if (!$showId || !$interactionType) {
            http_response_code(400);
            echo json_encode(['error' => 'Show ID and interaction type required']);
            exit;
        }

        $allowedTypes = ['view', 'bookmark', 'attempt_book'];
        if (!in_array($interactionType, $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid interaction type']);
            exit;
        }

        $pdo = DatabaseConfig::getConnection();

        // Check if show exists first
        $stmt = $pdo->prepare("SELECT id FROM shows WHERE id = ?");
        $stmt->execute([$showId]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Show not found']);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO user_interactions (user_id, show_id, interaction_type) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$_SESSION['user_id'], $showId, $interactionType]);

        echo json_encode(['success' => true]);

    } catch (PDOException $e) {
        error_log("Interaction save error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save interaction: ' . $e->getMessage()]);
    } catch (Exception $e) {
        error_log("General error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
    }

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}