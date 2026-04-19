import { Component } from '@angular/core';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { Comment1Outlined, CheckSolid, XmarkSolid } from '@lineiconshq/free-icons';

type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

interface BookingItem {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  serviceName: string;
  schedule: string;
  guests: string;
  note?: string;
  amount: number;
  status: BookingStatus;
}

@Component({
  selector: 'app-bookings',
  imports: [LineiconsComponent],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings {
  totalBookings = 6;
  awaitingResponse = 2;
  totalEarnings = 700;

  bookings: BookingItem[] = [
    {
      bookingId: 'BK-2050',
      guestName: 'Sarah Mitchell',
      guestEmail: 'sarah.mitchell@example.com',
      serviceName: 'Coastal Sunset Tour',
      schedule: 'Mar 18, 2025 · 4:00 PM',
      guests: '2 guests',
      note: '"First time visiting"',
      amount: 90,
      status: 'Pending',
    },
    {
      bookingId: 'BK-2049',
      guestName: 'James Laurent',
      guestEmail: 'james.laurent@example.com',
      serviceName: 'Beach Villa Hammamet',
      schedule: 'Mar 20–22 · Check-in 2PM',
      guests: '3 guests',
      amount: 190,
      status: 'Confirmed',
    },
    {
      bookingId: 'BK-2048',
      guestName: 'Amina Khelifi',
      guestEmail: 'amina.khelifi@example.com',
      serviceName: 'Medina Food Walk',
      schedule: 'Mar 15, 2025 · 10:00 AM',
      guests: '4 guests',
      note: '"Vegetarian group"',
      amount: 120,
      status: 'Completed',
    },
    {
      bookingId: 'BK-2047',
      guestName: 'Marco Rossi',
      guestEmail: 'marco.rossi@example.com',
      serviceName: 'Traditional Cooking Class',
      schedule: 'Mar 14, 2025 · 11:00 AM',
      guests: '2 guests',
      amount: 110,
      status: 'Completed',
    },
    {
      bookingId: 'BK-2046',
      guestName: 'Nina Petrov',
      guestEmail: 'nina.petrov@example.com',
      serviceName: 'Coastal Sunset Tour',
      schedule: 'Mar 12, 2025 · 2:00 PM',
      guests: '1 guest',
      amount: 45,
      status: 'Cancelled',
    },
  ];
  comment10Outlined = Comment1Outlined;
  checkSolid = CheckSolid;
  xmarkSolid = XmarkSolid;
}
