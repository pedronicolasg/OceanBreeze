import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  isAuthenticated: boolean;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  isAuthenticated, 
  onNavigate, 
  onLogout 
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('public')}
          >
            <img src="/logo.png" alt="Oceanbreeze Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Oceanbreeze
            </h1>
          </div>
          
          <nav className="flex items-center gap-4">
            {!isAuthenticated ? (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {currentView !== 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    Painel
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-300/30 hover:bg-red-500/30 transition-all duration-200 text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};