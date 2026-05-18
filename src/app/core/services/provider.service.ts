import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  Provider,
  CreateProvider,
  UpdateProvider,
  ProviderStatus,
  ProviderType,
  PaginatedResponse,
  EnrichedProvider,
} from '../models';
import { User } from '../models';

const PROVIDERS_KEY = 'itinera_providers';
const USER_KEY = 'auth_user';

const DEFAULT_PROVIDERS: Provider[] = [
  {
    id: 1,
    user_id: 101,
    provider_type: 'hotel',
    business_name: 'Sahara Palace Douz',
    description: 'Desert lodge and camel trek operator in Douz.',
    documents: [],
    status: 'approved',
    phone: '+216 74 470 123',
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  },
  {
    id: 2,
    user_id: 102,
    provider_type: 'hotel',
    business_name: 'La Maison Bleue',
    description: 'Boutique riad-style hotel in Sidi Bou Saïd.',
    documents: [],
    status: 'approved',
    phone: '+216 71 740 456',
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  },
  {
    id: 3,
    user_id: 103,
    provider_type: 'restaurant',
    business_name: 'Dar Zarrouk',
    description: 'Heritage palace and fine dining in Tunis Medina.',
    documents: [],
    status: 'approved',
    phone: '+216 71 561 789',
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  },
  {
    id: 4,
    user_id: 104,
    provider_type: 'agency',
    business_name: 'Carthage Guides',
    description: 'Expert-guided tours of Carthage and Tunisian heritage sites.',
    documents: [],
    status: 'approved',
    phone: '+216 71 730 234',
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  },
  {
    id: 5,
    user_id: 105,
    provider_type: 'transport',
    business_name: 'Transfer Tunisie',
    description: 'Private and shared transfers across Tunisia.',
    documents: [],
    status: 'pending',
    phone: '+216 98 456 012',
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  },
  {
    id: 6,
    user_id: 106,
    provider_type: 'agency',
    business_name: 'Djerba Explore',
    description: 'Adventure tours and excursions in Djerba.',
    documents: [],
    status: 'rejected',
    phone: '+216 75 653 678',
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  },
];

@Injectable({ providedIn: 'root' })
export class ProviderService {
  constructor() {
    this.seedIfEmpty();
  }

  getAllEnriched(params?: { status?: ProviderStatus }): Observable<EnrichedProvider[]> {
    const storedUsers = this.getStoredUsers();
    let all = this.getStored() as EnrichedProvider[];

    if (params?.status) {
      all = all.filter((p) => p.status === params.status);
    }

    return of(
      all.map((p) => {
        const user = storedUsers.find((u) => u.id === p.user_id);
        return {
          ...p,
          user_full_name: user?.full_name ?? 'Unknown',
          user_email: user?.email ?? '',
        };
      }),
    ).pipe(delay(200));
  }

  getAll(params?: {
    page?: number;
    per_page?: number;
    status?: ProviderStatus;
    provider_type?: ProviderType;
  }): Observable<PaginatedResponse<Provider>> {
    let all = this.getStored();

    if (params?.status) {
      all = all.filter((p) => p.status === params.status);
    }
    if (params?.provider_type) {
      all = all.filter((p) => p.provider_type === params.provider_type);
    }

    return of(this.paginate(all, params?.page, params?.per_page)).pipe(delay(200));
  }

  getById(id: number): Observable<Provider> {
    const all = this.getStored();
    const provider = all.find((p) => p.id === id);
    if (!provider) {
      return throwError(() => new Error('Provider not found'));
    }
    return of(provider).pipe(delay(150));
  }

  getMyProvider(): Observable<Provider> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const all = this.getStored();
    const provider = all.find((p) => p.user_id === current.id);
    if (!provider) {
      return throwError(() => new Error('Provider profile not found'));
    }
    return of(provider).pipe(delay(150));
  }

  create(data: CreateProvider): Observable<Provider> {
    const all = this.getStored();
    const now = new Date();
    const provider: Provider = {
      id: this.nextId(all),
      ...data,
      status: 'pending',
      created_at: now,
      updated_at: now,
    };
    all.push(provider);
    this.setStored(all);
    return of(provider).pipe(delay(200));
  }

  update(id: number, data: UpdateProvider): Observable<Provider> {
    const all = this.getStored();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Provider not found'));
    }
    const updated: Provider = {
      ...all[index],
      ...data,
      updated_at: new Date(),
    };
    all[index] = updated;
    this.setStored(all);
    return of(updated).pipe(delay(200));
  }

  uploadDocuments(id: number, formData: FormData): Observable<Provider> {
    const all = this.getStored();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Provider not found'));
    }
    const newDocs: { name: string; url: string; type: string }[] = [];
    formData.forEach((value, key) => {
      if (value instanceof File) {
        newDocs.push({ name: value.name, url: `/documents/${value.name}`, type: value.type });
      }
    });
    all[index] = {
      ...all[index],
      documents: [...all[index].documents, ...newDocs],
      updated_at: new Date(),
    };
    this.setStored(all);
    return of(all[index]).pipe(delay(300));
  }

  approve(id: number): Observable<Provider> {
    return this.updateStatus(id, 'approved');
  }

  reject(id: number, reason: string): Observable<Provider> {
    const all = this.getStored();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Provider not found'));
    }
    all[index] = {
      ...all[index],
      status: 'rejected',
      rejection_reason: reason,
      updated_at: new Date(),
    };
    this.setStored(all);
    return of(all[index]).pipe(delay(200));
  }

  private updateStatus(id: number, status: ProviderStatus): Observable<Provider> {
    const all = this.getStored();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Provider not found'));
    }
    all[index] = { ...all[index], status, updated_at: new Date() };
    this.setStored(all);
    return of(all[index]).pipe(delay(200));
  }

  private getStored(): Provider[] {
    try {
      return JSON.parse(localStorage.getItem(PROVIDERS_KEY) || '[]') as Provider[];
    } catch {
      return [];
    }
  }

  private setStored(items: Provider[]): void {
    localStorage.setItem(PROVIDERS_KEY, JSON.stringify(items));
  }

  private getStoredUsers(): { id: number; full_name: string; email: string }[] {
    try {
      const raw = JSON.parse(localStorage.getItem('itinera_users') || '[]') as {
        id: number;
        full_name: string;
        email: string;
      }[];
      return raw;
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
    items: Provider[],
    page?: number,
    perPage?: number,
  ): PaginatedResponse<Provider> {
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

  private nextId(items: Provider[]): number {
    return items.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  }

  private seedIfEmpty(): void {
    if (!localStorage.getItem(PROVIDERS_KEY)) {
      this.setStored(DEFAULT_PROVIDERS);
    }
  }
}
