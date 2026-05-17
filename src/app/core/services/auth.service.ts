import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthResponse, LoginRequest, RegisterRequest } from '../models';
import { User } from '../models';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
  ) {}

  /**
   * Authenticates a user with email and password using Supabase Auth.
   * Automatically persists the token and user on success.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return from(
      this.supabaseService.client.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data.session || !data.user) {
          throw new Error('No session returned');
        }
        // Map Supabase user to our User model
        const user: User = {
          id: parseInt(data.user.id) || 0,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.['full_name'] || '',
          role: data.user.user_metadata?.['role'] || 'tourist',
          created_at: new Date(data.user.created_at),
          updated_at: new Date(),
        };
        this.saveToken(data.session.access_token, user);
        return { 
          access_token: data.session.access_token, 
          token_type: 'Bearer' as const, 
          user 
        };
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Registers a new tourist or provider account using Supabase Auth.
   * Automatically persists the token and user on success.
   * If email confirmation is required, returns user without session.
   */
  register(data: RegisterRequest): Observable<AuthResponse | { user: User; emailConfirmationRequired: true }> {
    return from(
      this.supabaseService.client.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: data.role,
          },
        },
      })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data.user) {
          throw new Error('Registration failed');
        }

        // Map Supabase user to our User model
        const user: User = {
          id: parseInt(data.user.id) || 0,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.['full_name'] || '',
          role: data.user.user_metadata?.['role'] || 'tourist',
          created_at: new Date(data.user.created_at),
          updated_at: new Date(),
        };

        // If email confirmation is required (no session), return special response
        if (!data.session) {
          return { user, emailConfirmationRequired: true as const };
        }

        // Auto-login if session is available
        this.saveToken(data.session.access_token, user);
        return { 
          access_token: data.session.access_token, 
          token_type: 'Bearer' as const, 
          user 
        };
      }),
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
   * Refreshes the current session using Supabase Auth.
   * Automatically persists the refreshed token and user on success.
   */
  refreshToken(): Observable<AuthResponse> {
    return from(
      this.supabaseService.client.auth.refreshSession()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data.session || !data.user) {
          throw new Error('No session returned');
        }
        const user: User = {
          id: parseInt(data.user.id) || 0,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.['full_name'] || '',
          role: data.user.user_metadata?.['role'] || 'tourist',
          created_at: new Date(data.user.created_at),
          updated_at: new Date(),
        };
        this.saveToken(data.session.access_token, user);
        return { 
          access_token: data.session.access_token, 
          token_type: 'Bearer' as const, 
          user 
        };
      }),
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

  private handleError(error: any): Observable<never> {
    const message = error?.message || 'An error occurred';
    return throwError(() => new Error(message));
  }
}
