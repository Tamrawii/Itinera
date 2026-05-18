import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  Tour,
  CreateTour,
  UpdateTour,
  Itinerary,
  CreateItinerary,
  UpdateItinerary,
  PaginatedResponse,
} from '../models';

const TOURS_KEY = 'itinera_tours';
const ITINERARIES_KEY = 'itinera_itineraries';

const DEFAULT_ITINERARIES: Itinerary[] = [
  { id: 1, tour_id: 1, day_number: 1, description: 'Arrival and welcome dinner at the desert camp.', location: 'Douz', created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 2, tour_id: 1, day_number: 2, description: 'Camel trek into the Grand Erg Oriental.', location: 'Grand Erg Oriental', created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 3, tour_id: 2, day_number: 1, description: 'Guided tour of Carthage ruins and Antonine Baths.', location: 'Carthage', created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 4, tour_id: 2, day_number: 1, description: 'Stroll through Sidi Bou Saïd and visit art galleries.', location: 'Sidi Bou Saïd', created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 5, tour_id: 3, day_number: 1, description: 'Walking tour of Tunis Medina souks and craft workshops.', location: 'Tunis Medina', created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 6, tour_id: 4, day_number: 1, description: 'Guided exploration of the Roman amphitheatre.', location: 'El Jem', created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 7, tour_id: 5, day_number: 1, description: 'Quad bike safety briefing and dune ride.', location: 'Djerba', created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
];

const DEFAULT_TOURS: Tour[] = [
  { id: 1, provider_id: 105, name: 'Sahara Overnight Camel Trek', description: 'Guided 2-day camel trek into the Grand Erg Oriental.', images: ['images/sahara-tunisia.jpg'], price: 350, duration: 2, itinerary: [], max_participants: 12, created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 2, provider_id: 106, name: 'Carthage & Sidi Bou Saïd Half-Day Tour', description: '4-hour guided walking tour of Carthage and Sidi Bou Saïd.', images: ['images/sahara-tunisia.jpg'], price: 95, duration: 1, itinerary: [], max_participants: 15, created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 3, provider_id: 105, name: 'Medina Artisan Workshop Walk', description: '3-hour immersive tour through Tunis Medina souks.', images: ['images/sahara-tunisia.jpg'], price: 75, duration: 1, itinerary: [], max_participants: 10, created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 4, provider_id: 104, name: 'El Jem Amphitheatre Guided Tour', description: '3-hour expert-guided tour of the Roman Colosseum.', images: ['images/sahara-tunisia.jpg'], price: 85, duration: 1, itinerary: [], max_participants: 20, created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
  { id: 5, provider_id: 102, name: 'Djerba Quad & Dunes Adventure', description: '2-hour guided quad bike tour across Djerba dunes.', images: ['images/sahara-tunisia.jpg'], price: 120, duration: 1, itinerary: [], max_participants: 8, created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01') },
];

@Injectable({ providedIn: 'root' })
export class TourService {
  constructor() {
    this.seedIfEmpty();
  }

  getAll(params?: { page?: number; per_page?: number }): Observable<PaginatedResponse<Tour>> {
    let all = this.getStoredTours();
    all = all.map((t) => this.attachItineraries(t));
    return of(this.paginate(all, params?.page, params?.per_page)).pipe(delay(200));
  }

  getById(id: number): Observable<Tour> {
    const all = this.getStoredTours();
    const tour = all.find((t) => t.id === id);
    if (!tour) {
      return throwError(() => new Error('Tour not found'));
    }
    return of(this.attachItineraries(tour)).pipe(delay(150));
  }

  getByProvider(providerId: number): Observable<Tour[]> {
    const all = this.getStoredTours();
    const tours = all.filter((t) => t.provider_id === providerId).map((t) => this.attachItineraries(t));
    return of(tours).pipe(delay(150));
  }

  create(data: CreateTour): Observable<Tour> {
    const all = this.getStoredTours();
    const now = new Date();
    const tour: Tour = {
      id: this.nextTourId(all),
      provider_id: data.provider_id,
      name: data.name,
      description: data.description,
      images: data.images,
      price: data.price,
      duration: data.duration,
      itinerary: [],
      max_participants: data.max_participants,
      created_at: now,
      updated_at: now,
    };
    all.push(tour);
    this.setStoredTours(all);

    if (data.itinerary?.length) {
      const itineraries = this.getStoredItineraries();
      data.itinerary.forEach((item, idx) => {
        itineraries.push({
          id: this.nextItineraryId(itineraries),
          tour_id: tour.id,
          day_number: item.day_number ?? idx + 1,
          description: item.description,
          location: item.location,
          created_at: now,
          updated_at: now,
        });
      });
      this.setStoredItineraries(itineraries);
    }

    return of(this.attachItineraries(tour)).pipe(delay(200));
  }

  update(id: number, data: UpdateTour): Observable<Tour> {
    const all = this.getStoredTours();
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) {
      return throwError(() => new Error('Tour not found'));
    }
    const { itinerary: _, ...rest } = data as any;
    const updated: Tour = {
      ...all[index],
      ...rest,
      updated_at: new Date(),
    };
    all[index] = updated;
    this.setStoredTours(all);
    return of(this.attachItineraries(updated)).pipe(delay(200));
  }

  delete(id: number): Observable<void> {
    const all = this.getStoredTours();
    const filtered = all.filter((t) => t.id !== id);
    if (filtered.length === all.length) {
      return throwError(() => new Error('Tour not found'));
    }
    this.setStoredTours(filtered);

    const itineraries = this.getStoredItineraries().filter((i) => i.tour_id !== id);
    this.setStoredItineraries(itineraries);

    return of(undefined).pipe(delay(150));
  }

  addItinerary(tourId: number, data: CreateItinerary): Observable<Itinerary> {
    const itineraries = this.getStoredItineraries();
    const now = new Date();
    const itinerary: Itinerary = {
      id: this.nextItineraryId(itineraries),
      tour_id: tourId,
      day_number: data.day_number,
      description: data.description,
      location: data.location,
      created_at: now,
      updated_at: now,
    };
    itineraries.push(itinerary);
    this.setStoredItineraries(itineraries);
    return of(itinerary).pipe(delay(200));
  }

  updateItinerary(itineraryId: number, data: UpdateItinerary): Observable<Itinerary> {
    const itineraries = this.getStoredItineraries();
    const index = itineraries.findIndex((i) => i.id === itineraryId);
    if (index === -1) {
      return throwError(() => new Error('Itinerary not found'));
    }
    const updated: Itinerary = {
      ...itineraries[index],
      ...data,
      updated_at: new Date(),
    };
    itineraries[index] = updated;
    this.setStoredItineraries(itineraries);
    return of(updated).pipe(delay(200));
  }

  deleteItinerary(itineraryId: number): Observable<void> {
    const itineraries = this.getStoredItineraries();
    const filtered = itineraries.filter((i) => i.id !== itineraryId);
    if (filtered.length === itineraries.length) {
      return throwError(() => new Error('Itinerary not found'));
    }
    this.setStoredItineraries(filtered);
    return of(undefined).pipe(delay(150));
  }

  private attachItineraries(tour: Tour): Tour {
    const itineraries = this.getStoredItineraries();
    return {
      ...tour,
      itinerary: itineraries
        .filter((i) => i.tour_id === tour.id)
        .sort((a, b) => a.day_number - b.day_number),
    };
  }

  private getStoredTours(): Tour[] {
    try { return JSON.parse(localStorage.getItem(TOURS_KEY) || '[]') as Tour[]; } catch { return []; }
  }

  private setStoredTours(items: Tour[]): void {
    localStorage.setItem(TOURS_KEY, JSON.stringify(items));
  }

  private getStoredItineraries(): Itinerary[] {
    try { return JSON.parse(localStorage.getItem(ITINERARIES_KEY) || '[]') as Itinerary[]; } catch { return []; }
  }

  private setStoredItineraries(items: Itinerary[]): void {
    localStorage.setItem(ITINERARIES_KEY, JSON.stringify(items));
  }

  private paginate(items: Tour[], page?: number, perPage?: number): PaginatedResponse<Tour> {
    const p = page ?? 1;
    const pp = perPage ?? 10;
    const total = items.length;
    const lastPage = Math.max(1, Math.ceil(total / pp));
    const start = (p - 1) * pp;
    return { data: items.slice(start, start + pp), total, page: p, per_page: pp, last_page: lastPage };
  }

  private nextTourId(items: Tour[]): number {
    return items.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  }

  private nextItineraryId(items: Itinerary[]): number {
    return items.reduce((max, i) => Math.max(max, i.id), 0) + 1;
  }

  private seedIfEmpty(): void {
    if (!localStorage.getItem(TOURS_KEY)) {
      this.setStoredTours(DEFAULT_TOURS);
    }
    if (!localStorage.getItem(ITINERARIES_KEY)) {
      this.setStoredItineraries(DEFAULT_ITINERARIES);
    }
  }
}
