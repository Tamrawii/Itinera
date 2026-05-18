import { Component, OnInit, signal, computed, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from '../../core/services/message.service';
import { Message, User } from '../../core/models';

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

@Component({
  selector: 'app-tourist-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class TouristMessages implements OnInit, AfterViewChecked {
  @ViewChild('chatBody') chatBody!: ElementRef<HTMLDivElement>;

  conversations = signal<Conversation[]>([]);
  activeConversation = signal<Conversation | null>(null);
  messages = signal<Message[]>([]);
  loading = signal(true);
  loadingMessages = signal(false);
  searchQuery = signal('');
  newMessage = signal('');

  private shouldScroll = false;
  private currentUserId = 0;

  readonly filteredConversations = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.conversations();
    return this.conversations().filter(
      (c) =>
        c.user.full_name.toLowerCase().includes(q) ||
        c.lastMessage.content.toLowerCase().includes(q),
    );
  });

  readonly totalUnread = computed(() =>
    this.conversations().reduce((sum, c) => sum + c.unreadCount, 0),
  );

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.currentUserId = this.getCurrentUserId();
    this.loadConversations();
  }

  private getCurrentUserId(): number {
    try {
      const raw = localStorage.getItem('auth_user');
      if (!raw) return 0;
      const user = JSON.parse(raw);
      return user.id ?? 0;
    } catch {
      return 0;
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  loadConversations(): void {
    this.messageService.getConversations().subscribe({
      next: (data) => {
        const convos = data.map((item) => ({
          user: item.user,
          lastMessage: item.last_message,
          unreadCount: item.unread_count,
        }));
        this.conversations.set(convos);
        this.loading.set(false);
        if (convos.length > 0 && !this.activeConversation()) {
          this.selectConversation(convos[0]);
        }
      },
      error: () => {
        this.conversations.set(this.getDemoConversations());
        this.loading.set(false);
        const convos = this.conversations();
        if (convos.length > 0) {
          this.selectConversation(convos[0]);
        }
      },
    });
  }

  selectConversation(conversation: Conversation): void {
    this.activeConversation.set(conversation);
    this.loadingMessages.set(true);

    this.messageService.getMessages(conversation.user.id).subscribe({
      next: (msgs) => {
        this.messages.set(msgs);
        this.loadingMessages.set(false);
        this.shouldScroll = true;
        this.markAsRead(conversation);
      },
      error: () => {
        this.messages.set(this.getDemoMessages(conversation.user.id));
        this.loadingMessages.set(false);
        this.shouldScroll = true;
        this.markAsRead(conversation);
      },
    });
  }

  sendMessage(): void {
    const content = this.newMessage().trim();
    const active = this.activeConversation();
    if (!content || !active) return;

    this.messageService.send(active.user.id, content).subscribe({
      next: (msg) => {
        this.messages.update((prev) => [...prev, msg]);
        this.updateConversationPreview(active.user.id, msg);
        this.newMessage.set('');
        this.shouldScroll = true;
      },
      error: () => {
        // Optimistic local-only message for demo
        const localMsg: Message = {
          id: Date.now(),
          sender_id: this.currentUserId,
          receiver_id: active.user.id,
          content,
          is_read: false,
          created_at: new Date(),
        };
        this.messages.update((prev) => [...prev, localMsg]);
        this.updateConversationPreview(active.user.id, localMsg);
        this.newMessage.set('');
        this.shouldScroll = true;
      },
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  isOutgoing(message: Message): boolean {
    return message.sender_id === this.currentUserId;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  private markAsRead(conversation: Conversation): void {
    if (conversation.unreadCount > 0) {
      this.messageService.markAsRead(conversation.user.id).subscribe({
        next: () => {
          this.conversations.update((convos) =>
            convos.map((c) =>
              c.user.id === conversation.user.id ? { ...c, unreadCount: 0 } : c,
            ),
          );
        },
        error: () => {
          // Still update locally for demo
          this.conversations.update((convos) =>
            convos.map((c) =>
              c.user.id === conversation.user.id ? { ...c, unreadCount: 0 } : c,
            ),
          );
        },
      });
    }
  }

  private updateConversationPreview(userId: number, msg: Message): void {
    this.conversations.update((convos) =>
      convos.map((c) =>
        c.user.id === userId ? { ...c, lastMessage: msg } : c,
      ),
    );
  }

  private scrollToBottom(): void {
    if (this.chatBody) {
      const el = this.chatBody.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  private getDemoConversations(): Conversation[] {
    return [
      {
        user: { id: 101, email: 'sahara.tours@example.com', full_name: 'Sahara Tours', role: 'provider', created_at: new Date(), updated_at: new Date() },
        lastMessage: { id: 1, sender_id: 101, receiver_id: 0, content: 'Your desert safari is confirmed for March 18th! We\'ll pick you up at 8 AM.', is_read: false, created_at: new Date(Date.now() - 600000) },
        unreadCount: 2,
      },
      {
        user: { id: 102, email: 'medina.hotels@example.com', full_name: 'Medina Hotels', role: 'provider', created_at: new Date(), updated_at: new Date() },
        lastMessage: { id: 2, sender_id: 0, receiver_id: 102, content: 'Can I get an early check-in at 11 AM?', is_read: true, created_at: new Date(Date.now() - 3600000) },
        unreadCount: 0,
      },
      {
        user: { id: 103, email: 'culinary.tn@example.com', full_name: 'Culinary Tunisia', role: 'provider', created_at: new Date(), updated_at: new Date() },
        lastMessage: { id: 3, sender_id: 103, receiver_id: 0, content: 'Thank you for attending! We hope you enjoyed the class.', is_read: false, created_at: new Date(Date.now() - 86400000) },
        unreadCount: 1,
      },
      {
        user: { id: 104, email: 'riad.sbb@example.com', full_name: 'Riad Sidi Bou Said', role: 'provider', created_at: new Date(), updated_at: new Date() },
        lastMessage: { id: 4, sender_id: 0, receiver_id: 104, content: 'Do you have availability for March 25-27?', is_read: true, created_at: new Date(Date.now() - 172800000) },
        unreadCount: 0,
      },
      {
        user: { id: 105, email: 'coastal.tours@example.com', full_name: 'Coastal Sunset Tours', role: 'provider', created_at: new Date(), updated_at: new Date() },
        lastMessage: { id: 5, sender_id: 105, receiver_id: 0, content: 'The tour departs from the marina at 4 PM sharp.', is_read: true, created_at: new Date(Date.now() - 432000000) },
        unreadCount: 0,
      },
    ];
  }

  private getDemoMessages(userId: number): Message[] {
    const demoMap: Record<number, Message[]> = {
      101: [
        { id: 10, sender_id: 0, receiver_id: 101, content: 'Hi! I just booked the Desert Safari Adventure. Could you share more details about what to bring?', is_read: true, created_at: new Date('2025-03-16T09:00:00') },
        { id: 11, sender_id: 101, receiver_id: 0, content: 'Welcome! Great choice. Please bring sunscreen, a hat, comfortable shoes, and a light jacket for the evening. We provide water and snacks.', is_read: true, created_at: new Date('2025-03-16T09:15:00') },
        { id: 12, sender_id: 0, receiver_id: 101, content: 'Perfect, thanks! Is there a pick-up service from my hotel?', is_read: true, created_at: new Date('2025-03-16T09:20:00') },
        { id: 13, sender_id: 101, receiver_id: 0, content: 'Yes! We offer hotel pick-up. Just share your hotel name and room number, and we\'ll be there at 8 AM.', is_read: true, created_at: new Date('2025-03-16T09:25:00') },
        { id: 14, sender_id: 0, receiver_id: 101, content: 'I\'m staying at Dar El Medina, room 204.', is_read: true, created_at: new Date('2025-03-16T09:30:00') },
        { id: 15, sender_id: 101, receiver_id: 0, content: 'Your desert safari is confirmed for March 18th! We\'ll pick you up at 8 AM.', is_read: false, created_at: new Date(Date.now() - 600000) },
      ],
      102: [
        { id: 20, sender_id: 0, receiver_id: 102, content: 'Hello, I have a reservation starting March 20. Is early check-in possible?', is_read: true, created_at: new Date('2025-03-17T14:00:00') },
        { id: 21, sender_id: 102, receiver_id: 0, content: 'Hello! Yes, we can arrange early check-in for you. What time works best?', is_read: true, created_at: new Date('2025-03-17T14:10:00') },
        { id: 22, sender_id: 0, receiver_id: 102, content: 'Can I get an early check-in at 11 AM?', is_read: true, created_at: new Date(Date.now() - 3600000) },
      ],
      103: [
        { id: 30, sender_id: 103, receiver_id: 0, content: 'Hi there! Your cooking class is tomorrow at 10 AM. Are you ready?', is_read: true, created_at: new Date('2025-03-14T18:00:00') },
        { id: 31, sender_id: 0, receiver_id: 103, content: 'Absolutely! Can\'t wait. Should I bring anything?', is_read: true, created_at: new Date('2025-03-14T18:05:00') },
        { id: 32, sender_id: 103, receiver_id: 0, content: 'Just yourself and an appetite! We provide all ingredients and aprons.', is_read: true, created_at: new Date('2025-03-14T18:10:00') },
        { id: 33, sender_id: 103, receiver_id: 0, content: 'Thank you for attending! We hope you enjoyed the class.', is_read: false, created_at: new Date(Date.now() - 86400000) },
      ],
      104: [
        { id: 40, sender_id: 0, receiver_id: 104, content: 'Hi, I saw your listing for Riad Sidi Bou Said. It looks amazing!', is_read: true, created_at: new Date('2025-03-15T10:00:00') },
        { id: 41, sender_id: 104, receiver_id: 0, content: 'Thank you! It\'s a beautiful property. Would you like to book a stay?', is_read: true, created_at: new Date('2025-03-15T10:15:00') },
        { id: 42, sender_id: 0, receiver_id: 104, content: 'Do you have availability for March 25-27?', is_read: true, created_at: new Date(Date.now() - 172800000) },
      ],
      105: [
        { id: 50, sender_id: 0, receiver_id: 105, content: 'Hi! I booked the Coastal Sunset Tour. What\'s the meeting point?', is_read: true, created_at: new Date('2025-03-10T12:00:00') },
        { id: 51, sender_id: 105, receiver_id: 0, content: 'The tour departs from the marina at 4 PM sharp.', is_read: true, created_at: new Date(Date.now() - 432000000) },
      ],
    };
    return demoMap[userId] || [];
  }
}
