import { AfterViewInit, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

interface BookingRow {
  id: string;
  customer: string;
  service: string;
  date: string;
  guests: number;
  amount: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  pendingActions?: boolean;
}

@Component({
  selector: 'app-bookings',
  imports: [FormsModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings implements AfterViewInit {
  readonly statuses: Array<'All' | 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed'> =
    ['All', 'Confirmed', 'Pending', 'Cancelled', 'Completed'];
  readonly sortOptions = ['Newest', 'Oldest', 'Amount (High–Low)', 'Amount (Low–High)'];

  searchQuery = signal('');
  activeStatus = signal<'All' | 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed'>('All');
  activeSort = signal('Newest');

  private readonly _allBookings: BookingRow[] = [
    {
      id: 'BK-1042',
      customer: 'Sarah Mitchell',
      service: 'Dar El Medina',
      date: 'Mar 15, 2025',
      guests: 2,
      amount: '$170',
      status: 'Confirmed',
    },
    {
      id: 'BK-1041',
      customer: 'James Laurent',
      service: 'Sahara Desert Trek',
      date: 'Mar 18, 2025',
      guests: 1,
      amount: '$240',
      status: 'Pending',
      pendingActions: true,
    },
    {
      id: 'BK-1040',
      customer: 'Amina Khelifi',
      service: 'Medina Walking Tour',
      date: 'Mar 12, 2025',
      guests: 4,
      amount: '$100',
      status: 'Confirmed',
    },
    {
      id: 'BK-1039',
      customer: 'Marco Rossi',
      service: 'Le Pirate',
      date: 'Mar 10, 2025',
      guests: 2,
      amount: '$70',
      status: 'Cancelled',
    },
    {
      id: 'BK-1038',
      customer: 'Leila Trabelsi',
      service: 'Riad Sidi Bou Said',
      date: 'Mar 20, 2025',
      guests: 2,
      amount: '$220',
      status: 'Confirmed',
    },
    {
      id: 'BK-1037',
      customer: 'David Chen',
      service: 'Cafe des Nattes',
      date: 'Mar 8, 2025',
      guests: 3,
      amount: '$45',
      status: 'Completed',
    },
    {
      id: 'BK-1036',
      customer: 'Nina Petrov',
      service: 'Sahara Desert Trek',
      date: 'Mar 5, 2025',
      guests: 2,
      amount: '$240',
      status: 'Completed',
    },
    {
      id: 'BK-1035',
      customer: 'Omar Belhadj',
      service: 'Dar El Medina',
      date: 'Mar 3, 2025',
      guests: 1,
      amount: '$85',
      status: 'Completed',
    },
  ];

  readonly bookings = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.activeStatus();
    const sort = this.activeSort();

    let list = this._allBookings.filter((b) => {
      const matchSearch = !q || b.customer.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
      const matchSt = st === 'All' || b.status === st;
      return matchSearch && matchSt;
    });

    switch (sort) {
      case 'Newest':            list = [...list].sort((a, b) => b.id.localeCompare(a.id)); break;
      case 'Oldest':            list = [...list].sort((a, b) => a.id.localeCompare(b.id)); break;
      case 'Amount (High–Low)': list = [...list].sort((a, b) => parseFloat(b.amount.replace('$','')) - parseFloat(a.amount.replace('$',''))); break;
      case 'Amount (Low–High)': list = [...list].sort((a, b) => parseFloat(a.amount.replace('$','')) - parseFloat(b.amount.replace('$',''))); break;
    }
    return list;
  });

  readonly totalFiltered  = computed(() => this.bookings().length);
  readonly totalRevenue   = computed(() => {
    const sum = this._allBookings.reduce((s, b) => s + parseFloat(b.amount.replace('$', '')), 0);
    return '$' + sum.toLocaleString();
  });
  readonly totalConfirmed = computed(() => this._allBookings.filter((b) => b.status === 'Confirmed').length);
  readonly totalPending   = computed(() => this._allBookings.filter((b) => b.status === 'Pending').length);

  /* ── Pagination ──────────────────────────────────────────── */
  currentPage = signal(1);
  readonly pageSize = 5;

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.bookings().length / this.pageSize)));

  readonly pagedBookings = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.bookings().slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  /* ── Row selection ───────────────────────────────────────── */
  selectedRows = signal<Set<string>>(new Set());

  readonly allPageSelected = computed(() => {
    const page = this.pagedBookings();
    const sel = this.selectedRows();
    return page.length > 0 && page.every((b) => sel.has(b.id));
  });

  readonly selectedCount = computed(() => this.selectedRows().size);

  toggleRow(id: string): void {
    const s = new Set(this.selectedRows());
    s.has(id) ? s.delete(id) : s.add(id);
    this.selectedRows.set(s);
  }

  toggleAll(): void {
    if (this.allPageSelected()) {
      const s = new Set(this.selectedRows());
      this.pagedBookings().forEach((r) => s.delete(r.id));
      this.selectedRows.set(s);
    } else {
      const s = new Set(this.selectedRows());
      this.pagedBookings().forEach((r) => s.add(r.id));
      this.selectedRows.set(s);
    }
  }

  bulkAction(action: string): void {
    console.log(action, [...this.selectedRows()]);
    this.clearSelection();
  }

  clearSelection(): void { this.selectedRows.set(new Set()); }

  readonly pageStart = computed(() => (this.currentPage() - 1) * this.pageSize + 1);
  readonly pageEnd   = computed(() => Math.min(this.currentPage() * this.pageSize, this.bookings().length));

  goToPage(p: number): void {
    this.currentPage.set(Math.min(Math.max(1, p), this.totalPages()));
  }

  ngAfterViewInit(): void { initFlowbite(); }

  setStatus(s: 'All' | 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed'): void { this.activeStatus.set(s); }
  setSort(s: string): void { this.activeSort.set(s); }
  onSearch(value: string): void { this.searchQuery.set(value); this.currentPage.set(1); }
}
