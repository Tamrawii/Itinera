export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  booking_id?: number;
  content: string;
  is_read: boolean;
  created_at: Date;
}

export interface CreateMessage {
  sender_id: number;
  receiver_id: number;
  booking_id?: number;
  content: string;
}

export type UpdateMessage = Partial<Pick<Message, 'content' | 'is_read'>>;
