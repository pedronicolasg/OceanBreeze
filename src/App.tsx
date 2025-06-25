import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { PublicPage } from "./components/PublicPage";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import type { Room, View } from "./types";
import {
  getStoredRooms,
  saveRooms,
  getAuthStatus,
  setAuthStatus,
} from "./utils/storage";

function App() {
  const [currentView, setCurrentView] = useState<View>("public");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    setRooms(getStoredRooms());
    setIsAuthenticated(getAuthStatus());
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setAuthStatus(true);
      setCurrentView("admin");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthStatus(false);
    setCurrentView("public");
  };

  const handleNavigate = (view: View) => {
    if (view === "admin" && !isAuthenticated) {
      setCurrentView("login");
    } else {
      setCurrentView(view);
    }
  };

  const handleAddRoom = (roomData: Omit<Room, "id">) => {
    const newRoom: Room = {
      ...roomData,
      id: Date.now().toString(),
    };
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    saveRooms(updatedRooms);
  };

  const handleUpdateRoom = (updatedRoom: Room) => {
    const updatedRooms = rooms.map((room) =>
      room.id === updatedRoom.id ? updatedRoom : room
    );
    setRooms(updatedRooms);
    saveRooms(updatedRooms);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este quarto?")) {
      const updatedRooms = rooms.filter((room) => room.id !== roomId);
      setRooms(updatedRooms);
      saveRooms(updatedRooms);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
      <Header
        currentView={currentView}
        isAuthenticated={isAuthenticated}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {currentView === "public" && <PublicPage rooms={rooms} />}

      {currentView === "login" && <LoginPage onLogin={handleLogin} />}

      {currentView === "admin" && isAuthenticated && (
        <AdminDashboard
          rooms={rooms}
          onAddRoom={handleAddRoom}
          onUpdateRoom={handleUpdateRoom}
          onDeleteRoom={handleDeleteRoom}
        />
      )}
    </div>
  );
}

export default App;
