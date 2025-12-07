@echo off
title Theater Booking Database Manager

echo.
echo THEATER BOOKING DATABASE MANAGER
echo =================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Try common OpenServer PHP paths
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
        echo 1. Make sure OpenServer is running
        echo 2. Add PHP to system PATH
        echo 3. Edit the path in this file
        echo.
        echo Current directory: %CD%
        echo.
        pause
        exit /b 1
    )
    set PHP_PATH="php"
)

echo [OK] PHP found: %PHP_PATH%
echo [OK] Directory: %CD%
echo.

echo Starting database manager...
echo.

%PHP_PATH% database_manager.php

if errorlevel 1 (
    echo.
    echo [ERROR] Script execution failed!
    echo Check if database_manager.php exists in current directory
)

echo.
echo Press any key to exit...
pause > nul