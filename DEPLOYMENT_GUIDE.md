# Deployment Guide - Éden Irrigation System

## Quick Deployment Options

### Option 1: Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" > "Deploy manually"
3. Drag and drop the `dist/` folder from your project
4. Your site will be live instantly!

**Or connect to Git:**
1. Click "Add new site" > "Import from Git"
2. Connect your GitHub repository
3. Build settings are already configured in `netlify.toml`

### Option 2: Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. Deploy!

### Option 3: GitHub Pages
1. Go to your GitHub repository settings
2. Navigate to "Pages" section
3. Select "GitHub Actions" as source
4. Create `.github/workflows/deploy.yml` (see below)

## GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Setup pnpm
      uses: pnpm/action-setup@v2
      with:
        version: latest
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm run build:web
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Manual Deployment Steps

If you prefer manual deployment:

1. **Build the project** (already done):
   ```bash
   pnpm run build:web
   ```

2. **Upload the `dist/` folder** to any static hosting service:
   - Netlify Drop
   - Vercel
   - Firebase Hosting
   - AWS S3 + CloudFront
   - Any web hosting provider

## Environment Variables for Production

Make sure to set these environment variables in your hosting platform:

```
VITE_SUPABASE_URL=https://mvnahetwsnqmjmdbesps.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bmFoZXR3c25xbWptZGJlc3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MDE5ODAsImV4cCI6MjA3MjE3Nzk4MH0.IMiSBzbYsPaIzE85Sd0chK-A-t5wqQSNi5sy8QBbDcI
VITE_API_URL=https://eden-api.onrender.com/api
```

## Backend Deployment (Optional)

Your backend server can be deployed to:
- **Render.com** (already configured in netlify.toml)
- **Railway.app**
- **Heroku**
- **DigitalOcean App Platform**

The frontend is configured to proxy API calls to `https://eden-api.onrender.com/api` as seen in `netlify.toml`.

## Current Status

✅ **Frontend built successfully** with optimized bundles
✅ **Bundle size optimized** - no more 500KB warnings
✅ **Deployment configuration ready** (netlify.toml)
✅ **Environment variables configured**

Your application is ready for deployment! Choose any of the options above.
