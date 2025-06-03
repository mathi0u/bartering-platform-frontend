import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../auth.models';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>login</mat-icon>
            Login
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                name="email"
                [(ngModel)]="loginData.email"
                required
                email
                #email="ngModel"
                placeholder="Enter your email"
              />
              <mat-icon matSuffix>email</mat-icon>
              @if (email.invalid && email.touched) {
                <mat-error>
                  @if (email.errors?.['required']) {
                    Email is required
                  }
                  @if (email.errors?.['email']) {
                    Please enter a valid email
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                type="password"
                name="password"
                [(ngModel)]="loginData.password"
                required
                #password="ngModel"
                placeholder="Enter your password"
              />
              <mat-icon matSuffix>lock</mat-icon>
              @if (password.invalid && password.touched) {
                <mat-error>
                  @if (password.errors?.['required']) {
                    Password is required
                  }
                </mat-error>
              }
            </mat-form-field>

            @if (loading()) {
              <button
                mat-raised-button
                color="primary"
                type="submit"
                disabled
                class="full-width login-button"
              >
                <mat-spinner diameter="20"></mat-spinner>
                Logging in...
              </button>
            } @else {
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="loginForm.invalid"
                class="full-width login-button"
              >
                Login
              </button>
            }
          </form>

          @if (error()) {
            <mat-card class="error-card">
              <mat-icon color="warn">error</mat-icon>
              {{ error() }}
            </mat-card>
          }
        </mat-card-content>

        <mat-card-actions>
          <p class="auth-link">
            Don't have an account?
            <a routerLink="/register" mat-button color="accent">Register here</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      min-height: -webkit-fill-available;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      overflow-y: auto;
      box-sizing: border-box;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 0;
    }

    mat-card-header {
      justify-content: center;
      padding-bottom: 16px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 24px;
      justify-content: center;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .login-button {
      height: 48px;
      font-size: 16px;
      margin-top: 8px;
    }

    .error-card {
      background-color: #ffebee;
      color: #c62828;
      margin-top: 16px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .auth-link {
      text-align: center;
      margin: 0;
      color: #666;
    }

    mat-spinner {
      margin-right: 8px;
    }

    mat-card-actions {
      justify-content: center;
      padding-top: 0;
    }

    /* Responsive design for small screens */
    @media (max-height: 700px) {
      .auth-container {
        align-items: flex-start;
        padding: 10px;
      }
    }

    @media (max-width: 480px) {
      .auth-container {
        padding: 15px;
      }

      .auth-card {
        max-width: 100%;
      }
    }

    @media (max-height: 600px) and (max-width: 480px) {
      .auth-container {
        min-height: auto;
        padding: 10px;
      }
    }
  `]
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  loading = signal(false);
  error = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.error.set(error.error?.message || 'Login failed. Please try again.');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
