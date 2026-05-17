import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

/**
 * Generic database service that provides CRUD operations using Supabase.
 * All data access goes through Supabase with automatic user context.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseDatabaseService {
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
  ) {}

  /**
   * Retrieves all records from a table with optional filters.
   */
  getAll<T>(
    table: string,
    options?: {
      filters?: Record<string, any>;
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
      offset?: number;
    },
  ): Observable<T[]> {
    let query = this.supabaseService.client.from(table).select('*');

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );
    }

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as T[]) || [];
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Retrieves a single record by ID.
   */
  getById<T>(table: string, id: number | string): Observable<T> {
    return from(
      this.supabaseService.client.from(table).select('*').eq('id', id).single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Record not found');
        return data as T;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Creates a new record.
   */
  create<T>(table: string, data: Partial<T>): Observable<T> {
    return from(
      this.supabaseService.client.from(table).insert(data as any).select().single(),
    ).pipe(
      map(({ data: result, error }) => {
        if (error) throw error;
        if (!result) throw new Error('Failed to create record');
        return result as T;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Updates a record by ID.
   */
  update<T>(
    table: string,
    id: number | string,
    data: Partial<T>,
  ): Observable<T> {
    return from(
      this.supabaseService.client
        .from(table)
        .update(data as any)
        .eq('id', id)
        .select()
        .single(),
    ).pipe(
      map(({ data: result, error }) => {
        if (error) throw error;
        if (!result) throw new Error('Record not found or update failed');
        return result as T;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Deletes a record by ID.
   */
  delete(table: string, id: number | string): Observable<void> {
    return from(
      this.supabaseService.client.from(table).delete().eq('id', id),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Gets records for the current authenticated user.
   */
  getMyRecords<T>(
    table: string,
    userIdColumn: string = 'user_id',
  ): Observable<T[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }

    return from(
      this.supabaseService.client
        .from(table)
        .select('*')
        .eq(userIdColumn, user.id),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as T[]) || [];
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Executes a custom RPC function.
   */
  rpc<T>(functionName: string, params?: Record<string, any>): Observable<T> {
    return from(this.supabaseService.client.rpc(functionName, params)).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as T;
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any): Observable<never> {
    const message = error?.message || error?.error?.message || 'Database error';
    return throwError(() => new Error(message));
  }
}
