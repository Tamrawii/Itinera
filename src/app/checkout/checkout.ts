import {
  Component,
  signal,
  computed,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Navbar } from '../public-layout/navbar/navbar';
import { Footer } from '../footer/footer';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  CheckCircle1Outlined,
  ArrowLeftOutlined,
  Shield2Outlined,
  CreditCardMultipleOutlined,
} from '@lineiconshq/free-icons';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';

import { BookingService } from '../core/services/booking.service';
import { PaymentService } from '../core/services/payment.service';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';
import { OfferService } from '../core/services/offer.service';
import { Offers } from '../core/models/offers.model';
import { Booking, Payment } from '../core/models';
import { environment } from '../../environments/environment';

type CheckoutStep = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Navbar, Footer, LineiconsComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, AfterViewInit, OnDestroy {
  step = signal<CheckoutStep>(1);
  offer = signal<Offers | null>(null);

  bookingForm: FormGroup;

  // Internal signal that tracks form value for reactive computed()
  private _formValue = signal<Record<string, unknown>>({});
  private _formSub?: Subscription;

  // Stripe state
  private stripe: Stripe | null = null;
  private stripeElements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;
  cardComplete = signal(false);
  cardError = signal<string | null>(null);

  // Processing state
  isProcessing = signal(false);

  // Confirmation data
  completedBooking = signal<Booking | null>(null);
  completedPayment = signal<Payment | null>(null);

  // Icons
  readonly CheckCircleOutlined = CheckCircle1Outlined;
  readonly ArrowLeftOutlined = ArrowLeftOutlined;
  readonly ShieldOutlined = Shield2Outlined;
  readonly CreditcardOutlined = CreditCardMultipleOutlined;

  // Computed: nights (only meaningful for hotel offers)
  readonly nights = computed(() => {
    const v = this._formValue();
    const checkIn = v?.['checkIn'] as string | undefined;
    const checkOut = v?.['checkOut'] as string | undefined;
    if (!checkIn || !checkOut) return 1;
    const diff =
      new Date(checkOut + 'T00:00:00').getTime() -
      new Date(checkIn + 'T00:00:00').getTime();
    return Math.max(1, Math.ceil(diff / 86_400_000));
  });

  // Computed: total price
  readonly totalPrice = computed(() => {
    const offer = this.offer();
    if (!offer) return 0;
    const guests = (this._formValue()?.['guests'] as number) ?? 1;
    if (offer.offer_type === 'hotel') return offer.price * this.nights();
    return offer.price * guests;
  });

  // Computed: line items for price breakdown
  readonly priceBreakdown = computed(() => {
    const offer = this.offer();
    if (!offer) return [];
    const guests = (this._formValue()?.['guests'] as number) ?? 1;
    if (offer.offer_type === 'hotel') {
      return [
        {
          label: `$${offer.price}/night × ${this.nights()} night${this.nights() > 1 ? 's' : ''}`,
          amount: offer.price * this.nights(),
        },
        { label: 'Taxes & fees', amount: 0 },
      ];
    }
    return [
      {
        label: `$${offer.price}/person × ${guests} guest${guests > 1 ? 's' : ''}`,
        amount: offer.price * guests,
      },
      { label: 'Service fee', amount: 0 },
    ];
  });

  // Today's date string for min date attribute
  readonly todayStr = new Date().toISOString().split('T')[0];

  // Minimum checkout date (day after check-in)
  readonly minCheckOut = computed(() => {
    const checkIn = this._formValue()?.['checkIn'] as string | undefined;
    if (!checkIn) return this.todayStr;
    const d = new Date(checkIn + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private toastService: ToastService,
    private offerService: OfferService,
  ) {
    // Try to get offer from router state
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as
      | { offer?: Offers; offerId?: number }
      | undefined;

    if (state?.offer) {
      this.offer.set(state.offer);
    } else if (state?.offerId) {
      const found = this.offerService.getOfferById(state.offerId);
      if (found) this.offer.set(found);
    }

    // Build form
    this.bookingForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      checkIn: ['', Validators.required],
      checkOut: [''],
      guests: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      specialRequests: [''],
    });

    // Pre-fill user info
    const user = this.authService.getCurrentUser();
    if (user) {
      this.bookingForm.patchValue({ fullName: user.full_name, email: user.email });
    }

    // Capture initial form value in the signal (post patchValue)
    this._formValue.set(this.bookingForm.value as Record<string, unknown>);

    // Keep signal in sync with future form changes
    this._formSub = this.bookingForm.valueChanges.subscribe((v) => {
      this._formValue.set(v as Record<string, unknown>);
    });
  }

  ngOnInit(): void {
    // Fallback: if no offer set from router state, use first offer
    if (!this.offer()) {
      const offers = this.offerService.getOffers();
      if (offers.length > 0) this.offer.set(offers[0]);
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this._formSub?.unsubscribe();
    this.cardElement?.destroy();
  }

  // ── Step navigation ────────────────────────────────────────────────

  goToStep2(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    // For hotels, checkOut is required
    const offer = this.offer();
    if (offer?.offer_type === 'hotel' && !this.bookingForm.value.checkOut) {
      this.bookingForm.get('checkOut')?.markAsTouched();
      this.toastService.showError('Please select a check-out date.');
      return;
    }
    this.step.set(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToStep1(): void {
    this.step.set(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToStep3(): void {
    this.step.set(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Mount Stripe after view updates
    setTimeout(() => this.mountStripe(), 50);
  }

  backToStep2(): void {
    this.step.set(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Stripe ──────────────────────────────────────────────────────────

  private async mountStripe(): Promise<void> {
    if (this.stripe) return; // Already initialized

    this.stripe = await loadStripe(environment.stripePublishableKey);
    if (!this.stripe) return;

    this.stripeElements = this.stripe.elements();
    this.cardElement = this.stripeElements.create('card', {
      style: {
        base: {
          color: '#1e293b',
          fontSize: '15px',
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
          fontWeight: '400',
          '::placeholder': { color: '#94a3b8' },
          iconColor: '#64748b',
        },
        invalid: { color: '#fa5252', iconColor: '#fa5252' },
      },
      hidePostalCode: true,
    });

    this.cardElement.mount('#stripe-card-element');

    this.cardElement.on('change', (event) => {
      this.cardComplete.set(event.complete);
      this.cardError.set(event.error?.message ?? null);
    });
  }

  // ── Payment flow ────────────────────────────────────────────────────

  async pay(): Promise<void> {
    if (!this.cardComplete() || this.isProcessing()) return;

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toastService.showError('You must be signed in to complete a booking.');
      this.router.navigate(['/sign-in']);
      return;
    }

    this.isProcessing.set(true);
    this.cardError.set(null);

    const offer = this.offer()!;
    const formValue = this.bookingForm.value;

    // Step A: Create booking
    this.bookingService
      .create({
        tourist_id: user.id,
        service_id: offer.id,
        booking_date: new Date(formValue.checkIn + 'T00:00:00'),
        total_price: this.totalPrice(),
      })
      .subscribe({
        next: (booking) => {
          // Step B: Initiate payment
          this.paymentService.initiate(booking.id, 'card').subscribe({
            next: (payment) => {
              // Step C: Confirm payment (simulates Stripe success)
              this.paymentService.confirm(payment.id).subscribe({
                next: (confirmed) => {
                  // Step D: Update booking status to confirmed
                  this.bookingService.updateStatus(booking.id, 'confirmed').subscribe({
                    next: () => {
                      this.completedBooking.set(booking);
                      this.completedPayment.set(confirmed);
                      this.isProcessing.set(false);
                      this.step.set(4);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      this.toastService.showSuccess('Booking confirmed! 🎉');
                    },
                    error: () => {
                      // Booking update failed but payment went through — still show success
                      this.completedBooking.set(booking);
                      this.completedPayment.set(confirmed);
                      this.isProcessing.set(false);
                      this.step.set(4);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    },
                  });
                },
                error: () => {
                  this.isProcessing.set(false);
                  this.cardError.set('Payment processing failed. Please try again.');
                },
              });
            },
            error: () => {
              this.isProcessing.set(false);
              this.cardError.set('Could not initiate payment. Please try again.');
            },
          });
        },
        error: () => {
          this.isProcessing.set(false);
          this.cardError.set('Could not create booking. Please try again.');
        },
      });
  }

  // ── Helpers ─────────────────────────────────────────────────────────

  isHotel(): boolean {
    return this.offer()?.offer_type === 'hotel';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  offerTypeLabel(type: string): string {
    const map: Record<string, string> = {
      hotel: 'Hotel',
      activity: 'Activity',
      restaurant: 'Restaurant',
      transportation: 'Transportation',
    };
    return map[type] ?? type;
  }

  getFieldError(field: string): string | null {
    const ctrl = this.bookingForm.get(field);
    if (!ctrl?.invalid || !ctrl.touched) return null;
    if (ctrl.errors?.['required']) return 'This field is required.';
    if (ctrl.errors?.['email']) return 'Enter a valid email address.';
    if (ctrl.errors?.['minlength'])
      return `Minimum ${ctrl.errors['minlength'].requiredLength} characters.`;
    if (ctrl.errors?.['min']) return `Minimum value is ${ctrl.errors['min'].min}.`;
    if (ctrl.errors?.['max']) return `Maximum value is ${ctrl.errors['max'].max}.`;
    return 'Invalid value.';
  }

  hasError(field: string): boolean {
    const ctrl = this.bookingForm.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }
}
