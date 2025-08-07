# Quick Portainer Secrets Setup

## Secrets to Create in Portainer

Access Portainer at: **https://10.10.10.20:9443**

### 1. Database Password
- **Name**: `ai_dashboard_db_password`
- **Value**: `ai_spend_secure_password_2024`

### 2. OpenAI API Key
- **Name**: `ai_dashboard_openai_key`  
- **Value**: `your-actual-openai-api-key-here`
- ⚠️ Replace with your real OpenAI API key (starts with `sk-`)

### 3. Anthropic API Key
- **Name**: `ai_dashboard_anthropic_key`
- **Value**: `your-actual-anthropic-api-key-here`  
- ⚠️ Replace with your real Anthropic API key

## Steps in Portainer:

1. **Login** to Portainer at https://10.10.10.20:9443
2. Go to **Secrets** (left sidebar)
3. Click **"Add secret"** for each secret above
4. After creating secrets, deploy the stack using `portainer-stack.yml`

## Stack Deployment:

1. Go to **Stacks** → **"Add stack"**
2. Name: `ai-spend-dashboard`
3. Upload `portainer-stack.yml` or paste its contents
4. Click **"Deploy the stack"**

## Access:

Once deployed: **https://10.10.10.20:9443**

The dashboard will be running on the same IP as Portainer but the stack will handle the routing.