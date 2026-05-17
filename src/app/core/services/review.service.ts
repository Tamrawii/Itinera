import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Review, CreateReview, UpdateReview } from '../models';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly table = 'reviews';

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
  ) {}

  /**
   * Retrieves all reviews submitted for a specific service.
   */
  getByService(serviceId: number): Observable<Review[]> {
    return from(
      this.supabaseService.client.from(this.table).select('*').eq('service_id', serviceId),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Review[]) || [];
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Retrieves all reviews submitted by the currently authenticated tourist.
   */
  getMyReviews(): Observable<Review[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    return from(
      this.supabaseService.client.from(this.table).select('*').eq('tourist_id', user.id),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Review[]) || [];
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Creates a new review for a service.
   */
  create(data: CreateReview): Observable<Review> {
    return from(
      this.supabaseService.client.from(this.table).insert(data as any).select().single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Failed to create review');
        return data as Review;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Updates an existing review by its ID.
   */
  update(id: number, data: UpdateReview): Observable<Review> {
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
        if (!data) throw new Error('Review not found');
        return data as Review;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Deletes a review by its ID.
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
   * Retrieves the average rating and total review count for a specific service.
   */
  getAverageRating(serviceId: number): Observable<{ average: number; count: number }> {
    return from(
      this.supabaseService.client
        .from(this.table)
        .select('rating')
        .eq('service_id', serviceId),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        const reviews = (data as Review[]) || [];
        const count = reviews.length;
        const average = count > 0
          ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / count
          : 0;
        return { average, count };
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any): Observable<never> {
    const message = error?.message || error?.error?.message || 'Review error';
    return throwError(() => new Error(message));
  }
}
