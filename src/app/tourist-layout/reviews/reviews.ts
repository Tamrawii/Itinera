import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { PlusOutlined, StarFatOutlined } from '@lineiconshq/free-icons';
import { ReviewService } from '../../core/services/review.service';
import { ToastService } from '../../core/services/toast.service';
import { Review } from '../../core/models/review.model';
import { ReviewsList } from '../../shared/reviews-list/reviews-list';
import { ReviewForm, BookingData, ReviewSubmitData } from '../../shared/review-form/review-form';

@Component({
  selector: 'app-tourist-reviews',
  standalone: true,
  imports: [
    CommonModule,
    LineiconsComponent,
    ReviewsList,
    ReviewForm
  ],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class TouristReviews implements OnInit {
  readonly PlusOutlined = PlusOutlined;
  readonly StarFatOutlined = StarFatOutlined;

  reviews: Review[] = [];
  loading: boolean = true;
  showReviewForm: boolean = false;
  selectedBooking: BookingData | null = null;
  editingReview: Review | null = null;
  isSubmitting: boolean = false;

  // Mock completed bookings for demo
  completedBookings: BookingData[] = [
    {
      id: 'booking-1',
      serviceName: 'Historical City Walking Tour',
      providerName: 'City Tours Inc.',
      serviceImage: '/images/services/city-tour.jpg',
      bookingDate: '2024-01-15',
      location: 'Rome, Italy',
      totalPrice: 45
    },
    {
      id: 'booking-2',
      serviceName: 'Airport Transfer Service',
      providerName: 'Quick Transit',
      serviceImage: '/images/services/airport-transfer.jpg',
      bookingDate: '2024-01-10',
      location: 'Paris, France',
      totalPrice: 35
    }
  ];

  private currentUserId = 0;

  constructor(
    private reviewService: ReviewService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.getCurrentUserId();
    this.loadMyReviews();
  }

  private getCurrentUserId(): number {
    try {
      const raw = localStorage.getItem('auth_user');
      if (!raw) return 0;
      const user = JSON.parse(raw);
      return user.id ?? 0;
    } catch {
      return 0;
    }
  }

  loadMyReviews(): void {
    this.loading = true;
    this.reviewService.getMyReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.toastService.showError('Failed to load reviews');
        this.loading = false;
        // For demo purposes, load mock data
        this.loadMockReviews();
      }
    });
  }

  private loadMockReviews(): void {
    // Mock reviews for demonstration
    this.reviews = [
      {
        id: 1,
        tourist_id: 1,
        service_id: 1,
        rating: 5,
        comment: 'Amazing tour! The guide was very knowledgeable and friendly. Highly recommend this experience to anyone visiting the city.',
        created_at: new Date('2024-01-16'),
        updated_at: new Date('2024-01-16'),
        service: {
          id: 1,
          provider_id: 1,
          name: 'Historical City Walking Tour',
          description: 'Explore the rich history of the city',
          price: 45,
          category: 'Tour',
          images: ['/images/services/city-tour.jpg'],
          availability: [],
          created_at: new Date(),
          updated_at: new Date()
        },
        tourist: {
          id: 1,
          full_name: 'John Doe',
          email: 'john@example.com',
          role: 'tourist' as const,
          created_at: new Date(),
          updated_at: new Date()
        }
      }
    ];
  }

  onReviewSubmit(data: ReviewSubmitData): void {
    this.isSubmitting = true;
    
    if (this.editingReview) {
      // Update existing review
      this.reviewService.update(this.editingReview.id, {
        rating: data.rating,
        comment: data.comment
      }).subscribe({
        next: (updatedReview) => {
          const index = this.reviews.findIndex(r => r.id === this.editingReview!.id);
          if (index !== -1) {
            this.reviews[index] = updatedReview;
          }
          this.toastService.showSuccess('Review updated successfully!');
          this.closeReviewForm();
        },
        error: (error) => {
          console.error('Error updating review:', error);
          this.toastService.showError('Failed to update review');
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new review
      this.reviewService.create({
        tourist_id: this.currentUserId,
        service_id: 1,
        rating: data.rating,
        comment: data.comment
      }).subscribe({
        next: (newReview) => {
          this.reviews.unshift(newReview);
          this.toastService.showSuccess('Review submitted successfully!');
          this.closeReviewForm();
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          this.toastService.showError('Failed to submit review');
          this.isSubmitting = false;
        }
      });
    }
  }

  onReviewEdit(review: Review): void {
    this.editingReview = review;
    this.selectedBooking = this.completedBookings[0]; // Mock booking data
    this.showReviewForm = true;
  }

  onReviewDelete(review: Review): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.delete(review.id).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(r => r.id !== review.id);
          this.toastService.showSuccess('Review deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting review:', error);
          this.toastService.showError('Failed to delete review');
        }
      });
    }
  }

  openReviewForm(): void {
    this.editingReview = null;
    this.selectedBooking = this.completedBookings[0]; // In real app, let user select booking
    this.showReviewForm = true;
  }

  closeReviewForm(): void {
    this.showReviewForm = false;
    this.selectedBooking = null;
    this.editingReview = null;
    this.isSubmitting = false;
  }

  getPendingBookings(): BookingData[] {
    // In real app, filter bookings that don't have reviews yet
    return this.completedBookings.filter(booking => 
      !this.reviews.some(review => review.service_id === 1) // Mock logic
    );
  }

  hasPendingReviews(): boolean {
    return this.getPendingBookings().length > 0;
  }
}
