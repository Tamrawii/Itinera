import { Component, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { HeartOutlined, MapMarker5Outlined, StarFatSolid } from '@lineiconshq/free-icons';
import { Offers } from '../../core/models/offers.model';
import { FavoriteBtn } from '../../shared/favorite-btn/favorite-btn';

@Component({
  selector: 'app-featured-card',
  imports: [RouterLink, LineiconsComponent, FavoriteBtn],
  templateUrl: './featured-card.html',
  styleUrl: './featured-card.css',
})
export class FeaturedCard {
  constructor(private router: Router) {}
  readonly item = input.required<Offers>();
  readonly showActions = input(true);
  readonly showFavorite = input(false);
  readonly showCategory = input(false);
  readonly MapMarker5Outlined = MapMarker5Outlined;
  readonly StarFatSolid = StarFatSolid;
  readonly HeartOutlined = HeartOutlined;

  bookNow(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/checkout'], {
      state: { offer: this.item() },
    });
  }
}
