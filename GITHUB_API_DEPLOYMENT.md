# GitHub API Automated Deployment

## Overview
This method uses the GitHub API with your personal access token to automatically:
- Create the GitHub repository
- Push all code to GitHub
- Configure everything for Portainer deployment

## Prerequisites
1. GitHub personal access token
2. Node.js installed on your system
3. Git installed on your system

## Step 1: Create GitHub Personal Access Token

1. Go to **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Note**: `AI Spend Dashboard Deployment`
4. **Scopes**: Select these permissions:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `user` (Update user data) 
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

## Step 2: Run Automated Deployment

### Windows:
```batch
# Option 1: Run with prompt for token
github-deploy.bat

# Option 2: Run with token as argument
github-deploy.bat your_github_token_here
```

### Linux/Mac:
```bash
# Option 1: Run with prompt for token
./github-deploy.sh

# Option 2: Run with token as argument
./github-deploy.sh your_github_token_here

# Option 3: Set environment variable
export GITHUB_TOKEN=your_github_token_here
node github-deploy.js
```

## What the Script Does

### ✅ **Automated Steps:**

1. **Checks if repository exists**
   - Uses GitHub API to check for existing repo
   - If exists, skips creation step

2. **Creates GitHub repository** (if needed)
   - Repository name: `ai-spend-dashboard`
   - Description: AI spend tracking dashboard
   - Public repository
   - Issues enabled

3. **Initializes Git**
   - Creates local git repository
   - Adds all files to git
   - Creates initial commit

4. **Pushes to GitHub**
   - Uses token authentication
   - Pushes code to main branch
   - Sets up remote tracking

5. **Displays deployment instructions**
   - Shows exact Portainer configuration
   - Provides environment variables
   - Shows next steps

### 📋 **Script Output:**
```
🚀 AI Spend Dashboard - Automated GitHub Deployment
====================================================

🔍 Checking if repository exists...
📦 Creating GitHub repository...
✅ Repository created: https://github.com/huegott/ai-spend-dashboard
🔧 Setting up git and pushing code...
   Initializing git repository...
   Adding files to git...
   Creating commit...
   Adding GitHub remote...
   Pushing to GitHub...
✅ Code pushed to GitHub successfully!

🎉 SUCCESS! Repository created and code pushed!
```

## Step 3: Deploy in Portainer

After the script completes successfully:

1. **Go to Portainer**: https://10.10.10.20:9443
2. **Stacks** → **Add stack**
3. **Name**: `ai-spend-dashboard`
4. **Web editor** - The script will display the exact configuration to paste
5. **Environment variables**:
   ```
   DB_PASSWORD=ai_spend_secure_password_2024
   OPENAI_API_KEY=sk-your-openai-key-here
   ANTHROPIC_API_KEY=your-anthropic-key-here
   ```
6. **Deploy the stack**

## Step 4: Access Dashboard

- **URL**: https://10.10.10.20:8881
- **Repository**: https://github.com/huegott/ai-spend-dashboard

## Advantages of GitHub API Method

✅ **Fully Automated** - No manual repository creation
✅ **Token Authentication** - Secure, no password needed  
✅ **Error Handling** - Checks for existing repos, handles failures
✅ **Professional Setup** - Proper repository description and settings
✅ **One Command** - Everything happens automatically

## Troubleshooting

### Token Issues
- **Invalid token**: Make sure you copied the full token
- **Insufficient permissions**: Ensure `repo` and `user` scopes are selected
- **Token expired**: Generate a new token

### Git Issues
- **Git not found**: Install Git from https://git-scm.com/
- **Repository exists**: Script will detect and use existing repo
- **Network errors**: Check internet connectivity

### Node.js Issues
- **Node not found**: Install Node.js from https://nodejs.org/
- **Permission errors**: Try running as administrator/sudo

## Security Notes

- **Never commit your GitHub token** to the repository
- **Use environment variables** for sensitive data
- **Regenerate tokens** periodically for security
- **Limit token scopes** to minimum required permissions

## Future Updates

To update the application after deployment:

1. **Make changes locally**
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update: describe changes"
   git push origin main
   ```
3. **Redeploy in Portainer** (Update stack with re-pull enabled)

The GitHub API method provides a professional, automated workflow that's much more convenient than manual steps!