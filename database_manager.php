<?php
/**
 * Database Management Script for Theater Booking System
 * Використовується для створення, видалення, перевірки та заповнення БД
 */

require_once 'backend/config/database.php';

class DatabaseManager {
    private $pdo;

    public function __construct() {
        try {
            echo "🔌 Підключення до MySQL сервера...\n";

            // Підключення без вказівки БД для створення/видалення
            $dsn = "mysql:host=127.0.1.15;port=3306;charset=utf8mb4";
            $this->pdo = new PDO($dsn, 'root', '');
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            echo "✅ Підключення до MySQL успішне!\n";

        } catch (PDOException $e) {
            echo "❌ Помилка підключення до MySQL: " . $e->getMessage() . "\n";
            echo "💡 Переконайтесь, що:\n";
            echo "   - OpenServer запущений\n";
            echo "   - MySQL сервіс активний\n";
            echo "   - Використовуються правильні налаштування (localhost, root, без пароля)\n\n";

            echo "Натисніть Enter для виходу...";
            if (php_sapi_name() === 'cli') {
                fgets(STDIN);
            }
            die();
        }
    }

    public function createDatabase() {
        try {
            echo "🔨 Створюємо базу даних 'theater_booking'...\n";

            $this->pdo->exec("CREATE DATABASE IF NOT EXISTS theater_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $this->pdo->exec("USE theater_booking");

            // Створення таблиць
            $this->createTables();

            echo "✅ База даних успішно створена!\n";

        } catch (PDOException $e) {
            echo "❌ Помилка створення БД: " . $e->getMessage() . "\n";
        }
    }

    private function createTables() {
        $tables = [
            // Users table
            "CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )",

            // Shows table
            "CREATE TABLE IF NOT EXISTS shows (
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
            )",

            // Bookings table
            "CREATE TABLE IF NOT EXISTS bookings (
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
            )",

            // User interactions table
            "CREATE TABLE IF NOT EXISTS user_interactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                show_id INT NOT NULL,
                interaction_type ENUM('view', 'bookmark', 'attempt_book') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (show_id) REFERENCES shows(id)
            )"
        ];

        foreach ($tables as $sql) {
            $this->pdo->exec($sql);
        }

        // Створення індексів
        $indexes = [
            "CREATE INDEX IF NOT EXISTS idx_shows_date ON shows(date)",
            "CREATE INDEX IF NOT EXISTS idx_shows_scene_type ON shows(scene_type)",
            "CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_bookings_show_id ON bookings(show_id)",
            "CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id)"
        ];

        foreach ($indexes as $sql) {
            $this->pdo->exec($sql);
        }
    }

    public function dropDatabase() {
        try {
            echo "🗑️ Видаляємо базу даних 'theater_booking'...\n";

            $this->pdo->exec("DROP DATABASE IF EXISTS theater_booking");

            echo "✅ База даних успішно видалена!\n";

        } catch (PDOException $e) {
            echo "❌ Помилка видалення БД: " . $e->getMessage() . "\n";
        }
    }

    public function checkDatabase() {
        try {
            echo "🔍 Перевіряємо стан бази даних...\n\n";

            // Перевірка існування БД
            $stmt = $this->pdo->query("SHOW DATABASES LIKE 'theater_booking'");
            if (!$stmt->fetch()) {
                echo "❌ База даних 'theater_booking' не існує!\n";
                return;
            }

            $this->pdo->exec("USE theater_booking");

            // Перевірка таблиць
            $tables = ['users', 'shows', 'bookings', 'user_interactions'];
            echo "📋 Таблиці:\n";

            foreach ($tables as $table) {
                $stmt = $this->pdo->query("SHOW TABLES LIKE '$table'");
                if ($stmt->fetch()) {
                    $count = $this->pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
                    echo "  ✅ $table ($count записів)\n";
                } else {
                    echo "  ❌ $table - не існує\n";
                }
            }

            echo "\n📊 Статистика:\n";

            // Статистика користувачів
            $userCount = $this->pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
            echo "  👥 Користувачів: $userCount\n";

            // Статистика вистав
            $showCount = $this->pdo->query("SELECT COUNT(*) FROM shows")->fetchColumn();
            echo "  🎭 Вистав: $showCount\n";

            // Статистика бронювань
            $bookingCount = $this->pdo->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
            echo "  🎫 Бронювань: $bookingCount\n";

            echo "\n✅ База даних працює нормально!\n";

        } catch (PDOException $e) {
            echo "❌ Помилка перевірки БД: " . $e->getMessage() . "\n";
        }
    }

    public function seedData() {
        try {
            echo "🌱 Заповнюємо базу даних тестовими даними...\n";

            $this->pdo->exec("USE theater_booking");

            // Очищення таблиць
            echo "  🧹 Очищення існуючих даних...\n";
            $this->pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
            $this->pdo->exec("TRUNCATE TABLE user_interactions");
            $this->pdo->exec("TRUNCATE TABLE bookings");
            $this->pdo->exec("TRUNCATE TABLE shows");
            $this->pdo->exec("TRUNCATE TABLE users");
            $this->pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

            // Додавання вистав
            echo "  🎭 Додаємо вистави...\n";
            $showsData = [
                ['Марлен Дітріх', '2024-12-22 18:00:00', 'main', 500, 375, 250, 'Драма', 'XX століття', 'images/marlen.jpg'],
                ['Чикаго', '2024-12-25 19:00:00', 'main', 600, 450, 300, 'Мюзикл', 'XX століття', 'images/chicago.jpg'],
                ['Коли буря вщухне', '2024-12-28 17:30:00', 'main', 300, 225, 150, 'Драма', 'Сучасність', 'images/whenthestormends.jpg'],
                ['Ромео і Джульєтта', '2024-12-29 18:00:00', 'chamber', 650, 500, 350, 'Трагедія', 'Відродження', 'images/romeoandjuliette.jpg'],
                ['Вірні дружини', '2025-01-03 19:30:00', 'main', 400, 335, 270, 'Комедія', 'XVIII століття', 'images/loyalwives.jpg'],
                ['Самотній Захід', '2025-01-06 18:00:00', 'main', 500, 400, 300, 'Драма', 'Дикий Захід', 'images/thelonelywest.jpg'],
                ['Легенди Києва', '2025-01-10 17:00:00', 'chamber', 520, 370, 220, 'Історична', 'Середньовіччя', 'images/thelegendsofkyiv.jpg'],
                ['Ліниві та ніжні', '2025-01-12 19:00:00', 'main', 600, 460, 320, 'Комедія', 'Сучасність', 'images/lazyandtender.jpg'],
                ['Кабаре', '2025-01-16 17:00:00', 'main', 650, 525, 400, 'Мюзикл', 'XX століття', 'images/cabare.jpg'],
                ['Енеїда', '2025-01-23 18:00:00', 'main', 500, 400, 300, 'Епос', 'Античність', 'images/eneida.jpg'],
                ['Готель двух світів', '2025-01-27 19:00:00', 'chamber', 400, 325, 250, 'Містика', 'Сучасність', 'images/thehoteloftwoworlds.jpg'],
                ['Процес', '2025-01-31 17:30:00', 'main', 500, 425, 350, 'Драма', 'XX століття', 'images/process.jpg']
            ];

            $stmt = $this->pdo->prepare("INSERT INTO shows (title, date, scene_type, price_high, price_mid, price_low, genre, period_setting, poster) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

            foreach ($showsData as $show) {
                $stmt->execute($show);
            }

            // Додавання тестових користувачів
            echo "  👥 Додаємо тестових користувачів...\n";
            $usersData = [
                ['admin@theater.com', 'admin123', 'Адміністратор'],
                ['user1@test.com', 'password123', 'Тестовий Користувач 1'],
                ['user2@test.com', 'password123', 'Тестовий Користувач 2']
            ];

            $stmt = $this->pdo->prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");

            foreach ($usersData as $user) {
                $hashedPassword = password_hash($user[1], PASSWORD_DEFAULT);
                $stmt->execute([$user[0], $hashedPassword, $user[2]]);
            }

            // Додавання тестових бронювань
            echo "  🎫 Додаємо тестові бронювання...\n";
            $bookingsData = [
                [1, 1, 5, 10, 375], // User 1, Show 1, Row 5, Seat 10, Mid price
                [1, 2, 3, 5, 450],  // User 1, Show 2, Row 3, Seat 5, Mid price
                [2, 1, 1, 15, 500], // User 2, Show 1, Row 1, Seat 15, High price
                [2, 4, 2, 3, 500]   // User 2, Show 4, Row 2, Seat 3, Mid price (chamber)
            ];

            $stmt = $this->pdo->prepare("INSERT INTO bookings (user_id, show_id, seat_row, seat_number, price) VALUES (?, ?, ?, ?, ?)");

            foreach ($bookingsData as $booking) {
                $stmt->execute($booking);
            }

            echo "\n✅ Тестові дані успішно додані!\n";
            echo "📝 Тестові користувачі:\n";
            echo "  - admin@theater.com / admin123\n";
            echo "  - user1@test.com / password123\n";
            echo "  - user2@test.com / password123\n";

        } catch (PDOException $e) {
            echo "❌ Помилка заповнення даними: " . $e->getMessage() . "\n";
        }
    }
}

// CLI Menu
function showMenu() {
    echo "\n";
    echo "🎭 ======== THEATER BOOKING DB MANAGER ========\n";
    echo "1. 🔨 Створити базу даних\n";
    echo "2. 🗑️  Видалити базу даних\n";
    echo "3. 🔍 Перевірити стан бази даних\n";
    echo "4. 🌱 Заповнити тестовими даними\n";
    echo "5. 🚪 Вихід\n";
    echo "=============================================\n";
    echo "Оберіть опцію (1-5): ";
}

// Main execution
if (php_sapi_name() === 'cli') {
    echo "🎭 THEATER BOOKING DATABASE MANAGER\n";
    echo "====================================\n";
    echo "📂 Поточна директорія: " . __DIR__ . "\n";
    echo "📝 Файл конфігурації: " . __DIR__ . "/backend/config/database.php\n\n";

    // Перевірка наявності конфігураційного файлу
    if (!file_exists(__DIR__ . '/backend/config/database.php')) {
        echo "⚠️  УВАГА: Файл backend/config/database.php не знайдено!\n";
        echo "💡 Переконайтесь, що структура проекту правильна:\n";
        echo "   project/\n";
        echo "   ├── database_manager.php\n";
        echo "   └── backend/config/database.php\n\n";
    }

    $manager = new DatabaseManager();

    while (true) {
        showMenu();
        $choice = trim(fgets(STDIN));

        echo "\n";

        switch ($choice) {
            case '1':
                $manager->createDatabase();
                break;
            case '2':
                echo "⚠️ Ви впевнені, що хочете видалити базу даних? (yes/no): ";
                $confirm = trim(fgets(STDIN));
                if (strtolower($confirm) === 'yes') {
                    $manager->dropDatabase();
                } else {
                    echo "❌ Операція скасована.\n";
                }
                break;
            case '3':
                $manager->checkDatabase();
                break;
            case '4':
                $manager->seedData();
                break;
            case '5':
                echo "👋 До побачення!\n";
                exit(0);
            default:
                echo "❌ Невірний вибір. Спробуйте ще раз.\n";
        }

        echo "\nНатисніть Enter для продовження...";
        fgets(STDIN);
    }
} else {
    echo "❌ Цей скрипт можна запускати тільки з командного рядка (CLI)\n";
}
?>