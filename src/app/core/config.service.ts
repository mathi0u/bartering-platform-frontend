import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Environment } from "../../environments/environment.interface";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private config: Environment = environment;

  get apiUrl() {
    return this.config.apiUrl;
  }

  get appName() {
    return this.config.appName;
  }

  get version() {
    return this.config.version;
  }

  get isProduction() {
    return this.config.production;
  }

  get enableLogging() {
    return this.config.enableLogging;
  }

  get enableDevTools() {
    return this.config.enableDevTools;
  }

  get maxFileSize() {
    return this.config.maxFileSize;
  }

  get supportedImageTypes() {
    return this.config.supportedImageTypes;
  }

  get defaultPageSize() {
    return this.config.defaultPageSize;
  }

  get maxItemsPerUser() {
    return this.config.maxItemsPerUser;
  }

  get sessionTimeout() {
    return this.config.sessionTimeout;
  }

  isImageTypeSupported(type: string) {
    return this.supportedImageTypes.includes(type);
  }

  formatFileSize(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  log(message: string, ...optionalParams: unknown[]) {
    if (this.enableLogging) {
      console.log(`[${this.appName}]`, message, ...optionalParams);
    }
  }

  error(message: string, ...optionalParams: unknown[]) {
    if (this.enableLogging) {
      console.error(`[${this.appName}]`, message, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: unknown[]) {
    if (this.enableLogging) {
      console.warn(`[${this.appName}]`, message, ...optionalParams);
    }
  }
}
