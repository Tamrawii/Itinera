export type UserRole = 'tourist' | 'provider' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUser {
  email: string;
  full_name: string;
  role: UserRole;
  password: string;
}

export type UpdateUser = Partial<Omit<CreateUser, 'password'>> & {
  password?: string;
};
