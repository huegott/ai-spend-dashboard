#!/bin/bash

echo "========================================="
echo "AI Spend Dashboard - GitHub API Deployment"  
echo "========================================="
echo

# Change to script directory
cd "$(dirname "$0")"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is available"
echo

# Get GitHub token from user input if not provided as argument
if [ -z "$1" ]; then
    echo "🔑 Please enter your GitHub API token:"
    echo "   (You can create one at https://github.com/settings/tokens)"
    echo "   (Required scopes: repo, user)"
    echo
    read -p "GitHub Token: " GITHUB_TOKEN
else
    GITHUB_TOKEN="$1"
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GitHub token is required"
    exit 1
fi

echo
echo "🚀 Starting automated deployment..."
echo

# Run the deployment script
node github-deploy.js "$GITHUB_TOKEN"

echo
echo "Press any key to continue..."
read -n 1