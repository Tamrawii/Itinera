import { Itinerary, CreateItinerary } from './itinerary.model';

export interface Tour {
  id: number;
  provider_id: number;
  name: string;
  duration: number;
  itinerary: Itinerary[];
  max_participants: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTour {
  provider_id: number;
  name: string;
  duration: number;
  itinerary: Omit<CreateItinerary, 'tour_id'>[];
  max_participants: number;
}

export type UpdateTour = Partial<CreateTour>;
