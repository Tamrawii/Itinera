export interface UserProvider {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  profile_picture: string;
  validation_status: 'pending' | 'approved' | 'rejected';
}
