import type { Room } from '../types';

const STORAGE_KEY = 'oceanbreeze_quartoskey';
const AUTH_KEY = 'oceanbreeze_loginkey';

export const getStoredRooms = (): Room[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Dados padrão dos quartos pra testar
  const defaultRooms: Room[] = [
    {
      id: '1',
      name: 'Suíte Vista Mar',
      type: 'Suíte',
      price: 450,
      description: 'Suíte luxuosa com vista panorâmica do oceano, varanda privativa e comodidades premium.',
      imageUrl: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      isAvailable: true,
      amenities: ['Vista do Mar', 'Varanda Privativa', 'Cama King', 'Frigobar', 'Serviço de Quarto'],
      maxGuests: 2,
      size: 650
    },
    {
      id: '2',
      name: 'Deluxe Beira-Mar',
      type: 'Deluxe',
      price: 320,
      description: 'Quarto deluxe elegante com vista para o mar e mobiliário moderno.',
      imageUrl: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
      isAvailable: true,
      amenities: ['Vista do Mar', 'Cama Queen', 'Mesa de Trabalho', 'Máquina de Café'],
      maxGuests: 2,
      size: 450
    },
    {
      id: '3',
      name: 'Vila Jardim',
      type: 'Vila',
      price: 680,
      description: 'Vila privativa com vista para jardim tropical e comodidades exclusivas.',
      imageUrl: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
      isAvailable: false,
      amenities: ['Vista do Jardim', 'Piscina Privativa', 'Cama King', 'Cozinha', 'Sala de Estar'],
      maxGuests: 4,
      size: 1200
    },
    {
      id: '4',
      name: 'Standard Coral',
      type: 'Standard',
      price: 180,
      description: 'Quarto standard confortável com comodidades essenciais e design moderno.',
      imageUrl: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
      isAvailable: true,
      amenities: ['Cama de Casal', 'Ar Condicionado', 'WiFi Gratuito', 'TV'],
      maxGuests: 2,
      size: 300
    }
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRooms));
  return defaultRooms;
};

export const saveRooms = (rooms: Room[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
};

export const getAuthStatus = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const setAuthStatus = (isAuthenticated: boolean) => {
  localStorage.setItem(AUTH_KEY, isAuthenticated.toString());
};