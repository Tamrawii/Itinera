import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from './navbar/navbar';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  Buildings1Outlined,
  KnifeFork1Outlined,
  Car2Solid,
  Search1Outlined,
  Home2Outlined,
  MapMarker5Outlined,
  Bolt3Solid,
} from '@lineiconshq/free-icons';
import { Footer } from '../footer/footer';
import { FeaturedCard } from './featured-card/featured-card';
import { DestinationCard, DestinationItem } from './destination-card/destination-card';
import { OfferService } from '../core/services/offer.service';
import { Offers } from '../core/models/offers.model';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterLink,
    FormsModule,
    Navbar,
    LineiconsComponent,
    Footer,
    FeaturedCard,
    DestinationCard,
    SlicePipe,
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {
  offersList = signal<Offers[]>([
    {
      id: 0,
      owner_id: 0,
      title: '',
      description: '',
      price: 0,
      discount_percentage: 0,
      date_from: new Date(),
      date_to: new Date(),
      image_url: [],
      location: '',
      rating: 0,
      number_of_reviews: 0,
      tag: '',
      offer_type: 'restaurant',
    },
  ]);

  searchQuery = '';

  constructor(private offerService: OfferService, private router: Router) {
    this.offersList.set(this.offerService.getOffers());
  }

  navigateToSearch(): void {
    this.router.navigate(['/view-all'], {
      queryParams: this.searchQuery ? { q: this.searchQuery } : {},
    });
  }

  Buildings1Outlined = Buildings1Outlined;
  KnifeFork1Outlined = KnifeFork1Outlined;
  Car2Solid = Car2Solid;
  Search1Outlined = Search1Outlined;
  MapMarker5Outlined = MapMarker5Outlined;
  Bolt3Solid = Bolt3Solid;
  Home2Outlined = Home2Outlined;

  destinationList: DestinationItem[] = [
    {
      title: 'Sidi Bou Said',
      image: '/images/sidi-bou-said.jpg',
    },
    {
      title: 'Sahara Desert',
      image: '/images/sahara-tunisia.jpg',
    },
    {
      title: 'Tunis Medina',
      image: '/images/medina-tunisia.jpg',
    },
  ];
}
