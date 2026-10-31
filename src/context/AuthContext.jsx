import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  getUsers,
  initializeDataService,
} from '../services/dataService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data and load active user
  useEffect(() => {
    initializeDataService();
    const storedUserId = localStorage.getItem('mini_ats_active_user_id_v1') || 'usr-1';
    const user = getUserById(storedUserId);
    if (user) {
      setCurrentUser(user);
    } else {
      // Fallback to first user
      const allUsers = getUsers();
      if (allUsers.length > 0) {
        setCurrentUser(allUsers[0]);
        localStorage.setItem('mini_ats_active_user_id_v1', allUsers[0].id);
      }
    }
    setIsLoading(false);
  }, []);

  // Login handler
  const login = (email, password, role) => {
    const user = getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'No account found with this email address.' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }
    if (role && user.role !== role) {
      return {
        success: false,
        message: `This account is registered as a ${user.role}. Please select the ${user.role} role to login.`,
      };
    }

    setCurrentUser(user);
    localStorage.setItem('mini_ats_active_user_id_v1', user.id);
    return { success: true, user };
  };

  // Register handler
  const register = (data) => {
    const existing = getUserByEmail(data.email);
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'candidate',
      phone: data.phone || '',
      location: data.location || '',
      education: data.education || '',
      degree: data.degree || '',
      gradYear: data.gradYear || '',
      company: data.company || (data.role === 'recruiter' ? 'TechNova Solutions' : ''),
      skills: data.skills || [],
    });

    setCurrentUser(newUser);
    localStorage.setItem('mini_ats_active_user_id_v1', newUser.id);
    return { success: true, user: newUser };
  };

  // Quick switch user for demo presentation
  const switchUser = (userId) => {
    const user = getUserById(userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('mini_ats_active_user_id_v1', user.id);
      return user;
    }
    return null;
  };

  // Update profile
  const updateProfile = (updates) => {
    if (!currentUser) return null;
    const updated = updateUser(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
    }
    return updated;
  };

  const logout = () => {
    // For demo convenience, clear active user or reset to unauthenticated
    setCurrentUser(null);
    localStorage.removeItem('mini_ats_active_user_id_v1');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout,
        switchUser,
        updateProfile,
      }}
    >
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
