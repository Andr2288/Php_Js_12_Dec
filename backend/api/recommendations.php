<?php
session_start();

require_once __DIR__ . '/../config/database.php';

// CORS Headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit;
}

try {
    $pdo = DatabaseConfig::getConnection();
    $userId = $_SESSION['user_id'];

    // Алгоритм рекомендацій
    $recommendations = [];

    // 1. Отримуємо історію взаємодій користувача (бронювання, перегляди)
    $stmt = $pdo->prepare("
        SELECT DISTINCT s.genre, s.period_setting, s.scene_type 
        FROM bookings b
        JOIN shows s ON b.show_id = s.id
        WHERE b.user_id = ?
        
        UNION
        
        SELECT DISTINCT s.genre, s.period_setting, s.scene_type 
        FROM user_interactions ui
        JOIN shows s ON ui.show_id = s.id
        WHERE ui.user_id = ?
    ");
    $stmt->execute([$userId, $userId]);
    $userPreferences = $stmt->fetchAll();

    // 2. Отримуємо ID вистав, які користувач вже бронював
    $stmt = $pdo->prepare("
        SELECT DISTINCT show_id 
        FROM bookings 
        WHERE user_id = ?
    ");
    $stmt->execute([$userId]);
    $bookedShows = array_column($stmt->fetchAll(), 'show_id');

    if (!empty($userPreferences)) {
        // Користувач має історію - рекомендуємо на основі вподобань
        
        // Створюємо умови WHERE для схожих вистав
        $genreConditions = [];
        $periodConditions = [];
        $sceneConditions = [];
        $params = [];
        
        foreach ($userPreferences as $pref) {
            if ($pref['genre']) {
                $genreConditions[] = 'genre LIKE ?';
                $params[] = '%' . $pref['genre'] . '%';
            }
            if ($pref['period_setting']) {
                $periodConditions[] = 'period_setting LIKE ?';
                $params[] = '%' . $pref['period_setting'] . '%';
            }
            if ($pref['scene_type']) {
                $sceneConditions[] = 'scene_type = ?';
                $params[] = $pref['scene_type'];
            }
        }

        $whereConditions = [];
        if (!empty($genreConditions)) {
            $whereConditions[] = '(' . implode(' OR ', $genreConditions) . ')';
        }
        if (!empty($periodConditions)) {
            $whereConditions[] = '(' . implode(' OR ', $periodConditions) . ')';
        }
        if (!empty($sceneConditions)) {
            $whereConditions[] = '(' . implode(' OR ', $sceneConditions) . ')';
        }

        $sql = "
            SELECT *, 
                   CASE 
                       WHEN date > NOW() THEN 1 
                       ELSE 0 
                   END as is_upcoming
            FROM shows 
            WHERE date > NOW()
        ";

        if (!empty($whereConditions)) {
            $sql .= " AND (" . implode(' OR ', $whereConditions) . ")";
        }

        // Виключаємо заброньовані вистави
        if (!empty($bookedShows)) {
            $sql .= " AND id NOT IN (" . implode(',', array_fill(0, count($bookedShows), '?')) . ")";
            $params = array_merge($params, $bookedShows);
        }

        $sql .= " ORDER BY date ASC LIMIT 6";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $recommendations = $stmt->fetchAll();

    } else {
        // Новий користувач - рекомендуємо популярні майбутні вистави
        $sql = "
            SELECT s.*, COUNT(b.id) as booking_count
            FROM shows s
            LEFT JOIN bookings b ON s.id = b.show_id
            WHERE s.date > NOW()
        ";

        if (!empty($bookedShows)) {
            $sql .= " AND s.id NOT IN (" . implode(',', array_fill(0, count($bookedShows), '?')) . ")";
            $params = $bookedShows;
        } else {
            $params = [];
        }

        $sql .= "
            GROUP BY s.id
            ORDER BY booking_count DESC, s.date ASC
            LIMIT 6
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $recommendations = $stmt->fetchAll();
    }

    // Додаємо бали релевантності для сортування (якщо є історія)
    if (!empty($userPreferences) && !empty($recommendations)) {
        foreach ($recommendations as &$show) {
            $score = 0;
            
            foreach ($userPreferences as $pref) {
                if ($pref['genre'] && stripos($show['genre'], $pref['genre']) !== false) {
                    $score += 3; // Жанр - найважливіше
                }
                if ($pref['period_setting'] && stripos($show['period_setting'], $pref['period_setting']) !== false) {
                    $score += 2; // Період
                }
                if ($pref['scene_type'] && $show['scene_type'] === $pref['scene_type']) {
                    $score += 1; // Тип сцени
                }
            }
            
            $show['relevance_score'] = $score;
        }
        
        // Сортуємо за релевантністю
        usort($recommendations, function($a, $b) {
            return $b['relevance_score'] - $a['relevance_score'];
        });
    }

    echo json_encode([
        'success' => true,
        'recommendations' => array_slice($recommendations, 0, 6) // Максимум 6 рекомендацій
    ]);

} catch (PDOException $e) {
    error_log("Recommendations fetch error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch recommendations']);
}
