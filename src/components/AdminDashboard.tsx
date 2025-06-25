import React, { useState } from "react";
import { Plus, BarChart3, Users, Calendar, TrendingUp } from "lucide-react";
import type { Room } from "../types";
import { RoomCard } from "./RoomCard";
import { RoomForm } from "./RoomForm";

interface AdminDashboardProps {
  rooms: Room[];
  onUpdateRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string) => void;
  onAddRoom: (room: Omit<Room, "id">) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  rooms,
  onUpdateRoom,
  onDeleteRoom,
  onAddRoom,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | undefined>();

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleSave = (roomData: Omit<Room, "id">) => {
    if (editingRoom) {
      onUpdateRoom({ ...roomData, id: editingRoom.id });
    } else {
      onAddRoom(roomData);
    }
    setShowForm(false);
    setEditingRoom(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRoom(undefined);
  };

  const availableRooms = rooms.filter((room) => room.isAvailable).length;
  const totalRevenue = rooms.reduce((sum, room) => sum + room.price, 0);
  const averagePrice = totalRevenue / rooms.length || 0;

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho da dash */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Painel Administrativo
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie os quartos e reservas do seu hotel
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-medium"
          >
            <Plus className="w-5 h-5" />
            Adicionar Quarto
          </button>
        </div>

        {/* Cards de dados/estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Quartos</p>
                <p className="text-3xl font-bold text-gray-800">
                  {rooms.length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-cyan-600" />
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponíveis</p>
                <p className="text-3xl font-bold text-green-600">
                  {availableRooms}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ocupados</p>
                <p className="text-3xl font-bold text-red-600">
                  {rooms.length - availableRooms}
                </p>
              </div>
              <Users className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Preço Médio</p>
                <p className="text-3xl font-bold text-purple-600">
                  R${averagePrice.toFixed(0)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Gerenciamento dos quartos */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Gerenciamento de Quartos
          </h2>

          {rooms.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Nenhum quarto disponível
                </h3>
                <p className="text-gray-600 mb-4">
                  Comece adicionando seu primeiro quarto
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-medium"
                >
                  Adicionar Primeiro Quarto
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  isAdmin={true}
                  onEdit={handleEdit}
                  onDelete={onDeleteRoom}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal do form dos quartos */}
      {showForm && (
        <RoomForm
          room={editingRoom}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};
