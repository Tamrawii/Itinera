import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  Service,
  CreateService,
  UpdateService,
  ServiceAvailability,
  PaginatedResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly baseUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves a paginated list of services with optional filters.
   */
  getAll(params?: {
    page?: number;
    per_page?: number;
    category?: string;
    provider_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
  }): Observable<PaginatedResponse<Service>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }
    return this.http
      .get<PaginatedResponse<Service>>(this.baseUrl, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a single service by its numeric ID.
   */
  getById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all services belonging to a specific provider.
   */
  getByProvider(providerId: number): Observable<Service[]> {
    return this.http
      .get<Service[]>(`${environment.apiUrl}/providers/${providerId}/services`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a new service listing.
   */
  create(data: CreateService): Observable<Service> {
    return this.http.post<Service>(this.baseUrl, data).pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing service by its ID.
   */
  update(id: number, data: UpdateService): Observable<Service> {
    return this.http
      .put<Service>(`${this.baseUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a service by its ID.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Uploads images for a service as multipart/form-data.
   */
  uploadImages(id: number, formData: FormData): Observable<Service> {
    return this.http
      .post<Service>(`${this.baseUrl}/${id}/images`, formData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Replaces the full availability schedule for a service.
   */
  updateAvailability(id: number, availability: ServiceAvailability[]): Observable<Service> {
    return this.http
      .put<Service>(`${this.baseUrl}/${id}/availability`, { availability })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
