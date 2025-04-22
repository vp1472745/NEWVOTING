import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axois';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData, userType) => {
    const userInfo = {
      ...(userType === 'organization' ? userData.user : userData),
      type: userType
    };
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    
    switch (userType) {
      case 'organization':
        return '/organization/dashboard';
      case 'candidate':
        return '/candidate/dashboard';
      case 'voter':
        return '/voter/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  const logout = async () => {
    try {
      // Call the server's logout endpoint based on user type
      if (user?.type) {
        await axios.post(`/${user.type}/logout`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      
      // Clear local state and storage
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      return '/';
    } catch (error) {
      // Even if server logout fails, clear local state
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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