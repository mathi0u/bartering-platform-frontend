export interface Environment {
  production: boolean;
  apiUrl: string;
  appName: string;
  version: string;
  enableLogging: boolean;
  enableDevTools: boolean;
  maxFileSize: number;
  supportedImageTypes: string[];
  defaultPageSize: number;
  maxItemsPerUser: number;
  sessionTimeout: number;
}
