'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get('/auth/me');
        setUser(res.data.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      await checkAuth();
      router.push('/');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Something went wrong'
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      await checkAuth();
      router.push('/');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Something went wrong'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const updateProfile = async (data) => {
    try {
      const res = await axios.put('/auth/updatedetails', data);
      setUser(res.data.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Something went wrong'
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 