# 🚀 Render.com Free Cloud Deployment Guide

This guide walks you through deploying the **Compare Anything AI Backend** to **Render.com** completely free of charge (0 Taka / No Credit Card Required).

---

## 📋 Overview of What We Configured

Your repository already includes all necessary cloud configuration files:
- **`Dockerfile`:** Alpine-based PHP 8.3 container with SQLite, Composer, and Laravel optimizations.
- **`docker-entrypoint.sh`:** Automatic SQLite database creation, storage permission management, and dynamic port binding (`$PORT`).
- **`render.yaml`:** Render Blueprint specification for automatic 1-click infrastructure deployment.
- **`.dockerignore`:** Keeps the Docker container lightweight and fast to build.

---

## 🛠️ Step-by-Step Deployment (Takes ~5 Minutes)

### Step 1: Push Your Code to GitHub

If you haven't pushed your latest code to GitHub yet:
```powershell
git add .
git commit -m "Add Render cloud deployment configuration and Day 5 release assets"
git push origin main
```

---

### Step 2: Sign Up on Render.com (100% Free)

1. Open your browser and go to: **[https://render.com](https://render.com)**
2. Click **"Get Started"** or **"Sign In"** using your **GitHub account**.
3. *Note: No credit card is requested or required.*

---

### Step 3: Deploy using Render Blueprint (1-Click)

1. In your Render Dashboard, click the **"New +"** button in the top right.
2. Select **"Blueprint"** (or **"Web Service"**).
3. Connect your GitHub account and select your repository: **`final-project`** (or `eaemon4409/final-project`).
4. Render will automatically detect the **`render.yaml`** file in your repository!
5. In the configuration screen, you will see the environment variables:
   - `APP_ENV`: `production` (already set)
   - `GROQ_MODEL`: `openai/gpt-oss-120b` (already set)
   - `GROQ_API_KEY`: **Paste your Groq API Key here** (e.g. `gsk_...`)
6. Click **"Apply"** or **"Create Web Service"**.

---

### Step 4: Wait for Build & Get Your Live URL

1. Render will pull the Docker container, install dependencies, and start the server.
2. In approximately **2 to 3 minutes**, you will see:
   ```
   ==> Starting service with 'docker-entrypoint.sh'
   ==> Your service is live 🎉
   ```
3. At the top of your Render service dashboard, copy your unique live URL, for example:
   ```text
   https://compare-anything-backend.onrender.com
   ```

---

### Step 5: Test the Live Backend

Open your browser or terminal and test the health endpoint:
```text
https://compare-anything-backend.onrender.com/api/v1/health
```
You will receive:
```json
{
  "status": "ok",
  "service": "Compare Anything AI Backend",
  "version": "1.0.0",
  "default_provider": "groq",
  "groq_configured": true
}
```

---

### Step 6: Connect Extension to Live Cloud Backend

Now that your backend is running 24/7 on the cloud:

1. In [`extension/src/services/apiService.ts`](../extension/src/services/apiService.ts#L3), update the default URL:
   ```typescript
   const DEFAULT_API_URL = 'https://compare-anything-backend.onrender.com/api/v1';
   ```
2. Re-package the Chrome Extension:
   ```powershell
   cd extension
   npm run package
   ```
3. Your new [`release/compare-anything-extension-v1.0.0.zip`](../release/compare-anything-extension-v1.0.0.zip) will now point directly to your live cloud API!

---

## 💡 Good to Know (Render Free Tier Behavior)

- **Free Tier Inactivity:** On Render's free tier, if no one makes a comparison request for 15 minutes, the server enters a temporary sleep state to save resources.
- **Auto Wake-Up:** The moment a user clicks "Compare", Render wakes up automatically in ~20–30 seconds.
- **Upgrading Later:** Once you have hundreds of active users and want instant 0-second responses 24/7, you can switch to a $7/month plan or a $4/month VPS. For testing and launching, the free tier is 100% sufficient!
