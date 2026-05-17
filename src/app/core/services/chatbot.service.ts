import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly baseUrl = `${environment.apiUrl}/chatbot`;

  constructor(private http: HttpClient) {}

  /**
   * Sends a user message along with conversation history to the backend,
   * which forwards the request to Gemini and returns the AI reply.
   */
  sendMessage(
    message: string,
    history: { role: string; content: string }[],
  ): Observable<{ reply: string }> {
    return this.http
      .post<{ reply: string }>(this.baseUrl, { message, history })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}
