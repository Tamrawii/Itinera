import { User } from './user.model';

export interface AuthResponse {
  access_token: string;
  token_type: 'Bearer';
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: 'tourist' | 'provider';
}
