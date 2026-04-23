import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  EyeOutlined,
  BoxClosedOutlined,
  User4Outlined,
  UserMultiple4Outlined,
  CalendarDaysOutlined,
  Gear1Outlined,
  BarChart4Outlined,
} from '@lineiconshq/free-icons';
import { OfferService } from '../services/offer.service';
import { Offers } from '../models/offers';
import { UserProvider } from '../models/user-provider';
import { UserProviderService } from '../services/user-provider.service';
import { UserTourist } from '../models/user-tourist';
import { UserTouristService } from '../services/user-tourist.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LineiconsComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
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

  providersList = signal<UserProvider[]>([
    {
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      profile_picture: '',
      validation_status: 'pending',
    },
  ]);

  touristsList = signal<UserTourist[]>([
    {
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      profile_picture: '',
      country: '',
      saved_offers: [],
    },
  ]);

  constructor(
    private offerService: OfferService,
    private providersListService: UserProviderService,
    private touristsListService: UserTouristService,
  ) {
    this.offersList.set(this.offerService.getOffers());
    this.providersList.set(this.providersListService.getProviders());
    this.touristsList.set(this.touristsListService.getTourists());
  }
  eyeOutlined = EyeOutlined;
  boxClosedOutlined = BoxClosedOutlined;
  user4Outlined = User4Outlined;
  userMultiple4Outlined = UserMultiple4Outlined;
  calendarDaysOutlined = CalendarDaysOutlined;
  gear1Outlined = Gear1Outlined;
  barChart4Outlined = BarChart4Outlined;
}
