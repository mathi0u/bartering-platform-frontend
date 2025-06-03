import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Environment } from '../../environments/environment.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Environment = environment;

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get appName(): string {
    return this.config.appName;
  }

  get version(): string {
    return this.config.version;
  }

  get isProduction(): boolean {
    return this.config.production;
  }

  get enableLogging(): boolean {
    return this.config.enableLogging;
  }

  get enableDevTools(): boolean {
    return this.config.enableDevTools;
  }

  get maxFileSize(): number {
    return this.config.maxFileSize;
  }

  get supportedImageTypes(): string[] {
    return this.config.supportedImageTypes;
  }

  get defaultPageSize(): number {
    return this.config.defaultPageSize;
  }

  get maxItemsPerUser(): number {
    return this.config.maxItemsPerUser;
  }

  get sessionTimeout(): number {
    return this.config.sessionTimeout;
  }

  // Utility methods
  isImageTypeSupported(type: string): boolean {
    return this.supportedImageTypes.includes(type);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  log(message: any, ...optionalParams: any[]): void {
    if (this.enableLogging) {
      console.log(`[${this.appName}]`, message, ...optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]): void {
    if (this.enableLogging) {
      console.error(`[${this.appName}]`, message, ...optionalParams);
    }
  }

  warn(message: any, ...optionalParams: any[]): void {
    if (this.enableLogging) {
      console.warn(`[${this.appName}]`, message, ...optionalParams);
    }
  }
}
