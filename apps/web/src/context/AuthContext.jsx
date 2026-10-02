import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('touchit_token');
      const savedUser = localStorage.getItem('touchit_user');

      // Purge any legacy fake mock tokens
      if (savedToken && !savedToken.startsWith('eyJ')) {
        localStorage.removeItem('touchit_token');
        localStorage.removeItem('touchit_user');
        setLoading(false);
        return;
      }

      if (savedToken && savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setToken(savedToken);

          // Verify session integrity with backend
          try {
            const meRes = await api.auth.getMe();
            if (meRes?.data?.user) {
              setUser(meRes.data.user);
              localStorage.setItem('touchit_user', JSON.stringify(meRes.data.user));
            }
          } catch (verifyErr) {
            // If token has expired or is invalid, log out cleanly
            if (verifyErr.status === 401) {
              setUser(null);
              setToken(null);
              localStorage.removeItem('touchit_token');
              localStorage.removeItem('touchit_user');
            }
          }
        } catch (e) {
          console.error('Failed to parse saved user', e);
          setUser(null);
          setToken(null);
          localStorage.removeItem('touchit_token');
          localStorage.removeItem('touchit_user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res?.data?.user) {
        setUser(res.data.user);
        setToken(res.token);
        localStorage.setItem('touchit_user', JSON.stringify(res.data.user));
        localStorage.setItem('touchit_token', res.token);
        showToast(`Welcome back, ${res.data.user.name}! (${res.data.user.role})`, 'success');
        return res.data.user;
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
      return null;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.auth.register(userData);
      if (res?.data?.user) {
        setUser(res.data.user);
        setToken(res.token);
        localStorage.setItem('touchit_user', JSON.stringify(res.data.user));
        localStorage.setItem('touchit_token', res.token);
        showToast(`Account created as ${res.data.user.role}! Welcome, ${res.data.user.name}`, 'success');
        return res.data.user;
      }
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('touchit_user');
    localStorage.removeItem('touchit_token');
    showToast('You have been logged out.', 'info');
  };

  // Role checks
  const role = user?.role || 'GUEST';
  const isBuyer = role === 'CUSTOMER';
  const isSeller = role === 'SELLER';
  const isAdmin = role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        role,
        isBuyer,
        isSeller,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
