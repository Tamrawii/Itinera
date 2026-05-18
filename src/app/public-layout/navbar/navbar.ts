import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  dropdownOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get user(): User | null {
    return this.authService.getCurrentUser();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
  }

  getDashboardLink(): string {
    switch (this.user?.role) {
      case 'admin':
        return '/admin/overview';
      case 'provider':
        return '/provider/dashboard';
      default:
        return '/tourist/dashboard';
    }
  }

  getProfileLink(): string {
    switch (this.user?.role) {
      case 'admin':
        return '/admin/overview';
      case 'provider':
        return '/provider/profile-settings';
      default:
        return '/tourist/profile';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-user-wrapper]')) {
      this.closeDropdown();
    }
  }
}