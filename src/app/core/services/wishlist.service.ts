import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Wishlist } from '../models';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly table = 'wishlists';

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
  ) {}

  /**
   * Retrieves the full wishlist of the currently authenticated tourist.
   */
  getMyWishlist(): Observable<Wishlist[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    return from(
      this.supabaseService.client.from(this.table).select('*').eq('user_id', user.id),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Wishlist[]) || [];
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Adds a service to the current tourist's wishlist.
   */
  add(serviceId: number): Observable<Wishlist> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    return from(
      this.supabaseService.client
        .from(this.table)
        .insert({ user_id: user.id, service_id: serviceId } as any)
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Failed to add to wishlist');
        return data as Wishlist;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Removes a service from the current tourist's wishlist.
   */
  remove(serviceId: number): Observable<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    return from(
      this.supabaseService.client
        .from(this.table)
        .delete()
        .eq('user_id', user.id)
        .eq('service_id', serviceId),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Checks whether a specific service is already in the current tourist's wishlist.
   */
  isInWishlist(serviceId: number): Observable<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    return from(
      this.supabaseService.client
        .from(this.table)
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('service_id', serviceId),
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return (response.count || 0) > 0;
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any): Observable<never> {
    const message = error?.message || error?.error?.message || 'Wishlist error';
    return throwError(() => new Error(message));
  }
}
