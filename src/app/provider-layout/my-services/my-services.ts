import { Component } from '@angular/core';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { StarFatSolid } from '@lineiconshq/free-icons';

interface ProviderService {
  title: string;
  category: 'Tour' | 'Activity' | 'Hotel';
  location: string;
  image: string;
  imageAlt: string;
  price: number;
  rating?: number;
  ratingCount?: number;
  bookings: number;
  status: 'Active' | 'Draft';
}

@Component({
  selector: 'app-my-services',
  imports: [LineiconsComponent],
  templateUrl: './my-services.html',
  styleUrl: './my-services.css',
})
export class MyServices {
  services: ProviderService[] = [
    {
      title: 'Coastal Sunset Tour',
      category: 'Tour',
      location: 'Sidi Bou Said',
      image: '/images/sidi-bou-said.jpg',
      imageAlt: 'Coastal sunset view in Sidi Bou Said',
      rating: 4.7,
      ratingCount: 42,
      price: 45,
      bookings: 18,
      status: 'Active',
    },
    {
      title: 'Medina Food Walk',
      category: 'Activity',
      location: 'Tunis Medina',
      image: '/images/medina-tunisia.jpg',
      imageAlt: 'Medina food walk in Tunis',
      rating: 4.8,
      ratingCount: 67,
      price: 30,
      bookings: 34,
      status: 'Active',
    },
    {
      title: 'Beach Villa Hammamet',
      category: 'Hotel',
      location: 'Hammamet',
      image: '/images/hotel-tunisia.jpg',
      imageAlt: 'Beach villa in Hammamet',
      rating: 4.5,
      ratingCount: 23,
      price: 95,
      bookings: 12,
      status: 'Active',
    },
    {
      title: 'Traditional Cooking Class',
      category: 'Activity',
      location: 'Sidi Bou Said',
      image: '/images/restaurant-tunisia.jpg',
      imageAlt: 'Traditional cooking class by the sea',
      rating: 4.9,
      ratingCount: 89,
      price: 55,
      bookings: 45,
      status: 'Active',
    },
    {
      title: 'Desert Glamping',
      category: 'Hotel',
      location: 'Douz',
      image: '/images/sahara-tunisia.jpg',
      imageAlt: 'Desert glamping camp in Douz',
      price: 120,
      bookings: 0,
      status: 'Draft',
    },
  ];
  starFatSolid = StarFatSolid;
}
