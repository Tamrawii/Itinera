export type MessageRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  error?: boolean;
}

export interface GeminiHistoryEntry {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}
