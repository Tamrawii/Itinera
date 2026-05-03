import { Injectable, signal, computed } from '@angular/core';
import {
  GoogleGenerativeAI,
  ChatSession,
  GenerativeModel,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { environment } from '../../environments/environment';
import { TOURIST_SYSTEM_PROMPT } from '../config/system-prompt.config';
import { ChatMessage, GeminiHistoryEntry } from '../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private chatSession: ChatSession | null = null;

  readonly messages = signal<ChatMessage[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly isStreaming = computed(() => this.messages().some((m) => m.isStreaming));

  constructor() {
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);

    this.model = this.genAI.getGenerativeModel({
      model: environment.geminiModel,

      // ── System Instruction ───────────────────────────────────────────────
      // This injects prompt into every conversation
      systemInstruction: {
        role: 'system',
        parts: [{ text: TOURIST_SYSTEM_PROMPT }],
      },

      // ── Safety Settings ──────────────────────────────────────────────────
      // Tourist content is safe — keep defaults but be explicit
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],

      // ── Generation Config ─────────────────────────────────────────────────
      generationConfig: {
        temperature: 0.7, // Balanced creativity vs. consistency
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048, // Enough for a full itinerary
      },
    });

    this.initChatSession();
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Send a user message and stream the model's response.
   * Uses streaming for a better UX (response appears word-by-word).
   */
  async sendMessage(userText: string): Promise<void> {
    if (!userText.trim() || this.isLoading()) return;

    this.error.set(null);
    this.isLoading.set(true);

    // Add user message immediately for instant feedback
    const userMessage = this.createMessage('user', userText);
    this.messages.update((msgs) => [...msgs, userMessage]);

    // Placeholder for the streaming bot response
    const botMessageId = this.generateId();
    const botPlaceholder = this.createMessage('model', '', botMessageId, true);
    this.messages.update((msgs) => [...msgs, botPlaceholder]);

    try {
      const result = await this.chatSession!.sendMessageStream(userText);

      let fullResponse = '';

      // Stream chunks as they arrive
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;

        // Update the streaming message in place
        this.messages.update((msgs) =>
          msgs.map((m) =>
            m.id === botMessageId ? { ...m, content: fullResponse, isStreaming: true } : m,
          ),
        );
      }

      // Mark streaming as complete
      this.messages.update((msgs) =>
        msgs.map((m) =>
          m.id === botMessageId ? { ...m, content: fullResponse, isStreaming: false } : m,
        ),
      );
    } catch (err) {
      const errorMessage = this.parseError(err);
      this.error.set(errorMessage);

      // Replace placeholder with error state
      this.messages.update((msgs) =>
        msgs.map((m) =>
          m.id === botMessageId
            ? {
                ...m,
                content: '⚠️ Something went wrong. Please try again.',
                isStreaming: false,
                error: true,
              }
            : m,
        ),
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Reset the conversation — clears messages and starts a fresh chat session.
   */
  resetConversation(): void {
    this.messages.set([]);
    this.error.set(null);
    this.isLoading.set(false);
    this.initChatSession();
  }

  /**
   * Rebuild the chat session with existing history (for conversation restore).
   */
  loadHistory(history: GeminiHistoryEntry[]): void {
    this.chatSession = this.model.startChat({ history });
  }

  // ── Private Helpers ────────────────────────────────────────────────────────

  private initChatSession(history: GeminiHistoryEntry[] = []): void {
    this.chatSession = this.model.startChat({
      history,
      // The system instruction is already on the model — no need to repeat it here
    });
  }

  private createMessage(
    role: 'user' | 'model',
    content: string,
    id?: string,
    isStreaming = false,
  ): ChatMessage {
    return {
      id: id ?? this.generateId(),
      role,
      content,
      timestamp: new Date(),
      isStreaming,
    };
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  private parseError(err: unknown): string {
    if (err instanceof Error) {
      // Gemini-specific error codes
      if (err.message.includes('429')) {
        return 'Rate limit reached. Please wait a moment before sending another message.';
      }
      if (err.message.includes('403')) {
        return 'API key invalid or quota exceeded. Please check your configuration.';
      }
      if (err.message.includes('SAFETY')) {
        return 'The response was blocked by safety filters. Please rephrase your request.';
      }
      return err.message;
    }
    return 'An unexpected error occurred.';
  }
}
