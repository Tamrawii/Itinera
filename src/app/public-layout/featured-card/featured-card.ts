import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { HeartOutlined, MapMarker5Outlined, StarFatSolid } from '@lineiconshq/free-icons';
import { Offers } from '../../models/offers';

@Component({
  selector: 'app-featured-card',
  imports: [RouterLink, LineiconsComponent],
  templateUrl: './featured-card.html',
  styleUrl: './featured-card.css',
})
export class FeaturedCard {
  readonly item = input.required<Offers>();
  readonly showActions = input(true);
  readonly showFavorite = input(false);
  readonly showCategory = input(false);
  readonly MapMarker5Outlined = MapMarker5Outlined;
  readonly StarFatSolid = StarFatSolid;
  readonly HeartOutlined = HeartOutlined;
}
