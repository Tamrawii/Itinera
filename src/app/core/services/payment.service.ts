import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Payment, PaymentMethod } from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly baseUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the payment record associated with a specific booking.
   */
  getByBooking(bookingId: number): Observable<Payment> {
    return this.http
      .get<Payment>(`${this.baseUrl}/booking/${bookingId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Initiates a payment for a booking using a specified payment method.
   */
  initiate(bookingId: number, method: PaymentMethod): Observable<Payment> {
    return this.http
      .post<Payment>(this.baseUrl, { booking_id: bookingId, payment_method: method })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all payment records for the currently authenticated user.
   */
  getMyPayments(): Observable<Payment[]> {
    return this.http
      .get<Payment[]>(`${environment.apiUrl}/my-payments`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
