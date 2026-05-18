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
import { UserTouristService, TouristPreferences } from '../../core/services/user-tourist.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models/user.model';
import { UserTourist } from '../../core/models/user-tourist.model';

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
  touristProfile: UserTourist | null = null;
  loading: boolean = true;
  saving: boolean = false;
  savingPreferences: boolean = false;
  changingPassword: boolean = false;
  
  activeTab: 'profile' | 'password' | 'preferences' = 'profile';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  preferences: TouristPreferences = {
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
    private touristService: UserTouristService,
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
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[+]?[0-9]{10,15}$')]],
      country: ['', [Validators.maxLength(100)]],
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

        this.touristService.getMyTouristProfile().subscribe({
          next: (tourist) => {
            this.touristProfile = tourist;
            this.profileForm.patchValue({
              first_name: tourist.first_name,
              last_name: tourist.last_name,
              email: user.email,
              phone: user.phone || '',
              country: tourist.country || '',
              bio: tourist.bio || ''
            });
          },
          error: () => {
            this.profileForm.patchValue({
              first_name: '',
              last_name: '',
              email: user.email,
              phone: user.phone || '',
              country: '',
              bio: ''
            });
          }
        });

        this.touristService.getMyPreferences().subscribe({
          next: (prefs) => {
            this.preferences = prefs;
          }
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.toastService.showError('Failed to load profile');
        this.loading = false;
      }
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
    const fullName = `${formData.first_name} ${formData.last_name}`.trim();

    let completed = 0;
    let hasError = false;

    const maybeDone = () => {
      completed++;
      if (completed === 2) {
        if (!hasError) {
          this.toastService.showSuccess('Profile updated successfully!');
        }
        this.saving = false;
      }
    };

    this.touristService.updateMyTouristProfile({
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      country: formData.country,
      bio: formData.bio
    }).subscribe({
      next: (updatedTourist) => {
        this.touristProfile = updatedTourist;
        maybeDone();
      },
      error: (err) => {
        console.error('Error updating tourist profile:', err);
        hasError = true;
        this.toastService.showError('Failed to save tourist details');
        maybeDone();
      }
    });

    this.userService.updateMyProfile({
      full_name: fullName,
      email: formData.email,
      phone: formData.phone
    } as any).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        maybeDone();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        hasError = true;
        this.toastService.showError('Failed to update profile');
        maybeDone();
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
        this.toastService.showError(error?.message || 'Failed to change password');
        this.changingPassword = false;
      }
    });
  }

  savePreferences(): void {
    this.savingPreferences = true;

    this.touristService.updateMyPreferences(this.preferences).subscribe({
      next: (updated) => {
        this.preferences = updated;
        this.toastService.showSuccess('Preferences saved successfully!');
        this.savingPreferences = false;
      },
      error: (error) => {
        console.error('Error saving preferences:', error);
        this.toastService.showError('Failed to save preferences');
        this.savingPreferences = false;
      }
    });
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