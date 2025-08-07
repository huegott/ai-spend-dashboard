# 🔐 Secure Deployment Guide with Infisical Machine Identity

This guide implements **zero-trust secrets management** using Infisical Machine Identity - no static tokens in config files!

## ✅ Security Benefits

✅ **No static tokens stored anywhere**  
✅ **Short-lived access tokens** (automatically refreshed)  
✅ **Machine Identity authentication** with Client ID/Secret  
✅ **Runtime secret injection** (secrets loaded at container startup)  
✅ **Granular permissions** and IP restrictions  
✅ **Audit logs** and anomaly detection  

## 🚀 Setup Steps

### 1. Create Machine Identity in Infisical

1. **Go to Infisical Dashboard**: https://app.infisical.com
2. **Create/Select Project**: "AI Spend Dashboard"
3. **Create Machine Identity**:
   - Go to: Settings → Machine Identities
   - Click: "Create Identity"
   - Name: `ai-dashboard-production`
   - Select: "Universal Auth"

4. **Configure Universal Auth**:
   - Access Token TTL: `7200` (2 hours)
   - Access Token Max TTL: `7200`
   - Access Token Num Uses: `0` (unlimited)
   - IP Allowlist: Your server IPs (optional)

5. **Copy Credentials**:
   - Client ID: `<your-client-id>`
   - Client Secret: `<your-client-secret>` 

6. **Assign Project Role**:
   - Add identity to your project
   - Role: `Admin` or custom role with secret read permissions

### 2. Add Secrets to Infisical

In your project's **production** environment, add:

| Secret Key | Secret Value | Notes |
|------------|--------------|-------|
| `DB_PASSWORD` | `your_secure_db_password_123` | Database password |
| `OPENAI_API_KEY` | `sk-proj-...` | OpenAI API key |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Anthropic API key |
| `JWT_SECRET` | `your-jwt-secret-here` | JWT signing secret |

### 3. Deploy with Portainer

#### Environment Variables in Portainer Stack:

```yaml
# ONLY these 3 variables need to be set in Portainer:
INFISICAL_CLIENT_ID=your_machine_identity_client_id
INFISICAL_CLIENT_SECRET=your_machine_identity_client_secret  
INFISICAL_PROJECT_ID=your_project_id_here

# Optional: If you need DB_PASSWORD for postgres container
DB_PASSWORD=temp_password_will_be_overridden_by_app
```

#### The Stack Will:
1. 🚀 Start containers
2. 🔐 App container authenticates with Infisical using Machine Identity
3. 📥 Fetches all secrets via API (short-lived tokens)
4. 🌍 Loads secrets into environment variables
5. ✅ Starts application with secrets available

## 🔧 How It Works

### Secure Authentication Flow:
```
1. Container starts with INFISICAL_CLIENT_ID + INFISICAL_CLIENT_SECRET
2. docker-entrypoint.sh calls secure-secrets.js
3. secure-secrets.js authenticates with Machine Identity
4. Receives short-lived access token (2 hours)
5. Fetches all secrets using access token
6. Loads secrets into process environment
7. Starts main application
```

### Files Created:
- `secure-secrets.js` - Secure client for Machine Identity auth
- `docker-entrypoint.sh` - Container startup script  
- Updated `Dockerfile` - Uses secure entrypoint
- Updated `portainer-stack.yml` - Machine Identity config

## 🧪 Testing Locally

```bash
# Set machine identity credentials
export INFISICAL_CLIENT_ID=your_client_id
export INFISICAL_CLIENT_SECRET=your_client_secret
export INFISICAL_PROJECT_ID=your_project_id

# Test secret fetching
node secure-secrets.js list
node secure-secrets.js get DB_PASSWORD

# Test full secret loading
node secure-secrets.js load
```

## 🚨 Security Best Practices

### ✅ DO:
- Store Client ID/Secret in secure environment variables
- Use IP allowlisting for production
- Set appropriate token TTLs
- Monitor audit logs
- Rotate credentials regularly

### ❌ DON'T:
- Store credentials in `.env` files
- Commit credentials to git
- Use overly permissive roles
- Set infinite token TTLs
- Skip IP restrictions in production

## 🆘 Troubleshooting

### Authentication Issues:
```bash
# Check if credentials work
node secure-secrets.js list

# Common errors:
# - Invalid Client ID/Secret
# - Identity not added to project
# - Insufficient permissions
# - Network/firewall blocking API access
```

### Container Issues:
```bash
# Check container logs
docker logs your-container-name

# Look for:
# ✅ "Successfully authenticated with Machine Identity"  
# ✅ "Loaded secrets: DB_PASSWORD, OPENAI_API_KEY, ..."
# ✅ "Starting application..."
```

## 🔄 Token Lifecycle

- **Access tokens expire in 2 hours**
- **Automatically refreshed** when needed
- **No manual token management** required
- **Audit trail** of all authentication events

This approach eliminates the "secret zero" problem while providing enterprise-grade security! 🎉