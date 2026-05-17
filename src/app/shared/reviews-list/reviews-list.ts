import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { 
  User4Outlined, 
  CalendarDaysOutlined, 
  StarFatOutlined,
  ExitOutlined,
  Trash3Outlined,
  Search1Outlined
} from '@lineiconshq/free-icons';
import { StarRating } from '../star-rating/star-rating';
import { Review } from '../../core/models/review.model';

export interface ReviewListActions {
  edit: (review: Review) => void;
  delete: (review: Review) => void;
}

@Component({
  selector: 'app-reviews-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LineiconsComponent,
    StarRating
  ],
  templateUrl: './reviews-list.html',
  styleUrl: './reviews-list.css'
})
export class ReviewsList {
  readonly User4Outlined = User4Outlined;
  readonly CalendarDaysOutlined = CalendarDaysOutlined;
  readonly StarFatOutlined = StarFatOutlined;
  readonly ExitOutlined = ExitOutlined;
  readonly Trash3Outlined = Trash3Outlined;
  readonly Search1Outlined = Search1Outlined;

  @Input() reviews: Review[] = [];
  @Input() loading: boolean = false;
  @Input() showActions: boolean = true;
  @Input() showServiceInfo: boolean = false;
  @Input() emptyMessage: string = 'No reviews yet';

  @Output() reviewEdit = new EventEmitter<Review>();
  @Output() reviewDelete = new EventEmitter<Review>();

  searchTerm: string = '';
  filteredReviews: Review[] = [];

  ngOnInit(): void {
    this.filterReviews();
  }

  ngOnChanges(): void {
    this.filterReviews();
  }

  onSearchChange(): void {
    this.filterReviews();
  }

  private filterReviews(): void {
    if (!this.searchTerm.trim()) {
      this.filteredReviews = [...this.reviews];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredReviews = this.reviews.filter(review => {
        const searchableText = [
          review.comment,
          review.service?.name || '',
          review.tourist?.full_name || ''
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchLower);
      });
    }
  }

  onEditReview(review: Review): void {
    this.reviewEdit.emit(review);
  }

  onDeleteReview(review: Review): void {
    this.reviewDelete.emit(review);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getRatingStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  isStarFilled(starNumber: number, rating: number): boolean {
    return starNumber <= rating;
  }

  getReviewStats(): { average: number; count: number } {
    if (this.reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      average: Math.round((total / this.reviews.length) * 10) / 10,
      count: this.reviews.length
    };
  }
}
