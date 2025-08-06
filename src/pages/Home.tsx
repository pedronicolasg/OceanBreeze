import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star, Wifi, Car } from "lucide-react";
import { useBooking } from "../contexts/BookingContext";
import DatePicker from "../components/UI/DatePicker";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const {
    rooms,
    searchDates,
    setSearchDates,
    getAvailableRooms,
    getRoomAverageRating,
  } = useBooking();
  const [displayRooms, setDisplayRooms] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    if (!searchDates.checkIn) {
      setSearchDates({ checkIn: today, checkOut: tomorrow });
    }
    // Show all rooms initially
    setDisplayRooms(rooms);
  }, [rooms]);

  const handleSearch = () => {
    if (!searchDates.checkIn || !searchDates.checkOut) {
      alert("Por favor, selecione as datas de check-in e check-out");
      return;
    }

    if (new Date(searchDates.checkIn) >= new Date(searchDates.checkOut)) {
      alert("A data de check-out deve ser posterior à data de check-in");
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      const rooms = getAvailableRooms(
        searchDates.checkIn,
        searchDates.checkOut
      );
      setDisplayRooms(rooms);
      setHasSearched(true);
      setIsSearching(false);
    }, 500);
  };

  const handleViewDetails = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  const calculateNights = () => {
    if (!searchDates.checkIn || !searchDates.checkOut) return 0;
    const checkIn = new Date(searchDates.checkIn);
    const checkOut = new Date(searchDates.checkOut);
    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920)",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Bem-vindo ao
            <span className="block bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Ocean Breeze
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-delay">
            Desfrute de uma experiência única à beira-mar
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <DatePicker
                label="Check-in"
                value={searchDates.checkIn}
                onChange={(value) =>
                  setSearchDates({ ...searchDates, checkIn: value })
                }
                min={today}
              />
              <DatePicker
                label="Check-out"
                value={searchDates.checkOut}
                onChange={(value) =>
                  setSearchDates({ ...searchDates, checkOut: value })
                }
                min={searchDates.checkIn || today}
              />
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>{isSearching ? "Buscando..." : "Buscar Quartos"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {hasSearched ? "Quartos Disponíveis" : "Nossos Quartos"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {hasSearched
                ? `${displayRooms.length} ${
                    displayRooms.length === 1
                      ? "quarto encontrado"
                      : "quartos encontrados"
                  } para suas datas`
                : "Descubra nossos quartos exclusivos com vista para o mar"}
            </p>
          </div>

          {displayRooms.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {hasSearched
                  ? "Nenhum quarto disponível"
                  : "Nenhum quarto cadastrado"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {hasSearched
                  ? "Tente outras datas ou entre em contato conosco"
                  : "Em breve teremos quartos disponíveis"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        R$ {room.price}/noite
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {room.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities
                        .slice(0, 3)
                        .map((amenity: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      {room.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{room.amenities.length - 3} mais
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getRoomAverageRating(room.id) > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {getRoomAverageRating(room.id)}
                            </span>
                          </div>
                        )}
                      </div>
                      {hasSearched &&
                        searchDates.checkIn &&
                        searchDates.checkOut && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Total: R$ {room.price * calculateNights()}
                          </div>
                        )}
                      <button
                        onClick={() => handleViewDetails(room.id)}
                        className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg ml-auto"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {hasSearched && displayRooms.length === 0 && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8">
              <div className="text-4xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum quarto disponível
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Não encontramos quartos disponíveis para as datas selecionadas.
              </p>
              <button
                onClick={() => {
                  setHasSearched(false);
                  setDisplayRooms(rooms);
                }}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Ver Todos os Quartos
              </button>
            </div>
          </div>
        </section>
      )}

      {hasSearched && displayRooms.length > 0 && (
        <section className="pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <button
              onClick={() => {
                setHasSearched(false);
                setDisplayRooms(rooms);
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Ver Todos os Quartos Disponíveis
            </button>
          </div>
        </section>
      )}

      {!hasSearched && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Por que escolher o Ocean Breeze?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Oferecemos uma experiência única com comodidades de primeira
                classe
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Localização Privilegiada",
                  description: "À beira-mar com vista panorâmica do oceano",
                },
                {
                  icon: Star,
                  title: "Serviço 5 Estrelas",
                  description: "Atendimento personalizado e de excelência",
                },
                {
                  icon: Wifi,
                  title: "Wi-Fi Gratuito",
                  description: "Internet de alta velocidade em todo o hotel",
                },
                {
                  icon: Car,
                  title: "Estacionamento",
                  description: "Estacionamento gratuito para hóspedes",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
