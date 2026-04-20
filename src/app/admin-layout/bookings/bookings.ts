import { Component } from '@angular/core';

interface BookingRow {
  id: string;
  customer: string;
  service: string;
  date: string;
  guests: number;
  amount: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  pendingActions?: boolean;
}

@Component({
  selector: 'app-bookings',
  imports: [],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings {
  readonly bookings: BookingRow[] = [
    {
      id: 'BK-1042',
      customer: 'Sarah Mitchell',
      service: 'Dar El Medina',
      date: 'Mar 15, 2025',
      guests: 2,
      amount: '$170',
      status: 'Confirmed',
    },
    {
      id: 'BK-1041',
      customer: 'James Laurent',
      service: 'Sahara Desert Trek',
      date: 'Mar 18, 2025',
      guests: 1,
      amount: '$240',
      status: 'Pending',
      pendingActions: true,
    },
    {
      id: 'BK-1040',
      customer: 'Amina Khelifi',
      service: 'Medina Walking Tour',
      date: 'Mar 12, 2025',
      guests: 4,
      amount: '$100',
      status: 'Confirmed',
    },
    {
      id: 'BK-1039',
      customer: 'Marco Rossi',
      service: 'Le Pirate',
      date: 'Mar 10, 2025',
      guests: 2,
      amount: '$70',
      status: 'Cancelled',
    },
    {
      id: 'BK-1038',
      customer: 'Leila Trabelsi',
      service: 'Riad Sidi Bou Said',
      date: 'Mar 20, 2025',
      guests: 2,
      amount: '$220',
      status: 'Confirmed',
    },
    {
      id: 'BK-1037',
      customer: 'David Chen',
      service: 'Cafe des Nattes',
      date: 'Mar 8, 2025',
      guests: 3,
      amount: '$45',
      status: 'Completed',
    },
    {
      id: 'BK-1036',
      customer: 'Nina Petrov',
      service: 'Sahara Desert Trek',
      date: 'Mar 5, 2025',
      guests: 2,
      amount: '$240',
      status: 'Completed',
    },
    {
      id: 'BK-1035',
      customer: 'Omar Belhadj',
      service: 'Dar El Medina',
      date: 'Mar 3, 2025',
      guests: 1,
      amount: '$85',
      status: 'Completed',
    },
  ];
}
