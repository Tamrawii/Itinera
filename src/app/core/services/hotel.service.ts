import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Hotel, CreateHotel, UpdateHotel, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private readonly baseUrl = `${environment.apiUrl}/hotels`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves a paginated list of hotels.
   */
  getAll(params?: { page?: number; per_page?: number }): Observable<PaginatedResponse<Hotel>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http
      .get<PaginatedResponse<Hotel>>(this.baseUrl, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a single hotel by its numeric ID.
   */
  getById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Retrieves the hotel associated with a specific provider.
   */
  getByProvider(providerId: number): Observable<Hotel> {
    return this.http
      .get<Hotel>(`${environment.apiUrl}/providers/${providerId}/hotel`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a new hotel record.
   */
  create(data: CreateHotel): Observable<Hotel> {
    return this.http.post<Hotel>(this.baseUrl, data).pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing hotel by its ID.
   */
  update(id: number, data: UpdateHotel): Observable<Hotel> {
    return this.http
      .put<Hotel>(`${this.baseUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a hotel by its ID.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
