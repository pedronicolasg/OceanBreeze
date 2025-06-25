import React, { useState } from 'react';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import type { Room } from '../types';
import { RoomCard } from './RoomCard';

interface PublicPageProps {
  rooms: Room[];
}

export const PublicPage: React.FC<PublicPageProps> = ({ rooms }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const roomTypes = ['Todos', ...Array.from(new Set(rooms.map(room => room.type)))];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Todos' || room.type === selectedType;
    const matchesAvailability = !showAvailableOnly || room.isAvailable;
    
    return matchesSearch && matchesType && matchesAvailability;
  });

  return (
    <div className="min-h-screen pt-16">
      {/* Seção principal */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Bem-vindo ao Oceanbreeze
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Experimente luxo e conforto com vistas deslumbrantes do oceano. 
            Sua escapada perfeita te aguarda.
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>Maldivas • Resort de Luxo</span>
            <div className="flex items-center gap-1 ml-4">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-semibold">4.9/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de pesquisa */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar quartos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500"
              />
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700">Apenas disponíveis</span>
              </label>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 p-4 text-center">
            <div className="text-2xl font-bold text-cyan-600">{rooms.length}</div>
            <div className="text-sm text-gray-600">Total de Quartos</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{rooms.filter(r => r.isAvailable).length}</div>
            <div className="text-sm text-gray-600">Disponíveis</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">R${Math.min(...rooms.map(r => r.price))}</div>
            <div className="text-sm text-gray-600">A partir de por noite</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{roomTypes.length - 1}</div>
            <div className="text-sm text-gray-600">Tipos de Quarto</div>
          </div>
        </div>

        {/* Gris dos quartos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum quarto encontrado</h3>
              <p className="text-gray-600">Tente ajustar seus critérios de busca</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};