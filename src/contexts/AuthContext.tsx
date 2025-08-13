"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/sop';

interface AuthContextType {
  currentUser: User | null;
  switchRole: (role: 'Admin' | 'Karyawan') => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    nama: 'Indira Kamila',
    peran: 'Admin'
  });

  const switchRole = (role: 'Admin' | 'Karyawan') => {
    setCurrentUser(prev => prev ? {
      ...prev,
      peran: role,
      nama: role === 'Admin' ? 'Indira Kamila' : 'David Effendi'
    } : null);
  };

  const isAdmin = currentUser?.peran === 'Admin';

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
