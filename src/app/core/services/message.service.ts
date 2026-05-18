import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Message, User } from '../models';

const MESSAGES_KEY = 'itinera_messages';
const USER_KEY = 'auth_user';

const DEFAULT_MESSAGES: Message[] = [
  { id: 1, sender_id: 201, receiver_id: 101, booking_id: 1, content: 'Hello, I have a question about the desert lodge. Is breakfast included?', is_read: true, created_at: new Date('2025-06-10') },
  { id: 2, sender_id: 101, receiver_id: 201, booking_id: 1, content: 'Yes, a traditional Tunisian breakfast is included with every stay!', is_read: true, created_at: new Date('2025-06-10') },
  { id: 3, sender_id: 201, receiver_id: 101, booking_id: 1, content: 'Perfect, thank you! Also, do you offer airport pickup?', is_read: false, created_at: new Date('2025-06-11') },
  { id: 4, sender_id: 202, receiver_id: 102, booking_id: 2, content: 'Bonjour! Is the rooftop restaurant open to non-guests?', is_read: true, created_at: new Date('2025-06-15') },
  { id: 5, sender_id: 102, receiver_id: 202, booking_id: 2, content: 'Bonjour! Yes, our rooftop is open to everyone. Reservations recommended for sunset.', is_read: false, created_at: new Date('2025-06-15') },
  { id: 6, sender_id: 203, receiver_id: 103, booking_id: 3, content: 'Can you accommodate a late check-in? Our flight arrives at 11 PM.', is_read: true, created_at: new Date('2025-07-01') },
  { id: 7, sender_id: 103, receiver_id: 203, booking_id: 3, content: 'Of course! We have 24-hour reception. Just let us know your flight number.', is_read: true, created_at: new Date('2025-07-01') },
  { id: 8, sender_id: 204, receiver_id: 104, booking_id: 4, content: 'Are there vegetarian options at the restaurant?', is_read: false, created_at: new Date('2025-07-20') },
];

@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor() {
    this.seedIfEmpty();
  }

  getConversations(): Observable<{ user: User; last_message: Message; unread_count: number }[]> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const all = this.getAll();
    const myMessages = all.filter(
      (m) => m.sender_id === current.id || m.receiver_id === current.id,
    );

    const partnerIds = new Set<number>();
    myMessages.forEach((m) => {
      const partnerId = m.sender_id === current.id ? m.receiver_id : m.sender_id;
      partnerIds.add(partnerId);
    });

    const conversations = Array.from(partnerIds).map((partnerId) => {
      const convMessages = myMessages
        .filter((m) => m.sender_id === partnerId || m.receiver_id === partnerId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const lastMessage = convMessages[0];
      const unreadCount = convMessages.filter(
        (m) => m.receiver_id === current.id && !m.is_read,
      ).length;

      const partnerUser: User = {
        id: partnerId,
        email: `user${partnerId}@itinera.tn`,
        full_name: `User ${partnerId}`,
        role: partnerId >= 200 ? 'tourist' : 'provider',
        created_at: new Date(),
        updated_at: new Date(),
      };

      return { user: partnerUser, last_message: lastMessage, unread_count: unreadCount };
    });

    conversations.sort(
      (a, b) =>
        new Date(b.last_message.created_at).getTime() -
        new Date(a.last_message.created_at).getTime(),
    );

    return of(conversations).pipe(delay(150));
  }

  getMessages(userId: number): Observable<Message[]> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const all = this.getAll();
    const messages = all
      .filter(
        (m) =>
          (m.sender_id === current.id && m.receiver_id === userId) ||
          (m.sender_id === userId && m.receiver_id === current.id),
      )
      .sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

    return of(messages).pipe(delay(150));
  }

  send(receiverId: number, content: string, bookingId?: number): Observable<Message> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const all = this.getAll();
    const message: Message = {
      id: this.nextId(all),
      sender_id: current.id,
      receiver_id: receiverId,
      booking_id: bookingId,
      content,
      is_read: false,
      created_at: new Date(),
    };

    all.push(message);
    this.setAll(all);

    return of(message).pipe(delay(200));
  }

  markAsRead(userId: number): Observable<void> {
    const current = this.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('No authenticated user'));
    }

    const all = this.getAll();
    let changed = false;
    all.forEach((m) => {
      if (m.sender_id === userId && m.receiver_id === current.id && !m.is_read) {
        m.is_read = true;
        changed = true;
      }
    });

    if (changed) {
      this.setAll(all);
    }

    return of(undefined).pipe(delay(100));
  }

  getUnreadCount(): Observable<number> {
    const current = this.getCurrentUser();
    if (!current) {
      return of(0).pipe(delay(100));
    }

    const all = this.getAll();
    const count = all.filter((m) => m.receiver_id === current.id && !m.is_read).length;

    return of(count).pipe(delay(100));
  }

  private getAll(): Message[] {
    try {
      return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]') as Message[];
    } catch {
      return [];
    }
  }

  private setAll(items: Message[]): void {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(items));
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

  private nextId(items: Message[]): number {
    return items.reduce((max, m) => Math.max(max, m.id), 0) + 1;
  }

  private seedIfEmpty(): void {
    if (!localStorage.getItem(MESSAGES_KEY)) {
      this.setAll(DEFAULT_MESSAGES);
    }
  }
}
