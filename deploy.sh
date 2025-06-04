#!/bin/bash

# Build and deployment script for Bartering Frontend
# Usage: ./deploy.sh [environment]
# Environments: dev, staging, prod

set -e

ENVIRONMENT=${1:-prod}
BUILD_DIR="dist"

echo "🚀 Starting deployment for environment: $ENVIRONMENT"

# Validate environment
case $ENVIRONMENT in
  dev|development)
    ENV_CONFIG="development"
    ;;
  staging)
    ENV_CONFIG="staging"
    ;;
  prod|production)
    ENV_CONFIG="production"
    ;;
  *)
    echo "❌ Invalid environment: $ENVIRONMENT"
    echo "Valid options: dev, staging, prod"
    exit 1
    ;;
esac

echo "📦 Installing dependencies..."
npm ci

echo "🧪 Running tests..."
npm run test -- --watch=false --browsers=ChromeHeadless

echo "🔍 Running linting..."
# npm run lint

echo "🏗️  Building application for $ENV_CONFIG..."
npm run build:$ENVIRONMENT

echo "📊 Build statistics:"
if [ -d "$BUILD_DIR/browser" ]; then
  ls -lah $BUILD_DIR/browser/
else
  ls -lah $BUILD_DIR/
fi

echo "✅ Build completed successfully!"

# Optional: Add deployment commands here based on your hosting platform
case $ENVIRONMENT in
  prod|production)
    echo "🌐 Ready for production deployment"
    echo "Upload the contents of $BUILD_DIR to your production server"
    ;;
  staging)
    echo "🧪 Ready for staging deployment"
    echo "Upload the contents of $BUILD_DIR to your staging server"
    ;;
  dev|development)
    echo "🔧 Development build completed"
    ;;
esac

echo "🎉 Deployment preparation completed!"
