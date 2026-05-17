import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Unauthorized page displayed when a user tries to access a route
 * they don't have permission for based on their role.
 */
@Component({
  standalone: true,
  selector: 'app-unauthorized',
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
      <div class="text-center max-w-md px-4">
        <div class="mb-6">
          <svg class="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p class="text-gray-600 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div class="flex gap-4 justify-center">
          <button
            (click)="goHome()"
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go Home
          </button>
          <button
            (click)="goToSignIn()"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  `,
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }

  goToSignIn(): void {
    this.router.navigate(['/sign-in']);
  }
}
