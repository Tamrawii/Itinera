import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User, UpdateUser, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves a paginated, optionally filtered list of all users (admin).
   */
  getAll(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    role?: string;
  }): Observable<PaginatedResponse<User>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http
      .get<PaginatedResponse<User>>(this.baseUrl, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a single user by their numeric ID.
   */
  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Updates an arbitrary user's profile by ID (admin).
   */
  updateProfile(id: number, data: UpdateUser): Observable<User> {
    return this.http
      .put<User>(`${this.baseUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Permanently deletes a user by their ID (admin).
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Retrieves the profile of the currently authenticated user.
   */
  getMyProfile(): Observable<User> {
    return this.http
      .get<User>(`${environment.apiUrl}/me`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates the currently authenticated user's own profile fields.
   */
  updateMyProfile(data: Partial<User>): Observable<User> {
    return this.http
      .patch<User>(`${environment.apiUrl}/me`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Changes the current user's password.
   */
  changePassword(data: { current_password: string; new_password: string }): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/me/change-password`, data)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
