import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Folder, CheckCircle2, Circle, ChevronRight, Moon, Sun } from 'lucide-react';
import Header from '../../components/header/header';

const ProjectPage = () => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const [projectForm, setProjectForm] = useState({ title: '', description: '' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '' });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const getProgress = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.tasks.length === 0) return 0;
    const completed = project.tasks.filter(t => t.completed).length;
    return Math.round((completed / project.tasks.length) * 100);
  };

  const createProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: projectForm.title,
      description: projectForm.description,
      tasks: []
    };
    setProjects([...projects, newProject]);
    setProjectForm({ title: '', description: '' });
    setShowProjectDialog(false);
  };

  const updateProject = () => {
    if (!editingProject) return;
    setProjects(projects.map(p =>
      p.id === editingProject.id
        ? { ...p, title: projectForm.title, description: projectForm.description }
        : p
    ));
    setProjectForm({ title: '', description: '' });
    setEditingProject(null);
    setShowProjectDialog(false);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    if (selectedProject?.id === id) setSelectedProject(null);
  };

  const addTask = () => {
    if (!selectedProject) return;
    const newTask = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      completed: false
    };
    setProjects(projects.map(p =>
      p.id === selectedProject.id
        ? { ...p, tasks: [...p.tasks, newTask] }
        : p
    ));
    setTaskForm({ title: '', description: '' });
    setShowTaskDialog(false);
  };

  const updateTask = () => {
    if (!selectedProject || !editingTask) return;
    setProjects(projects.map(p =>
      p.id === selectedProject.id
        ? {
            ...p,
            tasks: p.tasks.map(t =>
              t.id === editingTask.id
                ? { ...t, title: taskForm.title, description: taskForm.description }
                : t
            )
          }
        : p
    ));
    setTaskForm({ title: '', description: '' });
    setEditingTask(null);
    setShowTaskDialog(false);
  };

  const toggleTask = (taskId) => {
    if (!selectedProject) return;
    setProjects(projects.map(p =>
      p.id === selectedProject.id
        ? {
            ...p,
            tasks: p.tasks.map(t =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            )
          }
        : p
    ));
  };

  const deleteTask = (taskId) => {
    if (!selectedProject) return;
    setProjects(projects.map(p =>
      p.id === selectedProject.id
        ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
        : p
    ));
  };

  const openEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({ title: project.title, description: project.description });
    setShowProjectDialog(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({ title: task.title, description: task.description });
    setShowTaskDialog(true);
  };

  const currentProject = projects.find(p => p.id === selectedProject?.id);

  return (
    <div className={`min-h-screen min-w-full transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20'}`}>
      <Header />
      <div className={`sticky top-0 z-40 backdrop-blur-xl border-b shadow-sm transition-colors duration-300 ${isDark ? 'bg-gray-900/70 border-gray-700/50' : 'bg-white/70 border-gray-200/50'}`}>
        <div className="w-full px-8 sm:px-12 lg:px-16 py-4 sm:py-5">

          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              {selectedProject && (
                <button
                  onClick={() => setSelectedProject(null)}
                  className={`p-1.5 sm:p-2 rounded-xl transition-all duration-200 hover:scale-105 shrink-0 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100/80'}`}
                  title="Retour aux projets"
                >
                  <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 rotate-180 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              )}
              <div className="min-w-0 flex-1">

               <h1
  className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent truncate ${
    isDark ? 'from-white to-gray-300' : 'from-gray-900 to-gray-700'
  }`}
>

{selectedProject ? currentProject?.title : 'Mes Projets'}
                </h1>

                <p className={`text-xs sm:text-sm mt-0.5 flex items-center gap-1 sm:gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="inline-flex items-center gap-1 sm:gap-1.5">
                    {selectedProject ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        <span className="truncate">{currentProject?.tasks.filter(t => t.completed).length}/{currentProject?.tasks.length || 0} tâches</span>
                      </>
                    ) : (
                      <>
                        <Folder className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        {projects.length} projet{projects.length > 1 ? 's' : ''}
                      </>
                    )}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
              <button
                onClick={() => {
                  if (selectedProject) {
                    setTaskForm({ title: '', description: '' });
                    setEditingTask(null);
                    setShowTaskDialog(true);
                  } else {
                    setProjectForm({ title: '', description: '' });
                    setEditingProject(null);
                    setShowProjectDialog(true);
                  }
                }}
                className="px-3 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium flex items-center gap-1.5 sm:gap-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">{selectedProject ? 'Nouvelle tâche' : 'Nouveau projet'}</span>
                <span className="sm:hidden">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {selectedProject && currentProject && (
          <div className="mb-4 sm:mb-6">
            <div className={`backdrop-blur-sm rounded-xl sm:rounded-2xl border p-4 sm:p-6 shadow-lg transition-colors duration-300 ${isDark ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                 
                 <div className="min-w-0 flex-1 pl-2 sm:pl-4">

                    <h2 className={`font-semibold text-base sm:text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Progression globale</h2>
                    <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentProject.tasks.filter(t => t.completed).length} sur {currentProject.tasks.length} tâches
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {getProgress(selectedProject.id)}%
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Complété</p>
                </div>
              </div>
              <div className={`relative h-3 rounded-full overflow-hidden shadow-inner ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-700 ease-out shadow-lg"
                  style={{ width: `${getProgress(selectedProject.id)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedProject ? (
          projects.length === 0 ? (
            <div className={`backdrop-blur-sm rounded-xl sm:rounded-2xl border p-8 sm:p-12 md:p-16 text-center shadow-lg transition-colors duration-300 ${isDark ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'}`}>
           
              <h3 className={`text-lg sm:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Aucun projet pour le moment</h3>
            
              <button
                onClick={() => {
                  setProjectForm({ title: '', description: '' });
                  setShowProjectDialog(true);
                }}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Créer un projet
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => {
                const progress = getProgress(project.id);
                const completedTasks = project.tasks.filter(t => t.completed).length;

                return (
                  <div
                    key={project.id}
                    className={`group relative backdrop-blur-sm rounded-xl sm:rounded-2xl border p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 ${isDark ? 'bg-gray-800/80 border-gray-700/50 hover:border-blue-500/50' : 'bg-white/80 border-gray-200/50 hover:border-blue-200'}`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${isDark ? 'bg-gradient-to-br from-blue-900/0 via-purple-900/0 to-pink-900/0 group-hover:from-blue-900/20 group-hover:via-purple-900/10 group-hover:to-pink-900/10' : 'bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 group-hover:via-purple-50/30 group-hover:to-pink-50/20'}`} />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold truncate group-hover:text-blue-500 transition-colors text-base sm:text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {project.title}
                            </h3>
                            <p className={`text-xs flex items-center gap-1 mt-0.5 sm:mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              <span className="truncate">{project.tasks.length} tâche{project.tasks.length > 1 ? 's' : ''}</span>
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300 shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>

                      {project.description && (
                        <p className={`text-xs sm:text-sm mb-4 sm:mb-5 line-clamp-2 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {project.description}
                        </p>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Progression</span>
                          <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{completedTasks}/{project.tasks.length}</span>
                        </div>
                        <div className={`relative h-2.5 rounded-full overflow-hidden shadow-inner ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-500 shadow-md"
                            style={{ width: `${progress}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-bold">
                            {progress}% complété
                          </span>
                        </div>
                      </div>

                      <div className={`flex gap-2 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t opacity-0 group-hover:opacity-100 transition-all duration-300 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditProject(project);
                          }}
                          className={`flex-1 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-105 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Modifier</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Supprimer "${project.title}" ?`)) {
                              deleteProject(project.id);
                            }
                          }}
                          className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {currentProject?.tasks.length === 0 ? (
              <div className={`backdrop-blur-sm rounded-xl sm:rounded-2xl border p-8 sm:p-12 md:p-16 text-center shadow-lg transition-colors duration-300 ${isDark ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'}`}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                </div>
                <h3 className={`text-lg sm:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Aucune tâche pour le moment</h3>
                <p className={`text-sm sm:text-base mb-6 sm:mb-8 max-w-sm mx-auto px-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Commencez par créer votre première tâche pour ce projet</p>
                <button
                  onClick={() => {
                    setTaskForm({ title: '', description: '' });
                    setShowTaskDialog(true);
                  }}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Créer une tâche
                </button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {currentProject?.tasks.map(task => (
                  <div
                    key={task.id}
                    className={`group relative backdrop-blur-sm rounded-lg sm:rounded-xl border p-4 sm:p-5 hover:shadow-lg transition-all duration-300 ${
                      task.completed
                        ? isDark ? 'border-green-500/30 bg-green-900/20' : 'border-green-200/50 bg-green-50/30'
                        : isDark ? 'bg-gray-800/80 border-gray-700/50 hover:border-blue-500/50 hover:-translate-y-0.5' : 'bg-white/80 border-gray-200/50 hover:border-blue-200 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 sm:mt-1 shrink-0 transition-all duration-200 hover:scale-110"
                      >
                        {task.completed ? (
                          <div className="relative">
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                            <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-30 -z-10"></div>
                          </div>
                        ) : (
                          <Circle className={`w-5 h-5 sm:w-6 sm:h-6 hover:text-blue-500 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm sm:text-base mb-1 ${
                          task.completed
                            ? 'line-through text-gray-500'
                            : isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className={`text-xs sm:text-sm leading-relaxed ${
                            task.completed ? 'text-gray-500' : isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-1 sm:gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0">
                        <button
                          onClick={() => openEditTask(task)}
                          className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 hover:scale-110 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          title="Modifier"
                        >
                          <Edit2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Supprimer cette tâche ?')) {
                              deleteTask(task.id);
                            }
                          }}
                          className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 hover:scale-110 ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-50'}`}
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Project Dialog */}
      {showProjectDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className={`rounded-xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Titre du projet
                </label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="Ex: Site Web E-commerce"
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-sm sm:text-base ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                  autoFocus
                />
              </div>
              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Décrivez votre projet en quelques mots..."
                  rows={4}
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none transition-all text-sm sm:text-base ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => {
                  setShowProjectDialog(false);
                  setEditingProject(null);
                  setProjectForm({ title: '', description: '' });
                }}
                className={`flex-1 px-4 py-2.5 sm:px-5 sm:py-3 border-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 hover:scale-105 text-sm sm:text-base ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Annuler
              </button>
              <button
                onClick={editingProject ? updateProject : createProject}
                disabled={!projectForm.title.trim()}
                className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 disabled:shadow-none disabled:hover:scale-100 text-sm sm:text-base"
              >
                {editingProject ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Dialog */}
      {showTaskDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className={`rounded-xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className={`text-lg sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Titre de la tâche
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Ex: Design de la maquette"
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-sm sm:text-base ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                  autoFocus
                />
              </div>
              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>(optionnel)</span>
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Détails supplémentaires sur cette tâche..."
                  rows={4}
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none transition-all text-sm sm:text-base ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => {
                  setShowTaskDialog(false);
                  setEditingTask(null);
                  setTaskForm({ title: '', description: '' });
                }}
                className={`flex-1 px-4 py-2.5 sm:px-5 sm:py-3 border-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 hover:scale-105 text-sm sm:text-base ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Annuler
              </button>
              <button
                onClick={editingTask ? updateTask : addTask}
                disabled={!taskForm.title.trim()}
                className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 disabled:shadow-none disabled:hover:scale-100 text-sm sm:text-base"
              >
                {editingTask ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
