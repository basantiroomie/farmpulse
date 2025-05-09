import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  adminLogin: (passKey: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // TODO: Replace with actual authentication logic
  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser = { id: '1', email };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string) => {
    // Simulate API call
    const mockUser = { id: '1', email };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const adminLogin = async (passKey: string) => {
    // Valid admin keys
    const validAdminKeys = ['ADMIN_2025', 'HEALTH_MASTER', 'ANIMON_SUPER'];
    
    if (validAdminKeys.includes(passKey)) {
      const mockAdmin = { id: 'admin', email: 'admin@example.com', isAdmin: true };
      setUser(mockAdmin);
      localStorage.setItem('user', JSON.stringify(mockAdmin));
    } else {
      throw new Error('Invalid admin key');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    // Check for saved user on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}