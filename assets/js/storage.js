// storage.js - LocalStorage Helper Functions

const STORAGE_KEY = 'project_validator_ideas';

/**
 * Retrieves all saved projects
 * @returns {Array} Array of project objects
 */
function getProjects() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Saves a new project or updates an existing one
 * @param {Object} projectData 
 * @returns {string} The ID of the saved project
 */
function saveProject(projectData) {
  const projects = getProjects();
  
  // Create new project object
  const newProject = {
    id: projectData.id || Date.now().toString(),
    createdAt: projectData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...projectData
  };

  // Check if updating
  const existingIndex = projects.findIndex(p => p.id === newProject.id);
  if (existingIndex >= 0) {
    projects[existingIndex] = newProject;
  } else {
    projects.push(newProject);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return newProject.id;
}

/**
 * Get a specific project by ID
 * @param {string} id 
 * @returns {Object|null}
 */
function getProjectById(id) {
  const projects = getProjects();
  return projects.find(p => p.id === id) || null;
}

/**
 * Delete a project by ID
 * @param {string} id 
 */
function deleteProject(id) {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// Ensure it is available globally
window.StorageAPI = {
  getProjects,
  saveProject,
  getProjectById,
  deleteProject
};
