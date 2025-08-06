import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Wifi, Car, Coffee, Waves, Star, Check, X, MessageCircle, Send } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { Room, Review } from '../types';
import DatePicker from '../components/UI/DatePicker';

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rooms, createReservation, getAvailableRooms, addReview, getRoomReviews, getRoomAverageRating } = useBooking();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomReviews, setRoomReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: '',
  });
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (id) {
      const foundRoom = rooms.find(r => r.id === id);
      setRoom(foundRoom || null);
      
      if (foundRoom) {
        const reviews = getRoomReviews(id);
        setRoomReviews(reviews);
        setAverageRating(getRoomAverageRating(id));
        
        // Check if user already reviewed this room
        if (user) {
          const userReview = reviews.find(r => r.userId === user.id);
          if (userReview) {
            setReviewForm({
              rating: userReview.rating,
              comment: userReview.comment,
            });
          }
        }
      }
    }
  }, [id, rooms, getRoomReviews, getRoomAverageRating, user]);

  useEffect(() => {
    // Check availability when dates change
    if (bookingDates.checkIn && bookingDates.checkOut && room) {
      const availableRooms = getAvailableRooms(bookingDates.checkIn, bookingDates.checkOut);
      setIsAvailable(availableRooms.some(r => r.id === room.id));
      setAvailabilityChecked(true);
    } else {
      setIsAvailable(null);
      setAvailabilityChecked(false);
    }
  }, [bookingDates, room, getAvailableRooms]);

  const handleBookNow = async () => {
    if (!user) {
      // Salvar a URL atual para redirecionar após o login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }

    if (!bookingDates.checkIn || !bookingDates.checkOut) {
      alert('Por favor, selecione as datas de check-in e check-out');
      return;
    }

    if (isAvailable === false) {
      alert('Este quarto não está disponível para as datas selecionadas');
      return;
    }

    setIsBooking(true);
    try {
      const success = await createReservation(id!, bookingDates.checkIn, bookingDates.checkOut);
      if (success) {
        alert('Reserva realizada com sucesso!');
        navigate('/reservations');
      } else {
        alert('Erro ao realizar reserva. O quarto pode não estar mais disponível.');
        setIsAvailable(false);
      }
    } catch (error) {
      alert('Erro ao realizar reserva. Tente novamente.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !room) return;

    if (reviewForm.comment.length > 280) {
      alert('O comentário deve ter no máximo 280 caracteres');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const success = await addReview(room.id, reviewForm.rating, reviewForm.comment);
      if (success) {
        alert('Avaliação enviada com sucesso!');
        // Refresh reviews
        const reviews = getRoomReviews(room.id);
        setRoomReviews(reviews);
        setAverageRating(getRoomAverageRating(room.id));
      } else {
        alert('Erro ao enviar avaliação');
      }
    } catch (error) {
      alert('Erro ao enviar avaliação');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getUserName = (userId: string): string => {
    const users = JSON.parse(localStorage.getItem('oceanbreeze_users') || '[]');
    const user = users.find((u: any) => u.id === userId);
    return user ? user.fullName : 'Usuário';
  };

  const calculateNights = () => {
    if (!bookingDates.checkIn || !bookingDates.checkOut) return 0;
    const checkIn = new Date(bookingDates.checkIn);
    const checkOut = new Date(bookingDates.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: any } = {
      'Wi-Fi': Wifi,
      'Ar Condicionado': Star,
      'TV': Star,
      'Frigobar': Coffee,
      'Vista para o Mar': Waves,
      'Varanda': Star,
      'Cofre': Star,
      'Estacionamento': Car,
    };
    return icons[amenity] || Star;
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quarto não encontrado
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all duration-200"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const totalPrice = room.price * nights;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    R$ {room.price}/noite
                  </span>
                </div>
                {averageRating > 0 && (
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {averageRating}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      ({roomReviews.length})
                    </span>
                  </div>
                )}
              </div>

              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {room.name}
                </h1>
                
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                  {room.description}
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Comodidades
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room.amenities.map((amenity, index) => {
                      const IconComponent = getAmenityIcon(amenity);
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <IconComponent className="w-5 h-5 text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {amenity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <MessageCircle className="w-6 h-6" />
                      <span>Avaliações</span>
                      {roomReviews.length > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({roomReviews.length})
                        </span>
                      )}
                    </h3>
                    {averageRating > 0 && (
                      <div className="flex items-center space-x-2">
                        {renderStars(averageRating)}
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {averageRating}
                        </span>
                      </div>
                    )}
                  </div>

                  {user && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {roomReviews.some(r => r.userId === user.id) ? 'Atualizar Avaliação' : 'Deixe sua Avaliação'}
                      </h4>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Classificação
                          </label>
                          {renderStars(reviewForm.rating, true, (rating) => 
                            setReviewForm({ ...reviewForm, rating })
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Comentário (máximo 280 caracteres)
                          </label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            maxLength={280}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                            placeholder="Compartilhe sua experiência..."
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {reviewForm.comment.length}/280 caracteres
                          </p>
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmittingReview || !reviewForm.comment.trim()}
                          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>
                            {isSubmittingReview ? 'Enviando...' : 'Enviar Avaliação'}
                          </span>
                        </button>
                      </form>
                    </div>
                  )}

                  {roomReviews.length > 0 ? (
                    <div className="space-y-4">
                      {roomReviews
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((review) => (
                          <div
                            key={review.id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-semibold text-gray-900 dark:text-white">
                                  {getUserName(review.userId)}
                                </h5>
                                <div className="flex items-center space-x-2 mt-1">
                                  {renderStars(review.rating)}
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Ainda não há avaliações para este quarto.
                      </p>
                      {!user && (
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                          <button
                            onClick={() => navigate('/login')}
                            className="text-blue-500 hover:text-blue-600 underline"
                          >
                            Faça login
                          </button>
                          {' '}para deixar a primeira avaliação!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Fazer Reserva
              </h3>

              <div className="space-y-4 mb-6">
                <DatePicker
                  label="Data de Check-in"
                  value={bookingDates.checkIn}
                  onChange={(value) => setBookingDates({ ...bookingDates, checkIn: value })}
                  min={today}
                />
                <DatePicker
                  label="Data de Check-out"
                  value={bookingDates.checkOut}
                  onChange={(value) => setBookingDates({ ...bookingDates, checkOut: value })}
                  min={bookingDates.checkIn || today}
                />
              </div>

              {availabilityChecked && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  isAvailable 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center space-x-2">
                    {isAvailable ? (
                      <>
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                          Quarto disponível para as datas selecionadas
                        </p>
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                          Quarto não disponível para as datas selecionadas
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {bookingDates.checkIn && bookingDates.checkOut && isAvailable && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Check-in</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(bookingDates.checkIn).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Check-out</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(bookingDates.checkOut).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      {nights} {nights === 1 ? 'noite' : 'noites'}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      R$ {room.price} x {nights}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">
                      R$ {totalPrice.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBookNow}
                disabled={isBooking || !bookingDates.checkIn || !bookingDates.checkOut || isAvailable === false}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>
                  {isBooking 
                    ? 'Processando...' 
                    : !user 
                    ? 'Entrar para Reservar' 
                    : isAvailable === false
                    ? 'Indisponível'
                    : !bookingDates.checkIn || !bookingDates.checkOut
                    ? 'Selecione as Datas'
                    : 'Reservar Agora'
                  }
                </span>
              </button>

              {!user && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Você será redirecionado para fazer login
                </p>
              )}
              {!bookingDates.checkIn || !bookingDates.checkOut ? (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Selecione as datas para verificar disponibilidade
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;