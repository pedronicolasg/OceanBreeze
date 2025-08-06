import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Reservations from './pages/Reservations';
import RoomDetails from './pages/RoomDetails';
import Admin from './pages/Admin';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/reservations" element={<Reservations />} />
                  <Route path="/room/:id" element={<RoomDetails />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;