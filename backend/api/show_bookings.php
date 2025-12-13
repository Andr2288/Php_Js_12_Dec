<?php
session_start();

require_once '../config/cors.php';
require_once '../config/database.php';

// Set CORS headers
setCorsHeaders();
handlePreflight();

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit;
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get show ID from URL parameter
$showId = $_GET['show_id'] ?? null;

if (!$showId) {
    http_response_code(400);
    echo json_encode(['error' => 'Show ID required']);
    exit;
}

try {
    $pdo = DatabaseConfig::getConnection();

    // Get all booked seats for this show
    $stmt = $pdo->prepare("SELECT seat_row, seat_number FROM bookings WHERE show_id = ?");
    $stmt->execute([$showId]);
    $bookings = $stmt->fetchAll();

    // Format response
    $bookedSeats = array_map(function($booking) {
        return [
            'row' => (int)$booking['seat_row'],
            'seat' => (int)$booking['seat_number']
        ];
    }, $bookings);

    echo json_encode([
        'success' => true,
        'bookedSeats' => $bookedSeats
    ]);

} catch (PDOException $e) {
    error_log("Fetch bookings error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch bookings']);
}
?>