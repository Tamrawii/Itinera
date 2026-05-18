import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AuthResponse, LoginRequest, RegisterRequest } from '../models';
import { User } from '../models';
import { UserTouristService } from './user-tourist.service';

interface StoredUser {
  id: number;
  email: string;
  password: string;
  full_name: string;
  role: 'tourist' | 'provider' | 'admin';
  phone?: string;
  created_at: string;
  updated_at: string;
}

const USERS_KEY = 'itinera_users';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private router: Router,
    private touristService: UserTouristService,
  ) {
    this.seedIfEmpty();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const users = this.getUsers();
    const stored = users.find((u) => u.email === credentials.email);

    if (!stored || stored.password !== credentials.password) {
      return throwError(() => new Error('Invalid email or password'));
    }

    const user = this.toUser(stored);
    const token = this.generateToken(stored.id);
    this.persistSession(token, user);

    return of({ access_token: token, token_type: 'Bearer' as const, user }).pipe(delay(300));
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    const users = this.getUsers();

    if (users.some((u) => u.email === data.email)) {
      return throwError(() => new Error('A user with this email already exists'));
    }

    const now = new Date().toISOString();
    const stored: StoredUser = {
      id: this.nextId(users),
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      role: data.role,
      created_at: now,
      updated_at: now,
    };

    users.push(stored);
    this.setUsers(users);

    const user = this.toUser(stored);
    const token = this.generateToken(stored.id);
    this.persistSession(token, user);

    if (data.role === 'tourist') {
      this.touristService.createTouristProfile(user);
    }

    return of({ access_token: token, token_type: 'Bearer' as const, user }).pipe(delay(300));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/sign-in']);
  }

  refreshToken(): Observable<AuthResponse> {
    const user = this.getCurrentUser();
    const token = this.getToken();

    if (!user || !token) {
      return throwError(() => new Error('No active session'));
    }

    const newToken = this.generateToken(user.id);
    this.persistSession(newToken, user);

    return of({ access_token: newToken, token_type: 'Bearer' as const, user }).pipe(delay(150));
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    return this.getCurrentUser()?.role === role;
  }

  saveToken(token: string, user: User): void {
    this.persistSession(token, user);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /* ---- localStorage helpers ---- */

  private getUsers(): StoredUser[] {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as StoredUser[];
    } catch {
      return [];
    }
  }

  private setUsers(users: StoredUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private nextId(users: StoredUser[]): number {
    return users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  }

  private generateToken(userId: number): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({ sub: userId, iat: Math.floor(Date.now() / 1000) }),
    );
    const signature = btoa(
      Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(''),
    );
    return `${header}.${payload}.${signature}`;
  }

  private persistSession(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private seedIfEmpty(): void {
    const users = this.getUsers();
    if (users.length > 0) return;

    const now = new Date().toISOString();
    users.push({
      id: 1,
      email: 'admin@itinera.com',
      password: 'admin123',
      full_name: 'Admin User',
      role: 'admin',
      created_at: now,
      updated_at: now,
    });
    this.setUsers(users);
  }

  private toUser(stored: StoredUser): User {
    return {
      id: stored.id,
      email: stored.email,
      full_name: stored.full_name,
      role: stored.role,
      phone: stored.phone,
      created_at: new Date(stored.created_at),
      updated_at: new Date(stored.updated_at),
    };
  }
}
