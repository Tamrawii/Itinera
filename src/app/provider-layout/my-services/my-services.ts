import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { StarFatSolid } from '@lineiconshq/free-icons';
import type { ServiceAvailability } from '../../core/models/service.model';

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
  imports: [LineiconsComponent, FormsModule],
  templateUrl: './my-services.html',
  styleUrl: './my-services.css',
})
export class MyServices {
  modalOpen = signal(false);

  form = {
    name: '',
    description: '',
    price: null as number | null,
    category: '' as 'Tour' | 'Activity' | 'Hotel' | '',
    status: 'Active' as 'Active' | 'Draft',
    imageUrl: '',
    images: [] as string[],
    availability: [] as ServiceAvailability[],
    availDate: '',
    availSlots: null as number | null,
  };

  openModal(): void {
    this.form = {
      name: '',
      description: '',
      price: null,
      category: '',
      status: 'Active',
      imageUrl: '',
      images: [],
      availability: [],
      availDate: '',
      availSlots: null,
    };
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  addImage(): void {
    const url = this.form.imageUrl.trim();
    if (url && !this.form.images.includes(url)) {
      this.form.images = [...this.form.images, url];
      this.form.imageUrl = '';
    }
  }

  removeImage(index: number): void {
    this.form.images = this.form.images.filter((_, i) => i !== index);
  }

  addAvailability(): void {
    if (this.form.availDate && this.form.availSlots && this.form.availSlots > 0) {
      this.form.availability = [
        ...this.form.availability,
        { date: this.form.availDate, slots: this.form.availSlots },
      ];
      this.form.availDate = '';
      this.form.availSlots = null;
    }
  }

  removeAvailability(index: number): void {
    this.form.availability = this.form.availability.filter((_, i) => i !== index);
  }

  submitService(): void {
    if (!this.form.name || !this.form.category || !this.form.price) return;
    const newService: ProviderService = {
      title: this.form.name,
      category: this.form.category as 'Tour' | 'Activity' | 'Hotel',
      location: '',
      image: this.form.images[0] ?? '',
      imageAlt: this.form.name,
      price: this.form.price,
      bookings: 0,
      status: this.form.status,
    };
    this.services = [newService, ...this.services];
    this.closeModal();
  }

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
