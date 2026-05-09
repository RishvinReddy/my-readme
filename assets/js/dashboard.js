// dashboard.js - Render project results

document.addEventListener('DOMContentLoaded', () => {
  // Get ID from URL
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  if (!projectId) {
    window.location.href = 'saved.html';
    return;
  }

  const project = window.StorageAPI.getProjectById(projectId);
  
  if (!project) {
    alert('Project not found!');
    window.location.href = 'saved.html';
    return;
  }

  // Populate basic text
  document.getElementById('dbProjectName').textContent = project.name;
  document.getElementById('dbProjectIdea').textContent = project.oneLineIdea;
  document.getElementById('dbType').textContent = project.type;
  document.getElementById('dbTier').textContent = project.tier;
  document.getElementById('dbDomain').textContent = project.domain || 'N/A';
  document.getElementById('dbDeployment').textContent = project.deployment || 'N/A';
  document.getElementById('dbProblem').textContent = project.problemStatement;
  document.getElementById('dbAngle').textContent = project.uniqueAngle;
  document.getElementById('dbAi').textContent = project.aiIntegration || 'None specified';

  // Animate Score Circle
  const scoreText = document.getElementById('dbScore');
  const scoreCircle = document.getElementById('scoreCircle');
  const finalScore = project.totalScore;
  
  // Update score counter
  let currentScore = 0;
  const duration = 1500;
  const increment = finalScore / (duration / 16); // 60fps
  
  const counter = setInterval(() => {
    currentScore += increment;
    if (currentScore >= finalScore) {
      currentScore = finalScore;
      clearInterval(counter);
    }
    scoreText.textContent = Math.round(currentScore);
  }, 16);

  // Update SVG dash offset
  // Circumference is 2 * pi * r = 2 * 3.14 * 45 ≈ 283
  const offset = 283 - (283 * finalScore) / 100;
  setTimeout(() => {
    scoreCircle.style.strokeDashoffset = offset;
  }, 100);

  // Style Verdict
  const verdictEl = document.getElementById('dbVerdict');
  const verdictBg = document.getElementById('verdictBg');
  verdictEl.textContent = project.verdict;

  if (project.totalScore >= 85) {
    verdictEl.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border', 'border-emerald-500/50');
    scoreCircle.style.stroke = '#10b981'; // emerald-500
    verdictBg.classList.replace('bg-primary-600/10', 'bg-emerald-600/20');
  } else if (project.totalScore >= 70 || project.verdict.includes('BUILD (AI EXCEPTION)')) {
    verdictEl.classList.add('bg-primary-500/20', 'text-primary-400', 'border', 'border-primary-500/50');
    scoreCircle.style.stroke = '#8b5cf6'; // violet-500
  } else if (project.totalScore >= 55) {
    verdictEl.classList.add('bg-accent-500/20', 'text-accent-400', 'border', 'border-accent-500/50');
    scoreCircle.style.stroke = '#0ea5e9'; // sky-500
    verdictBg.classList.replace('bg-primary-600/10', 'bg-accent-600/20');
  } else {
    verdictEl.classList.add('bg-rose-500/20', 'text-rose-400', 'border', 'border-rose-500/50');
    scoreCircle.style.stroke = '#f43f5e'; // rose-500
    verdictBg.classList.replace('bg-primary-600/10', 'bg-rose-600/20');
  }

  // Draw Radar Chart
  const ctx = document.getElementById('radarChart').getContext('2d');
  
  // Chart.js defaults for dark theme
  Chart.defaults.color = '#94a3b8'; // slate-400
  Chart.defaults.font.family = 'Inter';

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Technical Depth', 'Career/Resume Value', 'Market Viability', 'Personal Interest', 'AI Potential'],
      datasets: [{
        label: 'Project Strengths (out of 10)',
        data: [
          project.metrics.technical,
          project.metrics.career,
          project.metrics.viability,
          project.metrics.interest,
          project.metrics.ai
        ],
        backgroundColor: 'rgba(139, 92, 246, 0.2)', // primary-500 with opacity
        borderColor: '#8b5cf6',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#8b5cf6',
        pointHoverBackgroundColor: '#8b5cf6',
        pointHoverBorderColor: '#fff',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: {
            font: { size: 12, weight: '600' },
            color: '#e2e8f0' // slate-200
          },
          ticks: {
            min: 0,
            max: 10,
            stepSize: 2,
            display: false // Hide numbers on grid lines
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#fff',
          bodyColor: '#cbd5e1',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 10,
          displayColors: false
        }
      }
    }
  });

  // Render Competitors
  const compTbody = document.getElementById('dbCompetitors');
  if (project.competitors && project.competitors.length > 0) {
    compTbody.innerHTML = '';
    project.competitors.forEach(comp => {
      compTbody.innerHTML += `
        <tr class="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
          <td class="p-3 font-medium text-white">${comp.name}</td>
          <td class="p-3 text-emerald-400/80">${comp.strengths}</td>
          <td class="p-3 text-rose-400/80">${comp.weaknesses}</td>
        </tr>
      `;
    });
  } else {
    compTbody.innerHTML = `<tr><td colspan="3" class="p-3 text-center text-slate-500">No competitors analyzed.</td></tr>`;
  }

  // --- PHASE 3 FEATURES ---

  // 1. Break-Even Analysis
  const dbFinancials = document.getElementById('dbFinancials');
  if (dbFinancials && project.estCosts !== undefined && project.estRev !== undefined) {
    if (project.estRev > 0) {
      const usersNeeded = Math.ceil(project.estCosts / project.estRev);
      dbFinancials.innerHTML = `
        <div class="flex flex-col gap-2">
          <div class="flex justify-between border-b border-white/5 pb-2">
            <span>Est. Server Costs</span> <span class="font-bold text-rose-400">$${project.estCosts}/mo</span>
          </div>
          <div class="flex justify-between border-b border-white/5 pb-2">
            <span>Est. SaaS Pricing</span> <span class="font-bold text-emerald-400">$${project.estRev}/mo</span>
          </div>
          <div class="mt-2 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-center">
            <p class="font-bold text-emerald-400 text-lg">${usersNeeded}</p>
            <p class="text-xs text-slate-400 uppercase tracking-wide">Paid Users Needed To Break Even</p>
          </div>
        </div>
      `;
    } else {
      dbFinancials.innerHTML = `<p class="text-slate-500 italic">No revenue defined. Project is a cost-center.</p>`;
    }
  }

  // 2. Tech Stack Recommender
  const dbTechStack = document.getElementById('dbTechStack');
  if (dbTechStack) {
    let stack = [];
    if (project.domain === 'AI') stack = ['Next.js', 'Python/FastAPI', 'OpenAI', 'Pinecone'];
    else if (project.domain === 'Blockchain') stack = ['Next.js', 'Solidity', 'Hardhat', 'Ethers.js'];
    else if (project.domain === 'SaaS') stack = ['Next.js', 'Tailwind', 'Supabase', 'Stripe'];
    else stack = ['React', 'Node.js', 'PostgreSQL'];

    if (project.deployment === 'Vercel') stack.push('Vercel Analytics');
    if (project.deployment === 'AWS') stack.push('AWS Lambda', 'S3');

    dbTechStack.innerHTML = stack.map(tech => `
      <span class="px-3 py-1 bg-dark-800 border border-white/10 rounded-full text-xs font-medium text-slate-300">
        ${tech}
      </span>
    `).join('');
  }

  // 3. Roast My Idea
  const dbRoast = document.getElementById('dbRoast');
  if (dbRoast && project.scores) {
    let roast = "";
    const s = project.scores;
    if (project.totalScore < 30) roast = "Ouch. This idea is so weak it wouldn't survive a single investor pitch. Did you even try?";
    else if (s.market < 4 && s.tech > 7) roast = "Ah, a classic 'Solution looking for a problem'. Great tech, but literally nobody wants to buy this. Welcome to GitHub graveyard.";
    else if (s.tech < 4) roast = "This is just a CRUD app. A weekend tutorial project. Calling it a 'Startup' is an insult to startups.";
    else if (project.totalScore > 80) roast = "Okay, I'll admit... this is actually a solid idea. You might just pull this off. Stop reading this and go build it.";
    else roast = "It's completely average. Not terrible, not a unicorn. You'll probably build 40% of it and then abandon it for a new idea.";
    
    dbRoast.textContent = `"${roast}"`;
  }

  // 4. Interactive Kanban Board
  const kanbanTodo = document.getElementById('kanban-todo');
  const kanbanProgress = document.getElementById('kanban-progress');
  const kanbanDone = document.getElementById('kanban-done');

  if (kanbanTodo) {
    const phases = [
      { id: 'p1', title: "1. Architecture", desc: "Define system design." },
      { id: 'p2', title: "2. UI/UX Design", desc: "Wireframing." },
      { id: 'p3', title: "3. Backend Setup", desc: "Initialize environments." },
      { id: 'p4', title: "4. Database", desc: "Schema design." },
      { id: 'p5', title: "5. Core APIs", desc: "Develop main endpoints." },
      { id: 'p6', title: "6. Auth", desc: "Implement login." },
      { id: 'p7', title: "7. AI Integration", desc: "Add smart features." },
      { id: 'p8', title: "8. Frontend MVP", desc: "Connect UI to APIs." },
      { id: 'p9', title: "9. Deployment", desc: "Push to production." },
      { id: 'p10', title: "10. Launch", desc: "Marketing & Launch." }
    ];

    // Load saved kanban state or default to everything in "todo"
    const savedState = project.kanban || {};
    
    phases.forEach((phase) => {
      const card = document.createElement('div');
      card.className = "bg-dark-900 border border-white/5 p-3 rounded-lg shadow-md mb-3 cursor-move hover:border-primary-500/50 transition-colors";
      card.draggable = true;
      card.id = `card-${phase.id}`;
      card.innerHTML = `
        <h5 class="text-white text-xs font-bold">${phase.title}</h5>
        <p class="text-slate-400 text-[10px] mt-1">${phase.desc}</p>
      `;

      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.id);
        setTimeout(() => card.classList.add('opacity-50'), 0);
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('opacity-50');
      });

      const colStatus = savedState[phase.id] || 'todo';
      if (colStatus === 'progress') kanbanProgress.appendChild(card);
      else if (colStatus === 'done') kanbanDone.appendChild(card);
      else kanbanTodo.appendChild(card);
    });

    // Handle Drag & Drop events for columns
    [kanbanTodo, kanbanProgress, kanbanDone].forEach(col => {
      col.addEventListener('dragover', e => e.preventDefault());
      col.addEventListener('drop', e => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(cardId);
        if (card) {
          col.appendChild(card);
          // Save state
          if (!project.kanban) project.kanban = {};
          project.kanban[cardId.replace('card-', '')] = col.dataset.status;
          window.StorageAPI.saveProject(project);
        }
      });
    });
  }

  // PDF Export Logic
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      // Hide buttons temporarily
      downloadPdfBtn.style.display = 'none';
      const newProjBtn = downloadPdfBtn.nextElementSibling;
      if(newProjBtn) newProjBtn.style.display = 'none';

      const element1 = document.getElementById('exportableDashboard');
      const element2 = document.getElementById('exportableLower');
      
      // We will wrap them in a temporary div to export everything
      const wrap = document.createElement('div');
      wrap.style.padding = '20px';
      wrap.style.backgroundColor = '#0f172a'; // dark-900
      wrap.appendChild(element1.cloneNode(true));
      wrap.appendChild(element2.cloneNode(true));
      
      const opt = {
        margin:       0.5,
        filename:     `${project.name.replace(/\s+/g, '-').toLowerCase()}-analysis.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, backgroundColor: '#0f172a', useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(wrap).save().then(() => {
        downloadPdfBtn.style.display = 'flex';
        if(newProjBtn) newProjBtn.style.display = 'flex';
      });
    });
  }

});
