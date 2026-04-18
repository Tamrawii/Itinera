import { Component } from '@angular/core';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { Search1Outlined } from '@lineiconshq/free-icons';
import { Footer } from '../../footer/footer';
import { FeaturedCard, FeaturedItem } from '../featured-card/featured-card';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-view-all',
  imports: [Navbar, Footer, FeaturedCard, LineiconsComponent],
  templateUrl: './view-all.html',
  styleUrl: './view-all.css',
})
export class ViewAll {
  readonly Search1Outlined = Search1Outlined;

  featuredList: FeaturedItem[] = [
    {
      category: 'Hotels',
      title: 'Dar El Medina',
      location: 'Tunis Medina',
      image: 'images/hotel-tunisia.jpg',
      imageAlt: 'Dar El Medina in Tunis Medina',
      rating: 4.8,
      ratingCount: 124,
      price: 85,
      pricePrefix: 'From ',
    },
    {
      category: 'Restaurants',
      title: 'Le Pirate',
      location: 'Sidi Bou Said',
      image: 'images/restaurant-tunisia.jpg',
      imageAlt: 'Le Pirate restaurant in Sidi Bou Said',
      rating: 4.6,
      ratingCount: 89,
      price: 35,
      pricePrefix: 'From ',
    },
    {
      category: 'Tours',
      title: 'Sahara Desert Trek',
      location: 'Douz, Tozeur',
      image: 'images/sahara-tunisia.jpg',
      imageAlt: 'Sahara Desert Trek',
      rating: 4.9,
      ratingCount: 203,
      price: 120,
      pricePrefix: 'From ',
    },
    {
      category: 'Tours',
      title: 'Medina Walking Tour',
      location: 'Tunis',
      image: 'images/medina-tunisia.jpg',
      imageAlt: 'Medina Walking Tour in Tunis',
      rating: 4.7,
      ratingCount: 92,
      price: 25,
      pricePrefix: 'From ',
    },
    {
      category: 'Hotels',
      title: 'Blue Coast Escape',
      location: 'Sidi Bou Said',
      image: 'images/sidi-bou-said.jpg',
      imageAlt: 'Blue Coast view in Sidi Bou Said',
      rating: 4.8,
      ratingCount: 147,
      price: 95,
      pricePrefix: 'From ',
    },
    {
      category: 'Restaurants',
      title: 'Carthage Terrace',
      location: 'La Marsa',
      image: 'images/restaurant-tunisia.jpg',
      imageAlt: 'Carthage Terrace restaurant in La Marsa',
      rating: 4.7,
      ratingCount: 76,
      price: 40,
      pricePrefix: 'From ',
    },
  ];
}
