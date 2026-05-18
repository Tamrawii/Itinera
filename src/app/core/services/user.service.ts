import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { User, UpdateUser, PaginatedResponse } from '../models';

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
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class UserService {
  getAll(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    role?: string;
  }): Observable<PaginatedResponse<User>> {
    let users = this.getUsers();

    if (params?.search) {
      const q = params.search.toLowerCase();
      users = users.filter(
        (u) =>
          u.full_name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      );
    }

    if (params?.role) {
      users = users.filter((u) => u.role === params.role);
    }

    const page = params?.page ?? 1;
    const perPage = params?.per_page ?? 10;
    const total = users.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const paged = users.slice(start, start + perPage);

    return of({
      data: paged.map((u) => this.toUser(u)),
      total,
      page,
      per_page: perPage,
      last_page: lastPage,
    }).pipe(delay(200));
  }

  getById(id: number): Observable<User> {
    const users = this.getUsers();
    const stored = users.find((u) => u.id === id);

    if (!stored) {
      return throwError(() => new Error('User not found'));
    }

    return of(this.toUser(stored)).pipe(delay(150));
  }

  updateProfile(id: number, data: UpdateUser): Observable<User> {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }

    const now = new Date().toISOString();
    const updated: StoredUser = {
      ...users[index],
      ...data,
      password: data.password ?? users[index].password,
      updated_at: now,
    };

    users[index] = updated;
    this.setUsers(users);

    this.refreshCurrentSession(updated);

    return of(this.toUser(updated)).pipe(delay(200));
  }

  deleteUser(id: number): Observable<void> {
    const users = this.getUsers();
    const filtered = users.filter((u) => u.id !== id);

    if (filtered.length === users.length) {
      return throwError(() => new Error('User not found'));
    }

    this.setUsers(filtered);
    return of(undefined).pipe(delay(150));
  }

  getMyProfile(): Observable<User> {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return throwError(() => new Error('No authenticated user'));
    }

    try {
      return of(JSON.parse(raw) as User).pipe(delay(150));
    } catch {
      return throwError(() => new Error('Invalid session data'));
    }
  }

  updateMyProfile(data: Partial<User>): Observable<User> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === current.id);

    if (index === -1) {
      return throwError(() => new Error('User not found in registry'));
    }

    const now = new Date().toISOString();
    const updated: StoredUser = {
      ...users[index],
      full_name: (data as any).full_name ?? users[index].full_name,
      email: (data as any).email ?? users[index].email,
      phone: (data as any).phone ?? users[index].phone,
      updated_at: now,
    };

    users[index] = updated;
    this.setUsers(users);

    this.refreshCurrentSession(updated);

    return of(this.toUser(updated)).pipe(delay(200));
  }

  changePassword(data: {
    current_password: string;
    new_password: string;
  }): Observable<void> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === current.id);

    if (index === -1) {
      return throwError(() => new Error('User not found in registry'));
    }

    if (users[index].password !== data.current_password) {
      return throwError(() => new Error('Current password is incorrect'));
    }

    users[index].password = data.new_password;
    users[index].updated_at = new Date().toISOString();
    this.setUsers(users);

    return of(undefined).pipe(delay(200));
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

  private getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private refreshCurrentSession(stored: StoredUser): void {
    const current = this.getCurrentUser();
    if (current && current.id === stored.id) {
      localStorage.setItem(USER_KEY, JSON.stringify(this.toUser(stored)));
    }
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