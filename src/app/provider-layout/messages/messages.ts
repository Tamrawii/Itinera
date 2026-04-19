import { Component } from '@angular/core';

interface ConversationItem {
  initials: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
  online?: boolean;
  active?: boolean;
}

interface ChatMessage {
  text: string;
  time: string;
  outgoing: boolean;
}

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {
  conversations: ConversationItem[] = [
    {
      initials: 'SM',
      name: 'Sarah Mitchell',
      preview: 'Amazing! One last thing — do y...',
      time: '10m ago',
      unread: 1,
      online: true,
      active: true,
    },
    {
      initials: 'JL',
      name: 'James Laurent',
      preview: 'Can we start at 4 PM instead?',
      time: '1h ago',
      unread: 1,
    },
    {
      initials: 'AK',
      name: 'Amina Khelifi',
      preview: 'Thank you so much! See you then.',
      time: '3h ago',
      unread: 0,
      online: true,
    },
    {
      initials: 'MR',
      name: 'Marco Rossi',
      preview: 'Is the cooking class suitable for kids?',
      time: 'Yesterday',
      unread: 0,
    },
    {
      initials: 'NP',
      name: 'Nina Petrov',
      preview: 'Can we book a private sunset tour?',
      time: '2d ago',
      unread: 0,
    },
  ];

  activeGuest = {
    initials: 'SM',
    name: 'Sarah Mitchell',
    role: 'Guest',
  };

  messages: ChatMessage[] = [
    {
      text: "Hello! Thank you for your booking at Dar El Medina. We're looking forward to welcoming you.",
      time: '10:00 AM',
      outgoing: true,
    },
    {
      text: "Hi! I'm very excited. Is it possible to have an early check-in around 11 AM?",
      time: '10:05 AM',
      outgoing: false,
    },
    {
      text: 'Of course! We can arrange that for you. The room will be ready by 11 AM.',
      time: '10:08 AM',
      outgoing: true,
    },
    {
      text: "That's perfect, thank you! Also, is the rooftop terrace available for breakfast?",
      time: '10:12 AM',
      outgoing: false,
    },
    {
      text: "Yes! Breakfast is served on the rooftop terrace from 7:30 to 10:30 AM. You'll have a beautiful view of the Medina.",
      time: '10:15 AM',
      outgoing: true,
    },
    {
      text: 'Amazing! One last thing — do you offer airport transfers?',
      time: '10:20 AM',
      outgoing: false,
    },
  ];
}
