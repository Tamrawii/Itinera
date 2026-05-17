import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { StarFatSolid, StarFatOutlined } from '@lineiconshq/free-icons';

export interface RatingChangeEvent {
  rating: number;
}

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [
    CommonModule,
    LineiconsComponent
  ],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css'
})
export class StarRating {
  readonly StarFatSolid = StarFatSolid;
  readonly StarFatOutlined = StarFatOutlined;

  @Input() rating: number = 0;
  @Input() maxRating: number = 5;
  @Input() readonly: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showValue: boolean = false;
  @Input() disabled: boolean = false;

  @Output() ratingChange = new EventEmitter<RatingChangeEvent>();

  hoverRating: number = 0;

  get stars(): number[] {
    return Array(this.maxRating).fill(0).map((_, i) => i + 1);
  }

  get sizeClass(): string {
    return `star-rating--${this.size}`;
  }

  onStarClick(rating: number): void {
    if (this.readonly || this.disabled) return;
    
    this.rating = rating;
    this.ratingChange.emit({ rating });
  }

  onStarHover(rating: number): void {
    if (this.readonly || this.disabled) return;
    
    this.hoverRating = rating;
  }

  onStarLeave(): void {
    if (this.readonly || this.disabled) return;
    
    this.hoverRating = 0;
  }

  isStarFilled(starNumber: number): boolean {
    return starNumber <= (this.hoverRating || this.rating);
  }

  getDisplayRating(): string {
    return this.rating.toFixed(1);
  }

  getIconSize(): number {
    switch (this.size) {
      case 'small': return 16;
      case 'medium': return 24;
      case 'large': return 32;
      default: return 24;
    }
  }
}
