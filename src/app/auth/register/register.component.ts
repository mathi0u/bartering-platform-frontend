import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegisterRequest } from '../auth.models';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
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
            <mat-icon>person_add</mat-icon>
            Create Account
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input
                matInput
                type="text"
                name="name"
                [(ngModel)]="registerData.name"
                required
                #name="ngModel"
                placeholder="Enter your full name"
              />
              <mat-icon matSuffix>person</mat-icon>
              @if (name.invalid && name.touched) {
                <mat-error>
                  @if (name.errors?.['required']) {
                    Name is required
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                name="email"
                [(ngModel)]="registerData.email"
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
                [(ngModel)]="registerData.password"
                required
                minlength="6"
                #password="ngModel"
                placeholder="Enter your password (min 6 characters)"
              />
              <mat-icon matSuffix>lock</mat-icon>
              @if (password.invalid && password.touched) {
                <mat-error>
                  @if (password.errors?.['required']) {
                    Password is required
                  }
                  @if (password.errors?.['minlength']) {
                    Password must be at least 6 characters
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
                class="full-width register-button"
              >
                <mat-spinner diameter="20"></mat-spinner>
                Creating Account...
              </button>
            } @else {
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="registerForm.invalid"
                class="full-width register-button"
              >
                Create Account
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
            Already have an account?
            <a routerLink="/login" mat-button color="accent">Login here</a>
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

    .register-button {
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
export class RegisterComponent {
  registerData: RegisterRequest = {
    name: '',
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

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.error.set(error.error?.message || 'Registration failed. Please try again.');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
