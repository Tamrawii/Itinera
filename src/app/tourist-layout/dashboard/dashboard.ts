import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { FavoriteBtn } from '../../shared/favorite-btn/favorite-btn';
import { 
  CalendarDaysOutlined, 
  HeartOutlined, 
  StarFatOutlined,
  TrendUp1Outlined,
  MapMarker5Outlined,
  StopwatchOutlined,
  Comment1Outlined
} from '@lineiconshq/free-icons';
import { WishlistService } from '../../core/services/wishlist.service';
import { BookingService } from '../../core/services/booking.service';
import { ReviewService } from '../../core/services/review.service';
import { ServiceService } from '../../core/services/service.service';
import { ToastService } from '../../core/services/toast.service';
import { Booking, Service } from '../../core/models';

interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  wishlistItems: number;
  reviewsCount: number;
}

interface RecentBooking {
  id: string;
  serviceName: string;
  provider: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  image: string;
}

interface WishlistItem {
  id: string;
  serviceId: number;
  name: string;
  category: string;
  price: number;
  image: string;
  location: string;
}

@Component({
  selector: 'app-tourist-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    LineiconsComponent,
    FavoriteBtn
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class TouristDashboard implements OnInit {
  readonly CalendarDaysOutlined = CalendarDaysOutlined;
  readonly HeartOutlined = HeartOutlined;
  readonly StarFatOutlined = StarFatOutlined;
  readonly TrendUp1Outlined = TrendUp1Outlined;
  readonly MapMarker5Outlined = MapMarker5Outlined;
  readonly StopwatchOutlined = StopwatchOutlined;
  readonly Comment1Outlined = Comment1Outlined;

  loading = signal(true);
  stats: DashboardStats = { totalBookings: 0, upcomingBookings: 0, wishlistItems: 0, reviewsCount: 0 };
  recentBookings: RecentBooking[] = [];
  wishlistItems: WishlistItem[] = [];

  constructor(
    private wishlistService: WishlistService,
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private serviceService: ServiceService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    let loaded = 0;
    const checkDone = () => { loaded++; if (loaded === 3) this.loading.set(false); };

    this.bookingService.getMyBookings().subscribe({
      next: (res) => {
        const bookings = res.data;
        this.stats.totalBookings = bookings.length;
        this.stats.upcomingBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length;
        const recent = bookings
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);
        this.enrichRecentBookings(recent);
        checkDone();
      },
      error: () => checkDone(),
    });

    this.wishlistService.getMyWishlist().subscribe({
      next: (items) => {
        this.stats.wishlistItems = items.length;
        this.enrichWishlistItems(items.slice(0, 3));
        checkDone();
      },
      error: () => checkDone(),
    });

    this.reviewService.getMyReviews().subscribe({
      next: (reviews) => {
        this.stats.reviewsCount = reviews.length;
        checkDone();
      },
      error: () => checkDone(),
    });
  }

  private enrichRecentBookings(bookings: Booking[]): void {
    if (bookings.length === 0) { this.recentBookings = []; return; }
    const ids = [...new Set(bookings.map((b) => b.service_id))];
    let loaded = 0;
    const map = new Map<number, Service>();
    ids.forEach((sid) => {
      this.serviceService.getById(sid).subscribe({
        next: (svc) => { map.set(sid, svc); loaded++; if (loaded === ids.length) this.buildRecent(bookings, map); },
        error: () => { loaded++; if (loaded === ids.length) this.buildRecent(bookings, map); },
      });
    });
  }

  private buildRecent(bookings: Booking[], map: Map<number, Service>): void {
    this.recentBookings = bookings.map((b) => {
      const svc = map.get(b.service_id);
      return {
        id: String(b.id),
        serviceName: svc?.name ?? `Service #${b.service_id}`,
        provider: svc?.provider?.business_name ?? 'Provider',
        date: new Date(b.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        status: b.status,
        price: b.total_price,
        image: svc?.images?.[0] ?? '/images/placeholder-service.jpg',
      };
    });
  }

  private enrichWishlistItems(items: any[]): void {
    if (items.length === 0) { this.wishlistItems = []; return; }
    const ids = [...new Set(items.map((w) => w.service_id))];
    let loaded = 0;
    const map = new Map<number, Service>();
    ids.forEach((sid) => {
      this.serviceService.getById(sid).subscribe({
        next: (svc) => { map.set(sid, svc); loaded++; if (loaded === ids.length) this.buildWishlist(items, map); },
        error: () => { loaded++; if (loaded === ids.length) this.buildWishlist(items, map); },
      });
    });
  }

  private buildWishlist(items: any[], map: Map<number, Service>): void {
    this.wishlistItems = items.map((w) => {
      const svc = map.get(w.service_id);
      return {
        id: String(w.id),
        serviceId: w.service_id,
        name: svc?.name ?? 'Untitled',
        category: svc?.category ?? 'Service',
        price: svc?.price ?? 0,
        image: svc?.images?.[0] ?? '/images/placeholder-service.jpg',
        location: svc?.location ?? '—',
      };
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'confirmed': 'Confirmed',
      'pending': 'Pending',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  removeFromWishlist(serviceId: number, itemId: string): void {
    this.wishlistService.remove(serviceId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(item => item.id !== itemId);
        this.stats.wishlistItems = this.wishlistItems.length;
        this.toastService.showSuccess('Item removed from wishlist');
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
        this.toastService.showError('Failed to remove item from wishlist');
      }
    });
  }
}
