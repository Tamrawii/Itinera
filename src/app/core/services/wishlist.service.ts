import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Wishlist } from '../models';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly baseUrl = `${environment.apiUrl}/wishlist`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the full wishlist of the currently authenticated tourist.
   */
  getMyWishlist(): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(this.baseUrl).pipe(catchError(this.handleError));
  }

  /**
   * Adds a service to the current tourist's wishlist.
   */
  add(serviceId: number): Observable<Wishlist> {
    return this.http
      .post<Wishlist>(this.baseUrl, { service_id: serviceId })
      .pipe(catchError(this.handleError));
  }

  /**
   * Removes a service from the current tourist's wishlist.
   */
  remove(serviceId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${serviceId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Checks whether a specific service is already in the current tourist's wishlist.
   */
  isInWishlist(serviceId: number): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.baseUrl}/${serviceId}/check`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
