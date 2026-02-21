import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a valid token
  useEffect(() => {
    if (!api.hasToken()) {
      setLoading(false);
      return;
    }
    api.getMe()
      .then(data => setPlayer(data.player))
      .catch(() => {
        api.setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = useCallback(async (pseudo, password) => {
    const data = await api.login(pseudo, password);
    api.setToken(data.token);
    setPlayer(data.player);
    return data.player;
  }, []);

  const handleRegister = useCallback(async (pseudo, password, honeypot) => {
    const data = await api.register(pseudo, password, honeypot);
    api.setToken(data.token);
    setPlayer(data.player);
    return data.player;
  }, []);

  const logout = useCallback(() => {
    api.setToken(null);
    setPlayer(null);
  }, []);

  const updatePlayer = useCallback((updates) => {
    setPlayer(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{ player, loading, login: handleLogin, register: handleRegister, logout, updatePlayer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
