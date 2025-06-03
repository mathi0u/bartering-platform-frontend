import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentValidatorService {

  validateEnvironment(): boolean {
    const errors: string[] = [];

    if (!environment.apiUrl) {
      errors.push('API URL is not configured');
    }

    if (!environment.appName) {
      errors.push('App name is not configured');
    }

    if (!environment.version) {
      errors.push('App version is not configured');
    }

    if (environment.maxFileSize <= 0) {
      errors.push('Max file size must be greater than 0');
    }

    if (!environment.supportedImageTypes || environment.supportedImageTypes.length === 0) {
      errors.push('Supported image types must be configured');
    }

    if (environment.defaultPageSize <= 0) {
      errors.push('Default page size must be greater than 0');
    }

    if (environment.maxItemsPerUser <= 0) {
      errors.push('Max items per user must be greater than 0');
    }

    if (environment.sessionTimeout <= 0) {
      errors.push('Session timeout must be greater than 0');
    }

    if (errors.length > 0) {
      console.error('Environment validation errors:', errors);
      return false;
    }

    if (environment.enableLogging) {
      console.log('Environment validation passed:', {
        production: environment.production,
        apiUrl: environment.apiUrl,
        appName: environment.appName,
        version: environment.version
      });
    }

    return true;
  }

  getEnvironmentInfo() {
    return {
      production: environment.production,
      apiUrl: environment.apiUrl,
      appName: environment.appName,
      version: environment.version,
      enableLogging: environment.enableLogging,
      enableDevTools: environment.enableDevTools
    };
  }
}
