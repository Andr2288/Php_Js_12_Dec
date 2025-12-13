<?php
session_start();

// CORS вже встановлено в server.php, але додаємо для сумісності з Apache
if (!headers_sent()) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
    if (in_array($origin, ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'])) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Accept');
        header('Content-Type: application/json; charset=utf-8');
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Return authentication status
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'authenticated' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['user_email'],
            'name' => $_SESSION['user_name'],
            'created_at' => $_SESSION['user_created_at'] ?? null
        ]
    ]);
} else {
    echo json_encode([
        'authenticated' => false
    ]);
}