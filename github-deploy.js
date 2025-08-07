#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const GITHUB_USERNAME = 'huegott';
const REPO_NAME = 'ai-spend-dashboard';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.argv[2];

if (!GITHUB_TOKEN) {
    console.error('❌ GitHub token required!');
    console.error('Usage: node github-deploy.js YOUR_GITHUB_TOKEN');
    console.error('Or set GITHUB_TOKEN environment variable');
    process.exit(1);
}

console.log('🚀 AI Spend Dashboard - Automated GitHub Deployment');
console.log('====================================================');
console.log();

// Helper function to make GitHub API requests
function makeGitHubRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: endpoint,
            method: method,
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'User-Agent': 'AI-Spend-Dashboard-Deploy',
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                try {
                    const parsed = responseData ? JSON.parse(responseData) : {};
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject(new Error(`GitHub API Error ${res.statusCode}: ${parsed.message || responseData}`));
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${responseData}`));
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Step 1: Check if repository exists
async function checkRepository() {
    console.log('🔍 Checking if repository exists...');
    try {
        const repo = await makeGitHubRequest('GET', `/repos/${GITHUB_USERNAME}/${REPO_NAME}`);
        console.log('✅ Repository already exists:', repo.html_url);
        return true;
    } catch (error) {
        if (error.message.includes('404')) {
            console.log('📝 Repository does not exist, will create it');
            return false;
        }
        throw error;
    }
}

// Step 2: Create repository
async function createRepository() {
    console.log('📦 Creating GitHub repository...');
    const repoData = {
        name: REPO_NAME,
        description: 'AI Spend Dashboard for tracking OpenAI and Anthropic API usage and costs',
        private: false,
        has_issues: true,
        has_projects: true,
        has_wiki: false,
        auto_init: false
    };

    try {
        const repo = await makeGitHubRequest('POST', '/user/repos', repoData);
        console.log('✅ Repository created:', repo.html_url);
        return repo;
    } catch (error) {
        console.error('❌ Failed to create repository:', error.message);
        throw error;
    }
}

// Step 3: Initialize git and push
function setupGitAndPush() {
    console.log('🔧 Setting up git and pushing code...');
    
    try {
        // Check if git is available
        execSync('git --version', { stdio: 'ignore' });
        
        // Initialize git if needed
        if (!fs.existsSync('.git')) {
            console.log('   Initializing git repository...');
            execSync('git init', { stdio: 'inherit' });
        }

        // Configure git to use token authentication
        const remoteUrl = `https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`;
        
        // Remove existing origin if it exists
        try {
            execSync('git remote remove origin', { stdio: 'ignore' });
        } catch (e) {
            // Ignore if origin doesn't exist
        }

        console.log('   Adding files to git...');
        execSync('git add .', { stdio: 'inherit' });

        console.log('   Creating commit...');
        execSync('git commit -m "Initial commit: AI Spend Dashboard with automated GitHub deployment"', { stdio: 'inherit' });

        console.log('   Adding GitHub remote...');
        execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });

        console.log('   Pushing to GitHub...');
        execSync('git push -u origin main', { stdio: 'inherit' });

        console.log('✅ Code pushed to GitHub successfully!');
        return true;

    } catch (error) {
        console.error('❌ Git operations failed:', error.message);
        return false;
    }
}

// Step 4: Display deployment instructions
function showDeploymentInstructions() {
    console.log();
    console.log('🎉 SUCCESS! Repository created and code pushed!');
    console.log('==============================================');
    console.log();
    console.log('📋 Next Steps for Portainer Deployment:');
    console.log();
    console.log('1. Go to Portainer: https://10.10.10.20:9443');
    console.log('2. Stacks → Add stack');
    console.log('3. Name: ai-spend-dashboard');
    console.log('4. Web editor - paste this configuration:');
    console.log();
    
    const dockerConfig = `version: '3.8'

services:
  ai-dashboard:
    build: 
      context: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git#main
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
      - DATABASE_URL=postgresql://dashboard:\${DB_PASSWORD}@postgres:5432/ai_spend
      - OPENAI_API_KEY=\${OPENAI_API_KEY:-}
      - ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY:-}
      - PORT=3000
    networks:
      - ai-dashboard-network

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=ai_spend
      - POSTGRES_USER=dashboard
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
    networks:
      - ai-dashboard-network

volumes:
  postgres_data:

networks:
  ai-dashboard-network:`;

    console.log(dockerConfig);
    console.log();
    console.log('5. Environment variables:');
    console.log('   DB_PASSWORD=ai_spend_secure_password_2024');
    console.log('   OPENAI_API_KEY=sk-your-openai-key-here');
    console.log('   ANTHROPIC_API_KEY=your-anthropic-key-here');
    console.log();
    console.log('6. Deploy the stack');
    console.log('7. Access dashboard at: https://10.10.10.20:8881');
    console.log();
    console.log('🌐 Repository URL:', `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`);
    console.log();
}

// Main execution
async function main() {
    try {
        const repoExists = await checkRepository();
        
        if (!repoExists) {
            await createRepository();
        }

        const pushSuccess = setupGitAndPush();
        
        if (pushSuccess) {
            showDeploymentInstructions();
        } else {
            console.log('❌ Failed to push code. Please check git configuration and try again.');
        }

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

// Run the deployment
main();