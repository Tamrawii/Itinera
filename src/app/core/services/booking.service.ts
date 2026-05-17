import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Booking, BookingStatus, CreateBooking, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly baseUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

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
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http
      .get<PaginatedResponse<Booking>>(this.baseUrl, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves the paginated bookings for the currently authenticated tourist.
   */
  getMyBookings(params?: {
    page?: number;
    per_page?: number;
    status?: BookingStatus;
  }): Observable<PaginatedResponse<Booking>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http
      .get<PaginatedResponse<Booking>>(`${environment.apiUrl}/my-bookings`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a single booking by its numeric ID.
   */
  getById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Creates a new booking.
   */
  create(data: CreateBooking): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, data).pipe(catchError(this.handleError));
  }

  /**
   * Updates the status of a booking (e.g. confirm, complete).
   */
  updateStatus(id: number, status: BookingStatus): Observable<Booking> {
    return this.http
      .patch<Booking>(`${this.baseUrl}/${id}/status`, { status })
      .pipe(catchError(this.handleError));
  }

  /**
   * Cancels a booking by its ID.
   */
  cancel(id: number): Observable<Booking> {
    return this.http
      .post<Booking>(`${this.baseUrl}/${id}/cancel`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves the paginated bookings for the currently authenticated provider's services.
   */
  getProviderBookings(params?: {
    page?: number;
    per_page?: number;
    status?: BookingStatus;
  }): Observable<PaginatedResponse<Booking>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http
      .get<PaginatedResponse<Booking>>(`${environment.apiUrl}/provider/bookings`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
