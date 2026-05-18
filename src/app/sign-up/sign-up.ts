import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

@Component({
  selector: 'app-sign-up',
  imports: [LineiconsComponent, RouterLink, FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
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
  fullName = '';
  email = '';
  password = '';
  role: 'tourist' | 'provider' = 'tourist';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .register({
        full_name: this.fullName,
        email: this.email,
        password: this.password,
        role: this.role,
      })
      .subscribe({
        next: (response) => {
          if (this.role === 'provider') {
            this.router.navigate(['/provider-registration']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.errorMessage = err?.message || 'Registration failed';
          this.loading = false;
        },
      });
  }
}
