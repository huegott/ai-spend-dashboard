#!/bin/bash

echo "========================================="
echo "AI Spend Dashboard - GitHub Setup"
echo "========================================="
echo

# Change to script directory
cd "$(dirname "$0")"

echo "📁 Current directory: $(pwd)"
echo

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed"
    echo "Please install Git first: https://git-scm.com/"
    exit 1
fi

echo "✅ Git is available"
echo

# Initialize git repository
echo "🔧 Initializing git repository..."
git init

# Add all files
echo "📦 Adding all files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: AI Spend Dashboard with GitHub deployment"

# Add remote repository
echo "🔗 Adding GitHub remote repository..."
git remote add origin https://github.com/huegott/ai-spend-dashboard.git

# Push to GitHub
echo "🚀 Pushing to GitHub..."
if git push -u origin main; then
    echo
    echo "✅ SUCCESS! Code pushed to GitHub"
    echo
    echo "🌐 Repository URL: https://github.com/huegott/ai-spend-dashboard"
    echo
    echo "📋 Next Steps:"
    echo "1. Go to Portainer at https://10.10.10.20:9443"
    echo "2. Create new Stack named: ai-spend-dashboard"  
    echo "3. Use the configuration from deploy-portainer-stack.yml"
    echo "4. Set environment variables for DB_PASSWORD and API keys"
    echo "5. Deploy the stack"
    echo "6. Access dashboard at https://10.10.10.20:8881"
    echo
else
    echo
    echo "❌ Failed to push to GitHub"
    echo
    echo "🔍 Possible issues:"
    echo "- Repository doesn't exist on GitHub yet"
    echo "- Authentication required (you may need to login)"
    echo "- Network connectivity issues"
    echo
    echo "📝 Manual steps:"
    echo "1. Go to https://github.com/huegott"
    echo "2. Create new repository named: ai-spend-dashboard"
    echo "3. Run this script again"
fi

echo
echo "Press any key to continue..."
read -n 1