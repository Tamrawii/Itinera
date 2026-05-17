import { AfterViewInit, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

interface UserRow {
  initials: string;
  name: string;
  email: string;
  role: 'User' | 'Provider' | 'Admin';
  joined: string;
  bookings: number;
  status: 'Active' | 'Suspended';
}

@Component({
  selector: 'app-users',
  imports: [FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements AfterViewInit {
  readonly roles: Array<'All' | 'User' | 'Provider' | 'Admin'> = ['All', 'User', 'Provider', 'Admin'];
  readonly statuses: Array<'All' | 'Active' | 'Suspended'> = ['All', 'Active', 'Suspended'];
  readonly sortOptions = ['Name (A–Z)', 'Name (Z–A)', 'Bookings (High–Low)', 'Newest', 'Oldest'];

  searchQuery = signal('');
  activeRole = signal<'All' | 'User' | 'Provider' | 'Admin'>('All');
  activeStatus = signal<'All' | 'Active' | 'Suspended'>('All');
  activeSort = signal('Name (A–Z)');

  private readonly _allUsers: UserRow[] = [
    {
      initials: 'SM',
      name: 'Sarah Mitchell',
      email: 'sarah@example.com',
      role: 'User',
      joined: 'Jan 15, 2025',
      bookings: 3,
      status: 'Active',
    },
    {
      initials: 'JL',
      name: 'James Laurent',
      email: 'james@example.com',
      role: 'User',
      joined: 'Feb 2, 2025',
      bookings: 1,
      status: 'Active',
    },
    {
      initials: 'AK',
      name: 'Amina Khelifi',
      email: 'amina@example.com',
      role: 'Provider',
      joined: 'Dec 10, 2024',
      bookings: 0,
      status: 'Active',
    },
    {
      initials: 'MR',
      name: 'Marco Rossi',
      email: 'marco@example.com',
      role: 'User',
      joined: 'Mar 1, 2025',
      bookings: 2,
      status: 'Suspended',
    },
    {
      initials: 'LT',
      name: 'Leila Trabelsi',
      email: 'leila@example.com',
      role: 'Admin',
      joined: 'Nov 5, 2024',
      bookings: 5,
      status: 'Active',
    },
    {
      initials: 'DC',
      name: 'David Chen',
      email: 'david@example.com',
      role: 'User',
      joined: 'Jan 28, 2025',
      bookings: 0,
      status: 'Active',
    },
  ];

  readonly users = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const role = this.activeRole();
    const st = this.activeStatus();
    const sort = this.activeSort();

    let list = this._allUsers.filter((u) => {
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole = role === 'All' || u.role === role;
      const matchSt = st === 'All' || u.status === st;
      return matchSearch && matchRole && matchSt;
    });

    switch (sort) {
      case 'Name (A–Z)':          list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'Name (Z–A)':          list = [...list].sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'Bookings (High–Low)': list = [...list].sort((a, b) => b.bookings - a.bookings); break;
    }
    return list;
  });

  readonly totalFiltered  = computed(() => this.users().length);
  readonly totalActive    = computed(() => this._allUsers.filter((u) => u.status === 'Active').length);
  readonly totalProviders = computed(() => this._allUsers.filter((u) => u.role === 'Provider').length);
  readonly totalAdmins    = computed(() => this._allUsers.filter((u) => u.role === 'Admin').length);

  /* ── Pagination ──────────────────────────────────────────── */
  currentPage = signal(1);
  readonly pageSize = 5;

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.users().length / this.pageSize)));

  readonly pagedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.users().slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  /* ── Row selection ───────────────────────────────────────── */
  selectedRows = signal<Set<string>>(new Set());

  readonly allPageSelected = computed(() => {
    const page = this.pagedUsers();
    const sel = this.selectedRows();
    return page.length > 0 && page.every((u) => sel.has(u.email));
  });

  readonly selectedCount = computed(() => this.selectedRows().size);

  toggleRow(email: string): void {
    const s = new Set(this.selectedRows());
    s.has(email) ? s.delete(email) : s.add(email);
    this.selectedRows.set(s);
  }

  toggleAll(): void {
    if (this.allPageSelected()) {
      const s = new Set(this.selectedRows());
      this.pagedUsers().forEach((r) => s.delete(r.email));
      this.selectedRows.set(s);
    } else {
      const s = new Set(this.selectedRows());
      this.pagedUsers().forEach((r) => s.add(r.email));
      this.selectedRows.set(s);
    }
  }

  bulkAction(action: string): void {
    console.log(action, [...this.selectedRows()]);
    this.clearSelection();
  }

  clearSelection(): void { this.selectedRows.set(new Set()); }

  readonly pageStart = computed(() => (this.currentPage() - 1) * this.pageSize + 1);
  readonly pageEnd   = computed(() => Math.min(this.currentPage() * this.pageSize, this.users().length));

  goToPage(p: number): void {
    this.currentPage.set(Math.min(Math.max(1, p), this.totalPages()));
  }

  ngAfterViewInit(): void { initFlowbite(); }

  setRole(r: 'All' | 'User' | 'Provider' | 'Admin'): void { this.activeRole.set(r); }
  setStatus(s: 'All' | 'Active' | 'Suspended'): void { this.activeStatus.set(s); }
  setSort(s: string): void { this.activeSort.set(s); }
  onSearch(value: string): void { this.searchQuery.set(value); this.currentPage.set(1); }
}
