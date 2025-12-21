import api from './api';

/**
 * Service de gestion des projets
 * Gère toutes les opérations CRUD sur les projets
 */
const projectService = {
  /**
   * Récupérer tous les projets de l'utilisateur connecté
   * @returns {Promise<Array>} Liste des projets
   */
  getAllProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des projets' };
    }
  },

  /**
   * Récupérer un projet par son ID
   * @param {number} projectId - ID du projet
   * @returns {Promise<Object>} Détails du projet
   */
  getProjectById: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du projet' };
    }
  },

  /**
   * Créer un nouveau projet
   * @param {Object} projectData - Données du projet
   * @param {string} projectData.title - Titre du projet
   * @param {string} projectData.description - Description du projet
   * @returns {Promise<Object>} Projet créé
   */
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', {
        title: projectData.title,
        description: projectData.description,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création du projet' };
    }
  },

  /**
   * Mettre à jour un projet existant
   * @param {number} projectId - ID du projet
   * @param {Object} projectData - Nouvelles données du projet
   * @param {string} projectData.title - Nouveau titre du projet
   * @param {string} projectData.description - Nouvelle description du projet
   * @returns {Promise<Object>} Projet mis à jour
   */
  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, {
        title: projectData.title,
        description: projectData.description,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du projet' };
    }
  },

  /**
   * Supprimer un projet
   * @param {number} projectId - ID du projet à supprimer
   * @returns {Promise} Confirmation de suppression
   */
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression du projet' };
    }
  },
};

export default projectService;

