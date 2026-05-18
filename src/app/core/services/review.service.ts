import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Review, CreateReview, UpdateReview } from '../models';
import { User } from '../models';

const REVIEWS_KEY = 'itinera_reviews';
const USER_KEY = 'auth_user';

const DEFAULT_REVIEWS: Review[] = [
  { id: 1, tourist_id: 201, service_id: 1, rating: 5, comment: 'Absolutely stunning desert lodge. The camel ride at sunrise was unforgettable.', created_at: new Date('2025-06-15'), updated_at: new Date('2025-06-15') },
  { id: 2, tourist_id: 202, service_id: 1, rating: 4, comment: 'Great experience overall. The food could be improved but the location is magical.', created_at: new Date('2025-07-01'), updated_at: new Date('2025-07-01') },
  { id: 3, tourist_id: 203, service_id: 2, rating: 5, comment: 'La Maison Bleue is a dream. The views over the Gulf are breathtaking.', created_at: new Date('2025-06-20'), updated_at: new Date('2025-06-20') },
  { id: 4, tourist_id: 204, service_id: 2, rating: 4, comment: 'Charming boutique hotel with exceptional service. Highly recommended.', created_at: new Date('2025-07-10'), updated_at: new Date('2025-07-10') },
  { id: 5, tourist_id: 205, service_id: 3, rating: 5, comment: 'Dar Zarrouk is a masterpiece of restoration. The rooftop dining is world-class.', created_at: new Date('2025-05-25'), updated_at: new Date('2025-05-25') },
  { id: 6, tourist_id: 201, service_id: 3, rating: 4, comment: 'Beautiful heritage palace. The tile work and architecture are incredible.', created_at: new Date('2025-06-05'), updated_at: new Date('2025-06-05') },
  { id: 7, tourist_id: 202, service_id: 4, rating: 3, comment: 'Decent beachfront hotel but a bit dated. The gardens are lovely though.', created_at: new Date('2025-07-15'), updated_at: new Date('2025-07-15') },
  { id: 8, tourist_id: 203, service_id: 5, rating: 5, comment: 'The camel trek was the highlight of our trip. Sleeping under the Sahara stars is magical.', created_at: new Date('2025-08-01'), updated_at: new Date('2025-08-01') },
  { id: 9, tourist_id: 204, service_id: 6, rating: 4, comment: 'Very informative tour of Carthage. Our guide was knowledgeable and passionate.', created_at: new Date('2025-06-10'), updated_at: new Date('2025-06-10') },
  { id: 10, tourist_id: 205, service_id: 7, rating: 5, comment: 'The artisan workshop walk opened my eyes to Tunisian craftsmanship. A must-do!', created_at: new Date('2025-07-20'), updated_at: new Date('2025-07-20') },
];

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor() {
    this.seedIfEmpty();
  }

  getByService(serviceId: number): Observable<Review[]> {
    const all = this.getAll();
    return of(all.filter((r) => r.service_id === serviceId)).pipe(delay(150));
  }

  getMyReviews(): Observable<Review[]> {
    const touristId = this.getCurrentTouristId();
    if (!touristId) {
      return throwError(() => new Error('No authenticated tourist'));
    }
    const all = this.getAll();
    return of(all.filter((r) => r.tourist_id === touristId)).pipe(delay(150));
  }

  create(data: CreateReview): Observable<Review> {
    const touristId = this.getCurrentTouristId();
    if (!touristId) {
      return throwError(() => new Error('No authenticated tourist'));
    }
    const all = this.getAll();
    if (all.some((r) => r.tourist_id === touristId && r.service_id === data.service_id)) {
      return throwError(() => new Error('You have already reviewed this service'));
    }
    const now = new Date();
    const review: Review = {
      id: this.nextId(all),
      tourist_id: touristId,
      service_id: data.service_id,
      rating: data.rating,
      comment: data.comment,
      created_at: now,
      updated_at: now,
    };
    all.push(review);
    this.setAll(all);
    return of(review).pipe(delay(200));
  }

  update(id: number, data: UpdateReview): Observable<Review> {
    const all = this.getAll();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) {
      return throwError(() => new Error('Review not found'));
    }
    const updated: Review = {
      ...all[index],
      rating: data.rating ?? all[index].rating,
      comment: data.comment ?? all[index].comment,
      updated_at: new Date(),
    };
    all[index] = updated;
    this.setAll(all);
    return of(updated).pipe(delay(200));
  }

  delete(id: number): Observable<void> {
    const all = this.getAll();
    const filtered = all.filter((r) => r.id !== id);
    if (filtered.length === all.length) {
      return throwError(() => new Error('Review not found'));
    }
    this.setAll(filtered);
    return of(undefined).pipe(delay(150));
  }

  getAverageRating(serviceId: number): Observable<{ average: number; count: number }> {
    const all = this.getAll();
    const serviceReviews = all.filter((r) => r.service_id === serviceId);
    const count = serviceReviews.length;
    const average = count > 0
      ? Math.round((serviceReviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
      : 0;
    return of({ average, count }).pipe(delay(100));
  }

  private getAll(): Review[] {
    try {
      return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]') as Review[];
    } catch {
      return [];
    }
  }

  private setAll(items: Review[]): void {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(items));
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

  private nextId(items: Review[]): number {
    return items.reduce((max, r) => Math.max(max, r.id), 0) + 1;
  }

  private seedIfEmpty(): void {
    if (!localStorage.getItem(REVIEWS_KEY)) {
      this.setAll(DEFAULT_REVIEWS);
    }
  }
}
