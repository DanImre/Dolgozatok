import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface UserProfile {
  id: number;
  realName: string;
  classId: number | null;
  email?: string;
}

interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const profile = await api.get<UserProfile>('/api/User/me');
      setUser(profile);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      api.clearToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = api.getToken();
      if (token) {
        await fetchProfile();
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post<LoginResponse>('/login', { email, password });
      if (data && data.accessToken) {
        api.setToken(data.accessToken);
        await fetchProfile();
        // Keep track of email in memory since identity user email isn't in User domain profile
        setUser(prev => prev ? { ...prev, email } : null);
      } else {
        throw new Error('Invalid token response');
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshProfile = async () => {
    if (api.getToken()) {
      await fetchProfile();
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, refreshProfile }}>
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
