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

try {
    $pdo = DatabaseConfig::getConnection();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get bookings for show (to check occupied seats)
        $showId = $_GET['show_id'] ?? null;

        if (!$showId) {
            http_response_code(400);
            echo json_encode(['error' => 'Show ID required']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT seat_row, seat_number FROM bookings WHERE show_id = ?");
        $stmt->execute([$showId]);
        $bookings = $stmt->fetchAll();

        $bookedSeats = array_map(function($booking) {
            return [
                'row' => (int)$booking['seat_row'],
                'seat' => (int)$booking['seat_number']
            ];
        }, $bookings);

        echo json_encode(['bookedSeats' => $bookedSeats]);

    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create new booking
        $data = json_decode(file_get_contents('php://input'), true);

        $showId = $data['showId'] ?? null;
        $seats = $data['seats'] ?? [];
        $totalPrice = $data['totalPrice'] ?? 0;
        $userId = $_SESSION['user_id'];

        // Validation
        if (!$showId || empty($seats) || !$totalPrice) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid booking data']);
            exit;
        }

        if (count($seats) > 6) {
            http_response_code(400);
            echo json_encode(['error' => 'Maximum 6 seats per booking']);
            exit;
        }

        // Check if show exists
        $stmt = $pdo->prepare("SELECT id, price_high, price_mid, price_low FROM shows WHERE id = ?");
        $stmt->execute([$showId]);
        $show = $stmt->fetch();

        if (!$show) {
            http_response_code(404);
            echo json_encode(['error' => 'Show not found']);
            exit;
        }

        // Start transaction
        $pdo->beginTransaction();

        try {
            // Check if seats are still available
            foreach ($seats as $seat) {
                $stmt = $pdo->prepare("SELECT id FROM bookings WHERE show_id = ? AND seat_row = ? AND seat_number = ?");
                $stmt->execute([$showId, $seat['row'], $seat['seat']]);

                if ($stmt->fetch()) {
                    throw new Exception("Seat {$seat['row']}-{$seat['seat']} is already booked");
                }
            }

            // Insert bookings
            $bookingIds = [];
            foreach ($seats as $seat) {
                // Determine price based on row
                $price = $show['price_low']; // Default
                if ($seat['row'] <= 3) {
                    $price = $show['price_high'];
                } elseif ($seat['row'] <= 7) {
                    $price = $show['price_mid'];
                }

                $stmt = $pdo->prepare("INSERT INTO bookings (user_id, show_id, seat_row, seat_number, price) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$userId, $showId, $seat['row'], $seat['seat'], $price]);
                $bookingIds[] = $pdo->lastInsertId();
            }

            $pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'bookingId' => $bookingIds[0],
                'message' => 'Booking successful'
            ]);

        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(409);
            echo json_encode(['error' => $e->getMessage()]);
        }

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }

} catch (PDOException $e) {
    error_log("Booking error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>