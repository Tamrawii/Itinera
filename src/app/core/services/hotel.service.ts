import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Hotel, CreateHotel, UpdateHotel, PaginatedResponse } from '../models';

const HOTELS_KEY = 'itinera_hotels';

const DEFAULT_HOTELS: Hotel[] = [
  { id: 1, provider_id: 101, name: 'Sahara Palace Douz', description: 'Desert lodge at the gateway of the Grand Erg Oriental.', images: ['images/sahara-tunisia.jpg'], rooms_count: 24, check_in_time: '14:00', check_out_time: '12:00', amenities: ['Pool', 'Hammam', 'Restaurant', 'WiFi'], created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 2, provider_id: 102, name: 'La Maison Bleue', description: 'Boutique riad-style hotel in Sidi Bou Saïd.', images: ['images/sahara-tunisia.jpg'], rooms_count: 12, check_in_time: '15:00', check_out_time: '11:00', amenities: ['Rooftop', 'Restaurant', 'WiFi', 'Sea View'], created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 3, provider_id: 103, name: 'Dar Zarrouk Heritage Palace', description: 'Restored 19th-century palace in Tunis Medina.', images: ['images/sahara-tunisia.jpg'], rooms_count: 18, check_in_time: '14:00', check_out_time: '12:00', amenities: ['Rooftop Restaurant', 'Hammam', 'Courtyard', 'WiFi'], created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 4, provider_id: 104, name: 'Hôtel Les Orangers', description: 'Classic beachfront hotel in Hammamet.', images: ['images/sahara-tunisia.jpg'], rooms_count: 45, check_in_time: '14:00', check_out_time: '12:00', amenities: ['Pool', 'Beach Access', 'Restaurant', 'Spa'], created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
];

@Injectable({ providedIn: 'root' })
export class HotelService {
  constructor() {
    this.seedIfEmpty();
  }

  getAll(params?: { page?: number; per_page?: number }): Observable<PaginatedResponse<Hotel>> {
    const all = this.getStored();
    return of(this.paginate(all, params?.page, params?.per_page)).pipe(delay(200));
  }

  getById(id: number): Observable<Hotel> {
    const all = this.getStored();
    const hotel = all.find((h) => h.id === id);
    if (!hotel) {
      return throwError(() => new Error('Hotel not found'));
    }
    return of(hotel).pipe(delay(150));
  }

  getByProvider(providerId: number): Observable<Hotel> {
    const all = this.getStored();
    const hotel = all.find((h) => h.provider_id === providerId);
    if (!hotel) {
      return throwError(() => new Error('Hotel not found for this provider'));
    }
    return of(hotel).pipe(delay(150));
  }

  create(data: CreateHotel): Observable<Hotel> {
    const all = this.getStored();
    const now = new Date();
    const hotel: Hotel = {
      id: this.nextId(all),
      ...data,
      created_at: now,
      updated_at: now,
    };
    all.push(hotel);
    this.setStored(all);
    return of(hotel).pipe(delay(200));
  }

  update(id: number, data: UpdateHotel): Observable<Hotel> {
    const all = this.getStored();
    const index = all.findIndex((h) => h.id === id);
    if (index === -1) {
      return throwError(() => new Error('Hotel not found'));
    }
    const updated: Hotel = {
      ...all[index],
      ...data,
      updated_at: new Date(),
    };
    all[index] = updated;
    this.setStored(all);
    return of(updated).pipe(delay(200));
  }

  delete(id: number): Observable<void> {
    const all = this.getStored();
    const filtered = all.filter((h) => h.id !== id);
    if (filtered.length === all.length) {
      return throwError(() => new Error('Hotel not found'));
    }
    this.setStored(filtered);
    return of(undefined).pipe(delay(150));
  }

  private getStored(): Hotel[] {
    try {
      return JSON.parse(localStorage.getItem(HOTELS_KEY) || '[]') as Hotel[];
    } catch {
      return [];
    }
  }

  private setStored(items: Hotel[]): void {
    localStorage.setItem(HOTELS_KEY, JSON.stringify(items));
  }

  private paginate(items: Hotel[], page?: number, perPage?: number): PaginatedResponse<Hotel> {
    const p = page ?? 1;
    const pp = perPage ?? 10;
    const total = items.length;
    const lastPage = Math.max(1, Math.ceil(total / pp));
    const start = (p - 1) * pp;
    return { data: items.slice(start, start + pp), total, page: p, per_page: pp, last_page: lastPage };
  }

  private nextId(items: Hotel[]): number {
    return items.reduce((max, h) => Math.max(max, h.id), 0) + 1;
  }

  private seedIfEmpty(): void {
    if (!localStorage.getItem(HOTELS_KEY)) {
      this.setStored(DEFAULT_HOTELS);
    }
  }
}
