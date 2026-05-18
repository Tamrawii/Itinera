import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  CalendarDaysOutlined,
  MapMarker5Outlined,
  Search1Outlined,
} from '@lineiconshq/free-icons';

import { BookingService } from '../../core/services/booking.service';
import { ServiceService } from '../../core/services/service.service';
import { ToastService } from '../../core/services/toast.service';
import { Booking, BookingStatus, Service } from '../../core/models';

type FilterStatus = 'All' | BookingStatus;

interface EnrichedBooking extends Booking {
  serviceName: string;
  serviceImage: string;
  serviceLocation: string;
  serviceCategory: string;
}

@Component({
  selector: 'app-tourist-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LineiconsComponent],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class TouristBookings implements OnInit {
  readonly CalendarDaysOutlined = CalendarDaysOutlined;
  readonly MapMarker5Outlined = MapMarker5Outlined;
  readonly Search1Outlined = Search1Outlined;

  readonly statuses: FilterStatus[] = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];

  loading = signal(true);
  searchQuery = signal('');
  activeStatus = signal<FilterStatus>('All');
  currentPage = signal(1);
  readonly pageSize = 6;

  readonly allBookings = signal<EnrichedBooking[]>([]);

  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.activeStatus();
    let list = this.allBookings();
    if (st !== 'All') list = list.filter((b) => b.status === st);
    if (q) {
      list = list.filter(
        (b) =>
          b.serviceName.toLowerCase().includes(q) ||
          String(b.id).includes(q),
      );
    }
    return list;
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));

  readonly paged = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  readonly stats = computed(() => {
    const all = this.allBookings();
    return {
      total: all.length,
      upcoming: all.filter((b) => b.status === 'confirmed' || b.status === 'pending').length,
      completed: all.filter((b) => b.status === 'completed').length,
      cancelled: all.filter((b) => b.status === 'cancelled').length,
    };
  });

  constructor(
    private bookingService: BookingService,
    private serviceService: ServiceService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.bookingService.getMyBookings().subscribe({
      next: (res) => {
        this.enrichBookings(res.data);
      },
      error: () => {
        this.toastService.showError('Failed to load bookings');
        this.loading.set(false);
      },
    });
  }

  private enrichBookings(bookings: Booking[]): void {
    if (bookings.length === 0) {
      this.allBookings.set([]);
      this.loading.set(false);
      return;
    }

    const serviceIds = [...new Set(bookings.map((b) => b.service_id))];
    let loaded = 0;
    const serviceMap = new Map<number, Service>();

    serviceIds.forEach((sid) => {
      this.serviceService.getById(sid).subscribe({
        next: (svc) => {
          serviceMap.set(sid, svc);
          loaded++;
          if (loaded === serviceIds.length) {
            this.buildEnriched(bookings, serviceMap);
          }
        },
        error: () => {
          loaded++;
          if (loaded === serviceIds.length) {
            this.buildEnriched(bookings, serviceMap);
          }
        },
      });
    });
  }

  private buildEnriched(bookings: Booking[], map: Map<number, Service>): void {
    const enriched: EnrichedBooking[] = bookings.map((b) => {
      const svc = map.get(b.service_id);
      return {
        ...b,
        serviceName: svc?.name ?? `Service #${b.service_id}`,
        serviceImage: svc?.images?.[0] ?? '/images/placeholder-service.jpg',
        serviceLocation: svc?.location ?? '—',
        serviceCategory: svc?.category ?? '—',
      };
    });
    this.allBookings.set(enriched);
    this.loading.set(false);
  }

  setStatus(s: FilterStatus): void {
    this.activeStatus.set(s);
    this.currentPage.set(1);
  }

  onSearch(v: string): void {
    this.searchQuery.set(v);
    this.currentPage.set(1);
  }

  goToPage(p: number): void {
    this.currentPage.set(Math.min(Math.max(1, p), this.totalPages()));
  }

  cancelBooking(id: number): void {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    this.bookingService.cancel(id).subscribe({
      next: (updated) => {
        this.allBookings.update((list) =>
          list.map((b) => (b.id === id ? { ...b, status: updated.status } : b)),
        );
        this.toastService.showSuccess('Booking cancelled');
      },
      error: () => this.toastService.showError('Failed to cancel booking'),
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      confirmed: 'status-confirmed',
      pending: 'status-pending',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };
    return map[status] ?? '';
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
