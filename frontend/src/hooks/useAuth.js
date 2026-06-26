import { useState, useEffect } from 'react';
import api from '../utils/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in cookie by doing a test health/analytics request
    const checkAuth = async () => {
      try {
        await api.get('/admin/analytics');
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/admin/login', { email, password });
    if (res.data.success) {
      setIsAuthenticated(true);
    }
    return res.data;
  };

  const logout = async () => {
    await api.post('/admin/logout');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, login, logout };
}
