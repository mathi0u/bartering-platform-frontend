import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface SnackBarData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  action?: string;
}

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="custom-snackbar" [ngClass]="'snackbar-' + data.type">
      <div class="snackbar-content">
        <mat-icon class="snackbar-icon">{{ getIcon() }}</mat-icon>
        <span class="snackbar-message">{{ data.message }}</span>
      </div>
      <button 
        *ngIf="data.action" 
        mat-button 
        class="snackbar-action"
        (click)="dismiss()">
        {{ data.action }}
      </button>
    </div>
  `,
  styles: [`
    .custom-snackbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-radius: 8px;
      min-width: 300px;
      font-weight: 500;
    }

    .snackbar-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .snackbar-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .snackbar-message {
      flex: 1;
    }

    .snackbar-action {
      color: inherit !important;
      font-weight: bold;
      margin-left: 16px;
    }

    .snackbar-success {
      background-color: #4caf50;
      color: white;
    }

    .snackbar-error {
      background-color: #f44336;
      color: white;
    }

    .snackbar-warning {
      background-color: #ff9800;
      color: white;
    }

    .snackbar-info {
      background-color: #2196f3;
      color: white;
    }
  `]
})
export class CustomSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData,
    private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
  ) {}

  getIcon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
