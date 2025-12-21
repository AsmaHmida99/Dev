import api from './api';

/**
 * Service de gestion des tâches
 * Gère toutes les opérations CRUD sur les tâches d'un projet
 */
const taskService = {
  /**
   * Récupérer toutes les tâches d'un projet
   * @param {number} projectId - ID du projet
   * @returns {Promise<Array>} Liste des tâches
   */
  getAllTasks: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/tasks`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des tâches' };
    }
  },

  /**
   * Récupérer une tâche par son ID
   * @param {number} projectId - ID du projet
   * @param {number} taskId - ID de la tâche
   * @returns {Promise<Object>} Détails de la tâche
   */
  getTaskById: async (projectId, taskId) => {
    try {
      const response = await api.get(`/projects/${projectId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération de la tâche' };
    }
  },

  /**
   * Créer une nouvelle tâche dans un projet
   * @param {number} projectId - ID du projet
   * @param {Object} taskData - Données de la tâche
   * @param {string} taskData.title - Titre de la tâche
   * @param {string} taskData.description - Description de la tâche
   * @param {string} taskData.dueDate - Date d'échéance (format: YYYY-MM-DD)
   * @param {boolean} taskData.completed - Statut de complétion
   * @returns {Promise<Object>} Tâche créée
   */
  createTask: async (projectId, taskData) => {
    try {
      const response = await api.post(`/projects/${projectId}/tasks`, {
        title: taskData.title,
        description: taskData.description || '',
        dueDate: taskData.dueDate || null,
        completed: taskData.completed || false,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de la tâche' };
    }
  },

  /**
   * Mettre à jour une tâche existante
   * @param {number} projectId - ID du projet
   * @param {number} taskId - ID de la tâche
   * @param {Object} taskData - Nouvelles données de la tâche
   * @param {string} taskData.title - Nouveau titre de la tâche
   * @param {string} taskData.description - Nouvelle description de la tâche
   * @param {string} taskData.dueDate - Nouvelle date d'échéance
   * @param {boolean} taskData.completed - Nouveau statut de complétion
   * @returns {Promise<Object>} Tâche mise à jour
   */
  updateTask: async (projectId, taskId, taskData) => {
    try {
      const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        completed: taskData.completed,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour de la tâche' };
    }
  },

  /**
   * Basculer le statut de complétion d'une tâche
   * @param {number} projectId - ID du projet
   * @param {number} taskId - ID de la tâche
   * @param {Object} currentTask - Tâche actuelle avec toutes ses données
   * @returns {Promise<Object>} Tâche mise à jour
   */
  toggleTaskCompletion: async (projectId, taskId, currentTask) => {
    try {
      const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, {
        title: currentTask.title,
        description: currentTask.description || '',
        dueDate: currentTask.dueDate || null,
        completed: !currentTask.completed,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du statut de la tâche' };
    }
  },

  /**
   * Supprimer une tâche
   * @param {number} projectId - ID du projet
   * @param {number} taskId - ID de la tâche à supprimer
   * @returns {Promise} Confirmation de suppression
   */
  deleteTask: async (projectId, taskId) => {
    try {
      const response = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      // Le backend retourne un body vide (204 ou 200), donc on retourne un objet de confirmation
      return response.data || { success: true, message: 'Task deleted successfully' };
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression de la tâche' };
    }
  },
};

export default taskService;

