export interface Hotel {
  id: number;
  provider_id: number;
  name: string;
  rooms_count: number;
  check_in_time: string;
  check_out_time: string;
  amenities: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CreateHotel {
  provider_id: number;
  name: string;
  rooms_count: number;
  check_in_time: string;
  check_out_time: string;
  amenities: string[];
}

export type UpdateHotel = Partial<CreateHotel>;
