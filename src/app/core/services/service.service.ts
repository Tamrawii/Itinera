import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  Service,
  CreateService,
  UpdateService,
  ServiceAvailability,
  PaginatedResponse,
} from '../models';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly table = 'services';

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private storageService: StorageService,
  ) {}

  /**
   * Retrieves a paginated list of services with optional filters.
   */
  getAll(params?: {
    page?: number;
    per_page?: number;
    category?: string;
    provider_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
  }): Observable<PaginatedResponse<Service>> {
    let query = this.supabaseService.client.from(this.table).select('*', { count: 'exact' });

    if (params?.category) {
      query = query.eq('category', params.category);
    }
    if (params?.provider_id) {
      query = query.eq('provider_id', params.provider_id);
    }
    if (params?.search) {
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }
    if (params?.min_price !== undefined) {
      query = query.gte('price', params.min_price);
    }
    if (params?.max_price !== undefined) {
      query = query.lte('price', params.max_price);
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
          data: (response.data as Service[]) || [],
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
   * Retrieves a single service by its numeric ID.
   */
  getById(id: number): Observable<Service> {
    return from(
      this.supabaseService.client.from(this.table).select('*').eq('id', id).single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Service not found');
        return data as Service;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Retrieves all services belonging to a specific provider.
   */
  getByProvider(providerId: number): Observable<Service[]> {
    return from(
      this.supabaseService.client.from(this.table).select('*').eq('provider_id', providerId),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Service[]) || [];
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Creates a new service listing.
   */
  create(data: CreateService): Observable<Service> {
    return from(
      this.supabaseService.client.from(this.table).insert(data as any).select().single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Failed to create service');
        return data as Service;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Updates an existing service by its ID.
   */
  update(id: number, data: UpdateService): Observable<Service> {
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
        if (!data) throw new Error('Service not found');
        return data as Service;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Deletes a service by its ID.
   */
  delete(id: number): Observable<void> {
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
   * Uploads images for a service to Supabase Storage.
   */
  async uploadImages(id: number, files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const path = `services/${id}/${Date.now()}_${file.name}`;
      const url = await this.storageService.uploadFile('img-uploads', file, path);
      urls.push(url);
    }

    // Update service with new image URLs
    const { data } = await this.supabaseService.client
      .from(this.table)
      .select('images')
      .eq('id', id)
      .single();

    const existingImages = (data?.images as string[]) || [];
    const allImages = [...existingImages, ...urls];

    await this.supabaseService.client
      .from(this.table)
      .update({ images: allImages } as any)
      .eq('id', id);

    return urls;
  }

  /**
   * Replaces the full availability schedule for a service.
   */
  updateAvailability(id: number, availability: ServiceAvailability[]): Observable<Service> {
    return from(
      this.supabaseService.client
        .from(this.table)
        .update({ availability, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Service not found');
        return data as Service;
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any): Observable<never> {
    const message = error?.message || error?.error?.message || 'Service error';
    return throwError(() => new Error(message));
  }
}
