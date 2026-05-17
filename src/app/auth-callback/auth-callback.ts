import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/services/auth.service';
import { AuthResponse } from '../core/models';

/**
 * OAuth callback component that handles the redirect from Supabase after
 * a social provider (Google, Facebook, X) authentication.
 * Exchanges the authorization code for a session and redirects to the app.
 */
@Component({
  standalone: true,
  selector: 'app-auth-callback',
  template: `
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-lg">Completing sign-in...</p>
      </div>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error) {
      this.router.navigate(['/sign-in'], { queryParams: { error: 'oauth_failed' } });
      return;
    }

    if (code) {
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/oauth-callback`, { code })
        .subscribe({
          next: (response) => {
            this.authService.saveToken(response.access_token, response.user);
            // Redirect based on user role
            const user = response.user;
            if (user.role === 'tourist') {
              this.router.navigate(['/tourist']);
            } else if (user.role === 'provider') {
              this.router.navigate(['/provider']);
            } else if (user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          },
          error: () => {
            this.router.navigate(['/sign-in'], { queryParams: { error: 'oauth_failed' } });
          },
        });
    } else {
      this.router.navigate(['/sign-in']);
    }
  }
}
