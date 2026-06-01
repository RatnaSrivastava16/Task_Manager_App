import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

// Helper to decode JWT token natively in browser
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore session from localStorage token on mount
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
      } else {
        // Token is expired or invalid
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token: jwtToken } = response.data;
      
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      
      const decoded = decodeToken(jwtToken);
      setUser(decoded);
      setLoading(false);
      return true;
    } catch (err) {
      const errMsg = API.getErrorMessage(err);
      setAuthError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      await API.post('/auth/register', { name, email, password });
      setLoading(false);
      return true;
    } catch (err) {
      const errMsg = API.getErrorMessage(err);
      setAuthError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
