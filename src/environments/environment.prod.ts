import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://bartering-platform-backend-production.up.railway.app',
  appName: 'Bartering App',
  version: '1.0.0',
  enableLogging: false,
  enableDevTools: false,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  defaultPageSize: 10,
  maxItemsPerUser: 50,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
};
