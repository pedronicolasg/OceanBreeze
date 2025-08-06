import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { Room } from '../types';
import Modal from '../components/UI/Modal';
import ImageUpload from '../components/UI/ImageUpload';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { rooms, addRoom, updateRoom, deleteRoom, reservations } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    amenities: [] as string[],
  });
  const [newAmenity, setNewAmenity] = useState('');

  const commonAmenities = [
    'Wi-Fi', 'Ar Condicionado', 'TV', 'Frigobar', 'Vista para o Mar',
    'Varanda', 'Cofre', 'Banheira', 'Chuveiro', 'Secador de Cabelo',
    'Roupões', 'Chinelos', 'Serviço de Quarto', 'Estacionamento'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      amenities: [],
    });
    setNewAmenity('');
    setEditingRoom(null);
  };

  const openModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        name: room.name,
        description: room.description,
        price: room.price.toString(),
        image: room.image,
        amenities: [...room.amenities],
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const roomData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
        amenities: formData.amenities,
      };

      let success = false;
      if (editingRoom) {
        success = await updateRoom(editingRoom.id, roomData);
      } else {
        success = await addRoom(roomData);
      }

      if (success) {
        closeModal();
        alert(editingRoom ? 'Quarto atualizado com sucesso!' : 'Quarto adicionado com sucesso!');
      } else {
        alert('Erro ao salvar quarto');
      }
    } catch (error) {
      alert('Erro ao salvar quarto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (roomId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este quarto?')) {
      const success = await deleteRoom(roomId);
      if (success) {
        alert('Quarto excluído com sucesso!');
      } else {
        alert('Erro ao excluir quarto');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (value: string) => {
    setFormData({
      ...formData,
      image: value,
    });
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(a => a !== amenity),
    });
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim()) {
      addAmenity(newAmenity.trim());
      setNewAmenity('');
    }
  };

  const getStats = () => {
    const totalRooms = rooms.length;
    const totalReservations = reservations.length;
    const totalRevenue = reservations.reduce((sum, res) => sum + res.totalPrice, 0);
    const occupancyRate = totalRooms > 0 ? Math.round((reservations.length / totalRooms) * 100) : 0;

    return { totalRooms, totalReservations, totalRevenue, occupancyRate };
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acesso negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Você precisa ser um administrador para acessar esta página
          </p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie quartos e visualize estatísticas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Quartos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRooms}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reservas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReservations}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {stats.totalRevenue.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Ocupação</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.occupancyRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Gerenciar Quartos
              </h2>
              <button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar Quarto</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {rooms.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum quarto cadastrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Adicione o primeiro quarto para começar
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {room.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {room.description}
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        R$ {room.price}/noite
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            +{room.amenities.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(room)}
                          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingRoom ? 'Editar Quarto' : 'Adicionar Quarto'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do quarto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Suíte Oceano"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preço por noite (R$) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="450.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Descreva o quarto, suas características e diferenciais..."
              />
            </div>

            <ImageUpload
              label="Imagem do quarto *"
              value={formData.image}
              onChange={handleImageChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comodidades
              </label>
              
              {formData.amenities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selecionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Comodidades comuns:</p>
                <div className="flex flex-wrap gap-2">
                  {commonAmenities
                    .filter(amenity => !formData.amenities.includes(amenity))
                    .map((amenity, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addAmenity(amenity)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        + {amenity}
                      </button>
                    ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Adicionar comodidade personalizada"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                />
                <button
                  type="button"
                  onClick={addCustomAmenity}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="text-white" />
                ) : (
                  <>
                    <span>{editingRoom ? 'Atualizar' : 'Adicionar'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Admin;