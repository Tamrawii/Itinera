import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

type Role = 'tourist' | 'provider' | 'admin';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role') as Role | null;
    if (!role) {
      this.router.navigate(['/sign-in']);
      return false;
    }
    const routeMap: Record<Role, string> = {
      tourist: '/tourist',
      provider: '/provider',
      admin: '/admin',
    };
    const currentPath = window.location.pathname;
    const expectedPrefix = `/${role}`;
    if (!currentPath.startsWith(expectedPrefix)) {
      this.router.navigate([routeMap[role]]);
      return false;
    }
    return true;
  }
}
