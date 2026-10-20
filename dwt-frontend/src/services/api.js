import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour attacher le token JWT automatiquement et gérer les formulaires FormData
API.interceptors.request.use((config) => {
  // Si le payload est un FormData (téléversement de fichier), retirer 'Content-Type' pour laisser le navigateur injecter le multipart/form-data avec le bon boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  const token = sessionStorage.getItem('dwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
