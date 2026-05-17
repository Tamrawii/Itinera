import { User } from './user.model';
import { Service } from './service.model';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: number;
  tourist_id: number;
  tourist?: User;
  service_id: number;
  service?: Service;
  booking_date: Date;
  status: BookingStatus;
  total_price: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBooking {
  tourist_id: number;
  service_id: number;
  booking_date: Date;
  total_price: number;
}

export type UpdateBooking = Partial<CreateBooking> & {
  status?: BookingStatus;
};
