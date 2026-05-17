import { Service } from './service.model';

export interface Wishlist {
  id: number;
  tourist_id: number;
  service_id: number;
  service?: Service;
  created_at: Date;
}

export interface CreateWishlist {
  tourist_id: number;
  service_id: number;
}

export type UpdateWishlist = Partial<CreateWishlist>;
