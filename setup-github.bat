@echo off
echo =========================================
echo AI Spend Dashboard - GitHub Setup
echo =========================================
echo.

REM Change to project directory
cd /d "%~dp0"

echo 📁 Current directory: %CD%
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Git is available
echo.

REM Initialize git repository
echo 🔧 Initializing git repository...
git init

REM Add all files
echo 📦 Adding all files to git...
git add .

REM Create initial commit
echo 💾 Creating initial commit...
git commit -m "Initial commit: AI Spend Dashboard with GitHub deployment"

REM Add remote repository
echo 🔗 Adding GitHub remote repository...
git remote add origin https://github.com/huegott/ai-spend-dashboard.git

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Code pushed to GitHub
    echo.
    echo 🌐 Repository URL: https://github.com/huegott/ai-spend-dashboard
    echo.
    echo 📋 Next Steps:
    echo 1. Go to Portainer at https://10.10.10.20:9443
    echo 2. Create new Stack named: ai-spend-dashboard  
    echo 3. Use the configuration from deploy-portainer-stack.yml
    echo 4. Set environment variables for DB_PASSWORD and API keys
    echo 5. Deploy the stack
    echo 6. Access dashboard at https://10.10.10.20:8881
    echo.
) else (
    echo.
    echo ❌ Failed to push to GitHub
    echo.
    echo 🔍 Possible issues:
    echo - Repository doesn't exist on GitHub yet
    echo - Authentication required (you may need to login)
    echo - Network connectivity issues
    echo.
    echo 📝 Manual steps:
    echo 1. Go to https://github.com/huegott
    echo 2. Create new repository named: ai-spend-dashboard
    echo 3. Run this script again
)

echo.
echo Press any key to continue...
pause >nul