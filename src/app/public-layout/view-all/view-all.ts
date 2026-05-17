import { AfterViewInit, Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { Search1Outlined } from '@lineiconshq/free-icons';
import { Footer } from '../../footer/footer';
import { FeaturedCard } from '../featured-card/featured-card';
import { Navbar } from '../navbar/navbar';
import { Offers } from '../../core/models/offers.model';
import { OfferService } from '../../core/services/offer.service';
import { ActivatedRoute } from '@angular/router';
import { initFlowbite } from 'flowbite';

type OfferType = 'all' | 'hotel' | 'restaurant' | 'activity' | 'transportation';
type PriceRange = 'all' | '0-50' | '51-150' | '151-350' | '351+';
type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating';
type LocationFilter = string; // 'all' or a specific location region

@Component({
  selector: 'app-view-all',
  imports: [Navbar, Footer, FeaturedCard, LineiconsComponent, FormsModule],
  templateUrl: './view-all.html',
  styleUrl: './view-all.css',
})
export class ViewAll implements AfterViewInit, OnInit {
  readonly Search1Outlined = Search1Outlined;

  private _allOffers = signal<Offers[]>([]);

  constructor(private offerService: OfferService, private route: ActivatedRoute) {}

  searchQuery     = signal('');
  activeType      = signal<OfferType>('all');
  activePrice     = signal<PriceRange>('all');
  activeRating    = signal<number>(0);
  activeSort      = signal<SortOption>('recommended');
  activeLocation  = signal<LocationFilter>('all');
  checkInDate     = signal<string>('');
  checkOutDate    = signal<string>('');
  showDatePicker  = signal(false);

  readonly locations = computed<{ value: string; label: string }[]>(() => {
    const locs = [...new Set(this._allOffers().map(o => {
      const parts = o.location.split(',');
      return parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim();
    }))].sort();
    return [{ value: 'all', label: 'All Locations' }, ...locs.map(l => ({ value: l, label: l }))];
  });

  readonly todayStr = new Date().toISOString().split('T')[0];

  readonly offerTypes: { value: OfferType; label: string }[] = [
    { value: 'all',            label: 'All Types'      },
    { value: 'hotel',          label: 'Hotels'         },
    { value: 'restaurant',     label: 'Restaurants'    },
    { value: 'activity',       label: 'Activities'     },
    { value: 'transportation', label: 'Transportation' },
  ];

  readonly priceRanges: { value: PriceRange; label: string }[] = [
    { value: 'all',     label: 'Any Price'     },
    { value: '0-50',    label: 'Under $50'     },
    { value: '51-150',  label: '$51 – $150'    },
    { value: '151-350', label: '$151 – $350'   },
    { value: '351+',    label: '$351 and above'},
  ];

  readonly ratingOptions = [0, 3, 3.5, 4, 4.5];

  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'recommended', label: 'Recommended'     },
    { value: 'price-asc',   label: 'Price: Low–High' },
    { value: 'price-desc',  label: 'Price: High–Low' },
    { value: 'rating',      label: 'Top Rated'       },
  ];

  readonly offersList = computed(() => {
    const q        = this.searchQuery().toLowerCase().trim();
    const type     = this.activeType();
    const price    = this.activePrice();
    const rating   = this.activeRating();
    const sort     = this.activeSort();
    const location = this.activeLocation();
    const checkIn  = this.checkInDate();
    const checkOut = this.checkOutDate();

    let list = this._allOffers().filter((o) => {
      const matchSearch = !q || o.title.toLowerCase().includes(q) || o.location.toLowerCase().includes(q);
      const matchType   = type === 'all' || o.offer_type === type;
      const matchRating = o.rating >= rating;

      let matchPrice = true;
      if (price !== 'all') {
        if (price === '0-50')    matchPrice = o.price <= 50;
        if (price === '51-150')  matchPrice = o.price >= 51  && o.price <= 150;
        if (price === '151-350') matchPrice = o.price >= 151 && o.price <= 350;
        if (price === '351+')    matchPrice = o.price >= 351;
      }

      let matchLocation = true;
      if (location !== 'all') {
        matchLocation = o.location.includes(location);
      }

      let matchDate = true;
      if (checkIn || checkOut) {
        const offerStart = new Date(o.date_from).getTime();
        const offerEnd   = new Date(o.date_to).getTime();
        if (checkIn) {
          const inDate = new Date(checkIn).getTime();
          matchDate = matchDate && inDate >= offerStart && inDate <= offerEnd;
        }
        if (checkOut) {
          const outDate = new Date(checkOut).getTime();
          matchDate = matchDate && outDate >= offerStart && outDate <= offerEnd;
        }
      }

      return matchSearch && matchType && matchRating && matchPrice && matchLocation && matchDate;
    });

    switch (sort) {
      case 'price-asc':  list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating':     list = [...list].sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  });

  readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.activeType()     !== 'all')          count++;
    if (this.activePrice()    !== 'all')          count++;
    if (this.activeRating()   > 0)                count++;
    if (this.activeSort()     !== 'recommended')  count++;
    if (this.activeLocation() !== 'all')          count++;
    if (this.checkInDate()    || this.checkOutDate()) count++;
    return count;
  });

  readonly dateLabel = computed(() => {
    const ci = this.checkInDate();
    const co = this.checkOutDate();
    if (ci && co) return `${this.formatShortDate(ci)} – ${this.formatShortDate(co)}`;
    if (ci) return `From ${this.formatShortDate(ci)}`;
    if (co) return `Until ${this.formatShortDate(co)}`;
    return 'Availability';
  });

  readonly hasDateFilter = computed(() => !!(this.checkInDate() || this.checkOutDate()));

  ngOnInit(): void {
    const state = history.state;
    const fromState: Offers[] = state?.offersList ?? [];
    this._allOffers.set(fromState.length ? fromState : this.offerService.getOffers());

    const q = this.route.snapshot.queryParamMap.get('q');
    if (q) {
      this.searchQuery.set(q);
    }
  }

  ngAfterViewInit(): void { initFlowbite(); }

  setType(v: OfferType): void        { this.activeType.set(v); }
  setPrice(v: PriceRange): void      { this.activePrice.set(v); }
  setRating(v: number): void         { this.activeRating.set(v); }
  setSort(v: SortOption): void       { this.activeSort.set(v); }
  setLocation(v: LocationFilter): void { this.activeLocation.set(v); }
  onSearch(v: string): void          { this.searchQuery.set(v); }

  onCheckIn(v: string): void {
    this.checkInDate.set(v);
    if (this.checkOutDate() && v > this.checkOutDate()) {
      this.checkOutDate.set('');
    }
  }

  onCheckOut(v: string): void  { this.checkOutDate.set(v); }
  toggleDatePicker(): void     { this.showDatePicker.update(v => !v); }
  closeDatePicker(): void      { this.showDatePicker.set(false); }

  clearDates(): void {
    this.checkInDate.set('');
    this.checkOutDate.set('');
  }

  clearFilters(): void {
    this.activeType.set('all');
    this.activePrice.set('all');
    this.activeRating.set(0);
    this.activeSort.set('recommended');
    this.activeLocation.set('all');
    this.checkInDate.set('');
    this.checkOutDate.set('');
    this.searchQuery.set('');
  }

  typeLabel(v: OfferType): string     { return this.offerTypes.find(t => t.value === v)?.label ?? 'All Types'; }
  priceLabel(v: PriceRange): string   { return this.priceRanges.find(p => p.value === v)?.label ?? 'Any Price'; }
  sortLabel(v: SortOption): string    { return this.sortOptions.find(s => s.value === v)?.label ?? 'Recommended'; }
  ratingLabel(v: number): string      { return v === 0 ? 'Any Rating' : `${v}★ & up`; }
  locationLabel(v: string): string    { return v === 'all' ? 'All Locations' : v; }

  private formatShortDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
