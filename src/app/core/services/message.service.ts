import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Message, User } from '../models';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly table = 'messages';

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
  ) {}

  /**
   * Retrieves all conversations for the current user.
   * Returns messages grouped by conversation partner.
   */
  getConversations(): Observable<{ user: User; last_message: Message; unread_count: number }[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    // For simplicity, return empty array - implement with RPC or complex query later
    return from(Promise.resolve({ data: [], error: null })).pipe(
      map(() => []),
      catchError(this.handleError),
    );
  }

  /**
   * Retrieves all messages in the conversation with a specific user.
   */
  getMessages(userId: number): Observable<Message[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }
    return from(
      this.supabaseService.client
        .from(this.table)
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUser.id})`),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data as Message[]) || [];
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Sends a message to a receiver, optionally linked to a booking.
   */
  send(receiverId: number, content: string, bookingId?: number): Observable<Message> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    const messageData: any = {
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      read: false,
    };
    if (bookingId !== undefined) {
      messageData.booking_id = bookingId;
    }
    return from(
      this.supabaseService.client.from(this.table).insert(messageData).select().single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Failed to send message');
        return data as Message;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Marks all messages from a specific user as read.
   */
  markAsRead(userId: number): Observable<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    return from(
      this.supabaseService.client
        .from(this.table)
        .update({ read: true } as any)
        .eq('receiver_id', user.id)
        .eq('sender_id', userId)
        .eq('read', false),
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Retrieves the total count of unread messages for the current user.
   */
  getUnreadCount(): Observable<number> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Not authenticated'));
    }
    return from(
      this.supabaseService.client
        .from(this.table)
        .select('*', { count: 'exact' })
        .eq('receiver_id', user.id)
        .eq('read', false),
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.count || 0;
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: any): Observable<never> {
    const message = error?.message || error?.error?.message || 'Message error';
    return throwError(() => new Error(message));
  }
}
