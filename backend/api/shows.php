<?php
// CORS headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://theater-booking.local');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $pdo = DatabaseConfig::getConnection();

    // Get optional filters from query params
    $sceneType = $_GET['scene_type'] ?? null;
    $genre = $_GET['genre'] ?? null;
    $dateFrom = $_GET['date_from'] ?? null;

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

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch shows']);
}
?>