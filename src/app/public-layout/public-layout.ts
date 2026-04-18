import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { FeaturedCard, FeaturedItem } from './featured-card/featured-card';
import { DestinationCard, DestinationItem } from './destination-card/destination-card';

@Component({
  selector: 'app-public-layout',
  imports: [RouterLink, Navbar, LineiconsComponent, Footer, FeaturedCard, DestinationCard],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {
  Buildings1Outlined = Buildings1Outlined;
  KnifeFork1Outlined = KnifeFork1Outlined;
  Car2Solid = Car2Solid;
  Search1Outlined = Search1Outlined;
  MapMarker5Outlined = MapMarker5Outlined;
  Bolt3Solid = Bolt3Solid;
  Home2Outlined = Home2Outlined;

  featuredList: FeaturedItem[] = [
    {
      title: 'Dar El Medina',
      location: 'Tunis Medina',
      image: 'images/hotel-tunisia.jpg',
      imageAlt: 'Dar El Medina in Tunis Medina',
      rating: 4.5,
      ratingCount: 35,
      price: 85,
      priceSuffix: '/night',
    },
    {
      title: 'Le Pirate',
      location: 'Sidi Bou Said',
      image: 'images/restaurant-tunisia.jpg',
      imageAlt: 'Le Pirate restaurant in Sidi Bou Said',
      rating: 4.5,
      ratingCount: 35,
      price: 85,
    },
    {
      title: 'Sahara Desert Trek',
      location: 'Douz, Tozeur',
      image: 'images/sahara-tunisia.jpg',
      imageAlt: 'Sahara Desert Trek',
      rating: 4.5,
      ratingCount: 35,
      price: 120,
    },
    {
      title: 'Medina Walking Tour',
      location: 'Tunis',
      image: 'images/medina-tunisia.jpg',
      imageAlt: 'Medina Walking Tour in Tunis',
      rating: 4.5,
      ratingCount: 35,
      price: 20,
    },
  ];

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
