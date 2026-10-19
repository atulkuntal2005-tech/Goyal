import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  adminUser: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sga_admin_token'));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const cached = localStorage.getItem('sga_admin_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const login = (newToken: string, newUser: AdminUser) => {
    localStorage.setItem('sga_admin_token', newToken);
    localStorage.setItem('sga_admin_user', JSON.stringify(newUser));
    setToken(newToken);
    setAdminUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('sga_admin_token');
    localStorage.removeItem('sga_admin_user');
    setToken(null);
    setAdminUser(null);
  };

  const checkAuth = async (): Promise<boolean> => {
    const currentToken = localStorage.getItem('sga_admin_token');
    if (!currentToken) {
      setIsLoading(false);
      return false;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.user);
        setIsLoading(false);
        return true;
      } else {
        logout();
        setIsLoading(false);
        return false;
      }
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ adminUser, token, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
