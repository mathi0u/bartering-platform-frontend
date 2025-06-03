import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'https://staging-api.domain.com/api',
  appName: 'Bartering App (Staging)',
  version: '1.0.0',
  enableLogging: true,
  enableDevTools: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  defaultPageSize: 10,
  maxItemsPerUser: 50,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
};
