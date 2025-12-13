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

    // Get user bookings with show details
    $stmt = $pdo->prepare("
        SELECT 
            b.id as booking_id,
            b.seat_row,
            b.seat_number,
            b.price,
            b.created_at as booking_date,
            s.title as show_title,
            s.date as show_date,
            s.genre,
            s.scene_type,
            s.poster
        FROM bookings b
        JOIN shows s ON b.show_id = s.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    ");
    $stmt->execute([$userId]);
    $bookings = $stmt->fetchAll();

    // Group bookings by show and booking time to combine seats
    $groupedBookings = [];
    foreach ($bookings as $booking) {
        $key = $booking['booking_id'] . '_' . $booking['show_title'];
        
        if (!isset($groupedBookings[$key])) {
            $groupedBookings[$key] = [
                'show_title' => $booking['show_title'],
                'show_date' => $booking['show_date'],
                'genre' => $booking['genre'],
                'scene_type' => $booking['scene_type'],
                'poster' => $booking['poster'],
                'booking_date' => $booking['booking_date'],
                'seats' => [],
                'total_price' => 0,
                'seats_count' => 0
            ];
        }
        
        $groupedBookings[$key]['seats'][] = "Ряд {$booking['seat_row']}, місце {$booking['seat_number']}";
        $groupedBookings[$key]['total_price'] += (float)$booking['price'];
        $groupedBookings[$key]['seats_count']++;
    }

    // Format seats and convert to indexed array
    $formattedBookings = array_values($groupedBookings);
    foreach ($formattedBookings as &$booking) {
        $booking['seats'] = implode('; ', $booking['seats']);
    }

    echo json_encode([
        'success' => true,
        'bookings' => $formattedBookings
    ]);

} catch (PDOException $e) {
    error_log("User bookings fetch error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch bookings']);
}
