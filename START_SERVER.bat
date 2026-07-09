@echo off
REM Kanha Graphics - Quick Start Script for Windows
REM This script starts the development server with a single click

echo.
echo =========================================
echo   🚀 KANHA GRAPHICS - Development Server
echo =========================================
echo.

REM Navigate to the project directory
cd /d "C:\Users\ayush\Desktop\KG\kanha-graphics" || (
    echo ❌ Project directory not found!
    echo Please update the path in this batch file.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4 Address"') do (
    set "IP=%%a"
    goto :break
)
:break
set "IP=%IP:~1%"

REM Start the development server
echo.
echo ✅ Starting development server...
echo.
echo 📱 Access your website from:
echo    • This Computer: http://localhost:3000
echo    • Other Devices: http://%IP%:3000
echo.
echo 📱 On your phone, visit: http://%IP%:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

REM If npm run dev fails
if %errorlevel% neq 0 (
    echo.
    echo ❌ Server failed to start!
    echo Make sure Node.js and npm are installed.
    pause
)
