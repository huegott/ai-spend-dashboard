# Infisical Setup Guide for AI Spend Dashboard

## ✅ Step 1: CLI Installation (COMPLETED)
- Infisical CLI v0.41.97 installed successfully
- Use `npx @infisical/cli` for all commands

## 🔐 Step 2: Manual Login & Project Setup

### 2.1 Login to Infisical (Manual Steps)
Since interactive login doesn't work in this environment, follow these steps:

1. **Go to Infisical Dashboard**: https://app.infisical.com/login
2. **Create Account** or **Sign In**
3. **Create New Project** called "AI Spend Dashboard"

### 2.2 Create Service Token
1. In your Infisical project dashboard:
   - Go to **Settings** → **Service Tokens**
   - Click **Generate New Token**
   - Name: `ai-dashboard-portainer`
   - Environment: `production`
   - Copy the token (starts with `st_prod_...`)

### 2.3 Add Secrets to Infisical
In your project dashboard, add these secrets to the **production** environment:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `DB_PASSWORD` | Database password | `your_secure_db_password_123` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |
| `ANTHROPIC_API_KEY` | Anthropic API key | `sk-ant-...` |
| `JWT_SECRET` | JWT signing secret | `your_jwt_secret_here` |

## 🚀 Step 3: Configure Your Environment

### 3.1 Update .env file
```bash
# Copy .env.example to .env
cp .env.example .env

# Add your Infisical credentials:
INFISICAL_TOKEN=st_prod_your_service_token_here
INFISICAL_PROJECT_ID=your_project_id_here
INFISICAL_ENVIRONMENT=production
```

### 3.2 Test Connection
```bash
npx @infisical/cli secrets list --env=production --token=your_service_token
```

## 🐳 Step 4: Deploy with Portainer

### Option A: Manual Environment Variables
In Portainer stack deployment, set these environment variables:
- `DB_PASSWORD=your_password`
- `OPENAI_API_KEY=your_key` 
- `ANTHROPIC_API_KEY=your_key`

### Option B: Infisical Integration
Use the provided `infisical-sync.js` script to automatically sync secrets.

## 📋 Commands Reference
```bash
# List all secrets
npx @infisical/cli secrets list --env=production

# Get specific secret
npx @infisical/cli secrets get DB_PASSWORD --env=production

# Run command with secrets injected
npx @infisical/cli run --env=production -- docker-compose up

# Export secrets to shell
npx @infisical/cli run --env=production --command="printenv"
```

## ⚠️ Security Notes
- Never commit `.env` files with real tokens
- Store service tokens securely
- Use different tokens for different environments
- Rotate tokens regularly

## 🔧 Troubleshooting
- If `infisical` command fails, use `npx @infisical/cli` instead
- Ensure service token has correct environment permissions
- Check project ID matches your dashboard project