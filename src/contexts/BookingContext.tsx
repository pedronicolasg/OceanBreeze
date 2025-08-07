import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, Reservation, Review, BookingContextType } from '../types';

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking deve ser usado dentro de um BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

const initialRooms: Room[] = [
  {
    id: '1',
    name: 'Suíte Oceano',
    description: 'Uma luxuosa suíte com vista panorâmica para o oceano. Inclui varanda privativa, banheira de hidromassagem e decoração elegante.',
    price: 450,
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Frigobar', 'Vista para o Mar', 'Varanda'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Quarto Deluxe',
    description: 'Quarto espaçoso e confortável com todas as comodidades modernas. Perfeito para uma estadia relaxante.',
    price: 280,
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Frigobar', 'Cofre'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Quarto Standard',
    description: 'Quarto aconchegante e bem equipado, ideal para viajantes que buscam conforto e bom custo-benefício.',
    price: 180,
    image: 'https://images.pexels.com/photos/775219/pexels-photo-775219.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Suíte Romântica',
    description: 'Perfeita para casais, com iluminação suave, banheira para dois e vista para o pôr do sol.',
    price: 380,
    image: 'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Banheira', 'Varanda'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Quarto Família',
    description: 'Amplo espaço com camas extras e estrutura ideal para famílias com crianças.',
    price: 320,
    image: 'https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Berço', 'Frigobar'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Suíte Executiva',
    description: 'Design moderno e confortável, ideal para viagens de negócios com área de trabalho.',
    price: 400,
    image: 'https://images.pexels.com/photos/373892/pexels-photo-373892.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Mesa de Trabalho', 'Cofre'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Cabana Rústica',
    description: 'Hospede-se em uma charmosa cabana de madeira em meio à natureza.',
    price: 260,
    image: 'https://images.pexels.com/photos/271634/pexels-photo-271634.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'Lareira', 'Varanda', 'Frigobar'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Quarto Panorâmico',
    description: 'Vista deslumbrante da cidade em um quarto com janelas amplas e decoração minimalista.',
    price: 370,
    image: 'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Vista para a Cidade'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Loft Urbano',
    description: 'Acomodação moderna com conceito aberto e decoração industrial, no centro da cidade.',
    price: 410,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'TV', 'Cozinha Compacta', 'Ar Condicionado'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '13',
    name: 'Quarto Pet Friendly',
    description: 'Espaço ideal para quem viaja com seu pet, com comodidades adaptadas para animais de estimação.',
    price: 250,
    image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Espaço Pet'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '14',
    name: 'Suíte Zen',
    description: 'Ambiente tranquilo com decoração inspirada no estilo oriental, ideal para relaxar e meditar.',
    price: 340,
    image: 'https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Tatame', 'Jardim Interno'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '15',
    name: 'Apartamento Studio',
    description: 'Studio completo com cozinha, ideal para estadias longas ou viagens de trabalho.',
    price: 290,
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: ['Wi-Fi', 'Cozinha Completa', 'Ar Condicionado', 'TV'],
    createdAt: new Date().toISOString(),
  },
];


export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchDates, setSearchDates] = useState({
    checkIn: '',
    checkOut: '',
  });

  useEffect(() => {
    const savedRooms = localStorage.getItem('oceanbreeze_rooms');
    const savedReservations = localStorage.getItem('oceanbreeze_reservations');
    const savedReviews = localStorage.getItem('oceanbreeze_reviews');

    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    } else {
      setRooms(initialRooms);
      localStorage.setItem('oceanbreeze_rooms', JSON.stringify(initialRooms));
    }

    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }

    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  const getAvailableRooms = (checkIn: string, checkOut: string): Room[] => {
    if (!checkIn || !checkOut) return rooms;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    return rooms.filter(room => {
      const roomReservations = reservations.filter(res => res.roomId === room.id);
      
      return !roomReservations.some(reservation => {
        const resCheckIn = new Date(reservation.checkInDate);
        const resCheckOut = new Date(reservation.checkOutDate);
        
        return (checkInDate < resCheckOut && checkOutDate > resCheckIn);
      });
    });
  };

  const createReservation = async (roomId: string, checkIn: string, checkOut: string): Promise<boolean> => {
    try {
      const room = rooms.find(r => r.id === roomId);
      if (!room) return false;

      const availableRooms = getAvailableRooms(checkIn, checkOut);
      if (!availableRooms.find(r => r.id === roomId)) {
        return false;
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const newReservation: Reservation = {
        id: Date.now().toString(),
        userId: JSON.parse(localStorage.getItem('oceanbreeze_user') || '{}').id,
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: room.price * nights,
        createdAt: new Date().toISOString(),
      };

      const updatedReservations = [...reservations, newReservation];
      setReservations(updatedReservations);
      localStorage.setItem('oceanbreeze_reservations', JSON.stringify(updatedReservations));
      
      return true;
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      return false;
    }
  };

  const addReview = async (roomId: string, rating: number, comment: string): Promise<boolean> => {
    try {
      const user = JSON.parse(localStorage.getItem('oceanbreeze_user') || '{}');
      if (!user.id) return false;

      const existingReview = reviews.find(r => r.roomId === roomId && r.userId === user.id);
      if (existingReview) {
        const updatedReviews = reviews.map(r => 
          r.id === existingReview.id 
            ? { ...r, rating, comment, createdAt: new Date().toISOString() }
            : r
        );
        setReviews(updatedReviews);
        localStorage.setItem('oceanbreeze_reviews', JSON.stringify(updatedReviews));
      } else {
        const newReview: Review = {
          id: Date.now().toString(),
          userId: user.id,
          roomId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        };

        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        localStorage.setItem('oceanbreeze_reviews', JSON.stringify(updatedReviews));
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      return false;
    }
  };

  const getRoomReviews = (roomId: string): Review[] => {
    return reviews.filter(review => review.roomId === roomId);
  };

  const getRoomAverageRating = (roomId: string): number => {
    const roomReviews = getRoomReviews(roomId);
    if (roomReviews.length === 0) return 0;
    
    const totalRating = roomReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / roomReviews.length) * 10) / 10;
  };

  const addRoom = async (roomData: Omit<Room, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const newRoom: Room = {
        ...roomData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const updatedRooms = [...rooms, newRoom];
      setRooms(updatedRooms);
      localStorage.setItem('oceanbreeze_rooms', JSON.stringify(updatedRooms));
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar quarto:', error);
      return false;
    }
  };

  const updateRoom = async (id: string, roomData: Partial<Room>): Promise<boolean> => {
    try {
      const updatedRooms = rooms.map(room => 
        room.id === id ? { ...room, ...roomData } : room
      );
      
      setRooms(updatedRooms);
      localStorage.setItem('oceanbreeze_rooms', JSON.stringify(updatedRooms));
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar quarto:', error);
      return false;
    }
  };

  const deleteRoom = async (id: string): Promise<boolean> => {
    try {
      const updatedRooms = rooms.filter(room => room.id !== id);
      setRooms(updatedRooms);
      localStorage.setItem('oceanbreeze_rooms', JSON.stringify(updatedRooms));
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar quarto:', error);
      return false;
    }
  };

  return (
    <BookingContext.Provider value={{
      rooms,
      reservations,
      reviews,
      searchDates,
      setSearchDates,
      getAvailableRooms,
      createReservation,
      addReview,
      getRoomReviews,
      getRoomAverageRating,
      addRoom,
      updateRoom,
      deleteRoom,
    }}>
      {children}
    </BookingContext.Provider>
  );
};