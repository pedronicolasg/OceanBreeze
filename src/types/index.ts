export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  amenities: string[];
  maxGuests: number;
  size: number;
}

export interface User {
  username: string;
  isAdmin: boolean;
}

export type View = 'public' | 'login' | 'admin';