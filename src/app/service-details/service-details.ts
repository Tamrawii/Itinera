import { Component } from '@angular/core';
import { Navbar } from '../public-layout/navbar/navbar';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  MapMarker5Outlined,
  StarFatSolid,
  HeartOutlined,
  CheckOutlined,
  StopwatchOutlined,
  User4Outlined,
  Shield2Outlined,
  ArrowLeftOutlined,
} from '@lineiconshq/free-icons';
import { Footer } from '../footer/footer';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { OfferService } from '../core/services/offer.service';
import { Offers } from '../core/models/offers.model';
import { FavoriteBtn } from '../shared/favorite-btn/favorite-btn';

@Component({
  selector: 'app-service-details',
  imports: [Navbar, Footer, LineiconsComponent, FavoriteBtn],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails {
  constructor(
    private location: Location,
    private router: Router,
    private offerService: OfferService,
  ) {}

  MapMarker5Outlined = MapMarker5Outlined;
  StarFatSolid = StarFatSolid;
  HeartOutlined = HeartOutlined;
  CheckOutlined = CheckOutlined;
  StopwatchOutlined = StopwatchOutlined;
  User4Outlined = User4Outlined;
  Shield2Outlined = Shield2Outlined;
  ArrowLeftOutlined = ArrowLeftOutlined;

  goBack() {
    this.location.back();
  }

  bookNow(): void {
    // service-details is currently hardcoded to offer ID 1
    const offer = this.offerService.getOfferById(1);
    this.router.navigate(['/checkout'], {
      state: { offer },
    });
  }
}
