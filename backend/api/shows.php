<?php
require_once '../config/cors.php';
require_once '../config/database.php';

// Set CORS headers
setCorsHeaders();
handlePreflight();

// Check request method
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

    // Build SQL query
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

    // Return shows
    echo json_encode($shows);

} catch (PDOException $e) {
    error_log("Shows fetch error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch shows']);
}
?>