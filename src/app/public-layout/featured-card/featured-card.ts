import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { HeartOutlined, MapMarker5Outlined, StarFatSolid } from '@lineiconshq/free-icons';

export interface FeaturedItem {
  title: string;
  location: string;
  image: string;
  imageAlt: string;
  rating: number;
  ratingCount: number;
  price: number;
  priceSuffix?: string;
  category?: string;
  pricePrefix?: string;
}

@Component({
  selector: 'app-featured-card',
  imports: [RouterLink, LineiconsComponent],
  templateUrl: './featured-card.html',
  styleUrl: './featured-card.css',
})
export class FeaturedCard {
  readonly item = input.required<FeaturedItem>();
  readonly showActions = input(true);
  readonly showFavorite = input(false);
  readonly showCategory = input(false);
  readonly MapMarker5Outlined = MapMarker5Outlined;
  readonly StarFatSolid = StarFatSolid;
  readonly HeartOutlined = HeartOutlined;
}
