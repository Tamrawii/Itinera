import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Functional route guard that checks the current user's role against
 * an allowed list declared in route data: `{ roles: string[] }`.
 * Redirects to /sign-in if not authenticated, or /unauthorized if wrong role.
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[] | undefined;
  if (!allowedRoles?.length) return true;

  const user = authService.getCurrentUser();
  if (!user) {
    router.navigate(['/sign-in']);
    return false;
  }

  if (allowedRoles.includes(user.role)) return true;

  router.navigate(['/unauthorized']);
  return false;
};
