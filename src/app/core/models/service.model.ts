import { Provider } from './provider.model';

export interface ServiceAvailability {
  date: string;
  slots: number;
}

export interface Service {
  id: number;
  provider_id: number;
  provider?: Provider;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  availability: ServiceAvailability[];
  created_at: Date;
  updated_at: Date;
}

export interface CreateService {
  provider_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  availability: ServiceAvailability[];
}

export type UpdateService = Partial<CreateService>;
