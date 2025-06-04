import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomSnackbarComponent, SnackBarData } from './custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  private showCustomSnackbar(data: SnackBarData, duration: number = 3000): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data,
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar-container']
    });
  }

  /**
   * Show a success message
   */
  success(message: string, duration: number = 3000): void {
    this.showCustomSnackbar({
      message,
      type: 'success',
      action: '✓'
    }, duration);
  }

  /**
   * Show an error message
   */
  error(message: string, duration: number = 4000): void {
    this.showCustomSnackbar({
      message,
      type: 'error',
      action: '✗'
    }, duration);
  }

  /**
   * Show an info message
   */
  info(message: string, duration: number = 3000): void {
    this.showCustomSnackbar({
      message,
      type: 'info',
      action: 'ℹ'
    }, duration);
  }

  /**
   * Show a warning message
   */
  warning(message: string, duration: number = 3500): void {
    this.showCustomSnackbar({
      message,
      type: 'warning',
      action: '⚠'
    }, duration);
  }

  /**
   * Show a basic message (fallback to simple snackbar)
   */
  show(message: string, action?: string, duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
