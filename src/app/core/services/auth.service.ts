import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models';
import { User } from '../models';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private supabaseService: SupabaseService,
  ) {}

  /**
   * Authenticates a user with email and password.
   * Automatically persists the token and user on success.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => this.saveToken(res.access_token, res.user)),
      catchError(this.handleError),
    );
  }

  /**
   * Registers a new tourist or provider account.
   * Automatically persists the token and user on success.
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data).pipe(
      tap((res) => this.saveToken(res.access_token, res.user)),
      catchError(this.handleError),
    );
  }

  /**
   * Logs out the current user by clearing localStorage and navigating to /sign-in.
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['/sign-in']);
  }

  /**
   * Requests a new access token using the existing session.
   * Automatically persists the refreshed token and user on success.
   */
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, {}).pipe(
      tap((res) => this.saveToken(res.access_token, res.user)),
      catchError(this.handleError),
    );
  }

  /**
   * Returns the currently authenticated user parsed from localStorage,
   * or null if no session exists or the stored value is malformed.
   */
  getCurrentUser(): User | null {
    const raw = localStorage.getItem('auth_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  /**
   * Returns true if a valid, non-expired access token is present in localStorage.
   * Checks the JWT expiry timestamp to ensure the token is still valid.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Returns true if the current user's role matches the given role string.
   */
  hasRole(role: string): boolean {
    return this.getCurrentUser()?.role === role;
  }

  /**
   * Persists the access token and serialised user object to localStorage.
   */
  saveToken(token: string, user: User): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  /**
   * Returns the stored access token, or null if not present.
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Initiates OAuth sign-in with a social provider (Google, Facebook, or Twitter/X).
   * Redirects the user to the provider's auth page, then to Supabase, then back to the app.
   * @param provider - The OAuth provider to use
   */
  signInWithOAuth(provider: 'google' | 'facebook' | 'twitter'): Promise<void> {
    return this.supabaseService.client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    }).then(() => {});
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
