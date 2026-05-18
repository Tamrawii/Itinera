import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { UserTourist } from '../models/user-tourist.model';
import { User } from '../models/user.model';

export interface TouristPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  language: string;
  currency: string;
  timezone: string;
}

const TOURISTS_KEY = 'itinera_tourists';
const PREFERENCES_KEY = 'itinera_tourist_prefs';
const USER_KEY = 'auth_user';

const DEFAULT_PREFERENCES: TouristPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  marketingEmails: false,
  language: 'en',
  currency: 'USD',
  timezone: 'UTC',
};

const DEFAULT_TOURISTS: UserTourist[] = [
  {
    id: 201,
    first_name: 'Sophie',
    last_name: 'Marchand',
    email: 'sophie.marchand@gmail.com',
    phone: '+33 6 12 34 56 78',
    country: 'France',
    profile_picture: '/images/tourists/sophie-marchand.jpg',
    saved_offers: [1, 6, 10, 13],
  },
  {
    id: 202,
    first_name: 'James',
    last_name: 'Whitfield',
    email: 'james.whitfield@outlook.com',
    phone: '+44 7911 234567',
    country: 'United Kingdom',
    profile_picture: '/images/tourists/james-whitfield.jpg',
    saved_offers: [5, 8, 16],
  },
  {
    id: 203,
    first_name: 'Lena',
    last_name: 'Hoffmann',
    email: 'lena.hoffmann@web.de',
    phone: '+49 151 23456789',
    country: 'Germany',
    profile_picture: '/images/tourists/lena-hoffmann.jpg',
    saved_offers: [2, 6, 11, 17],
  },
  {
    id: 204,
    first_name: 'Ahmed',
    last_name: 'Al-Rashidi',
    email: 'ahmed.alrashidi@hotmail.com',
    phone: '+966 50 123 4567',
    country: 'Saudi Arabia',
    profile_picture: '/images/tourists/ahmed-alrashidi.jpg',
    saved_offers: [3, 5, 12, 15],
  },
  {
    id: 205,
    first_name: 'Giulia',
    last_name: 'Ferretti',
    email: 'giulia.ferretti@libero.it',
    phone: '+39 333 1234567',
    country: 'Italy',
    profile_picture: '/images/tourists/giulia-ferretti.jpg',
    saved_offers: [2, 9, 14, 20],
  },
  {
    id: 206,
    first_name: 'Omar',
    last_name: 'Bouaziz',
    email: 'omar.bouaziz@gmail.com',
    phone: '+216 22 345 678',
    country: 'Tunisia',
    profile_picture: '/images/tourists/omar-bouaziz.jpg',
    saved_offers: [5, 7, 8, 10, 20],
  },
  {
    id: 207,
    first_name: 'Fatima',
    last_name: 'El Idrissi',
    email: 'fatima.elidrissi@gmail.com',
    phone: '+212 6 61 23 45 67',
    country: 'Morocco',
    profile_picture: '/images/tourists/fatima-elidrissi.jpg',
    saved_offers: [3, 6, 11],
  },
  {
    id: 208,
    first_name: 'Lucas',
    last_name: 'Van den Berg',
    email: 'lucas.vandenberg@gmail.com',
    phone: '+31 6 12345678',
    country: 'Netherlands',
    profile_picture: '/images/tourists/lucas-vandenberg.jpg',
    saved_offers: [1, 5, 16, 19],
  },
  {
    id: 209,
    first_name: 'Amira',
    last_name: 'Mansouri',
    email: 'amira.mansouri@gmail.com',
    phone: '+216 55 678 901',
    country: 'Tunisia',
    profile_picture: '/images/tourists/amira-mansouri.jpg',
    saved_offers: [4, 9, 13, 14],
  },
  {
    id: 210,
    first_name: 'Carlos',
    last_name: 'Reyes',
    email: 'carlos.reyes@gmail.com',
    phone: '+34 612 345 678',
    country: 'Spain',
    profile_picture: '/images/tourists/carlos-reyes.jpg',
    saved_offers: [6, 8, 20],
  },
  {
    id: 211,
    first_name: 'Nour',
    last_name: 'Khalil',
    email: 'nour.khalil@outlook.com',
    phone: '+20 100 123 4567',
    country: 'Egypt',
    profile_picture: '/images/tourists/nour-khalil.jpg',
    saved_offers: [1, 3, 5, 12, 15],
  },
  {
    id: 212,
    first_name: 'Marie',
    last_name: 'Dupont',
    email: 'marie.dupont@orange.fr',
    phone: '+32 475 12 34 56',
    country: 'Belgium',
    profile_picture: '/images/tourists/marie-dupont.jpg',
    saved_offers: [2, 7, 10, 17],
  },
  {
    id: 213,
    first_name: 'Youssef',
    last_name: 'Benkhaled',
    email: 'youssef.benkhaled@gmail.com',
    phone: '+213 770 123 456',
    country: 'Algeria',
    profile_picture: '/images/tourists/youssef-benkhaled.jpg',
    saved_offers: [4, 6, 13, 19],
  },
  {
    id: 214,
    first_name: 'Emma',
    last_name: 'Johansson',
    email: 'emma.johansson@gmail.com',
    phone: '+46 70 123 45 67',
    country: 'Sweden',
    profile_picture: '/images/tourists/emma-johansson.jpg',
    saved_offers: [5, 9, 18, 20],
  },
  {
    id: 215,
    first_name: 'Khalid',
    last_name: 'Al-Mansoori',
    email: 'khalid.almansoori@gmail.com',
    phone: '+971 50 123 4567',
    country: 'United Arab Emirates',
    profile_picture: '/images/tourists/khalid-almansoori.jpg',
    saved_offers: [1, 3, 5, 11, 15],
  },
];

@Injectable({ providedIn: 'root' })
export class UserTouristService {
  constructor() {
    this.seedIfEmpty();
  }

  /* ---- Tourist CRUD ---- */

  getTourists(): UserTourist[] {
    return this.getStoredTourists();
  }

  getTouristById(id: number): Observable<UserTourist> {
    const tourists = this.getStoredTourists();
    const tourist = tourists.find((t) => t.id === id);

    if (!tourist) {
      return throwError(() => new Error('Tourist not found'));
    }

    return of(tourist).pipe(delay(150));
  }

  getTouristByEmail(email: string): Observable<UserTourist> {
    const tourists = this.getStoredTourists();
    const tourist = tourists.find((t) => t.email === email);

    if (!tourist) {
      return throwError(() => new Error('Tourist not found'));
    }

    return of(tourist).pipe(delay(150));
  }

  /* ---- Current user profile ---- */

  getMyTouristProfile(): Observable<UserTourist> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    return this.getTouristByEmail(current.email);
  }

    updateMyTouristProfile(data: Partial<UserTourist>): Observable<UserTourist> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const tourists = this.getStoredTourists();
    const index = tourists.findIndex((t) => t.email === current.email);

    if (index === -1) {
      this.createTouristProfile(current);
      return this.updateMyTouristProfile(data);
    }

    const updated: UserTourist = {
      ...tourists[index],
      first_name: data.first_name ?? tourists[index].first_name,
      last_name: data.last_name ?? tourists[index].last_name,
      phone: data.phone ?? tourists[index].phone,
      country: data.country ?? tourists[index].country,
      profile_picture: data.profile_picture ?? tourists[index].profile_picture,
      bio: data.bio ?? tourists[index].bio,
    };

    tourists[index] = updated;
    this.setStoredTourists(tourists);

    return of(updated).pipe(delay(200));
  }

  /* ---- Preferences ---- */

  getMyPreferences(): Observable<TouristPreferences> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const allPrefs = this.getAllPreferences();
    return of(allPrefs[current.id] ?? { ...DEFAULT_PREFERENCES }).pipe(delay(100));
  }

  updateMyPreferences(data: Partial<TouristPreferences>): Observable<TouristPreferences> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const allPrefs = this.getAllPreferences();
    const existing = allPrefs[current.id] ?? { ...DEFAULT_PREFERENCES };
    const updated: TouristPreferences = { ...existing, ...data };

    allPrefs[current.id] = updated;
    this.setAllPreferences(allPrefs);

    return of(updated).pipe(delay(150));
  }

  /* ---- Registration hook ---- */

  createTouristProfile(user: User): void {
    const tourists = this.getStoredTourists();

    if (tourists.some((t) => t.email === user.email)) {
      return;
    }

    const nameParts = user.full_name.split(' ');
    const tourist: UserTourist = {
      id: this.nextTouristId(tourists),
      first_name: nameParts[0] ?? '',
      last_name: nameParts.slice(1).join(' ') ?? '',
      email: user.email,
      phone: user.phone ?? '',
      country: '',
      profile_picture: '',
      saved_offers: [],
    };

    tourists.push(tourist);
    this.setStoredTourists(tourists);
  }

  /* ---- localStorage helpers ---- */

  private seedIfEmpty(): void {
    const existing = localStorage.getItem(TOURISTS_KEY);
    if (!existing || existing === '[]') {
      this.setStoredTourists(DEFAULT_TOURISTS);
    }
  }

  private getStoredTourists(): UserTourist[] {
    try {
      return JSON.parse(localStorage.getItem(TOURISTS_KEY) || '[]') as UserTourist[];
    } catch {
      return [];
    }
  }

  private setStoredTourists(tourists: UserTourist[]): void {
    localStorage.setItem(TOURISTS_KEY, JSON.stringify(tourists));
  }

  private getAllPreferences(): Record<number, TouristPreferences> {
    try {
      return JSON.parse(
        localStorage.getItem(PREFERENCES_KEY) || '{}',
      ) as Record<number, TouristPreferences>;
    } catch {
      return {};
    }
  }

  private setAllPreferences(prefs: Record<number, TouristPreferences>): void {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
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

  private nextTouristId(tourists: UserTourist[]): number {
    return tourists.reduce((max, t) => Math.max(max, t.id), 200) + 1;
  }
}