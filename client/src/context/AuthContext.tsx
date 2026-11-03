import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types.js';
import { api } from '../lib/api.js';

interface SignupData {
  email: string;
  password: string;
  full_name: string;
  role?: 'student' | 'teacher';
  teacher_code?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupData) => Promise<{ message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('quizlab_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('quizlab_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('quizlab_token');
      if (storedToken) {
        try {
          const res = await api.get<{ user: User }>('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('quizlab_user', JSON.stringify(res.data.user));
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem('quizlab_token');
          localStorage.removeItem('quizlab_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('quizlab_token', receivedToken);
    localStorage.setItem('quizlab_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const signup = async (data: SignupData): Promise<{ message: string }> => {
    const res = await api.post<{ message?: string; user?: User }>('/auth/signup', data);
    // Explicitly DO NOT auto-login: user must sign in via login page with their credentials
    return {
      message: res.data.message || 'Account created successfully! Please sign in.',
    };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('quizlab_token');
    localStorage.removeItem('quizlab_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
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
