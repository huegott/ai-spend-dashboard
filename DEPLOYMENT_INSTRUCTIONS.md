# Quick Deployment Instructions for huegott

## 🚀 **Step 1: Push to GitHub (Automated)**

1. **Create GitHub Repository First**:
   - Go to https://github.com/huegott
   - Click **"New repository"** (+ button, top right)
   - **Name**: `ai-spend-dashboard`
   - **Description**: `AI Spend Dashboard for OpenAI and Anthropic usage tracking`
   - Make it **Public**
   - **Don't check** any initialization boxes (README, .gitignore, license)
   - Click **"Create repository"**

2. **Run Setup Script**:
   ```bash
   # Double-click this file or run in Command Prompt:
   setup-github.bat
   ```

   The script will:
   - Initialize git repository
   - Add all files to git
   - Commit with initial message
   - Add GitHub remote (https://github.com/huegott/ai-spend-dashboard.git)
   - Push to GitHub

## 🐳 **Step 2: Deploy in Portainer**

1. **Access Portainer**: https://10.10.10.20:9443

2. **Create Stack**:
   - Go to **Stacks** → **Add stack**
   - **Name**: `ai-spend-dashboard`
   - **Build method**: Web editor

3. **Copy Configuration**:
   - Open `deploy-portainer-stack.yml` 
   - Copy the entire contents
   - Paste into Portainer web editor

4. **Set Environment Variables**:
   Add these in the "Environment variables" section:
   ```
   DB_PASSWORD=ai_spend_secure_password_2024
   OPENAI_API_KEY=sk-your-openai-key-here
   ANTHROPIC_API_KEY=your-anthropic-key-here
   ```
   *(Replace with your real API keys)*

5. **Deploy**:
   - Click **"Deploy the stack"**
   - Wait 5-10 minutes for build to complete

## 🌐 **Step 3: Access Dashboard**

- **URL**: https://10.10.10.20:8881
- Accept SSL certificate warning
- Dashboard should load with sidebar and charts

## 🔄 **Updating the Application**

To update after making changes:

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Update: describe your changes"
   git push origin main
   ```

2. **Redeploy in Portainer**:
   - Go to **Stacks** → **ai-spend-dashboard**
   - Click **"Update the stack"**
   - Enable **"Re-pull image and redeploy"**
   - Click **"Update"**

## 🔧 **Repository Information**

- **GitHub URL**: https://github.com/huegott/ai-spend-dashboard
- **Clone URL**: `git clone https://github.com/huegott/ai-spend-dashboard.git`
- **Dashboard URL**: https://10.10.10.20:8881
- **Portainer URL**: https://10.10.10.20:9443

## 📊 **Dashboard Features Available**

✅ **Real-time spend tracking** across OpenAI and Anthropic  
✅ **Interactive visualizations** (charts, graphs, breakdowns)  
✅ **Advanced filtering** by date, provider, model, project  
✅ **OpenAI automatic sync** (with API key)  
✅ **Manual Anthropic data entry**  
✅ **Responsive design** works on mobile/desktop  
✅ **Export capabilities** for reporting  

## 🆘 **Troubleshooting**

**If GitHub push fails:**
- Make sure you created the repository on GitHub first
- Check your GitHub authentication (may need to login)
- Try running the commands manually

**If Portainer deployment fails:**
- Check container logs for build errors
- Verify environment variables are set correctly
- Ensure port 8881 is not already in use
- Check that the Docker host can access GitHub

**If dashboard doesn't load:**
- Wait for both containers to be "healthy" 
- Check container logs for errors
- Verify the database initialized properly
- Try refreshing after a few minutes

## 🎉 **Success Indicators**

You'll know it worked when:
- ✅ Repository exists at https://github.com/huegott/ai-spend-dashboard
- ✅ Both containers show "running" and "healthy" in Portainer
- ✅ Dashboard loads at https://10.10.10.20:8881
- ✅ You can see the sidebar, charts, and filter panel
- ✅ "Sync OpenAI" button works (if API key provided)

**Ready to deploy? Run `setup-github.bat` to get started!**