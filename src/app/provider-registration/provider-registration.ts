import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { 
  User4Outlined, 
  Buildings1Outlined, 
  MapMarker5Outlined, 
  PhoneOutlined, 
  Envelope1Outlined, 
  Search1Outlined,
  CheckOutlined,
  XOutlined
} from '@lineiconshq/free-icons';
import { DocumentUpload, UploadedFile, DocumentType } from '../shared/document-upload/document-upload';
import { ToastService } from '../core/services/toast.service';

interface ProviderRegistrationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  businessInfo: {
    businessName: string;
    businessType: string;
    description: string;
    address: string;
    city: string;
    postalCode: string;
    website?: string;
  };
  documents: UploadedFile[];
}

@Component({
  selector: 'app-provider-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LineiconsComponent,
    DocumentUpload
  ],
  providers: [ToastService],
  templateUrl: './provider-registration.html',
  styleUrl: './provider-registration.css'
})
export class ProviderRegistration implements OnInit {
  readonly User4Outlined = User4Outlined;
  readonly Buildings1Outlined = Buildings1Outlined;
  readonly MapMarker5Outlined = MapMarker5Outlined;
  readonly Search1Outlined = Search1Outlined;
  readonly Envelope1Outlined = Envelope1Outlined;
  readonly XOutlined = XOutlined;
  readonly CheckOutlined = CheckOutlined;

  registrationForm: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  isSubmitting = false;

  documentTypes: DocumentType[] = [
    {
      id: 'business-license',
      name: 'Business License',
      description: 'Valid business registration document',
      required: true,
      acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
      maxSize: 10
    },
    {
      id: 'id-document',
      name: 'Government ID',
      description: 'National ID card or passport',
      required: true,
      acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
      maxSize: 5
    },
    {
      id: 'tax-certificate',
      name: 'Tax Certificate',
      description: 'Tax registration certificate',
      required: false,
      acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
      maxSize: 5
    },
    {
      id: 'insurance',
      name: 'Insurance Certificate',
      description: 'Business liability insurance',
      required: false,
      acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
      maxSize: 5
    }
  ];

  businessTypes = [
    { value: 'tour-guide', label: 'Tour Guide' },
    { value: 'transportation', label: 'Transportation Service' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'restaurant', label: 'Restaurant/Cafe' },
    { value: 'activity', label: 'Activity/Experience' },
    { value: 'shopping', label: 'Shopping/Retail' },
    { value: 'other', label: 'Other' }
  ];

  uploadedDocuments: UploadedFile[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registrationForm = this.createForm();
  }

  ngOnInit(): void {
    // Initialize form
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s\-\(\)]+$/)]],
      dateOfBirth: ['', [Validators.required]],
      
      // Business Information
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      businessType: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      website: ['', [Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)]]
    });
  }

  get personalInfoControls() {
    return {
      firstName: this.registrationForm.get('firstName'),
      lastName: this.registrationForm.get('lastName'),
      email: this.registrationForm.get('email'),
      phone: this.registrationForm.get('phone'),
      dateOfBirth: this.registrationForm.get('dateOfBirth')
    };
  }

  get businessInfoControls() {
    return {
      businessName: this.registrationForm.get('businessName'),
      businessType: this.registrationForm.get('businessType'),
      description: this.registrationForm.get('description'),
      address: this.registrationForm.get('address'),
      city: this.registrationForm.get('city'),
      postalCode: this.registrationForm.get('postalCode'),
      website: this.registrationForm.get('website')
    };
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        // Validate personal information
        const personalFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'];
        return this.validateFields(personalFields);
      
      case 2:
        // Validate business information
        const businessFields = ['businessName', 'businessType', 'description', 'address', 'city', 'postalCode'];
        return this.validateFields(businessFields);
      
      case 3:
        // Validate documents
        const requiredDocs = this.documentTypes.filter(doc => doc.required);
        const hasRequiredDocs = requiredDocs.every(doc => 
          this.uploadedDocuments.some(uploaded => 
            uploaded.name.toLowerCase().includes(doc.name.toLowerCase().replace(' ', ''))
          )
        );
        
        if (!hasRequiredDocs) {
          this.toastService.showError('Please upload all required documents');
          return false;
        }
        
        return true;
      
      default:
        return false;
    }
  }

  private validateFields(fields: string[]): boolean {
    let isValid = true;
    
    fields.forEach(field => {
      const control = this.registrationForm.get(field);
      if (control) {
        control.markAsTouched();
        if (control.invalid) {
          isValid = false;
        }
      }
    });
    
    if (!isValid) {
      this.toastService.showError('Please fill in all required fields correctly');
    }
    
    return isValid;
  }

  onDocumentsUploaded(files: UploadedFile[]): void {
    this.uploadedDocuments = files;
  }

  onDocumentRemoved(file: UploadedFile): void {
    this.uploadedDocuments = this.uploadedDocuments.filter(f => f.id !== file.id);
  }

  getStepTitle(): string {
    switch (this.currentStep) {
      case 1:
        return 'Personal Information';
      case 2:
        return 'Business Information';
      case 3:
        return 'Document Upload';
      default:
        return '';
    }
  }

  getStepDescription(): string {
    switch (this.currentStep) {
      case 1:
        return 'Tell us about yourself';
      case 2:
        return 'Provide details about your business';
      case 3:
        return 'Upload required verification documents';
      default:
        return '';
    }
  }

  submitRegistration(): void {
    if (!this.validateCurrentStep()) {
      return;
    }

    this.isSubmitting = true;

    const registrationData: ProviderRegistrationData = {
      personalInfo: {
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
        email: this.registrationForm.value.email,
        phone: this.registrationForm.value.phone,
        dateOfBirth: this.registrationForm.value.dateOfBirth
      },
      businessInfo: {
        businessName: this.registrationForm.value.businessName,
        businessType: this.registrationForm.value.businessType,
        description: this.registrationForm.value.description,
        address: this.registrationForm.value.address,
        city: this.registrationForm.value.city,
        postalCode: this.registrationForm.value.postalCode,
        website: this.registrationForm.value.website
      },
      documents: this.uploadedDocuments
    };

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.toastService.showSuccess('Registration submitted successfully! We will review your application within 3-5 business days.');
      this.router.navigate(['/registration-success']);
    }, 2000);
  }

  getErrorMessage(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    
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
      if (controlName === 'phone') {
        return 'Please enter a valid phone number';
      }
      if (controlName === 'website') {
        return 'Please enter a valid website URL';
      }
      return 'Invalid format';
    }
    
    return 'Invalid input';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
}
