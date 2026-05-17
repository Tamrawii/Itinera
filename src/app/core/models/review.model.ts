import { User } from './user.model';
import { Service } from './service.model';

export interface Review {
  id: number;
  tourist_id: number;
  tourist?: User;
  service_id: number;
  service?: Service;
  rating: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateReview {
  tourist_id: number;
  service_id: number;
  rating: number;
  comment: string;
}

export type UpdateReview = Partial<Pick<CreateReview, 'rating' | 'comment'>>;
