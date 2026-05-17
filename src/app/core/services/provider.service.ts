import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  Provider,
  CreateProvider,
  UpdateProvider,
  ProviderStatus,
  ProviderType,
  PaginatedResponse,
} from '../models';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private readonly table = 'providers';

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private storageService: StorageService,
  ) {}

  /**
   * Retrieves a paginated list of providers with optional status/type filters.
   */
  getAll(params?: {
    page?: number;
    per_page?: number;
    status?: ProviderStatus;
    provider_type?: ProviderType;
  }): Observable<PaginatedResponse<Provider>> {
    let query = this.supabaseService.client.from(this.table).select('*', { count: 'exact' });

    if (params?.status) {
      query = query.eq('status', params.status);
    }
    if (params?.provider_type) {
      query = query.eq('provider_type', params.provider_type);
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
          data: (response.data as Provider[]) || [],
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
   * Retrieves a provider by their numeric ID.
   */
  getById(id: number): Observable<Provider> {
    return from(
      this.supabaseService.client.from(this.table).select('*').eq('id', id).single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Provider not found');
        return data as Provider;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Retrieves the provider profile linked to the currently authenticated user.
   */
  getMyProvider(): Observable<Provider> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    return from(
      this.supabaseService.client.from(this.table).select('*').eq('user_id', user.id).single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Provider profile not found');
        return data as Provider;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Creates a new provider profile.
   */
  create(data: CreateProvider): Observable<Provider> {
    return from(
      this.supabaseService.client.from(this.table).insert(data as any).select().single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Failed to create provider');
        return data as Provider;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Updates an existing provider profile by ID.
   */
  update(id: number, data: UpdateProvider): Observable<Provider> {
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
        if (!data) throw new Error('Provider not found');
        return data as Provider;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Uploads verification documents for a provider.
   */
  async uploadDocuments(id: number, files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const path = `providers/${id}/documents/${Date.now()}_${file.name}`;
      const url = await this.storageService.uploadFile('doc-uploads', file, path);
      urls.push(url);
    }

    // Update provider with new document URLs
    const { data } = await this.supabaseService.client
      .from(this.table)
      .select('documents')
      .eq('id', id)
      .single();

    const existingDocs = (data?.documents as any[]) || [];
    const allDocs = [...existingDocs, ...urls.map(url => ({ name: 'Document', url, type: 'pdf' }))];

    await this.supabaseService.client
      .from(this.table)
      .update({ documents: allDocs } as any)
      .eq('id', id);

    return urls;
  }

  /**
   * Approves a pending provider application (admin only).
   */
  approve(id: number): Observable<Provider> {
    return from(
      this.supabaseService.client
        .from(this.table)
        .update({ status: 'approved', updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Provider not found');
        return data as Provider;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Rejects a provider application with a human-readable reason (admin only).
   */
  reject(id: number, reason: string): Observable<Provider> {
    return from(
      this.supabaseService.client
        .from(this.table)
        .update({ status: 'rejected', rejection_reason: reason, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Provider not found');
        return data as Provider;
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any): Observable<never> {
    const message = error?.message || error?.error?.message || 'Provider error';
    return throwError(() => new Error(message));
  }
}
