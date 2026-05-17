import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { User4Outlined, CalendarDaysOutlined, MapMarker5Outlined } from '@lineiconshq/free-icons';
import { StarRating, RatingChangeEvent } from '../star-rating/star-rating';
import { ToastService } from '../../core/services/toast.service';

export interface BookingData {
  id: string;
  serviceName: string;
  providerName: string;
  serviceImage: string;
  bookingDate: string;
  location: string;
  totalPrice: number;
}

export interface ReviewSubmitData {
  bookingId: string;
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LineiconsComponent,
    StarRating
  ],
  templateUrl: './review-form.html',
  styleUrl: './review-form.css'
})
export class ReviewForm {
  readonly User4Outlined = User4Outlined;
  readonly CalendarDaysOutlined = CalendarDaysOutlined;
  readonly MapMarker5Outlined = MapMarker5Outlined;

  @Input() booking: BookingData | null = null;
  @Input() isSubmitting: boolean = false;
  @Input() existingReview: { rating: number; comment: string } | null = null;

  @Output() reviewSubmit = new EventEmitter<ReviewSubmitData>();
  @Output() cancel = new EventEmitter<void>();

  reviewForm: FormGroup;
  currentRating: number = 0;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.reviewForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.existingReview) {
      this.isEditMode = true;
      this.currentRating = this.existingReview.rating;
      this.reviewForm.patchValue({
        rating: this.existingReview.rating,
        comment: this.existingReview.comment
      });
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  onRatingChange(event: RatingChangeEvent): void {
    this.currentRating = event.rating;
    this.reviewForm.patchValue({ rating: event.rating });
  }

  onSubmit(): void {
    if (!this.booking) {
      this.toastService.showError('No booking data available');
      return;
    }

    if (this.reviewForm.invalid) {
      this.markFormGroupTouched(this.reviewForm);
      this.toastService.showError('Please fill in all required fields correctly');
      return;
    }

    const formData = this.reviewForm.value;
    
    const reviewData: ReviewSubmitData = {
      bookingId: this.booking.id,
      rating: formData.rating,
      comment: formData.comment.trim()
    };

    this.reviewSubmit.emit(reviewData);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getCharacterCount(): number {
    return this.reviewForm.get('comment')?.value?.length || 0;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.reviewForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.reviewForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;
    
    if (errors['required']) {
      return 'This field is required';
    }
    
    if (errors['minlength']) {
      return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    }
    
    if (errors['maxlength']) {
      return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    }
    
    if (errors['min']) {
      return 'Please select a rating';
    }
    
    if (errors['max']) {
      return 'Invalid rating';
    }
    
    return 'Invalid input';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getSubmitButtonText(): string {
    if (this.isSubmitting) {
      return this.isEditMode ? 'Updating...' : 'Submitting...';
    }
    return this.isEditMode ? 'Update Review' : 'Submit Review';
  }

  getFormTitle(): string {
    return this.isEditMode ? 'Update Your Review' : 'Rate Your Experience';
  }

  getFormDescription(): string {
    return this.isEditMode 
      ? 'Update your rating and review for this service'
      : 'Share your experience to help other travelers make informed decisions';
  }
}
