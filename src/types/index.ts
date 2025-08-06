export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  profilePhoto?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  amenities: string[];
  createdAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  roomId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

export interface BookingContextType {
  rooms: Room[];
  reservations: Reservation[];
  reviews: Review[];
  searchDates: {
    checkIn: string;
    checkOut: string;
  };
  setSearchDates: (dates: { checkIn: string; checkOut: string }) => void;
  getAvailableRooms: (checkIn: string, checkOut: string) => Room[];
  createReservation: (roomId: string, checkIn: string, checkOut: string) => Promise<boolean>;
  addReview: (roomId: string, rating: number, comment: string) => Promise<boolean>;
  getRoomReviews: (roomId: string) => Review[];
  getRoomAverageRating: (roomId: string) => number;
  addRoom: (room: Omit<Room, 'id' | 'createdAt'>) => Promise<boolean>;
  updateRoom: (id: string, room: Partial<Room>) => Promise<boolean>;
  deleteRoom: (id: string) => Promise<boolean>;
}