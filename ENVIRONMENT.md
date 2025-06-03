# Environment Configuration

This document describes the environment configuration setup for the Bartering Frontend application.

## Environment Files

The application uses different environment files for different deployment scenarios:

- `src/environments/environment.ts` - Development environment (default)
- `src/environments/environment.prod.ts` - Production environment
- `src/environments/environment.staging.ts` - Staging environment
- `src/environments/environment.interface.ts` - TypeScript interface for type safety

## Environment Variables

Each environment file contains the following configuration:

| Variable | Type | Description |
|----------|------|-------------|
| `production` | boolean | Whether the app is running in production mode |
| `apiUrl` | string | Base URL for API endpoints |
| `appName` | string | Application name |
| `version` | string | Application version |
| `enableLogging` | boolean | Enable/disable console logging |
| `enableDevTools` | boolean | Enable/disable Angular dev tools |
| `maxFileSize` | number | Maximum file upload size in bytes |
| `supportedImageTypes` | string[] | Array of supported image MIME types |
| `defaultPageSize` | number | Default number of items per page |
| `maxItemsPerUser` | number | Maximum items a user can create |
| `sessionTimeout` | number | Session timeout in milliseconds |

## Build Commands

Use these npm scripts to build for different environments:

```bash
# Development build
npm run build:dev

# Staging build
npm run build:staging

# Production build
npm run build:prod
```

## Serve Commands

Use these npm scripts to serve the application in different modes:

```bash
# Development server
npm run start:dev

# Staging server
npm run start:staging

# Production server
npm run start:prod
```

## Services

### ConfigService
Located at `src/app/core/config.service.ts`, provides easy access to environment configuration throughout the application.

### EnvironmentValidatorService
Located at `src/app/core/environment-validator.service.ts`, validates environment configuration at runtime.

## Usage Example

```typescript
import { ConfigService } from './core/config.service';

constructor(private config: ConfigService) {
  console.log('API URL:', this.config.apiUrl);
  console.log('App Name:', this.config.appName);
}
```

## Production Deployment

For production deployment, make sure to:

1. Update the `apiUrl` in `environment.prod.ts` to point to your production API
2. Set `production: true` in the production environment
3. Disable logging and dev tools in production
4. Build using `npm run build:prod`

## Environment Validation

The application automatically validates the environment configuration on startup. Check the browser console for any validation errors or warnings.
