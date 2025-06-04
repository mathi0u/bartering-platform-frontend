import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
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

  getProfile(){
    return this.http.get(`${this.apiUrl}/profile`);
  }

  private handleAuthSuccess(response: AuthResponse) {
    localStorage.setItem(this.tokenKey, response.token);
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  private checkAuthStatus() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.isAuthenticated.set(true);
      // Récupérer les informations du profil utilisateur
      this.getProfile().subscribe({
        next: (user: any) => {
          this.currentUser.set(user);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération du profil:', error);
          // En cas d'erreur, supprimer le token invalide
          this.logout();
        }
      });
    }
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
}
