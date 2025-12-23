import axios from 'axios';

// Configuration de l'URL de base de l'API
// 
// Stratégie de connexion Backend-Frontend:
// - En développement: utilise http://localhost:8080 directement
// - En production (Docker): utilise des URLs relatives ('' = chemin actuel)
//   qui seront proxyfiées par nginx vers le backend (http://backend:8080)
//
// Les routes utilisées par les services:
// - /auth/login, /auth/register -> proxyfiées vers http://backend:8080/auth/*
// - /projects, /projects/:id -> proxyfiées vers http://backend:8080/projects/*
// - /projects/:id/tasks -> proxyfiées vers http://backend:8080/projects/:id/tasks
const getApiBaseUrl = () => {
  // Si VITE_API_BASE_URL est défini explicitement, l'utiliser en priorité
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // En production (Docker), utiliser des URLs relatives
  // nginx proxy les requêtes vers le backend automatiquement
  if (import.meta.env.PROD) {
    return ''; // URLs relatives = proxy nginx
  }
  
  // En développement, utiliser localhost directement
  return 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();

// Création de l'instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si le token est expiré ou invalide (401), rediriger vers la page de connexion
    // SAUF si c'est une requête de login/register (pas de redirection dans ce cas)
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');

      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

