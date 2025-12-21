import api from './api';

/**
 * Service d'authentification
 * Gère toutes les opérations liées à l'authentification des utilisateurs
 */
const authService = {
  /**
   * Connexion d'un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise} Réponse contenant le token JWT et les informations utilisateur
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Sauvegarder le token et les informations utilisateur dans le localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          email: response.data.email,
          roles: response.data.roles || [],
        }));

        const userData = {
          token: response.data.token,
          id: response.data.id,
          email: response.data.email,
          roles: response.data.roles || [],
        };
        return userData;
      } else {
        throw { message: 'Token non reçu du serveur' };
      }
    } catch (error) {
      // Gérer les erreurs de validation (400)
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Invalid email or password';
        throw { message: errorMessage };
      }

      // Gérer les erreurs d'authentification (401)
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || 'Invalid email or password';
        throw { message: errorMessage };
      }

      // Gérer les erreurs serveur (500)
      if (error.response?.status === 500) {
        const errorMessage = error.response?.data?.message || 'Server error. Please try again later.';
        throw { message: errorMessage };
      }

      // Gérer les erreurs réseau (pas de response)
      if (!error.response) {
        const errorMessage = error.message || 'Network error. Please check your connection.';
        throw { message: errorMessage };
      }

      // Gérer les autres erreurs
      throw error.response?.data || { message: error.message || 'Erreur lors de la connexion' };
    }
  },

  /**
   * Inscription d'un nouvel utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise} Réponse de confirmation d'inscription
   */
  register: async (email, password) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // Gérer les erreurs de validation (400)
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Email is already in use or invalid data';
        throw { message: errorMessage };
      }

      // Gérer les erreurs serveur (500)
      if (error.response?.status === 500) {
        const errorMessage = error.response?.data?.message || 'Server error. Please try again later.';
        throw { message: errorMessage };
      }

      // Gérer les erreurs réseau (pas de response)
      if (!error.response) {
        const errorMessage = error.message || 'Network error. Please check your connection.';
        throw { message: errorMessage };
      }

      // Gérer les autres erreurs
      throw error.response?.data || { message: error.message || 'Erreur lors de l\'inscription' };
    }
  },

  /**
   * Déconnexion de l'utilisateur
   * Supprime le token et les informations utilisateur du localStorage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('projects'); // Nettoyer aussi les données locales
  },

  /**
   * Récupérer l'utilisateur actuellement connecté
   * @returns {Object|null} Informations de l'utilisateur ou null si non connecté
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
      }
    }
    return null;
  },

  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean} True si l'utilisateur est connecté, false sinon
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  /**
   * Récupérer le token JWT
   * @returns {string|null} Token JWT ou null si non connecté
   */
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;

