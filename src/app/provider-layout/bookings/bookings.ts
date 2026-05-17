import { AfterViewInit, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

interface BookingItem {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  serviceName: string;
  schedule: string;
  guests: string;
  note?: string;
  amount: number;
  status: BookingStatus;
}

@Component({
  selector: 'app-bookings',
  imports: [FormsModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings implements AfterViewInit {
  readonly statuses: Array<'All' | BookingStatus> = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
  readonly sortOptions = ['Newest', 'Oldest', 'Amount (High–Low)', 'Amount (Low–High)'];

  searchQuery  = signal('');
  activeStatus = signal<'All' | BookingStatus>('All');
  activeSort   = signal('Newest');

  private readonly _all: BookingItem[] = [
    {
      bookingId: 'BK-2050',
      guestName: 'Sarah Mitchell',
      guestEmail: 'sarah.mitchell@example.com',
      serviceName: 'Coastal Sunset Tour',
      schedule: 'Mar 18, 2025 · 4:00 PM',
      guests: '2 guests',
      note: '"First time visiting"',
      amount: 90,
      status: 'Pending',
    },
    {
      bookingId: 'BK-2049',
      guestName: 'James Laurent',
      guestEmail: 'james.laurent@example.com',
      serviceName: 'Beach Villa Hammamet',
      schedule: 'Mar 20–22 · Check-in 2PM',
      guests: '3 guests',
      amount: 190,
      status: 'Confirmed',
    },
    {
      bookingId: 'BK-2048',
      guestName: 'Amina Khelifi',
      guestEmail: 'amina.khelifi@example.com',
      serviceName: 'Medina Food Walk',
      schedule: 'Mar 15, 2025 · 10:00 AM',
      guests: '4 guests',
      note: '"Vegetarian group"',
      amount: 120,
      status: 'Completed',
    },
    {
      bookingId: 'BK-2047',
      guestName: 'Marco Rossi',
      guestEmail: 'marco.rossi@example.com',
      serviceName: 'Traditional Cooking Class',
      schedule: 'Mar 14, 2025 · 11:00 AM',
      guests: '2 guests',
      amount: 110,
      status: 'Completed',
    },
    {
      bookingId: 'BK-2046',
      guestName: 'Nina Petrov',
      guestEmail: 'nina.petrov@example.com',
      serviceName: 'Coastal Sunset Tour',
      schedule: 'Mar 12, 2025 · 2:00 PM',
      guests: '1 guest',
      amount: 45,
      status: 'Cancelled',
    },
  ];

  readonly bookings = computed(() => {
    const q  = this.searchQuery().toLowerCase().trim();
    const st = this.activeStatus();
    const sort = this.activeSort();

    let list = this._all.filter((b) => {
      const matchSearch = !q ||
        b.guestName.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        b.bookingId.toLowerCase().includes(q);
      const matchSt = st === 'All' || b.status === st;
      return matchSearch && matchSt;
    });

    switch (sort) {
      case 'Newest':            list = [...list].sort((a, b) => b.bookingId.localeCompare(a.bookingId)); break;
      case 'Oldest':            list = [...list].sort((a, b) => a.bookingId.localeCompare(b.bookingId)); break;
      case 'Amount (High–Low)': list = [...list].sort((a, b) => b.amount - a.amount); break;
      case 'Amount (Low–High)': list = [...list].sort((a, b) => a.amount - b.amount); break;
    }
    return list;
  });

  readonly totalFiltered  = computed(() => this.bookings().length);
  readonly totalRevenue   = computed(() => '$' + this._all.reduce((s, b) => s + b.amount, 0).toLocaleString());
  readonly totalConfirmed = computed(() => this._all.filter((b) => b.status === 'Confirmed').length);
  readonly totalPending   = computed(() => this._all.filter((b) => b.status === 'Pending').length);

  /* ── Pagination ──────────────────────────────────────────── */
  currentPage = signal(1);
  readonly pageSize = 5;

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.bookings().length / this.pageSize)));
  readonly pagedBookings = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.bookings().slice(start, start + this.pageSize);
  });
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
  readonly pageStart   = computed(() => (this.currentPage() - 1) * this.pageSize + 1);
  readonly pageEnd     = computed(() => Math.min(this.currentPage() * this.pageSize, this.bookings().length));

  goToPage(p: number): void { this.currentPage.set(Math.min(Math.max(1, p), this.totalPages())); }

  /* ── Row selection ───────────────────────────────────────── */
  selectedRows = signal<Set<string>>(new Set());

  readonly allPageSelected = computed(() => {
    const page = this.pagedBookings();
    const sel  = this.selectedRows();
    return page.length > 0 && page.every((b) => sel.has(b.bookingId));
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
      this.pagedBookings().forEach((r) => s.delete(r.bookingId));
      this.selectedRows.set(s);
    } else {
      const s = new Set(this.selectedRows());
      this.pagedBookings().forEach((r) => s.add(r.bookingId));
      this.selectedRows.set(s);
    }
  }

  bulkAction(action: string): void { console.log(action, [...this.selectedRows()]); this.clearSelection(); }
  clearSelection(): void { this.selectedRows.set(new Set()); }

  setStatus(s: 'All' | BookingStatus): void { this.activeStatus.set(s); this.currentPage.set(1); }
  setSort(s: string): void  { this.activeSort.set(s); }
  onSearch(v: string): void { this.searchQuery.set(v); this.currentPage.set(1); }

  ngAfterViewInit(): void { initFlowbite(); }
}
