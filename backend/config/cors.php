<?php
/**
 * CORS Configuration
 * Викликати на початку кожного PHP файлу для правильної роботи з frontend
 */

// Дозволені origins
$allowedOrigins = [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',  // Альтернативний порт
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://theater-booking.local'
];

// Отримуємо origin з запиту
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Перевіряємо чи origin дозволений
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Fallback для локальної розробки
    header('Access-Control-Allow-Origin: http://localhost:5173');
}

// Дозволяємо credentials (cookies, sessions)
header('Access-Control-Allow-Credentials: true');

// Дозволені методи
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Дозволені заголовки
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');

// Expose headers
header('Access-Control-Expose-Headers: Content-Length, Content-Type');

// Content-Type
header('Content-Type: application/json; charset=utf-8');

// Max age для preflight запитів (24 години)
header('Access-Control-Max-Age: 86400');

// Обробка preflight OPTIONS запиту
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}