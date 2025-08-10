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

      // Faz a rolagem suave para a seção de quartos
      document.getElementById("quartos")?.scrollIntoView({ behavior: "smooth" });

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

      {/* Seção dos quartos com ID para scroll */}
      <section id="quartos" className="py-16 px-4">
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
          {/* ... resto da seção permanece igual */}
        </div>
      </section>

      {/* Resto do código igual */}
    </div>
  );
};

export default Home;

