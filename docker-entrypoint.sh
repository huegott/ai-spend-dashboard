#!/bin/bash
set -e

echo "🔐 Secure Docker Entrypoint - Loading secrets..."

# Check if machine identity credentials are provided
if [ -z "$INFISICAL_CLIENT_ID" ] || [ -z "$INFISICAL_CLIENT_SECRET" ]; then
    echo "❌ Error: INFISICAL_CLIENT_ID and INFISICAL_CLIENT_SECRET must be provided"
    echo "💡 These should be set as environment variables in your Docker deployment"
    exit 1
fi

echo "✅ Machine Identity credentials found"
echo "🔍 Project: $INFISICAL_PROJECT_ID"
echo "🌍 Environment: ${INFISICAL_ENVIRONMENT:-production}"

# Load secrets using our secure client
node /app/secure-secrets.js load

# Check if secrets were loaded successfully
if [ $? -eq 0 ]; then
    echo "✅ Secrets loaded successfully"
    echo "🚀 Starting application..."
    
    # Start the main application with loaded secrets in environment
    exec "$@"
else
    echo "❌ Failed to load secrets"
    exit 1
fi