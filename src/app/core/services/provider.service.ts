import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  Provider,
  CreateProvider,
  UpdateProvider,
  ProviderStatus,
  ProviderType,
  PaginatedResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private readonly baseUrl = `${environment.apiUrl}/providers`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves a paginated list of providers with optional status/type filters.
   */
  getAll(params?: {
    page?: number;
    per_page?: number;
    status?: ProviderStatus;
    provider_type?: ProviderType;
  }): Observable<PaginatedResponse<Provider>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http
      .get<PaginatedResponse<Provider>>(this.baseUrl, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a provider by their numeric ID.
   */
  getById(id: number): Observable<Provider> {
    return this.http.get<Provider>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Retrieves the provider profile linked to the currently authenticated user.
   */
  getMyProvider(): Observable<Provider> {
    return this.http.get<Provider>(`${this.baseUrl}/me`).pipe(catchError(this.handleError));
  }

  /**
   * Creates a new provider profile.
   */
  create(data: CreateProvider): Observable<Provider> {
    return this.http.post<Provider>(this.baseUrl, data).pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing provider profile by ID.
   */
  update(id: number, data: UpdateProvider): Observable<Provider> {
    return this.http
      .put<Provider>(`${this.baseUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Uploads verification documents for a provider as multipart/form-data.
   */
  uploadDocuments(id: number, files: FormData): Observable<Provider> {
    return this.http
      .post<Provider>(`${this.baseUrl}/${id}/documents`, files)
      .pipe(catchError(this.handleError));
  }

  /**
   * Approves a pending provider application (admin only).
   */
  approve(id: number): Observable<Provider> {
    return this.http
      .post<Provider>(`${this.baseUrl}/${id}/approve`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Rejects a provider application with a human-readable reason (admin only).
   */
  reject(id: number, reason: string): Observable<Provider> {
    return this.http
      .post<Provider>(`${this.baseUrl}/${id}/reject`, { reason })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
