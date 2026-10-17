import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour attacher le token JWT automatiquement (sessionStorage pour déconnexion à la fermeture)
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('dwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
