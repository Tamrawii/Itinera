import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  DashboardSquare1Outlined,
  BoxClosedOutlined,
  CalendarDaysOutlined,
  Comment1Outlined,
  StarFatOutlined,
  User4Outlined,
  CheckOutlined,
  XOutlined,
} from '@lineiconshq/free-icons';
import { ProviderService } from '../core/services/provider.service';
import { AuthService } from '../core/services/auth.service';

type ProviderUIStatus = 'loading' | 'no-profile' | 'pending' | 'rejected' | 'approved';

@Component({
  selector: 'app-provider-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LineiconsComponent],
  templateUrl: './provider-layout.html',
  styleUrl: './provider-layout.css',
})
export class ProviderLayout implements OnInit {
  readonly DashboardSquare1Outlined = DashboardSquare1Outlined;
  readonly BoxClosedOutlined = BoxClosedOutlined;
  readonly CalendarDaysOutlined = CalendarDaysOutlined;
  readonly Comment1Outlined = Comment1Outlined;
  readonly StarFatOutlined = StarFatOutlined;
  readonly User4Outlined = User4Outlined;
  readonly CheckOutlined = CheckOutlined;
  readonly XOutlined = XOutlined;

  providerStatus = signal<ProviderUIStatus>('loading');
  rejectionReason = signal<string | null>(null);
  providerName = signal<string>('');

  constructor(
    private providerService: ProviderService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/sign-in']);
      return;
    }
    this.providerName.set(user.full_name);

    this.providerService.getMyProvider().subscribe({
      next: (provider) => {
        this.providerStatus.set(provider.status as ProviderUIStatus);
        if (provider.status === 'rejected' && provider.rejection_reason) {
          this.rejectionReason.set(provider.rejection_reason);
        }
      },
      error: () => {
        // No provider profile found — redirect to registration
        this.providerStatus.set('no-profile');
        this.router.navigate(['/provider-registration']);
      },
    });
  }

  getInitials(): string {
    return this.providerName()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
