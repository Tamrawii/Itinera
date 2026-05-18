import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Booking, BookingStatus, CreateBooking, PaginatedResponse } from '../models';
import { User } from '../models';

const BOOKINGS_KEY = 'itinera_bookings';
const USER_KEY = 'auth_user';

const DEFAULT_BOOKINGS: Booking[] = [
  { id: 1, tourist_id: 201, service_id: 1, booking_date: new Date('2025-07-15'), status: 'confirmed', total_price: 280, created_at: new Date('2025-06-01'), updated_at: new Date('2025-06-01') },
  { id: 2, tourist_id: 202, service_id: 2, booking_date: new Date('2025-08-01'), status: 'confirmed', total_price: 320, created_at: new Date('2025-06-15'), updated_at: new Date('2025-06-15') },
  { id: 3, tourist_id: 203, service_id: 3, booking_date: new Date('2025-08-10'), status: 'pending', total_price: 480, created_at: new Date('2025-07-01'), updated_at: new Date('2025-07-01') },
  { id: 4, tourist_id: 204, service_id: 4, booking_date: new Date('2025-09-01'), status: 'completed', total_price: 195, created_at: new Date('2025-07-15'), updated_at: new Date('2025-09-02') },
  { id: 5, tourist_id: 205, service_id: 5, booking_date: new Date('2025-10-15'), status: 'confirmed', total_price: 350, created_at: new Date('2025-08-01'), updated_at: new Date('2025-08-01') },
  { id: 6, tourist_id: 201, service_id: 6, booking_date: new Date('2025-11-01'), status: 'cancelled', total_price: 95, created_at: new Date('2025-09-01'), updated_at: new Date('2025-10-15') },
  { id: 7, tourist_id: 202, service_id: 7, booking_date: new Date('2025-12-01'), status: 'pending', total_price: 75, created_at: new Date('2025-10-01'), updated_at: new Date('2025-10-01') },
];

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor() {
    this.seedIfEmpty();
  }

  getAll(params?: {
    page?: number;
    per_page?: number;
    status?: BookingStatus;
    tourist_id?: number;
    service_id?: number;
  }): Observable<PaginatedResponse<Booking>> {
    let all = this.getAllBookings();

    if (params?.status) {
      all = all.filter((b) => b.status === params.status);
    }
    if (params?.tourist_id) {
      all = all.filter((b) => b.tourist_id === params.tourist_id);
    }
    if (params?.service_id) {
      all = all.filter((b) => b.service_id === params.service_id);
    }

    return of(this.paginate(all, params?.page, params?.per_page)).pipe(delay(200));
  }

  getMyBookings(params?: {
    page?: number;
    per_page?: number;
    status?: BookingStatus;
  }): Observable<PaginatedResponse<Booking>> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    let all = this.getAllBookings().filter((b) => b.tourist_id === current.id);

    if (params?.status) {
      all = all.filter((b) => b.status === params.status);
    }

    return of(this.paginate(all, params?.page, params?.per_page)).pipe(delay(200));
  }

  getById(id: number): Observable<Booking> {
    const all = this.getAllBookings();
    const booking = all.find((b) => b.id === id);
    if (!booking) {
      return throwError(() => new Error('Booking not found'));
    }
    return of(booking).pipe(delay(150));
  }

  create(data: CreateBooking): Observable<Booking> {
    const all = this.getAllBookings();
    const now = new Date();
    const booking: Booking = {
      id: this.nextId(all),
      tourist_id: data.tourist_id,
      service_id: data.service_id,
      booking_date: data.booking_date,
      status: 'pending',
      total_price: data.total_price,
      created_at: now,
      updated_at: now,
    };
    all.push(booking);
    this.setAllBookings(all);
    return of(booking).pipe(delay(200));
  }

  updateStatus(id: number, status: BookingStatus): Observable<Booking> {
    const all = this.getAllBookings();
    const index = all.findIndex((b) => b.id === id);
    if (index === -1) {
      return throwError(() => new Error('Booking not found'));
    }
    all[index] = { ...all[index], status, updated_at: new Date() };
    this.setAllBookings(all);
    return of(all[index]).pipe(delay(200));
  }

  cancel(id: number): Observable<Booking> {
    return this.updateStatus(id, 'cancelled');
  }

  getProviderBookings(params?: {
    page?: number;
    per_page?: number;
    status?: BookingStatus;
  }): Observable<PaginatedResponse<Booking>> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const services = this.getStoredServices();
    const providerServiceIds = services
      .filter((s) => s.provider_id === current.id)
      .map((s) => s.id);

    let all = this.getAllBookings().filter((b) =>
      providerServiceIds.includes(b.service_id),
    );

    if (params?.status) {
      all = all.filter((b) => b.status === params.status);
    }

    return of(this.paginate(all, params?.page, params?.per_page)).pipe(delay(200));
  }

  private getAllBookings(): Booking[] {
    try {
      return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]') as Booking[];
    } catch {
      return [];
    }
  }

  private setAllBookings(items: Booking[]): void {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(items));
  }

  private getStoredServices(): { id: number; provider_id: number }[] {
    try {
      return JSON.parse(localStorage.getItem('itinera_services') || '[]') as { id: number; provider_id: number }[];
    } catch {
      return [];
    }
  }

  private getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private paginate(
    items: Booking[],
    page?: number,
    perPage?: number,
  ): PaginatedResponse<Booking> {
    const p = page ?? 1;
    const pp = perPage ?? 10;
    const total = items.length;
    const lastPage = Math.max(1, Math.ceil(total / pp));
    const start = (p - 1) * pp;
    return {
      data: items.slice(start, start + pp),
      total,
      page: p,
      per_page: pp,
      last_page: lastPage,
    };
  }

  private nextId(items: Booking[]): number {
    return items.reduce((max, b) => Math.max(max, b.id), 0) + 1;
  }

  private seedIfEmpty(): void {
    if (!localStorage.getItem(BOOKINGS_KEY)) {
      this.setAllBookings(DEFAULT_BOOKINGS);
    }
  }
}
