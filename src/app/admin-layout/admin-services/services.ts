import { AfterViewInit, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

interface AdminServiceRow {
  name: string;
  category: string;
  location: string;
  rating: string;
  price: string;
  bookings: number;
  status: 'Active' | 'Draft';
}

@Component({
  selector: 'app-services',
  imports: [FormsModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements AfterViewInit {
  readonly categories = ['All', 'Hotel', 'Restaurant', 'Tour', 'Activity'];
  readonly statuses: Array<'All' | 'Active' | 'Draft'> = ['All', 'Active', 'Draft'];
  readonly sortOptions = ['Name (A–Z)', 'Name (Z–A)', 'Price (Low–High)', 'Price (High–Low)', 'Bookings'];

  searchQuery = signal('');
  activeCategory = signal('All');
  activeStatus = signal<'All' | 'Active' | 'Draft'>('All');
  activeSort = signal('Name (A–Z)');

  private readonly _allServices: AdminServiceRow[] = [
    {
      name: 'Dar El Medina',
      category: 'Hotel',
      location: 'Tunis Medina',
      rating: '4.8',
      price: '$85',
      bookings: 42,
      status: 'Active',
    },
    {
      name: 'Le Pirate',
      category: 'Restaurant',
      location: 'Sidi Bou Said',
      rating: '4.6',
      price: '$35',
      bookings: 28,
      status: 'Active',
    },
    {
      name: 'Sahara Desert Trek',
      category: 'Tour',
      location: 'Douz, Tozeur',
      rating: '4.9',
      price: '$120',
      bookings: 89,
      status: 'Active',
    },
    {
      name: 'Medina Walking Tour',
      category: 'Activity',
      location: 'Tunis',
      rating: '4.7',
      price: '$25',
      bookings: 63,
      status: 'Active',
    },
    {
      name: 'Riad Sidi Bou Said',
      category: 'Hotel',
      location: 'Sidi Bou Said',
      rating: '4.5',
      price: '$110',
      bookings: 0,
      status: 'Draft',
    },
    {
      name: 'Cafe des Nattes',
      category: 'Restaurant',
      location: 'Sidi Bou Said',
      rating: '4.3',
      price: '$15',
      bookings: 15,
      status: 'Active',
    },
  ];

  readonly services = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.activeCategory();
    const st = this.activeStatus();
    const sort = this.activeSort();

    let list = this._allServices.filter((s) => {
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q);
      const matchesCat = cat === 'All' || s.category === cat;
      const matchesSt = st === 'All' || s.status === st;
      return matchesSearch && matchesCat && matchesSt;
    });

    switch (sort) {
      case 'Name (A–Z)':        list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'Name (Z–A)':        list = [...list].sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'Price (Low–High)':  list = [...list].sort((a, b) => parseFloat(a.price.replace('$','')) - parseFloat(b.price.replace('$',''))); break;
      case 'Price (High–Low)':  list = [...list].sort((a, b) => parseFloat(b.price.replace('$','')) - parseFloat(a.price.replace('$',''))); break;
      case 'Bookings':          list = [...list].sort((a, b) => b.bookings - a.bookings); break;
    }
    return list;
  });

  readonly totalFiltered = computed(() => this.services().length);

  /* ── Pagination ──────────────────────────────────────────── */
  currentPage = signal(1);
  readonly pageSize = 5;

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.services().length / this.pageSize)));

  readonly pagedServices = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.services().slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  /* ── Row selection ───────────────────────────────────────── */
  selectedRows = signal<Set<string>>(new Set());

  readonly allPageSelected = computed(() => {
    const page = this.pagedServices();
    const sel = this.selectedRows();
    return page.length > 0 && page.every((s) => sel.has(s.name));
  });

  readonly selectedCount = computed(() => this.selectedRows().size);

  toggleRow(name: string): void {
    const s = new Set(this.selectedRows());
    s.has(name) ? s.delete(name) : s.add(name);
    this.selectedRows.set(s);
  }

  toggleAll(): void {
    if (this.allPageSelected()) {
      const s = new Set(this.selectedRows());
      this.pagedServices().forEach((r) => s.delete(r.name));
      this.selectedRows.set(s);
    } else {
      const s = new Set(this.selectedRows());
      this.pagedServices().forEach((r) => s.add(r.name));
      this.selectedRows.set(s);
    }
  }

  bulkAction(action: string): void {
    console.log(action, [...this.selectedRows()]);
    this.clearSelection();
  }

  clearSelection(): void { this.selectedRows.set(new Set()); }

  readonly pageStart = computed(() => (this.currentPage() - 1) * this.pageSize + 1);
  readonly pageEnd   = computed(() => Math.min(this.currentPage() * this.pageSize, this.services().length));

  goToPage(p: number): void {
    this.currentPage.set(Math.min(Math.max(1, p), this.totalPages()));
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  setCategory(cat: string): void { this.activeCategory.set(cat); }
  setStatus(st: 'All' | 'Active' | 'Draft'): void { this.activeStatus.set(st); }
  setSort(s: string): void { this.activeSort.set(s); }
  onSearch(value: string): void { this.searchQuery.set(value); this.currentPage.set(1); }
}
