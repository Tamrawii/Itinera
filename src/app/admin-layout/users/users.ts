import { Component } from '@angular/core';

interface UserRow {
  initials: string;
  name: string;
  email: string;
  role: 'User' | 'Provider' | 'Admin';
  joined: string;
  bookings: number;
  status: 'Active' | 'Suspended';
}

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  readonly users: UserRow[] = [
    {
      initials: 'SM',
      name: 'Sarah Mitchell',
      email: 'sarah@example.com',
      role: 'User',
      joined: 'Jan 15, 2025',
      bookings: 3,
      status: 'Active',
    },
    {
      initials: 'JL',
      name: 'James Laurent',
      email: 'james@example.com',
      role: 'User',
      joined: 'Feb 2, 2025',
      bookings: 1,
      status: 'Active',
    },
    {
      initials: 'AK',
      name: 'Amina Khelifi',
      email: 'amina@example.com',
      role: 'Provider',
      joined: 'Dec 10, 2024',
      bookings: 0,
      status: 'Active',
    },
    {
      initials: 'MR',
      name: 'Marco Rossi',
      email: 'marco@example.com',
      role: 'User',
      joined: 'Mar 1, 2025',
      bookings: 2,
      status: 'Suspended',
    },
    {
      initials: 'LT',
      name: 'Leila Trabelsi',
      email: 'leila@example.com',
      role: 'Admin',
      joined: 'Nov 5, 2024',
      bookings: 5,
      status: 'Active',
    },
    {
      initials: 'DC',
      name: 'David Chen',
      email: 'david@example.com',
      role: 'User',
      joined: 'Jan 28, 2025',
      bookings: 0,
      status: 'Active',
    },
  ];
}
