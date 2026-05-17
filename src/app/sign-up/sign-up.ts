import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
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
import { RegisterRequest } from '../core/models';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, LineiconsComponent, RouterLink, FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp implements OnInit {
  AppleBrandOutlined = AppleBrandOutlined;
  Envelope1Outlined = Envelope1Outlined;
  EyeOutlined = EyeOutlined;
  EyeSolid = EyeSolid;
  GoogleOutlined = GoogleOutlined;
  Locked1Outlined = Locked1Outlined;
  MapMarker5Outlined = MapMarker5Outlined;
  User4Outlined = User4Outlined;
  Bolt3Solid = Bolt3Solid;

  showPassword = false;
  isLoading = false;
  oauthError: string | null = null;

  credentials: RegisterRequest = {
    email: '',
    password: '',
    full_name: '',
    role: 'tourist',
  };

  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    // Check for OAuth error
    this.oauthError = this.route.snapshot.queryParamMap.get('error');
    if (this.oauthError) {
      this.toastService.showError('Sign up failed. Please try again.');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Initiates OAuth sign-in/sign-up with a social provider.
   * Supabase handles both login and registration automatically.
   */
  async signInWithOAuth(provider: 'google' | 'facebook' | 'twitter'): Promise<void> {
    try {
      await this.authService.signInWithOAuth(provider);
    } catch (error) {
      this.toastService.showError('Failed to initiate sign up. Please try again.');
    }
  }

  /**
   * Handles email/password form submission for registration.
   */
  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password || !this.credentials.full_name) {
      this.toastService.showError('Please fill in all fields.');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authService.saveToken(response.access_token, response.user);
        this.toastService.showSuccess('Account created successfully!');
        // Redirect based on role
        const user = response.user;
        if (user.role === 'provider') {
          this.router.navigate(['/provider']);
        } else {
          this.router.navigate(['/tourist']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        const message = error.error?.message || 'Failed to create account. Please try again.';
        this.toastService.showError(message);
      },
    });
  }
}
