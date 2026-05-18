import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { GeminiService } from './gemini.service';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  constructor(private geminiService: GeminiService) {}

  sendMessage(
    message: string,
    history: { role: string; content: string }[],
  ): Observable<{ reply: string }> {
    this.geminiService.loadHistory(
      history.map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
    );

    this.geminiService.sendMessage(message);

    return of({ reply: 'Message sent. Check the chat for the response.' }).pipe(delay(100));
  }
}
