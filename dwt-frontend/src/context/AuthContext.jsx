import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

const getInitialToken = () => {
  try {
    return localStorage.getItem('dwt_token') || sessionStorage.getItem('dwt_token') || null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getInitialToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  // Charger le profil utilisateur si token actif
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }
      try {
        const res = await API.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          sessionStorage.removeItem('dwt_token');
          localStorage.removeItem('dwt_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          console.warn('Session expirée ou invalide :', err.message);
        }
        sessionStorage.removeItem('dwt_token');
        localStorage.removeItem('dwt_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (identifier, password) => {
    const res = await API.post('/auth/login', { identifier, password });
    if (res.data.success) {
      localStorage.setItem('dwt_token', res.data.token);
      sessionStorage.setItem('dwt_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Échec de connexion');
  };

  const register = async (gamertag, email, password) => {
    const res = await API.post('/auth/register', { gamertag, email, password });
    if (res.data.success) {
      localStorage.setItem('dwt_token', res.data.token);
      sessionStorage.setItem('dwt_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Échec d\'inscription');
  };

  const logout = () => {
    try {
      localStorage.removeItem('dwt_token');
      sessionStorage.removeItem('dwt_token');
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);

    // Si on était sur une vue protégée, réinitialiser l'URL sur l'accueil
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.includes('admin') || hash.includes('admin') || path.includes('player') || path.includes('espace-joueur')) {
      window.history.replaceState(null, '', '/');
    }
  };

  const setSession = (tokenData, userData) => {
    localStorage.setItem('dwt_token', tokenData);
    sessionStorage.setItem('dwt_token', tokenData);
    setToken(tokenData);
    setUser(userData);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        setSession,
        updateUser,
        isAdmin: user?.role === 'admin' || user?.role === 'moderator'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

