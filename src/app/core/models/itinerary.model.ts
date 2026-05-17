export interface Itinerary {
  id: number;
  tour_id: number;
  day_number: number;
  description: string;
  location: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateItinerary {
  tour_id: number;
  day_number: number;
  description: string;
  location: string;
}

export type UpdateItinerary = Partial<CreateItinerary>;
