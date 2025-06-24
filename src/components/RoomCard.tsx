import React from 'react';
import { Users, Square, Wifi, Coffee, Car, Tv } from 'lucide-react';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
  isAdmin?: boolean;
  onEdit?: (room: Room) => void;
  onDelete?: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ 
  room, 
  isAdmin = false, 
  onEdit, 
  onDelete 
}) => {
  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'WiFi Gratuito': <Wifi className="w-4 h-4" />,
      'Máquina de Café': <Coffee className="w-4 h-4" />,
      'Estacionamento': <Car className="w-4 h-4" />,
      'TV': <Tv className="w-4 h-4" />,
    };
    return iconMap[amenity] || <div className="w-4 h-4 bg-cyan-500 rounded-full" />;
  };

  return (
    <div className="group bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 overflow-hidden hover:bg-white/30 transition-all duration-300 hover:transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img 
          src={room.imageUrl} 
          alt={room.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
            room.isAvailable 
              ? 'bg-green-500/80 text-white' 
              : 'bg-red-500/80 text-white'
          }`}>
            {room.isAvailable ? 'Disponível' : 'Ocupado'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{room.name}</h3>
            <p className="text-sm text-gray-600 font-medium">{room.type}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-cyan-600">R${room.price}</p>
            <p className="text-sm text-gray-600">por noite</p>
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{room.description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{room.maxGuests} hóspedes</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{room.size} m²</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center gap-1 px-2 py-1 bg-white/30 rounded-full text-xs text-gray-700">
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
          {room.amenities.length > 3 && (
            <div className="px-2 py-1 bg-white/30 rounded-full text-xs text-gray-700">
              +{room.amenities.length - 3} mais
            </div>
          )}
        </div>
        
        {isAdmin ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(room)}
              className="flex-1 py-2 px-4 bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 rounded-lg hover:bg-blue-500/30 transition-colors text-blue-700 font-medium"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete?.(room.id)}
              className="flex-1 py-2 px-4 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-lg hover:bg-red-500/30 transition-colors text-red-700 font-medium"
            >
              Excluir
            </button>
          </div>
        ) : (
          <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-medium">
            Reservar Agora
          </button>
        )}
      </div>
    </div>
  );
};