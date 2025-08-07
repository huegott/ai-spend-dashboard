# Portainer CE (Docker Standalone) Deployment Guide

## Overview
This guide is for deploying the AI Spend Dashboard on Docker CE (standalone Docker) through Portainer, without Docker Swarm.

## Prerequisites
- Portainer CE running on Docker standalone (not Swarm mode)
- Access to Portainer at https://10.10.10.20:9443
- Admin privileges in Portainer

## Step-by-Step Deployment

### Step 1: Prepare the Application Files

You'll need to upload the application files to the Docker host. You can do this by:

**Option A: Git Clone (Recommended)**
```bash
# SSH to 10.10.10.20 and run:
git clone <your-repo-url> /opt/ai-spend-dashboard
cd /opt/ai-spend-dashboard
```

**Option B: File Upload**
Upload the `ai-spend-dashboard-deploy.tar.gz` file to the server and extract it:
```bash
# On the Docker host (10.10.10.20):
cd /opt
tar -xzf ai-spend-dashboard-deploy.tar.gz
mv ai-spend-dashboard-deploy ai-spend-dashboard
```

### Step 2: Configure Environment Variables

Edit the environment file on the server:
```bash
# SSH to 10.10.10.20 and edit:
nano /opt/ai-spend-dashboard/.env.production
```

Update these values:
```bash
# Required: Change the database password
DB_PASSWORD=your_secure_database_password_here

# Optional: Add your API keys for automatic syncing
OPENAI_API_KEY=sk-your-real-openai-api-key-here
ANTHROPIC_API_KEY=your-real-anthropic-api-key-here

# Keep these as-is
NODE_ENV=production
PORT=3000
```

### Step 3: Deploy via Portainer

#### 3.1 Access Portainer
1. Open browser and go to: https://10.10.10.20:9443
2. Log in with your Portainer credentials

#### 3.2 Create New Stack
1. Go to **Stacks** in the left sidebar
2. Click **"Add stack"**
3. **Name**: `ai-spend-dashboard`

#### 3.3 Configure Stack
Choose **"Repository"** method and configure:

**Repository Configuration:**
- **Repository URL**: `file:///opt/ai-spend-dashboard`
- **Compose path**: `docker-compose-standalone.yml`
- **Additional files**: `.env.production`

**OR use Web Editor method:**

Choose **"Web editor"** and paste this configuration:

```yaml
version: '3.8'

services:
  ai-dashboard:
    build: /opt/ai-spend-dashboard
    ports:
      - "8881:3000"
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://dashboard:${DB_PASSWORD:-ai_spend_secure_password_2024}@postgres:5432/ai_spend
      - OPENAI_API_KEY=${OPENAI_API_KEY:-placeholder-openai-key}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-placeholder-anthropic-key}
      - PORT=3000
    volumes:
      - /opt/ai-spend-dashboard/ssl:/app/ssl:ro
    networks:
      - ai-dashboard-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health", "||", "exit", "1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - /opt/ai-spend-dashboard/server/migrations/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    environment:
      - POSTGRES_DB=ai_spend
      - POSTGRES_USER=dashboard
      - POSTGRES_PASSWORD=${DB_PASSWORD:-ai_spend_secure_password_2024}
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

#### 3.4 Set Environment Variables

In the **"Environment variables"** section, add:

```
DB_PASSWORD=ai_spend_secure_password_2024
OPENAI_API_KEY=your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
```

**Important**: Replace the placeholder values with your actual API keys.

#### 3.5 Deploy
1. Click **"Deploy the stack"**
2. Portainer will start building and deploying

### Step 4: Monitor Deployment

#### 4.1 Watch Build Progress
1. Go to **Containers** to see the containers being created
2. The build process may take 5-10 minutes for the first deployment
3. Watch for these containers:
   - `ai-spend-dashboard_ai-dashboard_1` (building, then running)
   - `ai-spend-dashboard_postgres_1` (should start quickly)

#### 4.2 Check Container Logs
If there are issues:
1. Click on container name in **Containers** list  
2. Go to **Logs** tab
3. Look for error messages

### Step 5: Access the Dashboard

#### 5.1 First Access
1. Wait for both containers to be "running" and healthy
2. Open browser and go to: **https://10.10.10.20:8881**
3. Accept SSL certificate warning (self-signed certificate)
4. You should see the AI Spend Dashboard

#### 5.2 Test Basic Functionality
- Verify the dashboard loads with the sidebar and header
- Check that the summary cards are visible (may show $0.00 initially)
- Try changing date filters and provider filters
- Look for any error messages

### Step 6: Configure and Test Features

#### 6.1 Test API Integration (if keys provided)
1. Click the **"Sync OpenAI"** button in the filter panel
2. Check container logs for sync progress
3. Data should appear in charts after successful sync

#### 6.2 Manual Data Entry
You can add sample data manually through the API:

```bash
# Test API endpoint:
curl -X POST http://10.10.10.20:8881/api/spend/anthropic/manual \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-08-07",
    "model_name": "claude-3-sonnet-20240229",
    "cost_usd": 0.05,
    "input_tokens": 1000,
    "output_tokens": 200,
    "num_requests": 1
  }'
```

### Troubleshooting

#### Build Fails
- Check if Node.js dependencies are accessible
- Verify the build context path is correct
- Check container logs for build errors

#### Database Connection Issues
- Wait for postgres container to be fully healthy
- Verify DATABASE_URL environment variable
- Check postgres container logs

#### Port Conflicts
- Ensure port 9443 is not already in use
- Check if another service is using the same port
- You can change the port in the docker-compose file if needed

#### SSL Certificate Issues
- The app generates self-signed certificates automatically
- Browser warnings are expected - click "Proceed anyway"
- For production, replace certificates in the ssl/ directory

### Updating the Application

To update the application:

1. **Update Source Code**:
   ```bash
   # On the Docker host:
   cd /opt/ai-spend-dashboard
   git pull origin main  # or upload new files
   ```

2. **Rebuild via Portainer**:
   - Go to **Stacks** → **ai-spend-dashboard**
   - Click **"Update the stack"**
   - Enable **"Re-pull image and redeploy"**
   - Click **"Update"**

### Security Considerations

- Change default database password in production
- Use real SSL certificates for production deployment
- Keep API keys secure and rotate regularly
- Monitor access logs and resource usage
- Keep Docker images updated regularly

### Next Steps

1. **Add Real API Keys**: Update environment variables with actual API keys
2. **Test Data Sync**: Use OpenAI sync feature if API key is configured
3. **Customize**: Modify the application as needed
4. **Phase 3**: Plan MCP integrations with Portainer, GitHub, n8n, and Asana

The application should now be running at **https://10.10.10.20:8881**!