#!/bin/bash

# Test script for Caddy deployment configuration

echo "🚀 Testing Caddy Configuration for Railway Deployment"
echo "=================================================="

# Check if dist directory exists
if [ -d "dist/frontend-app" ]; then
    echo "✅ Build directory exists: dist/frontend-app"
else
    echo "❌ Build directory missing. Run 'npm run build:prod' first"
    exit 1
fi

# Check if Caddyfile exists
if [ -f "Caddyfile" ]; then
    echo "✅ Caddyfile exists"
else
    echo "❌ Caddyfile missing"
    exit 1
fi

# Check if nixpacks.toml exists
if [ -f "nixpacks.toml" ]; then
    echo "✅ nixpacks.toml exists"
else
    echo "❌ nixpacks.toml missing"
    exit 1
fi

# Check if railway.json exists
if [ -f "railway.json" ]; then
    echo "✅ railway.json exists"
else
    echo "❌ railway.json missing"
    exit 1
fi

# Check if environment.prod.ts has correct Railway URL
if grep -q "railway.app" "src/environments/environment.prod.ts"; then
    echo "✅ Production environment configured with Railway URL"
else
    echo "⚠️  Production environment may not be configured with Railway URL"
fi

# Check if index.html exists in dist
if [ -f "dist/frontend-app/browser/index.html" ]; then
    echo "✅ Built index.html exists"
else
    echo "❌ Built index.html missing"
    exit 1
fi

# Check if health check file exists
if [ -f "public/health" ]; then
    echo "✅ Health check file exists"
else
    echo "⚠️  Health check file missing (optional)"
fi

echo ""
echo "📋 Configuration Summary:"
echo "------------------------"
echo "Web Server: Caddy"
echo "Build Command: npm run build:prod"
echo "Start Command: ./caddy run --config Caddyfile --adapter caddyfile"
echo "Health Check: /health"
echo "Static Files: dist/frontend-app/browser"
echo ""

echo "🎉 Ready for Railway deployment!"
echo ""
echo "Next steps:"
echo "1. Commit and push your changes to GitHub"
echo "2. Connect your repository to Railway"
echo "3. Railway will automatically deploy using the configuration"
echo ""
echo "Test locally with:"
echo "npm run caddy:install && npm run caddy:dev"
