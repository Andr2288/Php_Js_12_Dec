<?php
// CORS Configuration
function setCorsHeaders() {
    // Allowed origins for development and production
    $allowed_origins = [
        'http://localhost:5173',        // Vite dev server
        'http://localhost:3000',        // Alternative dev port
        'http://127.0.0.1:5173',
        'http://theater-booking.local'  // Production domain
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    // Check if origin is allowed
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // Default to first allowed origin if none match
        header("Access-Control-Allow-Origin: http://localhost:5173");
    }

    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // 24 hours
}

// Handle preflight requests
function handlePreflight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
?>