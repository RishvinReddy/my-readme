// storage.js - Supabase Cloud Storage Helper Functions
// All methods are async and return Promises.
// Every project field maps to a dedicated database column.

const db = () => window._supabase; // lazy getter so client is always ready

/**
 * Converts a raw Supabase row → the project object shape the UI expects.
 */
function rowToProject(row) {
  return {
    // Identity
    id:               row.id,
    createdAt:        row.created_at,
    updatedAt:        row.updated_at,

    // Basic Info
    name:             row.name,
    type:             row.type,
    oneLineIdea:      row.one_line_idea,
    problemStatement: row.problem_statement,
    uniqueAngle:      row.unique_angle,

    // Technical
    domain:           row.domain,
    deployment:       row.deployment,
    aiIntegration:    row.ai_integration,

    // Financials
    estCosts:         row.est_costs,
    estRev:           row.est_rev,

    // Scoring
    totalScore:       row.total_score,
    verdict:          row.verdict,
    tier:             row.tier,

    // Complex nested data (stored as JSONB)
    scores:           row.scores      || {},
    metrics:          row.metrics     || {},
    competitors:      row.competitors || [],
    kanban:           row.kanban      || {},
  };
}

/**
 * Converts a project object → the column payload Supabase expects.
 */
function projectToRow(projectData, id, now) {
  // Get current user ID if auth is available
  const userId = window._supabase?.auth?.getUser
    ? undefined  // resolved async in saveProject
    : null;

  return {
    id,
    created_at:        projectData.createdAt || now,
    updated_at:        now,

    // Basic Info
    name:              projectData.name             || '',
    type:              projectData.type             || '',
    one_line_idea:     projectData.oneLineIdea      || '',
    problem_statement: projectData.problemStatement || '',
    unique_angle:      projectData.uniqueAngle      || '',

    // Technical
    domain:            projectData.domain           || '',
    deployment:        projectData.deployment       || '',
    ai_integration:    projectData.aiIntegration    || '',

    // Financials
    est_costs:         projectData.estCosts  ?? 0,
    est_rev:           projectData.estRev    ?? 0,

    // Scoring
    total_score:       projectData.totalScore ?? 0,
    verdict:           projectData.verdict    || '',
    tier:              projectData.tier       || '',

    // Complex nested data (JSONB)
    scores:            projectData.scores      || {},
    metrics:           projectData.metrics     || {},
    competitors:       projectData.competitors || [],
    kanban:            projectData.kanban      || {},
  };
}

// ─── CRUD ───────────────────────────────────────────────────────────────────

/**
 * Retrieves all saved projects from Supabase, ordered newest first.
 * @returns {Promise<Array>}
 */
async function getProjects() {
  const { data, error } = await db()
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('StorageAPI.getProjects error:', error.message);
    return [];
  }
  return (data || []).map(rowToProject);
}

/**
 * Saves a new project or upserts an existing one.
 * Automatically attaches the current user's ID if logged in.
 * @param {Object} projectData
 * @returns {Promise<string>} The UUID of the saved project
 */
async function saveProject(projectData) {
  const now = new Date().toISOString();
  const id  = projectData.id || crypto.randomUUID();

  // Get current user (null if not logged in)
  const { data: { user } } = await db().auth.getUser();

  const row = projectToRow(projectData, id, now);
  if (user) row.user_id = user.id;

  const { error } = await db()
    .from('projects')
    .upsert(row, { onConflict: 'id' });

  if (error) {
    console.error('StorageAPI.saveProject error:', error.message);
    throw error;
  }
  return id;
}

/**
 * Get a specific project by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
async function getProjectById(id) {
  const { data, error } = await db()
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('StorageAPI.getProjectById error:', error.message);
    return null;
  }
  return data ? rowToProject(data) : null;
}

/**
 * Delete a project by ID.
 * @param {string} id
 * @returns {Promise<void>}
 */
async function deleteProject(id) {
  const { error } = await db()
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('StorageAPI.deleteProject error:', error.message);
    throw error;
  }
}

// Expose globally so all pages can call await window.StorageAPI.*
window.StorageAPI = {
  getProjects,
  saveProject,
  getProjectById,
  deleteProject,
};

