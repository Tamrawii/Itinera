import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { LoginRequest } from '../core/models';
import {
  AppleBrandOutlined,
  Envelope1Outlined,
  EyeOutlined,
  EyeSolid,
  GoogleOutlined,
  Locked1Outlined,
  MapMarker5Outlined,
  User4Outlined,
  Bolt3Solid,
} from '@lineiconshq/free-icons';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, LineiconsComponent, RouterLink, FormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn implements OnInit {
  AppleBrandOutlined = AppleBrandOutlined;
  Envelope1Outlined = Envelope1Outlined;
  EyeOutlined = EyeOutlined;
  EyeSolid = EyeSolid;
  GoogleOutlined = GoogleOutlined;
  Locked1Outlined = Locked1Outlined;
  MapMarker5Outlined = MapMarker5Outlined;
  User2Outlined = User4Outlined;
  Bolt3Solid = Bolt3Solid;

  showPassword = false;
  returnUrl: string | null = null;
  oauthError: string | null = null;
  isLoading = false;

  credentials: LoginRequest = {
    email: '',
    password: '',
  };

  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    // Get return URL from query params
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    // Check for OAuth error
    this.oauthError = this.route.snapshot.queryParamMap.get('error');
    if (this.oauthError) {
      this.toastService.showError('Sign in failed. Please try again.');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Redirects to the stored returnUrl or default route based on user role.
   */
  navigateAfterLogin(): void {
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      const user = this.authService.getCurrentUser();
      if (user?.role === 'tourist') {
        this.router.navigate(['/tourist']);
      } else if (user?.role === 'provider') {
        this.router.navigate(['/provider']);
      } else if (user?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  /**
   * Initiates OAuth sign-in with the specified provider.
   */
  async signInWithOAuth(provider: 'google' | 'facebook' | 'twitter'): Promise<void> {
    try {
      await this.authService.signInWithOAuth(provider);
    } catch (error) {
      this.toastService.showError('Failed to initiate sign in. Please try again.');
    }
  }

  /**
   * Handles email/password form submission.
   */
  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.toastService.showError('Please enter both email and password.');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authService.saveToken(response.access_token, response.user);
        this.toastService.showSuccess('Signed in successfully!');
        this.navigateAfterLogin();
      },
      error: (error) => {
        this.isLoading = false;
        const message = error.error?.message || 'Invalid email or password.';
        this.toastService.showError(message);
      },
    });
  }
}
