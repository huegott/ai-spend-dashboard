#!/usr/bin/env node

/**
 * Secure Secrets Manager using Infisical Machine Identity
 * Best practice: No static tokens, use Machine Identity for secure authentication
 */

const https = require('https');
const fs = require('fs');

class InfisicalSecureClient {
    constructor(options = {}) {
        this.clientId = options.clientId || process.env.INFISICAL_CLIENT_ID;
        this.clientSecret = options.clientSecret || process.env.INFISICAL_CLIENT_SECRET;
        this.projectId = options.projectId || process.env.INFISICAL_PROJECT_ID;
        this.environment = options.environment || process.env.INFISICAL_ENVIRONMENT || 'production';
        this.apiUrl = options.apiUrl || process.env.INFISICAL_API_URL || 'https://app.infisical.com/api';
        
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    /**
     * Authenticate using Machine Identity (Universal Auth)
     * Returns short-lived access token
     */
    async authenticate() {
        if (this.isTokenValid()) {
            return this.accessToken;
        }

        if (!this.clientId || !this.clientSecret) {
            throw new Error('INFISICAL_CLIENT_ID and INFISICAL_CLIENT_SECRET must be set');
        }

        const authData = {
            clientId: this.clientId,
            clientSecret: this.clientSecret
        };

        try {
            const response = await this.makeRequest('POST', '/v1/auth/universal-auth/login', authData);
            
            this.accessToken = response.accessToken;
            this.tokenExpiry = new Date(Date.now() + (response.expiresIn * 1000));
            
            console.log('✅ Successfully authenticated with Machine Identity');
            return this.accessToken;
        } catch (error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    /**
     * Check if current token is still valid
     */
    isTokenValid() {
        return this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry;
    }

    /**
     * Fetch secrets from Infisical
     */
    async getSecrets(path = '/') {
        const token = await this.authenticate();

        try {
            const url = `/v3/secrets/raw?workspaceId=${this.projectId}&environment=${this.environment}&secretPath=${path}`;
            const response = await this.makeRequest('GET', url, null, {
                'Authorization': `Bearer ${token}`
            });

            return response.secrets || [];
        } catch (error) {
            throw new Error(`Failed to fetch secrets: ${error.message}`);
        }
    }

    /**
     * Get specific secret by key
     */
    async getSecret(secretName) {
        const secrets = await this.getSecrets();
        const secret = secrets.find(s => s.secretKey === secretName);
        
        if (!secret) {
            throw new Error(`Secret '${secretName}' not found`);
        }
        
        return secret.secretValue;
    }

    /**
     * Load secrets into environment variables
     */
    async loadSecretsToEnv() {
        const secrets = await this.getSecrets();
        const loaded = {};

        for (const secret of secrets) {
            process.env[secret.secretKey] = secret.secretValue;
            loaded[secret.secretKey] = '***LOADED***';
        }

        console.log('🔐 Loaded secrets:', Object.keys(loaded));
        return loaded;
    }

    /**
     * Make HTTP request to Infisical API
     */
    makeRequest(method, path, data = null, headers = {}) {
        return new Promise((resolve, reject) => {
            const url = new URL(this.apiUrl + path);
            
            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname + url.search,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'AI-Dashboard/1.0',
                    ...headers
                }
            };

            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try {
                        const jsonResponse = JSON.parse(body);
                        
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(jsonResponse);
                        } else {
                            reject(new Error(`HTTP ${res.statusCode}: ${jsonResponse.message || body}`));
                        }
                    } catch (parseError) {
                        reject(new Error(`Failed to parse response: ${body}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Request failed: ${error.message}`));
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }
}

/**
 * Docker entrypoint function
 * Load secrets before starting the main application
 */
async function dockerEntrypoint() {
    try {
        console.log('🚀 Starting secure secrets loading...');
        
        const client = new InfisicalSecureClient();
        await client.loadSecretsToEnv();
        
        console.log('✅ All secrets loaded securely');
        console.log('🎯 Starting main application...');
        
        // Start your main application here
        // require('./server/app.js');
        
    } catch (error) {
        console.error('❌ Failed to load secrets:', error.message);
        process.exit(1);
    }
}

// CLI usage
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'load':
            dockerEntrypoint();
            break;
            
        case 'get':
            const secretName = process.argv[3];
            if (!secretName) {
                console.error('Usage: node secure-secrets.js get SECRET_NAME');
                process.exit(1);
            }
            
            const client = new InfisicalSecureClient();
            client.getSecret(secretName)
                .then(value => console.log(value))
                .catch(error => {
                    console.error('Error:', error.message);
                    process.exit(1);
                });
            break;
            
        case 'list':
            const listClient = new InfisicalSecureClient();
            listClient.getSecrets()
                .then(secrets => {
                    console.log('Available secrets:');
                    secrets.forEach(s => console.log(`  - ${s.secretKey}`));
                })
                .catch(error => {
                    console.error('Error:', error.message);
                    process.exit(1);
                });
            break;
            
        default:
            console.log(`
🔐 Secure Secrets Manager

Usage:
  node secure-secrets.js load      # Load all secrets to environment
  node secure-secrets.js get NAME  # Get specific secret value  
  node secure-secrets.js list      # List available secrets

Environment Variables (secure):
  INFISICAL_CLIENT_ID      # Machine Identity Client ID
  INFISICAL_CLIENT_SECRET  # Machine Identity Client Secret  
  INFISICAL_PROJECT_ID     # Project ID
  INFISICAL_ENVIRONMENT    # Environment (default: production)
            `);
    }
}

module.exports = { InfisicalSecureClient, dockerEntrypoint };