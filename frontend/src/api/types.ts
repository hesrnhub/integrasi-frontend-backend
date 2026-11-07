// Tipe data yang cocok dengan respons backend (lihat StallResponseDto & AuthUserDto).
export type Role = 'admin' | 'owner' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Stall {
  id: number;
  ownerId: number;
  name: string;
  category: string | null;
  location: string | null;
  description: string | null;
  avgRating: number;
  reviewCount: number;
  isPopular: boolean;
}

// Payload create/update. Backend memakai .strict(), jadi jangan kirim field lain.
export interface StallInput {
  name: string;
  category?: string;
  location?: string;
  description?: string;
}

export interface StallQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

export interface LoginResult {
  token: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: User;
}
