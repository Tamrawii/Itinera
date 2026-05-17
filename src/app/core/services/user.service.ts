import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User, UpdateUser, PaginatedResponse } from '../models';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly table = 'users';

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
  ) {}

  /**
   * Retrieves a paginated, optionally filtered list of all users (admin).
   * Uses Supabase 'users' table with Row Level Security.
   */
  getAll(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    role?: string;
  }): Observable<PaginatedResponse<User>> {
    let query = this.supabaseService.client.from(this.table).select('*', { count: 'exact' });

    if (params?.role) {
      query = query.eq('role', params.role);
    }

    if (params?.search) {
      query = query.or(`full_name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
    }

    const startIdx = ((params?.page || 1) - 1) * (params?.per_page || 10);
    const endIdx = startIdx + (params?.per_page || 10) - 1;
    query = query.range(startIdx, endIdx);

    return from(query.then((res: any) => res)).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        const total = response.count || 0;
        const page = params?.page || 1;
        const per_page = params?.per_page || 10;
        return {
          data: (response.data as User[]) || [],
          total,
          page,
          per_page,
          last_page: Math.ceil(total / per_page),
        };
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Retrieves a single user by their ID.
   */
  getById(id: number): Observable<User> {
    return from(
      this.supabaseService.client.from(this.table).select('*').eq('id', id).single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('User not found');
        return data as User;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Updates an arbitrary user's profile by ID (admin).
   */
  updateProfile(id: number, data: UpdateUser): Observable<User> {
    return from(
      this.supabaseService.client
        .from(this.table)
        .update(data as any)
        .eq('id', id)
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('User not found');
        return data as User;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Permanently deletes a user by their ID (admin).
   */
  deleteUser(id: number): Observable<void> {
    return from(
      this.supabaseService.client.from(this.table).delete().eq('id', id),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Retrieves the profile of the currently authenticated user.
   * Uses Supabase Auth user metadata and users table.
   */
  getMyProfile(): Observable<User> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }
    return this.getById(currentUser.id);
  }

  /**
   * Updates the currently authenticated user's own profile fields.
   */
  updateMyProfile(data: Partial<User>): Observable<User> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }
    return this.updateProfile(currentUser.id, data as UpdateUser);
  }

  /**
   * Changes the current user's password using Supabase Auth.
   */
  changePassword(data: { current_password: string; new_password: string }): Observable<void> {
    return from(
      this.supabaseService.client.auth.updateUser({ password: data.new_password }),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any): Observable<never> {
    const message = error?.message || error?.error?.message || 'User service error';
    return throwError(() => new Error(message));
  }
}
