<?php
/**
 * PHP Built-in Server Router
 * Handles routing for the Theater Booking System backend
 */

// Apply CORS headers to ALL requests
require_once __DIR__ . '/config/cors.php';

// Get the requested URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Log request for debugging
error_log("Request: {$_SERVER['REQUEST_METHOD']} $uri");

// Serve static files directly
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// Route API requests
if (strpos($uri, '/api/') === 0) {
    // Remove /api/ prefix and route to appropriate file
    $route = substr($uri, 5); // Remove "/api/"

    if ($route === 'shows' || $route === 'shows.php') {
        require __DIR__ . '/api/shows.php';
        exit;
    }

    if ($route === 'bookings' || $route === 'bookings.php') {
        require __DIR__ . '/api/bookings.php';
        exit;
    }
}

// Route auth requests
if (strpos($uri, '/auth/') === 0) {
    $route = substr($uri, 6); // Remove "/auth/"

    if ($route === 'register' || $route === 'register.php') {
        require __DIR__ . '/auth/register.php';
        exit;
    }

    if ($route === 'login' || $route === 'login.php') {
        require __DIR__ . '/auth/login.php';
        exit;
    }

    if ($route === 'logout' || $route === 'logout.php') {
        require __DIR__ . '/auth/logout.php';
        exit;
    }

    if ($route === 'check' || $route === 'check.php') {
        require __DIR__ . '/auth/check.php';
        exit;
    }
}

// 404 for other requests
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not Found', 'uri' => $uri]);