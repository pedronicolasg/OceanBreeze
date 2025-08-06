import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { Reservation, Room } from '../types';

const Reservations: React.FC = () => {
  const { user } = useAuth();
  const { reservations, rooms } = useBooking();
  const [userReservations, setUserReservations] = useState<(Reservation & { room: Room })[]>([]);

  useEffect(() => {
    if (user) {
      const userRes = reservations
        .filter(res => res.userId === user.id)
        .map(res => {
          const room = rooms.find(r => r.id === res.roomId);
          return { ...res, room: room! };
        })
        .filter(res => res.room)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setUserReservations(userRes);
    }
  }, [user, reservations, rooms]);

  const getReservationStatus = (reservation: Reservation) => {
    const today = new Date();
    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);

    if (today < checkIn) {
      return { status: 'upcoming', label: 'Próxima', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    } else if (today >= checkIn && today <= checkOut) {
      return { status: 'active', label: 'Ativa', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
    } else {
      return { status: 'completed', label: 'Concluída', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acesso negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Você precisa estar logado para ver suas reservas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Minhas Reservas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie e acompanhe suas reservas
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.fullName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.fullName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {userReservations.length} {userReservations.length === 1 ? 'reserva' : 'reservas'}
              </p>
            </div>
          </div>
        </div>

        {userReservations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma reserva encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Você ainda não fez nenhuma reserva. Que tal explorar nossos quartos?
            </p>
            <a
              href="/"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Explorar Quartos
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {userReservations.map((reservation) => {
              const status = getReservationStatus(reservation);
              const nights = calculateNights(reservation.checkInDate, reservation.checkOutDate);
              
              return (
                <div
                  key={reservation.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={reservation.room.image}
                        alt={reservation.room.name}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {reservation.room.name}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            R$ {reservation.totalPrice.toLocaleString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {nights} {nights === 1 ? 'noite' : 'noites'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Check-in</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Check-out</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Reservado em</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(reservation.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {reservation.room.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {reservation.room.amenities.slice(0, 4).map((amenity, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                          {reservation.room.amenities.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                              +{reservation.room.amenities.length - 4} mais
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;