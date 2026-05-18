import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Wishlist } from '../models';
import { User } from '../models';

const WISHLIST_KEY = 'itinera_wishlist';
const USER_KEY = 'auth_user';

const DEFAULT_WISHLIST: Wishlist[] = [
  { id: 1, tourist_id: 201, service_id: 1, created_at: new Date('2025-05-01') },
  { id: 2, tourist_id: 201, service_id: 3, created_at: new Date('2025-05-02') },
  { id: 3, tourist_id: 202, service_id: 2, created_at: new Date('2025-05-03') },
  { id: 4, tourist_id: 202, service_id: 5, created_at: new Date('2025-05-04') },
  { id: 5, tourist_id: 203, service_id: 1, created_at: new Date('2025-05-05') },
  { id: 6, tourist_id: 203, service_id: 4, created_at: new Date('2025-05-06') },
  { id: 7, tourist_id: 204, service_id: 2, created_at: new Date('2025-05-07') },
  { id: 8, tourist_id: 204, service_id: 6, created_at: new Date('2025-05-08') },
  { id: 9, tourist_id: 205, service_id: 3, created_at: new Date('2025-05-09') },
  { id: 10, tourist_id: 205, service_id: 7, created_at: new Date('2025-05-10') },
];

@Injectable({ providedIn: 'root' })
export class WishlistService {
  constructor() {
    this.seedIfEmpty();
  }

  getMyWishlist(): Observable<Wishlist[]> {
    const touristId = this.getCurrentTouristId();
    if (!touristId) {
      return throwError(() => new Error('No authenticated tourist'));
    }
    const all = this.getAll();
    return of(all.filter((w) => w.tourist_id === touristId)).pipe(delay(150));
  }

  add(serviceId: number): Observable<Wishlist> {
    const touristId = this.getCurrentTouristId();
    if (!touristId) {
      return throwError(() => new Error('No authenticated tourist'));
    }
    const all = this.getAll();
    if (all.some((w) => w.tourist_id === touristId && w.service_id === serviceId)) {
      return throwError(() => new Error('Service already in wishlist'));
    }
    const item: Wishlist = {
      id: this.nextId(all),
      tourist_id: touristId,
      service_id: serviceId,
      created_at: new Date(),
    };
    all.push(item);
    this.setAll(all);
    return of(item).pipe(delay(150));
  }

  remove(serviceId: number): Observable<void> {
    const touristId = this.getCurrentTouristId();
    if (!touristId) {
      return throwError(() => new Error('No authenticated tourist'));
    }
    const all = this.getAll();
    const filtered = all.filter(
      (w) => !(w.tourist_id === touristId && w.service_id === serviceId),
    );
    if (filtered.length === all.length) {
      return throwError(() => new Error('Wishlist item not found'));
    }
    this.setAll(filtered);
    return of(undefined).pipe(delay(100));
  }

  isInWishlist(serviceId: number): Observable<boolean> {
    const touristId = this.getCurrentTouristId();
    if (!touristId) {
      return of(false).pipe(delay(100));
    }
    const all = this.getAll();
    const exists = all.some((w) => w.tourist_id === touristId && w.service_id === serviceId);
    return of(exists).pipe(delay(100));
  }

  private getAll(): Wishlist[] {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]') as Wishlist[];
    } catch {
      return [];
    }
  }

  private setAll(items: Wishlist[]): void {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }

  private getCurrentTouristId(): number | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      const user = JSON.parse(raw) as User;
      return user.role === 'tourist' ? user.id : null;
    } catch {
      return null;
    }
  }

  private nextId(items: Wishlist[]): number {
    return items.reduce((max, w) => Math.max(max, w.id), 0) + 1;
  }

  private seedIfEmpty(): void {
    if (!localStorage.getItem(WISHLIST_KEY)) {
      this.setAll(DEFAULT_WISHLIST);
    }
  }
}
