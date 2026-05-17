import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { 
  HeartOutlined, 
  MapMarker5Outlined, 
  Trash3Outlined,
  Search1Outlined
} from '@lineiconshq/free-icons';
import { WishlistService } from '../../core/services/wishlist.service';
import { Wishlist } from '../../core/models/wishlist.model';
import { ToastService } from '../../core/services/toast.service';

interface WishlistItem extends Wishlist {
  isRemoving?: boolean;
}

@Component({
  selector: 'app-tourist-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    LineiconsComponent
  ],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class TouristWishlist implements OnInit {
  readonly HeartOutlined = HeartOutlined;
  readonly MapMarker5Outlined = MapMarker5Outlined;
  readonly Trash3Outlined = Trash3Outlined;
  readonly Search1Outlined = Search1Outlined;

  wishlistItems: WishlistItem[] = [];
  isLoading = true;
  searchTerm = '';
  filteredItems: WishlistItem[] = [];

  constructor(
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.getMyWishlist().subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.filteredItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.toastService.showError('Failed to load wishlist');
        this.isLoading = false;
      }
    });
  }

  removeFromWishlist(serviceId: number, itemId: number): void {
    const item = this.wishlistItems.find(w => w.id === itemId);
    if (item) {
      item.isRemoving = true;
    }

    this.wishlistService.remove(serviceId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(w => w.id !== itemId);
        this.filterItems();
        this.toastService.showSuccess('Item removed from wishlist');
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
        this.toastService.showError('Failed to remove item from wishlist');
        if (item) {
          item.isRemoving = false;
        }
      }
    });
  }

  filterItems(): void {
    if (!this.searchTerm.trim()) {
      this.filteredItems = this.wishlistItems;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredItems = this.wishlistItems.filter(item =>
        item.service?.name?.toLowerCase().includes(term) ||
        item.service?.location?.toLowerCase().includes(term) ||
        item.service?.category?.toLowerCase().includes(term)
      );
    }
  }

  onSearchChange(): void {
    this.filterItems();
  }

  getServiceImage(service: any): string {
    return service.image_url?.[0] || '/images/placeholder-service.jpg';
  }

  getServicePrice(service: any): number {
    return service.price || 0;
  }

  getServiceLocation(service: any): string {
    return service.location || 'Location not specified';
  }

  getServiceCategory(service: any): string {
    return service.category || 'Service';
  }

  navigateToService(serviceId: number): void {
    // Navigate to service details
    // This would typically use Router.navigate
    console.log('Navigate to service:', serviceId);
  }
}
