# AI Spend Dashboard Deployment Script for Windows
# PowerShell script for Windows deployment

param(
    [switch]$Build,
    [switch]$Start,
    [switch]$Stop,
    [switch]$Logs,
    [switch]$Status,
    [string]$Service = ""
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 AI Spend Dashboard Management Script" -ForegroundColor Cyan

# Check if Docker is available
try {
    docker --version | Out-Null
    docker-compose --version | Out-Null
}
catch {
    Write-Host "❌ Docker or Docker Compose not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

# Change to project directory
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

if ($Build -or $Start) {
    Write-Host "📁 Checking directories..." -ForegroundColor Yellow
    
    # Create directories if they don't exist
    @("secrets", "ssl", "logs") | ForEach-Object {
        if (!(Test-Path $_)) {
            New-Item -ItemType Directory -Path $_ -Force | Out-Null
            Write-Host "Created directory: $_" -ForegroundColor Green
        }
    }

    # Check for secret files
    if (!(Test-Path "secrets\db_password.txt")) {
        Write-Host "⚠️  Database password file not found. Creating with random password..." -ForegroundColor Yellow
        $randomPassword = [System.Web.Security.Membership]::GeneratePassword(32, 8)
        $randomPassword | Out-File -FilePath "secrets\db_password.txt" -Encoding UTF8 -NoNewline
    }

    if (!(Test-Path "secrets\openai_api_key.txt")) {
        Write-Host "⚠️  OpenAI API key file not found. Creating placeholder..." -ForegroundColor Yellow
        "placeholder-openai-key" | Out-File -FilePath "secrets\openai_api_key.txt" -Encoding UTF8 -NoNewline
    }

    if (!(Test-Path "secrets\anthropic_api_key.txt")) {
        Write-Host "⚠️  Anthropic API key file not found. Creating placeholder..." -ForegroundColor Yellow
        "placeholder-anthropic-key" | Out-File -FilePath "secrets\anthropic_api_key.txt" -Encoding UTF8 -NoNewline
    }

    # Check for SSL certificates
    if (!(Test-Path "ssl\cert.pem") -or !(Test-Path "ssl\privkey.pem")) {
        Write-Host "🔒 SSL certificates not found. You'll need to add them manually for HTTPS." -ForegroundColor Yellow
        Write-Host "   Place cert.pem and privkey.pem in the ssl\ directory" -ForegroundColor Gray
    }
}

if ($Build) {
    Write-Host "🔨 Building containers..." -ForegroundColor Yellow
    docker-compose build --no-cache
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
}

if ($Start) {
    Write-Host "🚀 Starting services..." -ForegroundColor Yellow
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Services started successfully" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
        Write-Host "   HTTPS: https://10.10.10.20:9443" -ForegroundColor White
        Write-Host "   HTTP:  http://localhost:3000" -ForegroundColor White
        Write-Host ""
        Write-Host "📊 Features available:" -ForegroundColor Cyan
        Write-Host "   - Real-time spend analytics" -ForegroundColor White
        Write-Host "   - OpenAI API integration" -ForegroundColor White
        Write-Host "   - Manual Anthropic data entry" -ForegroundColor White
        Write-Host "   - Interactive charts and filters" -ForegroundColor White
        
    } else {
        Write-Host "❌ Failed to start services" -ForegroundColor Red
        exit 1
    }
}

if ($Stop) {
    Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
    docker-compose down
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Services stopped" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to stop services" -ForegroundColor Red
    }
}

if ($Logs) {
    if ($Service) {
        Write-Host "📋 Showing logs for $Service..." -ForegroundColor Yellow
        docker-compose logs -f $Service
    } else {
        Write-Host "📋 Showing all logs..." -ForegroundColor Yellow
        docker-compose logs -f
    }
}

if ($Status) {
    Write-Host "📊 Service status:" -ForegroundColor Yellow
    docker-compose ps
    
    Write-Host ""
    Write-Host "💾 Volume usage:" -ForegroundColor Yellow
    docker volume ls | Where-Object { $_ -match "ai.*dashboard" }
}

if (!($Build -or $Start -or $Stop -or $Logs -or $Status)) {
    Write-Host ""
    Write-Host "Usage: .\scripts\deploy.ps1 [OPTIONS]" -ForegroundColor White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -Build          Build Docker containers" -ForegroundColor White
    Write-Host "  -Start          Start the application" -ForegroundColor White
    Write-Host "  -Stop           Stop the application" -ForegroundColor White
    Write-Host "  -Logs           View logs (-Service <name> for specific service)" -ForegroundColor White
    Write-Host "  -Status         Show service status" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\scripts\deploy.ps1 -Build -Start" -ForegroundColor Gray
    Write-Host "  .\scripts\deploy.ps1 -Logs" -ForegroundColor Gray
    Write-Host "  .\scripts\deploy.ps1 -Logs -Service ai-dashboard" -ForegroundColor Gray
    Write-Host "  .\scripts\deploy.ps1 -Status" -ForegroundColor Gray
}