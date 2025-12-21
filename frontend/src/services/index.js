/**
 * Point d'entrée centralisé pour tous les services
 * Permet d'importer facilement les services dans les composants
 * 
 * Exemple d'utilisation:
 * import { authService, projectService, taskService } from '../services';
 */

export { default as authService } from './authService';
export { default as projectService } from './projectService';
export { default as taskService } from './taskService';
export { default as api } from './api';

