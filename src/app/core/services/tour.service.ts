import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  Tour,
  CreateTour,
  UpdateTour,
  Itinerary,
  CreateItinerary,
  UpdateItinerary,
  PaginatedResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class TourService {
  private readonly baseUrl = `${environment.apiUrl}/tours`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves a paginated list of tours.
   */
  getAll(params?: { page?: number; per_page?: number }): Observable<PaginatedResponse<Tour>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http
      .get<PaginatedResponse<Tour>>(this.baseUrl, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a single tour by its numeric ID.
   */
  getById(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all tours belonging to a specific provider.
   */
  getByProvider(providerId: number): Observable<Tour[]> {
    return this.http
      .get<Tour[]>(`${environment.apiUrl}/providers/${providerId}/tours`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a new tour.
   */
  create(data: CreateTour): Observable<Tour> {
    return this.http.post<Tour>(this.baseUrl, data).pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing tour by its ID.
   */
  update(id: number, data: UpdateTour): Observable<Tour> {
    return this.http
      .put<Tour>(`${this.baseUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a tour by its ID.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Adds a new itinerary day entry to a tour.
   */
  addItinerary(tourId: number, data: CreateItinerary): Observable<Itinerary> {
    return this.http
      .post<Itinerary>(`${this.baseUrl}/${tourId}/itinerary`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing itinerary entry by its ID.
   */
  updateItinerary(itineraryId: number, data: UpdateItinerary): Observable<Itinerary> {
    return this.http
      .put<Itinerary>(`${environment.apiUrl}/itinerary/${itineraryId}`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes an itinerary entry by its ID.
   */
  deleteItinerary(itineraryId: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/itinerary/${itineraryId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
