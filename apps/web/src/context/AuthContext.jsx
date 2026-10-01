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
    // Load persisted auth from localStorage
    const savedToken = localStorage.getItem('touchit_token');
    const savedUser = localStorage.getItem('touchit_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    } else {
      // Default to demo buyer for immediate smooth experience
      const defaultBuyer = {
        id: 1,
        email: 'buyer@touchit.com',
        name: 'Alex Johnson (Buyer)',
        role: 'CUSTOMER',
        address: '742 Evergreen Terrace, Springfield, OR',
        phone: '+1 (555) 382-9104',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      };
      setUser(defaultBuyer);
      setToken('jwt-buyer-token');
      localStorage.setItem('touchit_user', JSON.stringify(defaultBuyer));
      localStorage.setItem('touchit_token', 'jwt-buyer-token');
    }
    setLoading(false);
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
