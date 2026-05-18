export interface UserTourist {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  profile_picture: string;
  bio?: string;
  saved_offers: number[];
}
