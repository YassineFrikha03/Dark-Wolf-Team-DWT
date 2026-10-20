import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

// Détection précise d'un rafraîchissement de page dans l'onglet actif (F5 / reload) vs une nouvelle visite / reconnexion
const isPageReload = () => {
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      return navEntries[0].type === 'reload';
    }
    if (window.performance && window.performance.navigation) {
      return window.performance.navigation.type === 1; // 1 = TYPE_RELOAD
    }
  } catch {
    return false;
  }
  return false;
};

// Récupérer le token initial :
// - Si simple rechargement (F5) dans l'onglet en cours, préserver temporairement la session de travail
// - Si nouvelle visite / reconnexion au site (ouverture de l'onglet, du navigateur ou nouvelle navigation),
//   on garantit que TOUS les comptes (admin et joueur) sont déconnectés par défaut.
const getInitialToken = () => {
  try {
    localStorage.removeItem('dwt_token');
    if (isPageReload()) {
      return sessionStorage.getItem('dwt_token') || null;
    }
    // Déconnexion complète à chaque réouverture / reconnexion au site
    sessionStorage.removeItem('dwt_token');
    return null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getInitialToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  // Toujours nettoyer le localStorage au montage pour éviter toute persistance accidentelle
  useEffect(() => {
    try {
      localStorage.removeItem('dwt_token');
    } catch {
      // ignore
    }
  }, []);

  // Charger le profil utilisateur si token actif (cas d'un F5 dans la session en cours)
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
    try {
      sessionStorage.removeItem('dwt_token');
      localStorage.removeItem('dwt_token');
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
        updateUser,
        isAdmin: user?.role === 'admin' || user?.role === 'moderator'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

