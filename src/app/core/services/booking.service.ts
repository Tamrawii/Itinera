import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Booking, BookingStatus, CreateBooking, PaginatedResponse } from '../models';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly table = 'bookings';

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
  ) {}

  /**
   * Retrieves all bookings with optional filters (admin).
   */
  getAll(params?: {
    page?: number;
    per_page?: number;
    status?: BookingStatus;
    tourist_id?: number;
    service_id?: number;
  }): Observable<PaginatedResponse<Booking>> {
    let query = this.supabaseService.client.from(this.table).select('*', { count: 'exact' });

    if (params?.status) {
      query = query.eq('status', params.status);
    }
    if (params?.tourist_id) {
      query = query.eq('tourist_id', params.tourist_id);
    }
    if (params?.service_id) {
      query = query.eq('service_id', params.service_id);
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
          data: (response.data as Booking[]) || [],
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
   * Retrieves the paginated bookings for the currently authenticated tourist.
   */
  getMyBookings(params?: {
    page?: number;
    per_page?: number;
    status?: BookingStatus;
  }): Observable<PaginatedResponse<Booking>> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }

    let query = this.supabaseService.client
      .from(this.table)
      .select('*', { count: 'exact' })
      .eq('tourist_id', user.id);

    if (params?.status) {
      query = query.eq('status', params.status);
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
          data: (response.data as Booking[]) || [],
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
   * Retrieves a single booking by its numeric ID.
   */
  getById(id: number): Observable<Booking> {
    return from(
      this.supabaseService.client.from(this.table).select('*').eq('id', id).single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Booking not found');
        return data as Booking;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Creates a new booking.
   */
  create(data: CreateBooking): Observable<Booking> {
    return from(
      this.supabaseService.client.from(this.table).insert(data as any).select().single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Failed to create booking');
        return data as Booking;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Updates the status of a booking (e.g. confirm, complete).
   */
  updateStatus(id: number, status: BookingStatus): Observable<Booking> {
    return from(
      this.supabaseService.client
        .from(this.table)
        .update({ status, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Booking not found');
        return data as Booking;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Cancels a booking by its ID.
   */
  cancel(id: number): Observable<Booking> {
    return this.updateStatus(id, 'cancelled');
  }

  /**
   * Retrieves the paginated bookings for the currently authenticated provider's services.
   */
  getProviderBookings(params?: {
    page?: number;
    per_page?: number;
    status?: BookingStatus;
  }): Observable<PaginatedResponse<Booking>> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }

    // Get bookings for services owned by this provider
    let query = this.supabaseService.client
      .from(this.table)
      .select('*', { count: 'exact' })
      .eq('provider_id', user.id);

    if (params?.status) {
      query = query.eq('status', params.status);
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
          data: (response.data as Booking[]) || [],
          total,
          page,
          per_page,
          last_page: Math.ceil(total / per_page),
        };
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any): Observable<never> {
    const message = error?.message || error?.error?.message || 'Booking service error';
    return throwError(() => new Error(message));
  }
}
