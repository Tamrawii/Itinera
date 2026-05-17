import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { 
  User4Outlined, 
  Envelope1Outlined, 
  PhoneOutlined, 
  MapMarker5Outlined,
  CalendarDaysOutlined,
  HeartOutlined,
  EyeOutlined,
  EyeSolid
} from '@lineiconshq/free-icons';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models/user.model';

export interface ProfileFormData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
}

export interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

@Component({
  selector: 'app-tourist-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LineiconsComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class TouristProfile implements OnInit {
  readonly User4Outlined = User4Outlined;
  readonly Envelope1Outlined = Envelope1Outlined;
  readonly PhoneOutlined = PhoneOutlined;
  readonly MapMarker5Outlined = MapMarker5Outlined;
  readonly CalendarDaysOutlined = CalendarDaysOutlined;
  readonly HeartOutlined = HeartOutlined;
  readonly EyeOutlined = EyeOutlined;
  readonly EyeSolid = EyeSolid;

  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  user: User | null = null;
  loading: boolean = true;
  saving: boolean = false;
  changingPassword: boolean = false;
  
  activeTab: 'profile' | 'password' | 'preferences' = 'profile';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Mock preferences
  preferences = {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    language: 'en',
    currency: 'USD',
    timezone: 'UTC'
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.profileForm = this.createProfileForm();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private createProfileForm(): FormGroup {
    return this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[+]?[0-9]{10,15}$')]],
      location: ['', [Validators.maxLength(200)]],
      bio: ['', [Validators.maxLength(500)]]
    });
  }

  private createPasswordForm(): FormGroup {
    return this.fb.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const new_password = form.get('new_password')?.value;
    const confirm_password = form.get('confirm_password')?.value;
    
    return new_password === confirm_password ? null : { passwordMismatch: true };
  }

  loadUserProfile(): void {
    this.loading = true;
    this.userService.getMyProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          full_name: user.full_name,
          email: user.email,
          phone: user.phone || '',
          location: '',
          bio: ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.toastService.showError('Failed to load profile');
        this.loading = false;
        // Load mock data for demo
        this.loadMockProfile();
      }
    });
  }

  private loadMockProfile(): void {
    this.user = {
      id: 1,
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'tourist',
      phone: '+1234567890',
      created_at: new Date('2024-01-01'),
      updated_at: new Date()
    };
    
    this.profileForm.patchValue({
      full_name: this.user.full_name,
      email: this.user.email,
      phone: this.user.phone || '',
      location: 'New York, USA',
      bio: 'Travel enthusiast who loves exploring new destinations and cultures.'
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      this.toastService.showError('Please fix the errors in the form');
      return;
    }

    this.saving = true;
    const formData = this.profileForm.value;

    this.userService.updateMyProfile(formData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.toastService.showSuccess('Profile updated successfully!');
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.toastService.showError('Failed to update profile');
        this.saving = false;
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      this.toastService.showError('Please fix the errors in the form');
      return;
    }

    this.changingPassword = true;
    const formData = this.passwordForm.value;

    this.userService.changePassword({
      current_password: formData.current_password,
      new_password: formData.new_password
    }).subscribe({
      next: () => {
        this.toastService.showSuccess('Password changed successfully!');
        this.passwordForm.reset();
        this.changingPassword = false;
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.toastService.showError('Failed to change password');
        this.changingPassword = false;
      }
    });
  }

  savePreferences(): void {
    // Mock implementation - would connect to preferences service
    this.toastService.showSuccess('Preferences saved successfully!');
  }

  switchTab(tab: 'profile' | 'password' | 'preferences'): void {
    this.activeTab = tab;
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;
    
    if (errors['required']) {
      return 'This field is required';
    }
    
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    
    if (errors['minlength']) {
      return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    }
    
    if (errors['maxlength']) {
      return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    }
    
    if (errors['pattern']) {
      return 'Please enter a valid phone number';
    }
    
    if (errors['passwordMismatch']) {
      return 'Passwords do not match';
    }
    
    return 'Invalid input';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getAccountAge(): string {
    if (!this.user) return '';
    
    const created = new Date(this.user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months`;
    } else {
      return `${Math.floor(diffDays / 365)} years`;
    }
  }
}
