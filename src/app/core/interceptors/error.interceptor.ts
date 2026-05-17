import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * HTTP error interceptor that handles API errors globally.
 * Specifically handles 401 Unauthorized errors by logging out the user
 * and showing an appropriate message.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token is invalid or expired
        authService.logout();
        toastService.showError('Your session has expired. Please sign in again.');
      } else if (error.status === 403) {
        toastService.showError('You do not have permission to perform this action.');
      } else if (error.status === 404) {
        toastService.showError('The requested resource was not found.');
      } else if (error.status === 500) {
        toastService.showError('An unexpected error occurred. Please try again later.');
      }
      return throwError(() => error);
    }),
  );
};
