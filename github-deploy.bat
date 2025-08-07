@echo off
echo =========================================
echo AI Spend Dashboard - GitHub API Deployment  
echo =========================================
echo.

REM Change to project directory
cd /d "%~dp0"

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is available
echo.

REM Get GitHub token from user input if not provided as argument
if "%~1"=="" (
    echo 🔑 Please enter your GitHub API token:
    echo    ^(You can create one at https://github.com/settings/tokens^)
    echo    ^(Required scopes: repo, user^)
    echo.
    set /p GITHUB_TOKEN="GitHub Token: "
) else (
    set GITHUB_TOKEN=%~1
)

if "%GITHUB_TOKEN%"=="" (
    echo ❌ GitHub token is required
    pause
    exit /b 1
)

echo.
echo 🚀 Starting automated deployment...
echo.

REM Run the deployment script
node github-deploy.js "%GITHUB_TOKEN%"

echo.
echo Press any key to continue...
pause >nul