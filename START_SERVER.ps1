#!/usr/bin/env pwsh
# Kanha Graphics - Development Server Launcher (PowerShell)
# Right-click on this file > "Run with PowerShell" to use

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  🚀 KANHA GRAPHICS - Development Server" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
$projectPath = "C:\Users\ayush\Desktop\KG\kanha-graphics"

if (-not (Test-Path $projectPath)) {
    Write-Host "❌ Project directory not found at:" -ForegroundColor Red
    Write-Host "   $projectPath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Set-Location $projectPath

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Get local IP address
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*" } | Select-Object -First 1).IPAddress

Write-Host ""
Write-Host "✅ Starting development server..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Access your website from:" -ForegroundColor Cyan
Write-Host "   • This Computer: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Yellow
Write-Host "   • Other Devices: " -NoNewline
Write-Host "http://$ipAddress`:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 On your phone/tablet, visit:" -ForegroundColor Cyan
Write-Host "   " -NoNewline
Write-Host "http://$ipAddress`:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "🛑 Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the server
npm run dev

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Server failed to start!" -ForegroundColor Red
    Write-Host "Make sure Node.js and npm are installed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
