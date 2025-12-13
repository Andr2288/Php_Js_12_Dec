<?php
session_start();

require_once '../config/cors.php';

// Set CORS headers
setCorsHeaders();
handlePreflight();

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
?>