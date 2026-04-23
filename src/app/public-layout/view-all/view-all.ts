import { Component, signal } from '@angular/core';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { Search1Outlined } from '@lineiconshq/free-icons';
import { Footer } from '../../footer/footer';
import { FeaturedCard } from '../featured-card/featured-card';
import { Navbar } from '../navbar/navbar';
import { Offers } from '../../models/offers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all',
  imports: [Navbar, Footer, FeaturedCard, LineiconsComponent],
  templateUrl: './view-all.html',
  styleUrl: './view-all.css',
})
export class ViewAll {
  constructor(private router: Router) {}

  readonly Search1Outlined = Search1Outlined;
  offersList = signal<Offers[]>([]);

  ngOnInit() {
    const state = history.state;

    console.log('Offers list:', state.offersList);

    this.offersList.set(state.offersList || []);
  }
}
