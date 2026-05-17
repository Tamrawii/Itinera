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
  created_at: Date;
  updated_at: Date;
}

export interface CreateProvider {
  user_id: number;
  provider_type: ProviderType;
  business_name: string;
  description: string;
  documents: ProviderDocument[];
}

export type UpdateProvider = Partial<CreateProvider> & {
  status?: ProviderStatus;
};
