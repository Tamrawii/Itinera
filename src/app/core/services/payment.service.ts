import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Payment, PaymentMethod } from '../models';
import { User } from '../models';

const PAYMENTS_KEY = 'itinera_payments';
const BOOKINGS_KEY = 'itinera_bookings';
const USER_KEY = 'auth_user';

const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: 1,
    booking_id: 1,
    amount: 280,
    status: 'paid',
    payment_method: 'card',
    transaction_id: 'txn_001',
    created_at: new Date('2025-06-01'),
    updated_at: new Date('2025-06-01'),
  },
  {
    id: 2,
    booking_id: 2,
    amount: 320,
    status: 'paid',
    payment_method: 'card',
    transaction_id: 'txn_002',
    created_at: new Date('2025-06-15'),
    updated_at: new Date('2025-06-15'),
  },
  {
    id: 3,
    booking_id: 3,
    amount: 480,
    status: 'pending',
    payment_method: 'bank_transfer',
    created_at: new Date('2025-07-01'),
    updated_at: new Date('2025-07-01'),
  },
  {
    id: 4,
    booking_id: 4,
    amount: 195,
    status: 'paid',
    payment_method: 'cash',
    transaction_id: 'txn_004',
    created_at: new Date('2025-07-15'),
    updated_at: new Date('2025-09-02'),
  },
  {
    id: 5,
    booking_id: 5,
    amount: 350,
    status: 'paid',
    payment_method: 'card',
    transaction_id: 'txn_005',
    created_at: new Date('2025-08-01'),
    updated_at: new Date('2025-08-01'),
  },
  {
    id: 6,
    booking_id: 6,
    amount: 95,
    status: 'refunded',
    payment_method: 'card',
    transaction_id: 'txn_006',
    created_at: new Date('2025-09-01'),
    updated_at: new Date('2025-10-15'),
  },
  {
    id: 7,
    booking_id: 7,
    amount: 75,
    status: 'pending',
    payment_method: 'card',
    created_at: new Date('2025-10-01'),
    updated_at: new Date('2025-10-01'),
  },
];

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor() {
    this.seedIfEmpty();
  }

  getByBooking(bookingId: number): Observable<Payment> {
    const all = this.getAll();
    const payment = all.find((p) => p.booking_id === bookingId);
    if (!payment) {
      return throwError(() => new Error('Payment not found'));
    }
    return of(payment).pipe(delay(150));
  }

  initiate(bookingId: number, method: PaymentMethod): Observable<Payment> {
    const all = this.getAll();
    if (all.some((p) => p.booking_id === bookingId && p.status !== 'failed')) {
      return throwError(() => new Error('Payment already exists for this booking'));
    }

    const bookings = this.getBookings();
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return throwError(() => new Error('Booking not found'));
    }

    const now = new Date();
    const payment: Payment = {
      id: this.nextId(all),
      booking_id: bookingId,
      amount: booking.total_price,
      status: 'pending',
      payment_method: method,
      created_at: now,
      updated_at: now,
    };

    all.push(payment);
    this.setAll(all);

    return of(payment).pipe(delay(200));
  }

  getMyPayments(): Observable<Payment[]> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const bookings = this.getBookings();
    const myBookingIds = bookings.filter((b) => b.tourist_id === current.id).map((b) => b.id);

    const all = this.getAll();
    const myPayments = all.filter((p) => myBookingIds.includes(p.booking_id));

    return of(myPayments).pipe(delay(150));
  }

  confirm(paymentId: number): Observable<Payment> {
    const all = this.getAll();
    const index = all.findIndex((p) => p.id === paymentId);
    if (index === -1) {
      return throwError(() => new Error('Payment not found'));
    }
    const txnId =
      'pi_' +
      Array.from(crypto.getRandomValues(new Uint8Array(12)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    all[index] = {
      ...all[index],
      status: 'paid',
      transaction_id: txnId,
      updated_at: new Date(),
    };
    this.setAll(all);
    return of(all[index]).pipe(delay(1500)); // 1.5s to simulate Stripe processing
  }

  private getAll(): Payment[] {
    try {
      return JSON.parse(localStorage.getItem(PAYMENTS_KEY) || '[]') as Payment[];
    } catch {
      return [];
    }
  }

  private setAll(items: Payment[]): void {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(items));
  }

  private getBookings(): { id: number; tourist_id: number; total_price: number }[] {
    try {
      return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]') as {
        id: number;
        tourist_id: number;
        total_price: number;
      }[];
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

  private nextId(items: Payment[]): number {
    return items.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  }

  private seedIfEmpty(): void {
    if (!localStorage.getItem(PAYMENTS_KEY)) {
      this.setAll(DEFAULT_PAYMENTS);
    }
  }
}
