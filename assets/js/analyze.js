// analyze.js - Logic for the analyze form

const scorecardCriteria = [
  { id: 'score_problem', label: 'Solves Real Problem' },
  { id: 'score_techDepth', label: 'Technical Depth' },
  { id: 'score_modernTech', label: 'Modern Tech Usage' },
  { id: 'score_aiPotential', label: 'AI Integration Potential' },
  { id: 'score_resume', label: 'Resume Strength' },
  { id: 'score_portfolio', label: 'Portfolio Quality' },
  { id: 'score_startup', label: 'Startup Potential' },
  { id: 'score_scalability', label: 'Scalability' },
  { id: 'score_mvp', label: 'Ease of MVP Dev' },
  { id: 'score_interest', label: 'Personal Interest' },
  { id: 'score_learning', label: 'Learning Value' },
  { id: 'score_recruiter', label: 'Recruiter Attraction' },
  { id: 'score_deployment', label: 'Deployment Potential' },
  { id: 'score_github', label: 'GitHub Showcase' },
  { id: 'score_industry', label: 'Industry Relevance' }
];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('analyzeForm');
  const scorecardContainer = document.getElementById('scorecardFields');
  const competitorsContainer = document.getElementById('competitorsContainer');
  const addCompetitorBtn = document.getElementById('addCompetitorBtn');

  // Wizard Logic
  let currentStep = 1;
  const totalSteps = 5;
  const progressBar = document.getElementById('progressBar');

  function updateWizard(step) {
    // Hide all
    for(let i=1; i<=totalSteps; i++) {
      const sec = document.getElementById(`step${i}`);
      if(sec) {
        sec.classList.add('hidden');
        sec.classList.remove('animate-fade-in-up');
      }
      const label = document.getElementById(`stepLabel${i}`);
      if(label) {
        label.classList.remove('text-primary-400');
        label.classList.add('text-slate-500');
      }
    }
    
    // Show current
    const currentSec = document.getElementById(`step${step}`);
    currentSec.classList.remove('hidden');
    currentSec.classList.add('animate-fade-in-up');
    
    // Update labels up to current step
    for(let i=1; i<=step; i++) {
      const label = document.getElementById(`stepLabel${i}`);
      if(label) {
        label.classList.add('text-primary-400');
        label.classList.remove('text-slate-500');
      }
    }

    // Update progress bar
    if(progressBar) {
      progressBar.style.width = `${(step / totalSteps) * 100}%`;
    }
  }

  // Next/Prev Buttons
  document.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = parseInt(e.target.closest('button').dataset.target);
      
      // Basic validation check before proceeding
      const currentSection = document.getElementById(`step${currentStep}`);
      const requiredInputs = currentSection.querySelectorAll('input[required], textarea[required], select[required]');
      let isValid = true;
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('border-rose-500', 'ring-1', 'ring-rose-500');
          isValid = false;
        } else {
          input.classList.remove('border-rose-500', 'ring-1', 'ring-rose-500');
        }
      });

      if (!isValid) {
        if(window.showToast) window.showToast('Please fill out all required fields.', 'error');
        return;
      }

      currentStep = target;
      updateWizard(currentStep);
    });
  });

  document.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentStep = parseInt(e.target.closest('button').dataset.target);
      updateWizard(currentStep);
    });
  });

  // Competitor Logic
  let competitorCount = 0;
  function addCompetitorRow() {
    competitorCount++;
    const div = document.createElement('div');
    div.className = 'grid grid-cols-1 md:grid-cols-12 gap-4 items-center competitor-row';
    div.innerHTML = `
      <div class="md:col-span-3">
        <input type="text" class="input-field comp-name" placeholder="Competitor Name">
      </div>
      <div class="md:col-span-4">
        <input type="text" class="input-field comp-strength" placeholder="Their Strengths">
      </div>
      <div class="md:col-span-4">
        <input type="text" class="input-field comp-weakness" placeholder="Their Weaknesses">
      </div>
      <div class="md:col-span-1 flex justify-end">
        <button type="button" class="text-slate-500 hover:text-rose-400 transition-colors" onclick="this.parentElement.parentElement.remove()">
          <i class="ph ph-trash text-xl"></i>
        </button>
      </div>
    `;
    competitorsContainer.appendChild(div);
  }

  if (addCompetitorBtn) {
    addCompetitorBtn.addEventListener('click', addCompetitorRow);
    // Add one empty row by default
    addCompetitorRow();
  }

  // Inject scoring fields
  if (scorecardContainer) {
    scorecardCriteria.forEach(criteria => {
      const div = document.createElement('div');
      div.className = 'flex flex-col';
      div.innerHTML = `
        <label for="${criteria.id}" class="label-text truncate" title="${criteria.label}">
          ${criteria.label}
        </label>
        <div class="flex items-center gap-3">
          <input type="range" id="${criteria.id}" min="1" max="10" value="5" class="w-full accent-primary-500" 
                 oninput="this.nextElementSibling.textContent = this.value">
          <span class="text-primary-400 font-bold w-6 text-right">5</span>
        </div>
      `;
      scorecardContainer.appendChild(div);
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('calculateBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ph ph-spinner animate-spin"></i> Saving...';
      }

      // Gather Competitors
      const competitors = [];
      document.querySelectorAll('.competitor-row').forEach(row => {
        const name = row.querySelector('.comp-name').value;
        const str = row.querySelector('.comp-strength').value;
        const weak = row.querySelector('.comp-weakness').value;
        if (name) {
          competitors.push({ name, strengths: str, weaknesses: weak });
        }
      });

      // Gather Basic Data
      const projectData = {
        name: document.getElementById('projectName').value,
        type: document.getElementById('projectType').value,
        oneLineIdea: document.getElementById('oneLineIdea').value,
        problemStatement: document.getElementById('problemStatement').value,
        uniqueAngle: document.getElementById('uniqueAngle').value,
        domain: document.getElementById('domain').value,
        deployment: document.getElementById('deployment').value,
        aiIntegration: document.getElementById('aiIntegration').value,
        estCosts: Number(document.getElementById('estCosts').value) || 0,
        estRev: Number(document.getElementById('estRev').value) || 0,
        competitors: competitors,
        scores: {}
      };

      // Gather Scores (raw 1-10 per criterion)
      scorecardCriteria.forEach(criteria => {
        const val = parseInt(document.getElementById(criteria.id).value, 10);
        projectData.scores[criteria.id] = val;
      });

      try {
        // ── Delegate entirely to ScoringEngine ───────────────────────────
        const result = window.ScoringEngine.evaluate(projectData.scores);
        projectData.totalScore = result.totalScore;
        projectData.metrics    = result.metrics;
        projectData.verdict    = result.verdict;
        projectData.tier       = result.tier;

        // Save to Supabase cloud
        const savedId = await window.StorageAPI.saveProject(projectData);
        window.location.href = `dashboard.html?id=${savedId}`;
      } catch (err) {
        console.error('Failed to save project:', err);
        if (window.showToast) window.showToast('Failed to save project. Check console for details.', 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="ph-bold ph-calculator"></i> Calculate Verdict';
        }
      }
    });
  }
});

