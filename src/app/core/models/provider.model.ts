import { User } from './user.model';

export type ProviderType = 'restaurant' | 'hotel' | 'agency' | 'transport';

export type ProviderStatus = 'pending' | 'approved' | 'rejected';

export interface ProviderDocument {
  name: string;
  url: string;
  type: string;
}

export interface Provider {
  id: number;
  user_id: number;
  user?: User;
  provider_type: ProviderType;
  business_name: string;
  description: string;
  documents: ProviderDocument[];
  status: ProviderStatus;
  phone?: string;
  image?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  website?: string;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProvider {
  user_id: number;
  provider_type: ProviderType;
  business_name: string;
  description: string;
  documents: ProviderDocument[];
  phone?: string;
  image?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  website?: string;
}

export type UpdateProvider = Partial<CreateProvider> & {
  status?: ProviderStatus;
};

export interface EnrichedProvider extends Provider {
  user_full_name?: string;
  user_email?: string;
}
