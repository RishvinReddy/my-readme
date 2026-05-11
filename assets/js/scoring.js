// scoring.js - Intelligent Project Decision Engine
// A standalone, testable module. No DOM dependencies.
// Call window.ScoringEngine.* from any page.

(function () {

  // ─── Criteria Weights ────────────────────────────────────────────────────────
  // Each criterion contributes a weighted max of its weight value to totalScore.
  // Total max = 100 points.
  const WEIGHTS = {
    score_problem:    9,   // Solves Real Problem
    score_techDepth:  7,   // Technical Depth
    score_modernTech: 5,   // Modern Tech Usage
    score_aiPotential:8,   // AI Integration Potential
    score_resume:     8,   // Resume Strength
    score_portfolio:  6,   // Portfolio Quality
    score_startup:    7,   // Startup Potential
    score_scalability:7,   // Scalability
    score_mvp:        6,   // Ease of MVP Dev
    score_interest:   5,   // Personal Interest
    score_learning:   5,   // Learning Value
    score_recruiter:  7,   // Recruiter Attraction
    score_deployment: 6,   // Deployment Potential
    score_github:     6,   // GitHub Showcase
    score_industry:   8,   // Industry Relevance
  };

  const MAX_RAW = Object.values(WEIGHTS).reduce((a, b) => a + b, 0); // 100

  /**
   * Calculate the weighted total score (0–100).
   * @param {Object} rawScores  e.g. { score_problem: 7, score_techDepth: 8, ... }
   * @returns {number} 0–100 integer
   */
  function calculateScore(rawScores) {
    let weighted = 0;
    for (const [key, weight] of Object.entries(WEIGHTS)) {
      const val = rawScores[key] ?? 5; // default to mid if missing
      weighted += (val / 10) * weight;
    }
    return Math.round(weighted);
  }

  /**
   * Map a total score to a Tier 1–5 classification.
   * @param {number} score 0–100
   * @returns {{ tier: string, label: string, color: string }}
   */
  function getTier(score) {
    if (score >= 90) return { tier: 'Tier 5', label: 'Research-Grade / Unicorn', color: 'emerald' };
    if (score >= 80) return { tier: 'Tier 4', label: 'Startup-Ready', color: 'primary' };
    if (score >= 65) return { tier: 'Tier 3', label: 'Strong Portfolio', color: 'accent' };
    if (score >= 50) return { tier: 'Tier 2', label: 'Learning Project', color: 'yellow' };
    return              { tier: 'Tier 1', label: 'Tutorial / Experimental', color: 'rose' };
  }

  /**
   * Determine the verdict string. Applies expert rule overrides.
   * @param {number} score
   * @param {Object} rawScores
   * @returns {string}
   */
  function getVerdict(score, rawScores) {
    const s = rawScores;

    // Expert override rules (highest priority)
    if (
      (s.score_aiPotential ?? 0) >= 8 &&
      (s.score_resume      ?? 0) >= 7 &&
      (s.score_problem     ?? 0) >= 7 &&
      score < 85
    ) {
      return 'BUILD (AI EXCEPTION)';
    }

    if (
      (s.score_startup    ?? 0) >= 9 &&
      (s.score_scalability ?? 0) >= 8
    ) {
      return 'HIGH STARTUP POTENTIAL';
    }

    // Standard score-based verdicts
    if (score >= 85) return 'BUILD IMMEDIATELY';
    if (score >= 70) return 'Strong Project';
    if (score >= 55) return 'Good Learning Project';
    if (score >= 40) return 'Experimental Only';
    return 'Skip / Rethink';
  }

  /**
   * Calculate the 5 radar-chart metrics from raw scores.
   * @param {Object} rawScores
   * @returns {{ technical, career, viability, interest, ai }}  each 1–10
   */
  function calculateMetrics(rawScores) {
    const s = rawScores;
    return {
      technical: Math.round(((s.score_techDepth ?? 5) + (s.score_modernTech ?? 5) + (s.score_scalability ?? 5)) / 3),
      career:    Math.round(((s.score_resume    ?? 5) + (s.score_portfolio  ?? 5) + (s.score_recruiter  ?? 5)) / 3),
      viability: Math.round(((s.score_problem   ?? 5) + (s.score_startup    ?? 5) + (s.score_deployment ?? 5)) / 3),
      interest:  Math.round(((s.score_interest  ?? 5) + (s.score_learning   ?? 5)) / 2),
      ai:        s.score_aiPotential ?? 5,
    };
  }

  /**
   * Full evaluation — combines all scoring steps.
   * @param {Object} rawScores
   * @returns {{ totalScore, tier, tierLabel, tierColor, verdict, metrics }}
   */
  function evaluate(rawScores) {
    const totalScore = calculateScore(rawScores);
    const { tier, label: tierLabel, color: tierColor } = getTier(totalScore);
    const verdict = getVerdict(totalScore, rawScores);
    const metrics = calculateMetrics(rawScores);
    return { totalScore, tier, tierLabel, tierColor, verdict, metrics };
  }

  // Public API
  window.ScoringEngine = { calculateScore, getTier, getVerdict, calculateMetrics, evaluate };

})();
