import { AfterViewInit, Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

import { PaymentService } from '../../core/services/payment.service';
import { Payment, PaymentStatus, PaymentMethod } from '../../core/models';

type FilterStatus = 'All' | PaymentStatus;

@Component({
  selector: 'app-tourist-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class TouristPayments implements OnInit, AfterViewInit {
  readonly statuses: FilterStatus[] = ['All', 'pending', 'paid', 'refunded', 'failed'];
  readonly sortOptions = ['Newest', 'Oldest', 'Amount (High–Low)', 'Amount (Low–High)'];

  searchQuery = signal('');
  activeStatus = signal<FilterStatus>('All');
  activeSort = signal('Newest');
  loading = signal(true);

  private _all = signal<Payment[]>([]);

  readonly payments = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.activeStatus();
    const sort = this.activeSort();

    let list = this._all().filter((p) => {
      const matchSearch =
        !q ||
        String(p.id).includes(q) ||
        String(p.booking_id).includes(q) ||
        p.payment_method.toLowerCase().includes(q) ||
        (p.transaction_id ?? '').toLowerCase().includes(q);
      const matchStatus = st === 'All' || p.status === st;
      return matchSearch && matchStatus;
    });

    switch (sort) {
      case 'Newest':
        list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'Oldest':
        list = [...list].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'Amount (High–Low)':
        list = [...list].sort((a, b) => b.amount - a.amount);
        break;
      case 'Amount (Low–High)':
        list = [...list].sort((a, b) => a.amount - b.amount);
        break;
    }
    return list;
  });

  readonly totalFiltered = computed(() => this.payments().length);

  readonly totalSpent = computed(() => {
    const sum = this._all()
      .filter((p) => p.status === 'paid')
      .reduce((s, p) => s + p.amount, 0);
    return '$' + sum.toLocaleString();
  });

  readonly totalPaid = computed(() => this._all().filter((p) => p.status === 'paid').length);
  readonly totalPending = computed(() => this._all().filter((p) => p.status === 'pending').length);
  readonly totalRefunded = computed(() => this._all().filter((p) => p.status === 'refunded').length);

  /* ── Pagination ──────────────────────────────────────────── */
  currentPage = signal(1);
  readonly pageSize = 6;

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.payments().length / this.pageSize)));
  readonly pagedPayments = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.payments().slice(start, start + this.pageSize);
  });
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
  readonly pageStart = computed(() => (this.currentPage() - 1) * this.pageSize + 1);
  readonly pageEnd = computed(() => Math.min(this.currentPage() * this.pageSize, this.payments().length));

  goToPage(p: number): void {
    this.currentPage.set(Math.min(Math.max(1, p), this.totalPages()));
  }

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.getMyPayments().subscribe({
      next: (payments) => {
        this._all.set(payments);
        this.loading.set(false);
      },
      error: () => {
        // Fallback to demo data when API unavailable
        this._all.set(this.getDemoPayments());
        this.loading.set(false);
      },
    });
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  setStatus(s: FilterStatus): void {
    this.activeStatus.set(s);
    this.currentPage.set(1);
  }

  setSort(s: string): void {
    this.activeSort.set(s);
  }

  onSearch(v: string): void {
    this.searchQuery.set(v);
    this.currentPage.set(1);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatMethod(method: PaymentMethod): string {
    const map: Record<PaymentMethod, string> = {
      card: 'Credit Card',
      cash: 'Cash',
      bank_transfer: 'Bank Transfer',
    };
    return map[method] || method;
  }

  statusLabel(status: FilterStatus): string {
    if (status === 'All') return 'All';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  private getDemoPayments(): Payment[] {
    return [
      {
        id: 1,
        booking_id: 1042,
        amount: 170,
        status: 'paid',
        payment_method: 'card',
        transaction_id: 'TXN-9A3F21',
        created_at: new Date('2025-03-15T10:30:00'),
        updated_at: new Date('2025-03-15T10:30:00'),
      },
      {
        id: 2,
        booking_id: 1041,
        amount: 240,
        status: 'pending',
        payment_method: 'bank_transfer',
        created_at: new Date('2025-03-18T14:00:00'),
        updated_at: new Date('2025-03-18T14:00:00'),
      },
      {
        id: 3,
        booking_id: 1040,
        amount: 100,
        status: 'paid',
        payment_method: 'card',
        transaction_id: 'TXN-7B2E44',
        created_at: new Date('2025-03-12T09:15:00'),
        updated_at: new Date('2025-03-12T09:15:00'),
      },
      {
        id: 4,
        booking_id: 1039,
        amount: 70,
        status: 'refunded',
        payment_method: 'card',
        transaction_id: 'TXN-5C1D33',
        created_at: new Date('2025-03-10T16:45:00'),
        updated_at: new Date('2025-03-11T08:00:00'),
      },
      {
        id: 5,
        booking_id: 1038,
        amount: 220,
        status: 'paid',
        payment_method: 'cash',
        transaction_id: 'TXN-8E4G56',
        created_at: new Date('2025-03-20T11:00:00'),
        updated_at: new Date('2025-03-20T11:00:00'),
      },
      {
        id: 6,
        booking_id: 1037,
        amount: 45,
        status: 'failed',
        payment_method: 'bank_transfer',
        created_at: new Date('2025-03-08T13:30:00'),
        updated_at: new Date('2025-03-08T13:35:00'),
      },
      {
        id: 7,
        booking_id: 1036,
        amount: 240,
        status: 'paid',
        payment_method: 'card',
        transaction_id: 'TXN-2F7H89',
        created_at: new Date('2025-03-05T08:00:00'),
        updated_at: new Date('2025-03-05T08:00:00'),
      },
      {
        id: 8,
        booking_id: 1035,
        amount: 85,
        status: 'paid',
        payment_method: 'card',
        transaction_id: 'TXN-4A9J12',
        created_at: new Date('2025-03-03T15:20:00'),
        updated_at: new Date('2025-03-03T15:20:00'),
      },
    ];
  }
}
