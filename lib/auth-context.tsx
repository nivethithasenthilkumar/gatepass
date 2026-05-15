"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';
import { apiService } from './api';

interface AuthContextType {
  user: User | null;
  login: (rollNo: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  updateUser: (userData: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (rollNo: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login(rollNo, password);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      
      // Map backend user data to frontend User type
      const userData: User = {
        id: response.id.toString(),
        rollNo: response.rollNo,
        name: response.name,
        role: response.role.toLowerCase() as User['role'],
        department: response.department as User['department'],
        year: response.year as User['year'],
        hostel: response.hostel === 'DAYSCHOLAR' ? 'dayscholar' : response.hostel as User['hostel'],
        roomNo: response.roomNo,
        floorNo: response.floorNo,
        parentPhone: response.parentPhone,
        photo: response.photo,
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; message?: string }> => {
    try {
      await apiService.register(userData);
      return { success: true };
    } catch (error: any) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const updateUser = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}