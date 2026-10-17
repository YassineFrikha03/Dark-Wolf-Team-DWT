import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Nettoyer d'anciens jetons résiduels de localStorage pour garantir la sécurité à la fermeture
  useEffect(() => {
    try {
      localStorage.removeItem('dwt_token');
    } catch {
      // ignore
    }
  }, []);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem('dwt_token') || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Charger le profil si token présent
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          console.warn('Session expirée ou invalide :', err.message);
          sessionStorage.removeItem('dwt_token');
          localStorage.removeItem('dwt_token');
          setToken(null);
          setUser(null);
        } else {
          console.warn('Erreur temporaire de connexion à l\'API :', err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (identifier, password) => {
    const res = await API.post('/auth/login', { identifier, password });
    if (res.data.success) {
      sessionStorage.setItem('dwt_token', res.data.token);
      localStorage.removeItem('dwt_token');
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Échec de connexion');
  };

  const register = async (gamertag, email, password) => {
    const res = await API.post('/auth/register', { gamertag, email, password });
    if (res.data.success) {
      sessionStorage.setItem('dwt_token', res.data.token);
      localStorage.removeItem('dwt_token');
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Échec d\'inscription');
  };

  const logout = () => {
    sessionStorage.removeItem('dwt_token');
    localStorage.removeItem('dwt_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAdmin: user?.role === 'admin' || user?.role === 'moderator' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
