<?php
session_start();

// CORS вже встановлено в server.php, але додаємо для сумісності з Apache
if (!headers_sent()) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
    if (in_array($origin, ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'])) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Accept');
        header('Content-Type: application/json; charset=utf-8');
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Destroy session
$_SESSION = array();

// Destroy session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Logout successful'
]);