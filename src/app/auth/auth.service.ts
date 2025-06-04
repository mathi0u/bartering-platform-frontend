import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, of, catchError, firstValueFrom } from 'rxjs';
import { AuthResponse, User, LoginRequest, RegisterRequest } from './auth.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  private initializationComplete = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private async initializeAuth() {
    const token = localStorage.getItem(this.tokenKey);
    
    if (token) {
      try {
        const user = await firstValueFrom(this.getProfile());
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        console.error('Token invalide, déconnexion:', error);
        this.logout();
      }
    }
    this.initializationComplete.set(true);
  }

  isInitialized(): boolean {
    return this.initializationComplete();
  }

  register(userData: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  getProfile(): Observable<User> {
    return this.http.get<{message: string, user: User}>(`${this.apiUrl}/profile`)
      .pipe(
        map(response => response.user)
      );
  }

  private handleAuthSuccess(response: AuthResponse) {
    localStorage.setItem(this.tokenKey, response.token);
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
}
