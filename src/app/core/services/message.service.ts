import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Message, User } from '../models';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly baseUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all conversations for the current user, each with the
   * last message and unread count.
   */
  getConversations(): Observable<{ user: User; last_message: Message; unread_count: number }[]> {
    return this.http
      .get<{ user: User; last_message: Message; unread_count: number }[]>(
        `${this.baseUrl}/conversations`,
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all messages in the conversation with a specific user.
   */
  getMessages(userId: number): Observable<Message[]> {
    return this.http
      .get<Message[]>(`${this.baseUrl}/${userId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Sends a message to a receiver, optionally linked to a booking.
   */
  send(receiverId: number, content: string, bookingId?: number): Observable<Message> {
    const payload: { receiver_id: number; content: string; booking_id?: number } = {
      receiver_id: receiverId,
      content,
    };
    if (bookingId !== undefined) payload.booking_id = bookingId;
    return this.http.post<Message>(this.baseUrl, payload).pipe(catchError(this.handleError));
  }

  /**
   * Marks all messages from a specific user as read.
   */
  markAsRead(userId: number): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/${userId}/read`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves the total count of unread messages for the current user.
   */
  getUnreadCount(): Observable<number> {
    return this.http
      .get<number>(`${this.baseUrl}/unread-count`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
