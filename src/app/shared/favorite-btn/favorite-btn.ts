import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { HeartOutlined, HeartSolid } from '@lineiconshq/free-icons';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-favorite-btn',
  standalone: true,
  imports: [
    CommonModule,
    LineiconsComponent
  ],
  templateUrl: './favorite-btn.html',
  styleUrl: './favorite-btn.css'
})
export class FavoriteBtn {
  @Input() serviceId: number = 0;
  @Input() isFavorited: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showText: boolean = false;
  @Output() favoriteChanged = new EventEmitter<boolean>();

  readonly HeartOutlined = HeartOutlined;
  readonly HeartSolid = HeartSolid;

  isLoading = false;

  constructor(
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) {}

  toggleFavorite(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.isLoading || this.serviceId === 0) {
      return;
    }

    this.isLoading = true;

    if (this.isFavorited) {
      // Remove from wishlist
      this.wishlistService.remove(this.serviceId).subscribe({
        next: () => {
          this.isFavorited = false;
          this.favoriteChanged.emit(false);
          this.toastService.showSuccess('Removed from wishlist');
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
          this.toastService.showError('Failed to remove from wishlist');
          this.isLoading = false;
        }
      });
    } else {
      // Add to wishlist
      this.wishlistService.add(this.serviceId).subscribe({
        next: () => {
          this.isFavorited = true;
          this.favoriteChanged.emit(true);
          this.toastService.showSuccess('Added to wishlist');
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
          this.toastService.showError('Failed to add to wishlist');
          this.isLoading = false;
        }
      });
    }
  }

  get sizeClasses(): string {
    const baseClasses = 'favorite-btn';
    const sizeClasses = {
      small: 'favorite-btn-small',
      medium: 'favorite-btn-medium',
      large: 'favorite-btn-large'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]}`;
  }

  get iconSize(): number {
    const sizes = {
      small: 16,
      medium: 20,
      large: 24
    };
    return sizes[this.size];
  }
}
