import { Component, OnInit } from '@angular/core';
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
import { ToastService } from '../../core/services/toast.service';

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

  constructor(
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) {}

  stats: DashboardStats = {
    totalBookings: 12,
    upcomingBookings: 3,
    wishlistItems: 8,
    reviewsCount: 5
  };

  recentBookings: RecentBooking[] = [
    {
      id: '1',
      serviceName: 'Desert Safari Adventure',
      provider: 'Sahara Tours',
      date: '2025-02-15',
      status: 'confirmed',
      price: 120,
      image: '/images/desert-tour.jpg'
    },
    {
      id: '2',
      serviceName: 'Dar El Medina Hotel',
      provider: 'Medina Hotels',
      date: '2025-02-20',
      status: 'pending',
      price: 85,
      image: '/images/hotel-tunisia.jpg'
    },
    {
      id: '3',
      serviceName: 'Tunisian Cooking Class',
      provider: 'Culinary Tunisia',
      date: '2025-01-28',
      status: 'completed',
      price: 45,
      image: '/images/cooking-class.jpg'
    }
  ];

  wishlistItems: WishlistItem[] = [
    {
      id: '1',
      serviceId: 101,
      name: 'Sahara Desert Safari',
      category: 'Adventure',
      price: 150,
      image: '/images/sahara-tunisia.jpg',
      location: 'Douz, Tunisia'
    },
    {
      id: '2',
      serviceId: 102,
      name: 'Medina Food Tour',
      category: 'Food & Drink',
      price: 75,
      image: '/images/medina-tunisia.jpg',
      location: 'Tunis, Tunisia'
    },
    {
      id: '3',
      serviceId: 103,
      name: 'Sidi Bou Said Art Workshop',
      category: 'Cultural',
      price: 120,
      image: '/images/sidi-bou-said.jpg',
      location: 'Sidi Bou Said, Tunisia'
    }
  ];

  ngOnInit(): void {
    // Load dashboard data from services
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // TODO: Implement actual data loading from services
    // this.bookingService.getTouristBookings().subscribe(...)
    // this.wishlistService.getWishlistItems().subscribe(...)
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
