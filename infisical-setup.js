#!/usr/bin/env node

/**
 * Infisical Setup Helper
 * Interactive setup script for Infisical integration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔐 Infisical Setup Helper for AI Spend Dashboard\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

function createEnvFromExample() {
    if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
        console.log('📋 Creating .env from .env.example...');
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ .env file created\n');
    }
}

function checkInfisicalConnection() {
    try {
        // Try to run infisical command
        const result = execSync('npx @infisical/cli --version', { encoding: 'utf8' });
        console.log('✅ Infisical CLI:', result.trim());
    } catch (error) {
        console.log('❌ Infisical CLI not working properly');
        return false;
    }
    return true;
}

function showNextSteps() {
    console.log(`
🚀 Next Steps:

1. **Go to Infisical Dashboard**: https://app.infisical.com/login
   - Create account or sign in
   - Create new project: "AI Spend Dashboard"

2. **Create Service Token**:
   - Go to Settings → Service Tokens
   - Generate token for 'production' environment
   - Copy token (starts with st_prod_...)

3. **Add Secrets to Infisical**:
   Add these secrets to your production environment:
   - DB_PASSWORD (your database password)
   - OPENAI_API_KEY (your OpenAI API key)
   - ANTHROPIC_API_KEY (your Anthropic API key)
   - JWT_SECRET (your JWT secret)

4. **Update .env file**:
   Edit .env and add:
   INFISICAL_TOKEN=your_service_token_here
   INFISICAL_PROJECT_ID=your_project_id_here

5. **Test Connection**:
   npx @infisical/cli secrets list --env=production

6. **Deploy to Portainer**:
   Use the modified portainer-stack.yml file
   Set environment variables in Portainer UI

📚 Full instructions: See INFISICAL_SETUP.md
`);
}

function testConnection() {
    require('dotenv').config();
    
    const token = process.env.INFISICAL_TOKEN;
    if (!token) {
        console.log('❌ INFISICAL_TOKEN not found in .env file');
        return false;
    }

    try {
        console.log('🔍 Testing Infisical connection...');
        const result = execSync(`npx @infisical/cli secrets list --env=production --token=${token}`, 
            { encoding: 'utf8', stdio: 'pipe' });
        console.log('✅ Connection successful!');
        console.log('📋 Secrets found:', result.split('\n').length - 1, 'entries');
        return true;
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        console.log('💡 Make sure your service token is correct and has production environment access');
        return false;
    }
}

// Main execution
function main() {
    createEnvFromExample();
    
    if (!checkInfisicalConnection()) {
        console.log('❌ Please ensure Infisical CLI is properly installed');
        return;
    }

    // Check if already configured
    require('dotenv').config();
    if (process.env.INFISICAL_TOKEN) {
        console.log('🔍 Found existing Infisical token, testing connection...\n');
        if (testConnection()) {
            console.log('\n🎉 Infisical is fully configured and working!');
            console.log('💡 You can now deploy your stack to Portainer');
        }
    } else {
        showNextSteps();
    }
}

// Handle command line arguments
if (process.argv.includes('--test')) {
    testConnection();
} else if (process.argv.includes('--help')) {
    showNextSteps();
} else {
    main();
}