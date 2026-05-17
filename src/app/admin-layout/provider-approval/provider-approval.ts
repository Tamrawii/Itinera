import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { 
  User4Outlined, 
  Buildings1Outlined, 
  MapMarker5Outlined, 
  Envelope1Outlined, 
  PhoneOutlined,
  CalendarDaysOutlined,
  Search1Outlined,
  CheckOutlined,
  XOutlined,
  EyeOutlined
} from '@lineiconshq/free-icons';
import { ToastService } from '../../core/services/toast.service';

export interface ProviderApplication {
  id: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
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
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
}

export interface ApplicationFilter {
  status: string;
  businessType: string;
  dateRange: {
    start: string;
    end: string;
  };
  searchTerm: string;
}

@Component({
  selector: 'app-provider-approval',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LineiconsComponent
  ],
  providers: [ToastService],
  templateUrl: './provider-approval.html',
  styleUrl: './provider-approval.css'
})
export class ProviderApproval implements OnInit {
  readonly User4Outlined = User4Outlined;
  readonly Buildings1Outlined = Buildings1Outlined;
  readonly MapMarker5Outlined = MapMarker5Outlined;
  readonly Envelope1Outlined = Envelope1Outlined;
  readonly PhoneOutlined = PhoneOutlined;
  readonly CalendarDaysOutlined = CalendarDaysOutlined;
  readonly Search1Outlined = Search1Outlined;
  readonly CheckOutlined = CheckOutlined;
  readonly XOutlined = XOutlined;
  readonly EyeOutlined = EyeOutlined;
  applications: ProviderApplication[] = [];
  filteredApplications: ProviderApplication[] = [];
  selectedApplication: ProviderApplication | null = null;
  isLoading = true;

  filter: ApplicationFilter = {
    status: 'all',
    businessType: 'all',
    dateRange: {
      start: '',
      end: ''
    },
    searchTerm: ''
  };

  showFilters = false;
  showRejectionModal = false;
  rejectionReason = '';
  rejectionApplicationId = '';

  businessTypes = [
    { value: 'tour-guide', label: 'Tour Guide' },
    { value: 'transportation', label: 'Transportation Service' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'restaurant', label: 'Restaurant/Cafe' },
    { value: 'activity', label: 'Activity/Experience' },
    { value: 'shopping', label: 'Shopping/Retail' },
    { value: 'other', label: 'Other' }
  ];

  statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    
    // Simulate API call with mock data
    setTimeout(() => {
      this.applications = this.generateMockApplications();
      this.applyFilters();
      this.isLoading = false;
    }, 1000);
  }

  private generateMockApplications(): ProviderApplication[] {
    return [
      {
        id: '1',
        submittedAt: new Date('2024-01-15'),
        status: 'pending',
        personalInfo: {
          firstName: 'Ahmed',
          lastName: 'Ben Ali',
          email: 'ahmed.benali@example.com',
          phone: '+216 12 345 678',
          dateOfBirth: '1985-06-15'
        },
        businessInfo: {
          businessName: 'Sahara Adventures',
          businessType: 'tour-guide',
          description: 'Specialized desert tours and cultural experiences in southern Tunisia.',
          address: '123 Avenue Habib Bourguiba',
          city: 'Douz',
          postalCode: '4250',
          website: 'https://saharadventures.tn'
        },
        documents: [
          {
            id: 'doc1',
            name: 'business-license.pdf',
            type: 'Business License',
            url: '#',
            uploadedAt: new Date('2024-01-15')
          },
          {
            id: 'doc2',
            name: 'id-card.pdf',
            type: 'Government ID',
            url: '#',
            uploadedAt: new Date('2024-01-15')
          }
        ]
      },
      {
        id: '2',
        submittedAt: new Date('2024-01-14'),
        status: 'under_review',
        personalInfo: {
          firstName: 'Fatima',
          lastName: 'Mansouri',
          email: 'fatima.mansouri@example.com',
          phone: '+216 98 765 432',
          dateOfBirth: '1990-03-22'
        },
        businessInfo: {
          businessName: 'Mediterranean Cuisine',
          businessType: 'restaurant',
          description: 'Authentic Tunisian restaurant with sea views in Sidi Bou Said.',
          address: '45 Rue du Port',
          city: 'Sidi Bou Said',
          postalCode: '2026',
          website: 'https://mediterranean-cuisine.tn'
        },
        documents: [
          {
            id: 'doc3',
            name: 'business-license.pdf',
            type: 'Business License',
            url: '#',
            uploadedAt: new Date('2024-01-14')
          },
          {
            id: 'doc4',
            name: 'id-card.pdf',
            type: 'Government ID',
            url: '#',
            uploadedAt: new Date('2024-01-14')
          },
          {
            id: 'doc5',
            name: 'tax-certificate.pdf',
            type: 'Tax Certificate',
            url: '#',
            uploadedAt: new Date('2024-01-14')
          }
        ],
        reviewedBy: 'Admin User',
        reviewedAt: new Date('2024-01-16')
      },
      {
        id: '3',
        submittedAt: new Date('2024-01-13'),
        status: 'approved',
        personalInfo: {
          firstName: 'Mohamed',
          lastName: 'Khaled',
          email: 'mohamed.khaled@example.com',
          phone: '+216 55 123 789',
          dateOfBirth: '1988-11-10'
        },
        businessInfo: {
          businessName: 'Tunis Transport',
          businessType: 'transportation',
          description: 'Professional transportation services for tourists and locals.',
          address: '78 Avenue de la République',
          city: 'Tunis',
          postalCode: '1000'
        },
        documents: [
          {
            id: 'doc6',
            name: 'business-license.pdf',
            type: 'Business License',
            url: '#',
            uploadedAt: new Date('2024-01-13')
          },
          {
            id: 'doc7',
            name: 'id-card.pdf',
            type: 'Government ID',
            url: '#',
            uploadedAt: new Date('2024-01-13')
          },
          {
            id: 'doc8',
            name: 'insurance.pdf',
            type: 'Insurance Certificate',
            url: '#',
            uploadedAt: new Date('2024-01-13')
          }
        ],
        reviewedBy: 'Admin User',
        reviewedAt: new Date('2024-01-15')
      },
      {
        id: '4',
        submittedAt: new Date('2024-01-12'),
        status: 'rejected',
        personalInfo: {
          firstName: 'Samira',
          lastName: 'Trabelsi',
          email: 'samira.trabelsi@example.com',
          phone: '+216 71 234 567',
          dateOfBirth: '1992-07-18'
        },
        businessInfo: {
          businessName: 'Artisan Crafts',
          businessType: 'shopping',
          description: 'Traditional Tunisian handicrafts and souvenirs.',
          address: '12 Rue de l\'Artisanat',
          city: 'Kairouan',
          postalCode: '3100'
        },
        documents: [
          {
            id: 'doc9',
            name: 'business-license.pdf',
            type: 'Business License',
            url: '#',
            uploadedAt: new Date('2024-01-12')
          }
        ],
        reviewedBy: 'Admin User',
        reviewedAt: new Date('2024-01-14'),
        rejectionReason: 'Incomplete documentation. Missing government ID and tax certificate.'
      }
    ];
  }

  applyFilters(): void {
    this.filteredApplications = this.applications.filter(app => {
      // Status filter
      if (this.filter.status !== 'all' && app.status !== this.filter.status) {
        return false;
      }

      // Business type filter
      if (this.filter.businessType !== 'all' && app.businessInfo.businessType !== this.filter.businessType) {
        return false;
      }

      // Date range filter
      if (this.filter.dateRange.start) {
        const startDate = new Date(this.filter.dateRange.start);
        if (app.submittedAt < startDate) {
          return false;
        }
      }

      if (this.filter.dateRange.end) {
        const endDate = new Date(this.filter.dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (app.submittedAt > endDate) {
          return false;
        }
      }

      // Search filter
      if (this.filter.searchTerm) {
        const searchLower = this.filter.searchTerm.toLowerCase();
        const searchableText = [
          app.personalInfo.firstName,
          app.personalInfo.lastName,
          app.personalInfo.email,
          app.businessInfo.businessName,
          app.businessInfo.city
        ].join(' ').toLowerCase();

        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filter = {
      status: 'all',
      businessType: 'all',
      dateRange: {
        start: '',
        end: ''
      },
      searchTerm: ''
    };
    this.applyFilters();
  }

  selectApplication(application: ProviderApplication): void {
    this.selectedApplication = application;
  }

  closeApplicationDetails(): void {
    this.selectedApplication = null;
  }

  approveApplication(applicationId: string): void {
    const application = this.applications.find(app => app.id === applicationId);
    if (!application) return;

    // Update application status
    application.status = 'approved';
    application.reviewedBy = 'Admin User';
    application.reviewedAt = new Date();

    this.applyFilters();
    this.toastService.showSuccess('Application approved successfully');
    
    if (this.selectedApplication?.id === applicationId) {
      this.selectedApplication = application;
    }
  }

  openRejectionModal(applicationId: string): void {
    this.rejectionApplicationId = applicationId;
    this.rejectionReason = '';
    this.showRejectionModal = true;
  }

  closeRejectionModal(): void {
    this.showRejectionModal = false;
    this.rejectionApplicationId = '';
    this.rejectionReason = '';
  }

  rejectApplication(): void {
    if (!this.rejectionReason.trim()) {
      this.toastService.showError('Please provide a rejection reason');
      return;
    }

    const application = this.applications.find(app => app.id === this.rejectionApplicationId);
    if (!application) return;

    // Update application status
    application.status = 'rejected';
    application.reviewedBy = 'Admin User';
    application.reviewedAt = new Date();
    application.rejectionReason = this.rejectionReason;

    this.applyFilters();
    this.closeRejectionModal();
    this.toastService.showSuccess('Application rejected');
    
    if (this.selectedApplication?.id === this.rejectionApplicationId) {
      this.selectedApplication = application;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'under_review':
        return 'status-review';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'under_review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  }

  getBusinessTypeLabel(type: string): string {
    const businessType = this.businessTypes.find(bt => bt.value === type);
    return businessType ? businessType.label : type;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  viewDocument(documentUrl: string): void {
    window.open(documentUrl, '_blank');
  }

  getApplicationStats(): { [key: string]: number } {
    const stats = {
      total: this.applications.length,
      pending: 0,
      under_review: 0,
      approved: 0,
      rejected: 0
    };

    this.applications.forEach(app => {
      stats[app.status]++;
    });

    return stats;
  }
}
