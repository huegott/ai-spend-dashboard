# GitHub-Based Deployment Guide

## Overview
This approach deploys the AI Spend Dashboard by having Docker pull the source code directly from GitHub, eliminating the need to manually upload files to the server.

## Prerequisites
1. GitHub repository with the AI Spend Dashboard code
2. Portainer CE running on Docker standalone at 10.10.10.20
3. Docker host has internet access to pull from GitHub

## Step 1: Push Code to GitHub

### 1.1 Create GitHub Repository
1. Go to GitHub and create a new repository
2. Name it something like `ai-spend-dashboard`
3. Make it public (or private if you have access from your Docker host)

### 1.2 Push Local Code
```bash
# In your local project directory:
cd "C:\Users\Seth\Dropbox\sandbox\ask.fred\AI Spend Dashboard"

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AI Spend Dashboard with Docker deployment"

# Add your GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/ai-spend-dashboard.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy via Portainer

### 2.1 Access Portainer
1. Open browser: https://10.10.10.20:9443
2. Log in to Portainer

### 2.2 Create New Stack
1. Go to **Stacks** → **Add stack**
2. **Name**: `ai-spend-dashboard`

### 2.3 Use Web Editor Method
Select **"Web editor"** and paste this configuration:

```yaml
version: '3.8'

services:
  ai-dashboard:
    build: 
      context: https://github.com/YOUR_USERNAME/ai-spend-dashboard.git#main
      dockerfile: Dockerfile
    image: ai-spend-dashboard:latest
    ports:
      - "8881:3000"
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://dashboard:${DB_PASSWORD}@postgres:5432/ai_spend
      - OPENAI_API_KEY=${OPENAI_API_KEY:-}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}
      - PORT=3000
    networks:
      - ai-dashboard-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health", "||", "exit", "1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=ai_spend
      - POSTGRES_USER=dashboard
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    networks:
      - ai-dashboard-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dashboard -d ai_spend"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s

volumes:
  postgres_data:
    driver: local

networks:
  ai-dashboard-network:
    driver: bridge
```

**Important**: Replace `YOUR_USERNAME` with your actual GitHub username.

### 2.4 Set Environment Variables
In the **"Environment variables"** section, add:

```
DB_PASSWORD=ai_spend_secure_password_2024
OPENAI_API_KEY=sk-your-real-openai-key-here
ANTHROPIC_API_KEY=your-real-anthropic-key-here
```

### 2.5 Deploy the Stack
1. Click **"Deploy the stack"**
2. Docker will:
   - Clone your GitHub repository
   - Build the Docker image from source
   - Start the containers

## Step 3: Monitor Deployment

### 3.1 Watch Build Progress
1. Go to **Containers** in Portainer
2. Look for the building container: `ai-spend-dashboard_ai-dashboard_1`
3. The build process may take 5-10 minutes (includes npm install, React build, etc.)

### 3.2 Check Build Logs
1. Click on the container name
2. Go to **Logs** tab
3. You should see:
   - Git clone from GitHub
   - npm install (backend)
   - npm install (frontend)
   - React build process
   - Server starting

### 3.3 Wait for Health Checks
Both containers need to be "healthy":
- postgres: Should be healthy quickly
- ai-dashboard: Takes longer due to build + health check

## Step 4: Access and Test

### 4.1 First Access
1. Open browser: **https://10.10.10.20:8881**
2. Accept SSL certificate warning
3. Verify the dashboard loads properly

### 4.2 Test Features
- Check that all UI components load
- Try filtering by date ranges and providers
- If you provided real API keys, test the "Sync OpenAI" button

## Step 5: Updating the Application

### 5.1 Update Code on GitHub
```bash
# Make your changes locally
# Then commit and push:
git add .
git commit -m "Update: describe your changes"
git push origin main
```

### 5.2 Redeploy in Portainer
**Option A: Recreate Stack**
1. Go to **Stacks** → **ai-spend-dashboard**
2. Click **"Delete this stack"** (keep volumes when asked)
3. Create a new stack with the same configuration
4. Docker will pull the latest code from GitHub

**Option B: Force Rebuild**
1. Go to **Containers**
2. Stop and remove the `ai-dashboard` container
3. Go to **Images** and remove the `ai-spend-dashboard:latest` image
4. Go back to **Stacks** → **ai-spend-dashboard**
5. Click **"Update the stack"** with **"Re-pull image and redeploy"** enabled

## Advantages of GitHub Deployment

✅ **No File Uploads**: No need to manually transfer files to server
✅ **Version Control**: Full git history and collaboration
✅ **Easy Updates**: Just push to GitHub and redeploy
✅ **Reproducible**: Anyone can deploy the same version
✅ **Backup**: Code is safely stored on GitHub
✅ **CI/CD Ready**: Can add automated testing/building later

## Troubleshooting

### Build Fails - Git Clone Issues
- Verify the GitHub URL is correct and accessible
- For private repos, you may need to use token authentication
- Check that the Docker host has internet access

### Build Fails - npm Install Issues
- Check the logs for specific npm errors
- Ensure package.json files are properly committed to GitHub
- Verify Node.js version compatibility

### Build Takes Too Long
- The first build includes downloading all npm dependencies
- Subsequent builds should be faster due to Docker layer caching
- Consider optimizing Dockerfile for better caching

### Container Won't Start
- Check environment variables are set correctly
- Verify database connection issues
- Look at application logs for startup errors

## Security Notes

- Use environment variables for sensitive data (API keys, passwords)
- Consider using private GitHub repositories for production
- Regularly update dependencies and base images
- Monitor access logs and usage

## Example GitHub URLs

Replace these with your actual repository:
- **Public repo**: `https://github.com/YOUR_USERNAME/ai-spend-dashboard.git#main`
- **Private repo**: `https://YOUR_TOKEN@github.com/YOUR_USERNAME/ai-spend-dashboard.git#main`
- **Specific branch**: `https://github.com/YOUR_USERNAME/ai-spend-dashboard.git#develop`

Your AI Spend Dashboard will now be accessible at **https://10.10.10.20:8881** and can be easily updated by pushing changes to GitHub!