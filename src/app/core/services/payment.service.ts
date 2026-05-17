import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Payment, PaymentMethod } from '../models';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly table = 'payments';

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
  ) {}

  /**
   * Retrieves the payment record associated with a specific booking.
   */
  getByBooking(bookingId: number): Observable<Payment> {
    return from(
      this.supabaseService.client
        .from(this.table)
        .select('*')
        .eq('booking_id', bookingId)
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Payment not found');
        return data as Payment;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Initiates a payment for a booking using a specified payment method.
   */
  initiate(bookingId: number, method: PaymentMethod): Observable<Payment> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    return from(
      this.supabaseService.client
        .from(this.table)
        .insert({
          booking_id: bookingId,
          user_id: user.id,
          payment_method: method,
          status: 'pending',
        } as any)
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Failed to create payment');
        return data as Payment;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Retrieves all payment records for the currently authenticated user.
   */
  getMyPayments(): Observable<Payment[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    return from(
      this.supabaseService.client.from(this.table).select('*').eq('user_id', user.id),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Payment[]) || [];
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any): Observable<never> {
    const message = error?.message || error?.error?.message || 'Payment error';
    return throwError(() => new Error(message));
  }
}
