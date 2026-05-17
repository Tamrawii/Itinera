import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Review, CreateReview, UpdateReview } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly baseUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all reviews submitted for a specific service.
   */
  getByService(serviceId: number): Observable<Review[]> {
    return this.http
      .get<Review[]>(`${environment.apiUrl}/services/${serviceId}/reviews`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all reviews submitted by the currently authenticated tourist.
   */
  getMyReviews(): Observable<Review[]> {
    return this.http
      .get<Review[]>(`${environment.apiUrl}/my-reviews`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a new review for a service.
   */
  create(data: CreateReview): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, data).pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing review by its ID.
   */
  update(id: number, data: UpdateReview): Observable<Review> {
    return this.http
      .put<Review>(`${this.baseUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a review by its ID.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Retrieves the average rating and total review count for a specific service.
   */
  getAverageRating(serviceId: number): Observable<{ average: number; count: number }> {
    return this.http
      .get<{ average: number; count: number }>(
        `${environment.apiUrl}/services/${serviceId}/rating`,
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
