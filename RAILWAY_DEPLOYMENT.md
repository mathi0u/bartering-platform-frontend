# Railway Deployment Guide

This guide explains how to deploy your Angular Bartering Frontend to Railway.

## Prerequisites

1. Railway account (sign up at https://railway.app)
2. GitHub repository with your code
3. Railway CLI (optional, for local deployments)

## Deployment Steps

### Method 1: GitHub Integration (Recommended)

1. **Connect GitHub Repository:**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Build Settings:**
   Railway will automatically detect the configuration from `nixpacks.toml`:
   - Build Command: `npm run build:prod`
   - Start Command: `npx serve dist/frontend-app -s -p $PORT`

3. **Environment Variables:**
   No additional environment variables needed for frontend.

4. **Domain Configuration:**
   - Railway provides a default domain: `your-app.up.railway.app`
   - You can add custom domains in the Railway dashboard

### Method 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Configuration Files

### `nixpacks.toml`
Configures the build process for Railway's Nixpacks builder:
- Specifies Node.js provider
- Sets build and start commands
- Defines static output directory

### `railway.json`
Additional Railway-specific configuration:
- Health check settings
- Restart policies
- Build optimization

### `.railwayignore`
Files to exclude from Railway deployments.

## Production Environment

Your production environment is configured to use:
- API URL: `https://main-application-production-e9b0.up.railway.app/`
- Production optimizations enabled
- Logging disabled
- Dev tools disabled

## Deployment Commands

```bash
# Build for production locally
npm run build:prod

# Test production build locally
npm run serve:prod

# Railway-specific serve command
npm run railway:serve
```

## Post-Deployment Checklist

1. ✅ Verify the app loads at your Railway domain
2. ✅ Check that API calls work with your backend
3. ✅ Test authentication flow
4. ✅ Verify file uploads (if applicable)
5. ✅ Check browser console for errors

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify TypeScript compilation succeeds locally
- Check Railway build logs for specific errors

### App Doesn't Load
- Verify the `dist/frontend-app` directory exists after build
- Check that the serve command is correct
- Ensure PORT environment variable is used

### API Calls Fail
- Verify the `apiUrl` in `environment.prod.ts` is correct
- Check CORS settings on your backend
- Verify your backend is deployed and accessible

### Performance Issues
- Enable gzip compression in your serve configuration
- Consider implementing lazy loading for routes
- Optimize bundle size with Angular build optimizations

## Railway Features

- **Automatic Deployments:** Pushes to main branch trigger deployments
- **Preview Deployments:** PRs create preview environments
- **Monitoring:** Built-in metrics and logging
- **Custom Domains:** Add your own domain easily
- **Environment Variables:** Manage different configs per environment

## Cost Optimization

- Railway offers a generous free tier
- Production apps scale automatically
- Monitor usage in Railway dashboard
- Consider using Railway's sleep mode for development environments
