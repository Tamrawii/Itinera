import { Component } from '@angular/core';

interface AdminServiceRow {
  name: string;
  category: string;
  location: string;
  rating: string;
  price: string;
  bookings: number;
  status: 'Active' | 'Draft';
}

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  readonly services: AdminServiceRow[] = [
    {
      name: 'Dar El Medina',
      category: 'Hotel',
      location: 'Tunis Medina',
      rating: '4.8',
      price: '$85',
      bookings: 42,
      status: 'Active',
    },
    {
      name: 'Le Pirate',
      category: 'Restaurant',
      location: 'Sidi Bou Said',
      rating: '4.6',
      price: '$35',
      bookings: 28,
      status: 'Active',
    },
    {
      name: 'Sahara Desert Trek',
      category: 'Tour',
      location: 'Douz, Tozeur',
      rating: '4.9',
      price: '$120',
      bookings: 89,
      status: 'Active',
    },
    {
      name: 'Medina Walking Tour',
      category: 'Activity',
      location: 'Tunis',
      rating: '4.7',
      price: '$25',
      bookings: 63,
      status: 'Active',
    },
    {
      name: 'Riad Sidi Bou Said',
      category: 'Hotel',
      location: 'Sidi Bou Said',
      rating: '4.5',
      price: '$110',
      bookings: 0,
      status: 'Draft',
    },
    {
      name: 'Cafe des Nattes',
      category: 'Restaurant',
      location: 'Sidi Bou Said',
      rating: '4.3',
      price: '$15',
      bookings: 15,
      status: 'Active',
    },
  ];
}
