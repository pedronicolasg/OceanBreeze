import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('oceanbreeze_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('oceanbreeze_users') || '[]');
      const foundUser = users.find((u: User & { password: string }) => 
        u.username === username && u.password === password
      );
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('oceanbreeze_user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('oceanbreeze_users') || '[]');
      
      // Verificar se usuário já existe
      if (users.some((u: User) => u.username === userData.username || u.email === userData.email)) {
        return false;
      }

      // Initialize demo users if this is the first registration
      if (users.length === 0) {
        const demoUsers = [
          {
            id: 'demo-admin',
            username: 'admin',
            password: 'admin123',
            email: 'admin@oceanbreeze.com.br',
            fullName: 'Administrador do Sistema',
            dateOfBirth: '1990-01-01',
            profilePhoto: '',
            role: 'admin',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'demo-user',
            username: 'user',
            password: 'user123',
            email: 'user@oceanbreeze.com.br',
            fullName: 'Usuário Demonstração',
            dateOfBirth: '1995-06-15',
            profilePhoto: '',
            role: 'user',
            createdAt: new Date().toISOString(),
          },
        ];
        users.push(...demoUsers);
      }

      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('oceanbreeze_users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('oceanbreeze_user', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;

      const users = JSON.parse(localStorage.getItem('oceanbreeze_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      
      if (userIndex === -1) return false;

      const updatedUser = { ...user, ...userData };
      users[userIndex] = { ...users[userIndex], ...userData };
      
      localStorage.setItem('oceanbreeze_users', JSON.stringify(users));
      setUser(updatedUser);
      localStorage.setItem('oceanbreeze_user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oceanbreeze_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};