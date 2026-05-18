import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  Service,
  CreateService,
  UpdateService,
  ServiceAvailability,
  PaginatedResponse,
} from '../models';

const SERVICES_KEY = 'itinera_services';

const DEFAULT_SERVICES: Service[] = [
  {
    id: 1, provider_id: 101, name: 'Sahara Palace Douz — Desert Lodge',
    description: 'A desert lodge at the gateway of the Grand Erg Oriental. Traditional architecture with private hammam, camel paddock, and direct access to the dunes.',
    price: 280, category: 'hotel', images: ['images/sahara-tunisia.jpg'],
    availability: [{ date: '2025-06-01', slots: 5 }, { date: '2025-07-01', slots: 3 }],
    location: 'Douz, Kébili', address: 'Route des Dunes, Douz, Kébili 4260',
    created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01'),
  },
  {
    id: 2, provider_id: 102, name: 'La Maison Bleue — Sidi Bou Saïd',
    description: 'A boutique riad-style hotel in the iconic blue-and-white village, offering panoramic views over the Gulf of Tunis.',
    price: 320, category: 'hotel', images: ['images/sahara-tunisia.jpg'],
    availability: [{ date: '2025-06-01', slots: 8 }, { date: '2025-07-01', slots: 6 }],
    location: 'Sidi Bou Saïd, Tunis', address: 'Rue Sidi Bou Saïd, Sidi Bou Saïd, Tunis 2026',
    created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01'),
  },
  {
    id: 3, provider_id: 103, name: 'Médina Dar Zarrouk — Heritage Palace',
    description: 'A restored 19th-century palace in the heart of Tunis Medina. Original tile work and a rooftop restaurant.',
    price: 480, category: 'hotel', images: ['images/sahara-tunisia.jpg'],
    availability: [{ date: '2025-06-01', slots: 4 }, { date: '2025-07-01', slots: 2 }],
    location: 'Tunis Medina, Tunis', address: 'Rue Sidi Bou Khrissan, Médina de Tunis, Tunis 1008',
    created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01'),
  },
  {
    id: 4, provider_id: 104, name: 'Hôtel Les Orangers — Hammamet',
    description: 'A classic beachfront hotel surrounded by orange and jasmine gardens. Direct beach access and a large outdoor pool.',
    price: 195, category: 'hotel', images: ['images/sahara-tunisia.jpg'],
    availability: [{ date: '2025-06-01', slots: 10 }, { date: '2025-07-01', slots: 8 }],
    location: 'Hammamet, Nabeul', address: 'Avenue de la Plage, Hammamet, Nabeul 8050',
    created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01'),
  },
  {
    id: 5, provider_id: 105, name: 'Sahara Overnight Camel Trek',
    description: 'A guided 2-day camel trek into the Grand Erg Oriental. Berber tent overnight stay under the stars.',
    price: 350, category: 'activity', images: ['images/sahara-tunisia.jpg'],
    availability: [{ date: '2025-10-01', slots: 12 }, { date: '2025-11-01', slots: 10 }],
    location: 'Douz, Kébili', address: 'Route des Dunes, Douz, Kébili 4260',
    created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01'),
  },
  {
    id: 6, provider_id: 106, name: 'Carthage & Sidi Bou Saïd Half-Day Tour',
    description: 'A 4-hour guided walking tour covering the UNESCO ruins of Carthage followed by Sidi Bou Saïd.',
    price: 95, category: 'activity', images: ['images/sahara-tunisia.jpg'],
    availability: [{ date: '2025-06-01', slots: 15 }, { date: '2025-07-01', slots: 12 }],
    location: 'Carthage, Tunis', address: 'Avenue Habib Bourguiba, Carthage, Tunis 2016',
    created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01'),
  },
  {
    id: 7, provider_id: 105, name: 'Medina Artisan Workshop Walk',
    description: 'A 3-hour immersive tour through the souks of Tunis Medina visiting active craft workshops.',
    price: 75, category: 'activity', images: ['images/sahara-tunisia.jpg'],
    availability: [{ date: '2025-06-01', slots: 10 }, { date: '2025-07-01', slots: 8 }],
    location: 'Tunis Medina, Tunis', address: 'Rue de la Kasbah, Tunis Medina, Tunis 1008',
    created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01'),
  },
  {
    id: 8, provider_id: 104, name: 'El Jem Amphitheatre Guided Tour',
    description: 'A 3-hour expert-guided tour of the Roman Colosseum of El Jem with underground gallery access.',
    price: 85, category: 'activity', images: ['images/sahara-tunisia.jpg'],
    availability: [{ date: '2025-06-01', slots: 20 }, { date: '2025-07-01', slots: 18 }],
    location: 'El Jem, Mahdia', address: 'Route de Sfax, El Jem, Mahdia 5160',
    created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01'),
  },
  {
    id: 9, provider_id: 102, name: 'Djerba Quad & Dunes Adventure',
    description: 'A 2-hour guided quad bike tour across the sandy tracks and coastal dunes of Djerba.',
    price: 120, category: 'activity', images: ['images/sahara-tunisia.jpg'],
    availability: [{ date: '2025-06-01', slots: 8 }, { date: '2025-07-01', slots: 6 }],
    location: 'Djerba, Médenine', address: 'Zone Touristique Midoun, Djerba, Médenine 4116',
    created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01'),
  },
  {
    id: 10, provider_id: 103, name: 'Au Bon Vieux Temps — Traditional Tunisian',
    description: 'A legendary family restaurant inside the Tunis Medina serving recipes passed down three generations.',
    price: 45, category: 'restaurant', images: ['images/sahara-tunisia.jpg'],
    availability: [{ date: '2025-06-01', slots: 30 }, { date: '2025-07-01', slots: 25 }],
    location: 'Tunis Medina, Tunis', address: 'Rue Sidi Bou Khrissan, Médina de Tunis, Tunis 1008',
    created_at: new Date('2025-01-01'), updated_at: new Date('2025-01-01'),
  },
];

@Injectable({ providedIn: 'root' })
export class ServiceService {
  constructor() {
    this.seedIfEmpty();
  }

  getAll(params?: {
    page?: number;
    per_page?: number;
    category?: string;
    provider_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
  }): Observable<PaginatedResponse<Service>> {
    let all = this.getStored();

    if (params?.category) {
      all = all.filter((s) => s.category === params.category);
    }
    if (params?.provider_id) {
      all = all.filter((s) => s.provider_id === params.provider_id);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      all = all.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q),
      );
    }
    if (params?.min_price !== undefined) {
      all = all.filter((s) => s.price >= params.min_price!);
    }
    if (params?.max_price !== undefined) {
      all = all.filter((s) => s.price <= params.max_price!);
    }

    return of(this.paginate(all, params?.page, params?.per_page)).pipe(delay(200));
  }

  getById(id: number): Observable<Service> {
    const all = this.getStored();
    const service = all.find((s) => s.id === id);
    if (!service) {
      return throwError(() => new Error('Service not found'));
    }
    return of(service).pipe(delay(150));
  }

  getByProvider(providerId: number): Observable<Service[]> {
    const all = this.getStored();
    return of(all.filter((s) => s.provider_id === providerId)).pipe(delay(150));
  }

  create(data: CreateService): Observable<Service> {
    const all = this.getStored();
    const now = new Date();
    const service: Service = {
      id: this.nextId(all),
      ...data,
      created_at: now,
      updated_at: now,
    };
    all.push(service);
    this.setStored(all);
    return of(service).pipe(delay(200));
  }

  update(id: number, data: UpdateService): Observable<Service> {
    const all = this.getStored();
    const index = all.findIndex((s) => s.id === id);
    if (index === -1) {
      return throwError(() => new Error('Service not found'));
    }
    const updated: Service = {
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
    const filtered = all.filter((s) => s.id !== id);
    if (filtered.length === all.length) {
      return throwError(() => new Error('Service not found'));
    }
    this.setStored(filtered);
    return of(undefined).pipe(delay(150));
  }

  uploadImages(id: number, formData: FormData): Observable<Service> {
    const all = this.getStored();
    const index = all.findIndex((s) => s.id === id);
    if (index === -1) {
      return throwError(() => new Error('Service not found'));
    }
    const newImages: string[] = [];
    formData.forEach((value, key) => {
      if (value instanceof File) {
        newImages.push(`/images/${value.name}`);
      }
    });
    all[index] = {
      ...all[index],
      images: [...all[index].images, ...newImages],
      updated_at: new Date(),
    };
    this.setStored(all);
    return of(all[index]).pipe(delay(300));
  }

  updateAvailability(id: number, availability: ServiceAvailability[]): Observable<Service> {
    const all = this.getStored();
    const index = all.findIndex((s) => s.id === id);
    if (index === -1) {
      return throwError(() => new Error('Service not found'));
    }
    all[index] = { ...all[index], availability, updated_at: new Date() };
    this.setStored(all);
    return of(all[index]).pipe(delay(200));
  }

  private getStored(): Service[] {
    try {
      return JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]') as Service[];
    } catch {
      return [];
    }
  }

  private setStored(items: Service[]): void {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(items));
  }

  private paginate(
    items: Service[],
    page?: number,
    perPage?: number,
  ): PaginatedResponse<Service> {
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

  private nextId(items: Service[]): number {
    return items.reduce((max, s) => Math.max(max, s.id), 0) + 1;
  }

  private seedIfEmpty(): void {
    if (!localStorage.getItem(SERVICES_KEY)) {
      this.setStored(DEFAULT_SERVICES);
    }
  }
}
