export interface Offers {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  price: number;
  suffixPrice?: '/night' | '/day' | '/person';
  discount_percentage: number;
  date_from: Date;
  date_to: Date;
  image_url: string[];
  location: string;
  rating: number;
  number_of_reviews: number;
  tag: string;
  offer_type: 'restaurant' | 'hotel' | 'transportation' | 'activity';
}
