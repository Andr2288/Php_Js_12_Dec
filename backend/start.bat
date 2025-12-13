@echo off
title Theater Booking - PHP Server

echo.
echo ================================================
echo   THEATER BOOKING SYSTEM - PHP SERVER
echo ================================================
echo.

REM Change to backend directory
cd /d "%~dp0backend"

REM Check if backend directory exists
if not exist "server.php" (
    echo [ERROR] server.php not found in backend directory!
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Try to find PHP
set PHP_PATH=""
if exist "C:\OpenServer\modules\php\PHP_8.1\php.exe" set PHP_PATH="C:\OpenServer\modules\php\PHP_8.1\php.exe"
if exist "C:\OpenServer\modules\php\PHP_8.0\php.exe" set PHP_PATH="C:\OpenServer\modules\php\PHP_8.0\php.exe"
if exist "C:\OpenServer\modules\php\PHP_7.4\php.exe" set PHP_PATH="C:\OpenServer\modules\php\PHP_7.4\php.exe"
if exist "C:\OpenServer\modules\php\PHP_8.2\php.exe" set PHP_PATH="C:\OpenServer\modules\php\PHP_8.2\php.exe"

REM If no specific path found, try system PATH
if %PHP_PATH%=="" (
    php --version > nul 2>&1
    if errorlevel 1 (
        echo [ERROR] PHP not found!
        echo.
        echo Solutions:
        echo 1. Make sure OpenServer is installed
        echo 2. Add PHP to system PATH
        echo 3. Edit the PHP_PATH in this file
        echo.
        pause
        exit /b 1
    )
    set PHP_PATH="php"
)

echo [OK] PHP found: %PHP_PATH%
echo [OK] Backend directory: %CD%
echo.

REM Check if MySQL is running
echo [INFO] Checking MySQL connection...
%PHP_PATH% -r "try { new PDO('mysql:host=127.0.1.15;port=3306', 'root', ''); echo '[OK] MySQL connection successful'; } catch(PDOException $e) { echo '[ERROR] MySQL connection failed: ' . $e->getMessage(); exit(1); }"

if errorlevel 1 (
    echo.
    echo [WARNING] Make sure MySQL is running in OpenServer!
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Server starting on http://localhost:8000
echo   Press Ctrl+C to stop
echo ================================================
echo.

REM Start PHP built-in server
%PHP_PATH% -S localhost:8000 server.php

pause