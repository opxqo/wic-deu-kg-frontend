
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from './types';

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (data?: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: UserProfile = {
  name: "Alex Zhang",
  id: "202103058",
  email: "alex.zhang@wic.edu.kg",
  department: "Information Engineering",
  major: "Software Engineering",
  bio: "Passionate about code, coffee, and campus life. Always looking for new teammates for hackathons!",
  avatar: "https://picsum.photos/seed/alex_avatar/200/200",
  joinDate: "2021-09-01"
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (data?: Partial<UserProfile>) => {
    // In a real app, this would fetch from an API
    // We use the default mock user but allow overriding for the demo
    setUser({ ...defaultUser, ...data });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
