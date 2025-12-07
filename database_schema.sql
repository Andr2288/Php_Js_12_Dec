-- Theater Booking System Database Schema
-- For OpenServer MySQL

-- Create database
CREATE DATABASE IF NOT EXISTS theater_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE theater_booking;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shows table
CREATE TABLE shows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    scene_type ENUM('main', 'chamber') NOT NULL,
    price_high DECIMAL(10,2) NOT NULL,
    price_mid DECIMAL(10,2) NOT NULL,
    price_low DECIMAL(10,2) NOT NULL,
    genre VARCHAR(100),
    period_setting VARCHAR(100),
    poster VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    seat_row INT NOT NULL,
    seat_number INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (show_id) REFERENCES shows(id),
    UNIQUE KEY unique_seat (show_id, seat_row, seat_number)
);

-- User interactions table for recommendations
CREATE TABLE user_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    interaction_type ENUM('view', 'bookmark', 'attempt_book') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (show_id) REFERENCES shows(id)
);

-- Insert sample shows data based on current afisha
INSERT INTO shows (title, date, scene_type, price_high, price_mid, price_low, genre, period_setting, poster) VALUES 
('Марлен Дітріх', '2024-12-22 18:00:00', 'main', 500, 375, 250, 'Драма', 'XX століття', 'images/marlen.jpg'),
('Чикаго', '2024-12-25 19:00:00', 'main', 600, 450, 300, 'Мюзикл', 'XX століття', 'images/chicago.jpg'),
('Коли буря вщухне', '2024-12-28 17:30:00', 'main', 300, 225, 150, 'Драма', 'Сучасність', 'images/whenthestormends.jpg'),
('Ромео і Джульєтта', '2024-12-29 18:00:00', 'chamber', 650, 500, 350, 'Трагедія', 'Відродження', 'images/romeoandjuliette.jpg'),
('Вірні дружини', '2025-01-03 19:30:00', 'main', 400, 335, 270, 'Комедія', 'XVIII століття', 'images/loyalwives.jpg'),
('Самотній Захід', '2025-01-06 18:00:00', 'main', 500, 400, 300, 'Драма', 'Дикий Захід', 'images/thelonelywest.jpg'),
('Легенди Києва', '2025-01-10 17:00:00', 'chamber', 520, 370, 220, 'Історична', 'Середньовіччя', 'images/thelegendsofkyiv.jpg'),
('Ліниві та ніжні', '2025-01-12 19:00:00', 'main', 600, 460, 320, 'Комедія', 'Сучасність', 'images/lazyandtender.jpg'),
('Кабаре', '2025-01-16 17:00:00', 'main', 650, 525, 400, 'Мюзикл', 'XX століття', 'images/cabare.jpg'),
('Енеїда', '2025-01-23 18:00:00', 'main', 500, 400, 300, 'Епос', 'Античність', 'images/eneida.jpg'),
('Готель двух світів', '2025-01-27 19:00:00', 'chamber', 400, 325, 250, 'Містика', 'Сучасність', 'images/thehoteloftwoworlds.jpg'),
('Процес', '2025-01-31 17:30:00', 'main', 500, 425, 350, 'Драма', 'XX століття', 'images/process.jpg');

-- Create indexes for better performance
CREATE INDEX idx_shows_date ON shows(date);
CREATE INDEX idx_shows_scene_type ON shows(scene_type);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_show_id ON bookings(show_id);
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
