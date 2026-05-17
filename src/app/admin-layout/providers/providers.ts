import { AfterViewInit, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

interface ProviderRow {
  id: string;
  business: string;
  owner: string;
  location: string;
  rating: string;
  services: number;
  earnings: string;
  status: 'Active' | 'Pending' | 'Suspended';
}

@Component({
  selector: 'app-providers',
  imports: [FormsModule],
  templateUrl: './providers.html',
  styleUrl: './providers.css',
})
export class Providers implements AfterViewInit {
  readonly statuses: Array<'All' | 'Active' | 'Pending' | 'Suspended'> = ['All', 'Active', 'Pending', 'Suspended'];
  readonly locations: string[];
  readonly sortOptions = ['Business (A–Z)', 'Business (Z–A)', 'Rating (High–Low)', 'Earnings (High–Low)', 'Listings'];

  searchQuery = signal('');
  activeStatus = signal<'All' | 'Active' | 'Pending' | 'Suspended'>('All');
  activeLocation = signal('All');
  activeSort = signal('Business (A–Z)');

  private readonly _allProviders: ProviderRow[] = [
    {
      id: 'PR-1001',
      business: 'Dar El Medina Group',
      owner: 'Hedi Mansour',
      location: 'Tunis',
      rating: '4.8',
      services: 3,
      earnings: '$12,400',
      status: 'Active',
    },
    {
      id: 'PR-1002',
      business: 'Blue Coast Tours',
      owner: 'Yasmine Rejeb',
      location: 'Sidi Bou Said',
      rating: '4.7',
      services: 5,
      earnings: '$18,200',
      status: 'Active',
    },
    {
      id: 'PR-1003',
      business: 'Sahara Expeditions',
      owner: 'Khaled Dridi',
      location: 'Douz',
      rating: '4.9',
      services: 2,
      earnings: '$9,800',
      status: 'Active',
    },
    {
      id: 'PR-1004',
      business: 'Medina Flavors',
      owner: 'Fatma Ben Ali',
      location: 'Tunis',
      rating: '4.4',
      services: 1,
      earnings: '$3,600',
      status: 'Pending',
    },
    {
      id: 'PR-1005',
      business: 'Cap Bon Rentals',
      owner: 'Sami Gharbi',
      location: 'Hammamet',
      rating: '4.2',
      services: 4,
      earnings: '$7,100',
      status: 'Active',
    },
    {
      id: 'PR-1006',
      business: 'Carthage Heritage',
      owner: 'Rim Ksouri',
      location: 'Carthage',
      rating: '4.6',
      services: 2,
      earnings: '$5,500',
      status: 'Pending',
    },
  ];

  constructor() {
    const unique = ['All', ...new Set(this._allProviders.map((p) => p.location))];
    this.locations = unique;
  }

  readonly providers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.activeStatus();
    const loc = this.activeLocation();
    const sort = this.activeSort();

    let list = this._allProviders.filter((p) => {
      const matchSearch = !q || p.business.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q);
      const matchSt = st === 'All' || p.status === st;
      const matchLoc = loc === 'All' || p.location === loc;
      return matchSearch && matchSt && matchLoc;
    });

    switch (sort) {
      case 'Business (A–Z)':      list = [...list].sort((a, b) => a.business.localeCompare(b.business)); break;
      case 'Business (Z–A)':      list = [...list].sort((a, b) => b.business.localeCompare(a.business)); break;
      case 'Rating (High–Low)':   list = [...list].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)); break;
      case 'Earnings (High–Low)': list = [...list].sort((a, b) => parseFloat(b.earnings.replace(/[$,]/g,'')) - parseFloat(a.earnings.replace(/[$,]/g,''))); break;
      case 'Listings':            list = [...list].sort((a, b) => b.services - a.services); break;
    }
    return list;
  });

  readonly totalFiltered = computed(() => this.providers().length);
  readonly totalVerified = computed(() => this._allProviders.filter((p) => p.status === 'Active').length);
  readonly totalListings = computed(() => this._allProviders.reduce((s, p) => s + p.services, 0));
  readonly totalRevenue = computed(() => {
    const sum = this._allProviders.reduce((s, p) => s + parseFloat(p.earnings.replace(/[$,]/g, '')), 0);
    return '$' + sum.toLocaleString();
  });

  /* ── Pagination ──────────────────────────────────────────── */
  currentPage = signal(1);
  readonly pageSize = 5;

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.providers().length / this.pageSize)));

  readonly pagedProviders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.providers().slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  /* ── Row selection ───────────────────────────────────────── */
  selectedRows = signal<Set<string>>(new Set());

  readonly allPageSelected = computed(() => {
    const page = this.pagedProviders();
    const sel = this.selectedRows();
    return page.length > 0 && page.every((p) => sel.has(p.id));
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
      this.pagedProviders().forEach((r) => s.delete(r.id));
      this.selectedRows.set(s);
    } else {
      const s = new Set(this.selectedRows());
      this.pagedProviders().forEach((r) => s.add(r.id));
      this.selectedRows.set(s);
    }
  }

  bulkAction(action: string): void {
    console.log(action, [...this.selectedRows()]);
    this.clearSelection();
  }

  clearSelection(): void { this.selectedRows.set(new Set()); }

  readonly pageStart = computed(() => (this.currentPage() - 1) * this.pageSize + 1);
  readonly pageEnd   = computed(() => Math.min(this.currentPage() * this.pageSize, this.providers().length));

  goToPage(p: number): void {
    this.currentPage.set(Math.min(Math.max(1, p), this.totalPages()));
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  setStatus(st: 'All' | 'Active' | 'Pending' | 'Suspended'): void { this.activeStatus.set(st); }
  setLocation(loc: string): void { this.activeLocation.set(loc); }
  setSort(s: string): void { this.activeSort.set(s); }
  onSearch(value: string): void { this.searchQuery.set(value); this.currentPage.set(1); }
}
