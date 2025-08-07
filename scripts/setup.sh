#!/bin/bash

# AI Spend Dashboard Setup Script

set -e

echo "🚀 Setting up AI Spend Dashboard..."

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p secrets ssl logs

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create default secret files if they don't exist
echo "🔐 Setting up secrets..."

if [ ! -f "secrets/db_password.txt" ]; then
    echo "📝 Creating database password..."
    openssl rand -base64 32 > secrets/db_password.txt
    echo "✅ Generated random database password"
fi

if [ ! -f "secrets/openai_api_key.txt" ]; then
    echo "📝 Please enter your OpenAI API key (or press Enter to skip):"
    read -r openai_key
    if [ -n "$openai_key" ]; then
        echo "$openai_key" > secrets/openai_api_key.txt
        echo "✅ OpenAI API key saved"
    else
        echo "placeholder-openai-key" > secrets/openai_api_key.txt
        echo "⚠️  Placeholder OpenAI key created - update with real key later"
    fi
fi

if [ ! -f "secrets/anthropic_api_key.txt" ]; then
    echo "📝 Please enter your Anthropic API key (or press Enter to skip):"
    read -r anthropic_key
    if [ -n "$anthropic_key" ]; then
        echo "$anthropic_key" > secrets/anthropic_api_key.txt
        echo "✅ Anthropic API key saved"
    else
        echo "placeholder-anthropic-key" > secrets/anthropic_api_key.txt
        echo "⚠️  Placeholder Anthropic key created - update with real key later"
    fi
fi

# Set proper permissions
chmod 600 secrets/*
echo "🔒 Set secure permissions on secret files"

# Generate self-signed SSL certificates if none exist
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/privkey.pem" ]; then
    echo "🔒 Generating self-signed SSL certificates for testing..."
    openssl req -x509 -newkey rsa:4096 -keyout ssl/privkey.pem -out ssl/cert.pem -days 365 -nodes \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=10.10.10.20"
    chmod 600 ssl/privkey.pem
    chmod 644 ssl/cert.pem
    echo "✅ SSL certificates generated"
    echo "⚠️  Using self-signed certificates - browser will show security warning"
fi

echo "🔧 Building and starting containers..."
docker-compose build
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   HTTPS: https://10.10.10.20:9443"
    echo "   HTTP (dev): http://localhost:3000"
    echo ""
    echo "📊 Dashboard features:"
    echo "   - View spend analytics and charts"
    echo "   - Sync OpenAI data (if API key provided)"
    echo "   - Manual Anthropic data entry"
    echo "   - Filter by date, provider, and model"
    echo ""
    echo "🔧 Management commands:"
    echo "   docker-compose logs -f        # View logs"
    echo "   docker-compose down           # Stop services"
    echo "   docker-compose up -d          # Start services"
    echo ""
    echo "📚 Next steps:"
    echo "   1. Access the dashboard in your browser"
    echo "   2. Update API keys in secrets/ directory if needed"
    echo "   3. Use 'Sync OpenAI' button to import your data"
    echo "   4. For production, replace SSL certificates in ssl/ directory"
else
    echo "❌ Some services failed to start. Check logs:"
    docker-compose logs
    exit 1
fi

echo ""
echo "🎉 Setup complete! Your AI Spend Dashboard is ready."