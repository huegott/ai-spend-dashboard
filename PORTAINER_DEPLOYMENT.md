# Portainer Deployment Guide for AI Spend Dashboard

## Prerequisites
- Access to Portainer at https://10.10.10.20:9443
- Admin privileges in Portainer
- Docker environment running on 10.10.10.20

## Step 1: Create Secrets in Portainer

Before deploying the stack, you need to create the required secrets:

### 1.1 Navigate to Secrets
1. Log into Portainer at https://10.10.10.20:9443
2. Go to **Secrets** in the left sidebar
3. Click **"Add secret"**

### 1.2 Create Database Password Secret
- **Name**: `ai_dashboard_db_password`
- **Secret**: `ai_spend_secure_password_2024`
- Click **Create secret**

### 1.3 Create OpenAI API Key Secret
- **Name**: `ai_dashboard_openai_key`
- **Secret**: `your-actual-openai-api-key-here` (replace with real key)
- Click **Create secret**

### 1.4 Create Anthropic API Key Secret
- **Name**: `ai_dashboard_anthropic_key`
- **Secret**: `your-actual-anthropic-api-key-here` (replace with real key)
- Click **Create secret**

## Step 2: Create SSL Certificate Volume

### 2.1 Create SSL Volume
1. Go to **Volumes** in Portainer
2. Click **"Add volume"**
3. **Name**: `ai_dashboard_ssl_certs`
4. Click **Create volume**

### 2.2 Upload SSL Certificates
You'll need to get the SSL certificates into the volume. Options:

**Option A: Use a temporary container to copy files**
1. Create a temporary container with the volume mounted
2. Copy `cert.pem` and `privkey.pem` to the volume
3. Remove the temporary container

**Option B: Generate certificates in the container**
The application will work without SSL certificates but will use HTTP instead of HTTPS.

## Step 3: Deploy the Stack

### 3.1 Create New Stack
1. Go to **Stacks** in Portainer
2. Click **"Add stack"**
3. **Name**: `ai-spend-dashboard`

### 3.2 Upload Stack Configuration
Choose one of these methods:

**Method A: Upload docker-compose.yml**
1. Select **"Upload"** tab
2. Upload the `portainer-stack.yml` file from this directory

**Method B: Copy-paste configuration**
1. Select **"Web editor"** tab
2. Copy and paste the content from `portainer-stack.yml`

### 3.3 Configure Environment Variables (Optional)
Add these environment variables if needed:
- `DB_PASSWORD`: `ai_spend_secure_password_2024`

### 3.4 Deploy
1. Click **"Deploy the stack"**
2. Wait for deployment to complete
3. Check container logs for any issues

## Step 4: Access the Application

Once deployed successfully:

- **Application URL**: https://10.10.10.20:9443
- **Database**: PostgreSQL running in container
- **Data**: Persisted in Docker volumes

## Step 5: Initial Setup

### 5.1 Access Dashboard
1. Open https://10.10.10.20:9443 in your browser
2. You may see SSL certificate warnings (expected with self-signed certs)
3. Accept and proceed to the dashboard

### 5.2 Sync Data
1. If you added a real OpenAI API key, click **"Sync OpenAI"** button
2. For Anthropic data, use the manual input features
3. Set up date filters and explore the dashboard

## Troubleshooting

### Container Issues
1. Check container logs in Portainer:
   - Go to **Containers**
   - Click on the container name
   - View **Logs** tab

### Database Connection Issues
- Ensure the PostgreSQL container is healthy
- Check that secrets are properly configured
- Verify the database initialization completed

### SSL Certificate Issues
- The app will work without SSL certificates (HTTP mode)
- For production, replace with proper SSL certificates
- Check that certificates are properly mounted in the volume

### Port Conflicts
- Ensure port 9443 is not already in use
- Check Portainer's own port usage
- Verify firewall settings allow port 9443

## Stack Management Commands

### View Stack Status
- Go to **Stacks** → **ai-spend-dashboard**
- View container status and logs

### Update Stack
1. Go to **Stacks** → **ai-spend-dashboard** 
2. Click **"Editor"**
3. Make changes to the configuration
4. Click **"Update the stack"**

### Remove Stack
1. Go to **Stacks** → **ai-spend-dashboard**
2. Click **"Delete this stack"**
3. Choose whether to remove associated volumes

## Security Notes

- Change default passwords in production
- Use proper SSL certificates for production deployment  
- Regularly update the container images
- Monitor access logs and usage
- Keep API keys secure and rotate regularly

## Support

If you encounter issues:
1. Check container logs in Portainer
2. Verify all secrets are properly configured
3. Ensure the Docker host has adequate resources
4. Check network connectivity between containers