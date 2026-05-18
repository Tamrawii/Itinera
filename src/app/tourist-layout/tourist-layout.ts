import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { 
  Home2Outlined, 
  CalendarDaysOutlined, 
  HeartOutlined, 
  User4Outlined, 
  Comment1Outlined,
  StarFatOutlined,
  SlidersHorizontalSquare2Outlined
} from '@lineiconshq/free-icons';

const TITLE_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  bookings: 'My Bookings',
  payments: 'Payment Tracking',
  wishlist: 'My Wishlist',
  reviews: 'My Reviews',
  messages: 'Messages',
  profile: 'My Profile',
};

@Component({
  selector: 'app-tourist-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LineiconsComponent
  ],
  templateUrl: './tourist-layout.html',
  styleUrl: './tourist-layout.css'
})
export class TouristLayout {
  readonly Home2Outlined = Home2Outlined;
  readonly CalendarDaysOutlined = CalendarDaysOutlined;
  readonly HeartOutlined = HeartOutlined;
  readonly User4Outlined = User4Outlined;
  readonly Comment1Outlined = Comment1Outlined;
  readonly StarFatOutlined = StarFatOutlined;
  readonly SlidersHorizontalSquare2Outlined = SlidersHorizontalSquare2Outlined;

  private router = inject(Router);

  private routeEvent = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => {
        const segment = e.urlAfterRedirects.split('/').pop() || 'dashboard';
        return TITLE_MAP[segment] || 'Dashboard';
      })
    ),
    { initialValue: 'Dashboard' }
  );

  readonly pageTitle = computed(() => this.routeEvent());
}
