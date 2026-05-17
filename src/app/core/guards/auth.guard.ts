import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Functional route guard that redirects unauthenticated users to /sign-in.
 * Passes the intended URL as returnUrl query parameter for post-login redirect.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) return true;
  router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } });
  return false;
};
