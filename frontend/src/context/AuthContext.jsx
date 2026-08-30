import React, { createContext, useState, useEffect } from 'react';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // Validate session with backend me/ endpoint
      client.get('/authentication/me/')
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          // Token invalid or expired
          setUser(null);
          setToken(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        });
    }
  }, []);

  const loginUser = async (username, password) => {
    setLoading(true);
    try {
      const response = await client.post('/authentication/login/', { username, password });
      const { user: userData, token: userToken } = response.data;
      
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (error) {
      setLoading(false);
      const data = error.response?.data;
      let errMsg = 'Login failed. Please check credentials.';
      if (typeof data === 'string') {
        errMsg = data;
      } else if (data?.non_field_errors?.[0]) {
        errMsg = data.non_field_errors[0];
      } else if (data?.detail) {
        errMsg = data.detail;
      } else if (data?.message) {
        errMsg = data.message;
      }
      return { success: false, message: errMsg };
    }
  };

  const registerUser = async (formData) => {
    setLoading(true);
    try {
      const response = await client.post('/authentication/register/', formData);
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (error) {
      setLoading(false);
      return { success: false, errors: error.response?.data || { message: 'Registration failed.' } };
    }
  };

  const logoutUser = async () => {
    try {
      await client.post('/authentication/logout/');
    } catch (e) {
      console.warn('Logout API warning:', e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
