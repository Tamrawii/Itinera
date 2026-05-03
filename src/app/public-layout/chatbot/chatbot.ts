// import { Component } from '@angular/core';
// import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
// import { TelegramOutlined } from '@lineiconshq/free-icons';
// import { Message } from './message/message';

// @Component({
//   selector: 'app-chatbot',
//   imports: [LineiconsComponent, Message],
//   templateUrl: './chatbot.html',
//   styleUrl: './chatbot.css',
// })
// export class Chatbot {
//   sendIcon = TelegramOutlined;
// }

import {
  Component,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  // Inject the service
  protected readonly gemini = inject(GeminiService);

  // Local UI state
  protected userInput = signal<string>('');
  protected shouldScrollToBottom = false;

  // Suggestion chips for first interaction
  protected readonly suggestions = [
    '🏛️ 3-day cultural tour for history lovers',
    '🍽️ Food & culinary experiences for a weekend',
    '🌊 Beach & outdoor adventures for a week',
    '🛍️ Shopping & city exploration for families',
  ];

  ngOnInit(): void {
    // Add welcome message on load
    this.gemini.messages.update((msgs) => [
      {
        id: 'welcome',
        role: 'model',
        content: `👋 Welcome! I'm your personal travel planner. Tell me about your interests, how many days you have, and what kind of experience you're looking for — and I'll build you a custom itinerary!`,
        timestamp: new Date(),
      },
      ...msgs,
    ]);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  protected async handleSend(): Promise<void> {
    const text = this.userInput().trim();
    if (!text || this.gemini.isLoading()) return;

    this.userInput.set('');
    this.shouldScrollToBottom = true;

    await this.gemini.sendMessage(text);

    this.shouldScrollToBottom = true;
    this.messageInput?.nativeElement?.focus();
  }

  protected async handleSuggestion(suggestion: string): Promise<void> {
    // Strip the emoji prefix for cleaner API input
    const cleanText = suggestion.replace(/^[\u{1F000}-\u{1FFFF}][\s]*/u, '');
    await this.gemini.sendMessage(cleanText);
    this.shouldScrollToBottom = true;
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSend();
    }
    // Shift+Enter → new line (browser default, no override needed)
  }

  protected resetChat(): void {
    this.gemini.resetConversation();
    this.ngOnInit(); // Re-add welcome message
  }

  protected hasSuggestions(): boolean {
    return this.gemini.messages().length <= 1; // Only show before first real exchange
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }

  // Utility for template: track messages by ID for efficient rendering
  protected trackById(_: number, msg: { id: string }): string {
    return msg.id;
  }

  protected formatMessage(content: string): string {
    if (!content) return '';
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
}
