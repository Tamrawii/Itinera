import { Component } from '@angular/core';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { Comment1Outlined, StarFatSolid } from '@lineiconshq/free-icons';

interface RatingBand {
  stars: number;
  count: number;
  percent: number;
}

interface ReviewItem {
  initials: string;
  guest: string;
  service: string;
  date: string;
  rating: number;
  content: string;
  replied: boolean;
}

@Component({
  selector: 'app-reviews',
  imports: [LineiconsComponent],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews {
  averageRating = 4.7;
  totalReviews = 6;
  fiveStarPercent = 67;

  breakdown: RatingBand[] = [
    { stars: 5, count: 4, percent: 80 },
    { stars: 4, count: 2, percent: 33 },
    { stars: 3, count: 0, percent: 0 },
    { stars: 2, count: 0, percent: 0 },
    { stars: 1, count: 0, percent: 0 },
  ];

  reviews: ReviewItem[] = [
    {
      initials: 'SM',
      guest: 'Sarah Mitchell',
      service: 'Coastal Sunset Tour',
      date: 'Mar 10, 2025',
      rating: 5,
      content:
        "The most magical sunset I've ever seen. Our guide was knowledgeable and the boat was spotless. Can't recommend enough!",
      replied: true,
    },
    {
      initials: 'JL',
      guest: 'James Laurent',
      service: 'Beach Villa Hammamet',
      date: 'Mar 8, 2025',
      rating: 4,
      content:
        'Beautiful villa with great amenities. The pool area was perfect. Only minor issue was the Wi-Fi speed.',
      replied: false,
    },
  ];

  stars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (value <= rating ? 1 : 0));
  }
  comment10Outlined = Comment1Outlined;
  starFatSolid = StarFatSolid;
}
