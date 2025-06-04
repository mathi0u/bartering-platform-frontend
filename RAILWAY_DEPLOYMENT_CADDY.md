# Railway Deployment Guide

This guide explains how to deploy the Bartering Frontend application to Railway using Caddy as the web server.

## Overview

The application is configured to deploy automatically to Railway with:
- **Build**: Angular production build (`npm run build:prod`)
- **Web Server**: Caddy (fast, secure, automatic HTTPS)
- **Static Files**: Served with optimized caching and compression
- **SPA Routing**: Proper fallback to index.html for Angular routing

## Configuration Files

### Caddyfile
- Configures Caddy web server
- Enables gzip compression
- Sets security headers
- Configures static asset caching
- Handles SPA routing fallback
- Includes health check endpoint

### nixpacks.toml
- Railway build and deployment configuration
- Downloads and installs Caddy
- Builds the Angular app for production
- Starts Caddy server

### railway.json
- Railway service configuration
- Defines environment variables
- Sets up health checks

## Deployment Steps

1. **Connect Repository**
   ```bash
   # Make sure your code is pushed to GitHub
   git add .
   git commit -m "Configure Caddy deployment"
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub repo
   - Railway will automatically detect and deploy using nixpacks.toml

3. **Environment Variables**
   Railway automatically provides:
   - `PORT` - The port your app should listen on
   - Custom domain will be provided after deployment

## Features

### Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Caching Strategy
- Static assets (JS/CSS/images): 1 year cache
- HTML files: No cache (for updates)
- Gzip compression enabled

### Health Check
- Endpoint: `/health`
- Returns: 200 OK
- Used by Railway for deployment verification

## Local Testing

Test the Caddy configuration locally:

```bash
# Build the app
npm run build:prod

# Install Caddy (if not already installed)
curl -sSL https://github.com/caddyserver/caddy/releases/download/v2.7.6/caddy_2.7.6_linux_amd64.tar.gz | tar -xz caddy

# Run Caddy locally (replace 3000 with desired port)
PORT=3000 ./caddy run --config Caddyfile --adapter caddyfile
```

## Troubleshooting

### Build Issues
- Check build logs in Railway dashboard
- Ensure all dependencies are in package.json
- Verify Angular build succeeds locally

### Runtime Issues
- Check Caddy logs in Railway dashboard
- Verify Caddyfile syntax
- Test health endpoint: `https://your-app.railway.app/health`

### API Connection
- Verify API URL in environment.prod.ts
- Check CORS settings on your backend
- Ensure backend is accessible from Railway

## Performance Optimizations

- **Gzip Compression**: Reduces bundle size by ~70%
- **Static Asset Caching**: Reduces load times for returning users
- **CDN**: Railway provides global CDN automatically
- **HTTP/2**: Caddy enables HTTP/2 by default

## Environment Configuration

The production environment (`src/environments/environment.prod.ts`) is configured with:
- `apiUrl`: Points to your Railway backend API
- `production`: Set to `true`
- `enableLogging`: Disabled for production
- `enableDevTools`: Disabled for production

## Railway-Specific Benefits

- **Automatic HTTPS**: Caddy provides free SSL certificates
- **Zero-Config**: No need to configure reverse proxies
- **Automatic Restarts**: Railway restarts failed services automatically
- **Scaling**: Automatic scaling based on traffic
- **Monitoring**: Built-in metrics and logging
