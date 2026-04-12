# Dremora IT Platform Deployment Guide

Follow these steps to take your platform from your local XAMPP environment to the live internet.

## Phase 1: Push Code to GitHub

Since you have a GitHub account, you need to push these files to a new repository.

1. **Install Git**: If you don't have it installed, download it from [git-scm.com](https://git-scm.com/).
2. **Open Terminal** in your project folder (`C:\xampp\htdocs\Dremora`).
3. **Run these commands**:
   ```bash
   git init
   git add .
   git commit -m "Prepare for production release"
   # Create a new 'Public' repository on GitHub named 'Dremora'
   # Copy the 'Remote URL' from GitHub (e.g. https://github.com/yourname/Dremora.git)
   git remote add origin YOUR_GITHUB_REMOTE_URL
   git branch -M main
   git push -u origin main
   ```

## Phase 2: Deploy Backend (Render)

1. **Log in to [Render](https://render.com/)** using your GitHub account.
2. Click **New +** > **Web Service**.
3. Connect your **Dremora** GitHub repository.
4. **Settings**:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn --chdir backend app:app`
5. **Environment Variables**:
   - `GEMINI_API_KEY`: Paste your API Key.
   - `DB_HOST`: (Enter your Cloud MySQL host later).
   - `DB_USER`: (Enter your Cloud MySQL user later).
   - `DB_PASSWORD`: (Enter your Cloud MySQL password later).
   - `DB_NAME`: `dremora_db`

## Phase 3: Deploy Frontend (Vercel)

1. **Log in to [Vercel](https://vercel.com/)** with GitHub.
2. Click **Add New** > **Project**.
3. Import your **Dremora** repository.
4. Vercel will automatically detect it's a static site. Click **Deploy**.

## Phase 4: Database (The Final Piece)

To have a live database, you should use a service like **Aiven.io** or **Railway.app** to create a free MySQL instance. Paste those credentials into your **Render Environment Variables**.

---
**Your site is now ready for the world!**
