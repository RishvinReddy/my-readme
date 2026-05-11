// ai-engine.js - Intelligent Project Analysis Engine
// Rule-based smart analysis — no external API key required.
// When a Gemini/OpenAI key is added, swap generateWithAI() below.

(function () {

  // ── Tech Stack Library ────────────────────────────────────────────────────
  const STACKS = {
    AI:         { frontend: ['Next.js','React'], backend: ['Python/FastAPI','Node.js'], db: ['PostgreSQL','Pinecone','Redis'], infra: ['Vercel','AWS','Docker'], ai: ['OpenAI API','LangChain','Hugging Face','ChromaDB'] },
    Blockchain: { frontend: ['Next.js','React'], backend: ['Solidity','Hardhat','Node.js'], db: ['IPFS','PostgreSQL'], infra: ['Ethereum','Polygon','Vercel'], ai: [] },
    SaaS:       { frontend: ['Next.js','React','Tailwind CSS'], backend: ['Node.js/Express','Supabase'], db: ['PostgreSQL','Redis'], infra: ['Vercel','Railway','Stripe'], ai: ['OpenAI'] },
    IoT:        { frontend: ['React','Vue.js'], backend: ['Python/MQTT','Node.js'], db: ['InfluxDB','TimescaleDB'], infra: ['AWS IoT','Raspberry Pi','Docker'], ai: ['TensorFlow Lite'] },
    Cybersecurity: { frontend: ['React','Svelte'], backend: ['Python/Flask','Rust'], db: ['PostgreSQL','Elasticsearch'], infra: ['Docker','Kubernetes','Linux'], ai: ['ML anomaly detection'] },
    Web:        { frontend: ['React/Next.js','Tailwind CSS'], backend: ['Node.js','Supabase'], db: ['PostgreSQL','Redis'], infra: ['Vercel','Railway'], ai: [] },
    Mobile:     { frontend: ['React Native','Flutter'], backend: ['Node.js','Supabase'], db: ['PostgreSQL','SQLite'], infra: ['Expo','App Store','Play Store'], ai: [] },
    Default:    { frontend: ['React','HTML/CSS/JS'], backend: ['Node.js','Express'], db: ['PostgreSQL','MongoDB'], infra: ['Vercel','Railway'], ai: [] },
  };

  // ── Risk Library ─────────────────────────────────────────────────────────
  const RISKS = {
    score_problem:    { low: 'No clearly validated user pain point — high risk of building something nobody wants.' },
    score_techDepth:  { low: 'Shallow technical complexity makes this hard to differentiate on a resume or portfolio.' },
    score_startup:    { low: 'Low startup viability — difficult to monetize or attract investment.' },
    score_scalability:{ low: 'Scalability concerns — current design may not handle production load.' },
    score_mvp:        { low: 'High MVP complexity — risk of never shipping. Consider cutting scope.' },
    score_recruiter:  { low: 'Low recruiter appeal — consider adding a unique angle or modern tech.' },
    score_aiPotential:{ low: 'No AI integration — missing the most valued skill in 2024 hiring market.' },
    score_deployment: { low: 'No clear deployment strategy — unshipped projects have zero portfolio value.' },
    score_industry:   { low: 'Low industry relevance — may not align with current hiring trends.' },
  };

  // ── Market Insights ───────────────────────────────────────────────────────
  const MARKET_INSIGHTS = {
    AI:           'The AI/ML market is projected to reach $1.8T by 2030. Projects that integrate LLMs, RAG pipelines, or autonomous agents have extremely high hiring demand.',
    Blockchain:   'Web3 hiring has stabilized post-2022. Focus on DeFi, NFT infrastructure, or cross-chain tooling for maximum market relevance.',
    SaaS:         'B2B SaaS remains the most fundable vertical. If you can solve a workflow pain for SMEs with a clean API, you have a viable business.',
    IoT:          'Industrial IoT and smart cities are growing at 25% CAGR. Edge computing + real-time telemetry is the sweet spot.',
    Cybersecurity:'Cybersecurity talent shortage = 3.5M unfilled roles globally. Any project demonstrating security-first architecture is instantly attractive to employers.',
    Web:          'Full-stack web projects are table stakes. Add real-time features, AI, or unusual architecture to stand out.',
    Mobile:       'Cross-platform mobile (React Native / Flutter) skills are in high demand, especially combined with offline-first or AI features.',
    Default:      'Focus on solving a specific domain problem. Generic projects are forgettable — a narrow niche with deep value wins every time.',
  };

  // ── Feasibility Ratings ───────────────────────────────────────────────────
  function getFeasibilityRating(score) {
    if (score >= 85) return { label: 'Highly Feasible', color: 'emerald', detail: 'This project is well-defined, technically achievable, and market-validated. Execute immediately.' };
    if (score >= 70) return { label: 'Feasible',        color: 'primary', detail: 'Solid concept with good viability. Address 1-2 weak areas before starting to maximize success.' };
    if (score >= 55) return { label: 'Moderately Feasible', color: 'accent', detail: 'The core idea is sound but needs refinement in problem definition or technical strategy.' };
    if (score >= 40) return { label: 'Low Feasibility', color: 'amber', detail: 'Significant risks present. Validate the core assumption first before investing build time.' };
    return              { label: 'Not Feasible',   color: 'rose',  detail: 'Fundamental issues in problem-market fit or technical approach. Consider pivoting.' };
  }

  // ── Main Analysis Function ────────────────────────────────────────────────
  function analyzeProject(project) {
    const scores = project.scores || {};
    const domain = project.domain || 'Default';
    const stack  = STACKS[domain] || STACKS.Default;

    // ─── Recommended Stack
    const recommendedStack = [
      ...stack.frontend.slice(0, 2),
      ...stack.backend.slice(0, 2),
      ...stack.db.slice(0, 1),
      ...stack.infra.slice(0, 2),
      ...(stack.ai.length ? stack.ai.slice(0, 1) : []),
    ];

    // ─── Top Risks (pick worst-scoring areas)
    const risks = [];
    for (const [key, riskInfo] of Object.entries(RISKS)) {
      const val = scores[key] ?? 5;
      if (val <= 4) risks.push({ severity: 'High',   text: riskInfo.low });
      else if (val <= 6) risks.push({ severity: 'Medium', text: `${key.replace('score_', '').replace(/([A-Z])/g, ' $1').trim()} score is moderate — consider strengthening before launch.` });
    }
    // Keep top 4 by priority (High first, then Medium)
    const topRisks = [
      ...risks.filter(r => r.severity === 'High').slice(0, 2),
      ...risks.filter(r => r.severity === 'Medium').slice(0, 2),
    ].slice(0, 4);

    if (topRisks.length === 0) {
      topRisks.push({ severity: 'Low', text: 'No critical risks detected. Proceed with confidence — validate with real users early.' });
    }

    // ─── Feasibility
    const feasibility = getFeasibilityRating(project.totalScore || 0);

    // ─── Market Insight
    const marketInsight = MARKET_INSIGHTS[domain] || MARKET_INSIGHTS.Default;

    // ─── Resume Impact Summary
    const resumeScore  = scores.score_resume    || 5;
    const recruiterScore = scores.score_recruiter || 5;
    const avgResume    = Math.round((resumeScore + recruiterScore) / 2);
    let resumeImpact;
    if (avgResume >= 8)      resumeImpact = 'Exceptional — this project will be a top talking point in any technical interview.';
    else if (avgResume >= 6) resumeImpact = 'Strong — adds clear technical depth to your portfolio. Document it thoroughly.';
    else                     resumeImpact = 'Moderate — add a more complex feature or unique integration to boost recruiter appeal.';

    // ─── Startup Potential
    const startupScore = scores.score_startup || 5;
    const scaleScore   = scores.score_scalability || 5;
    let startupPotential;
    if (startupScore >= 8 && scaleScore >= 7) startupPotential = '🚀 High — this could become a real product. Validate with 10 real users before building V2.';
    else if (startupScore >= 6)               startupPotential = '📈 Medium — viable niche product. Focus on a single killer feature first.';
    else                                       startupPotential = '🎓 Low — better as a portfolio/learning project than a startup.';

    // ─── One-paragraph executive summary
    const summary = buildSummary(project, feasibility, domain);

    // ─── 3-line Startup Pitch
    const pitch = buildPitch(project, domain);

    return {
      feasibility,
      recommendedStack,
      topRisks,
      marketInsight,
      resumeImpact,
      startupPotential,
      summary,
      pitch,
    };
  }

  function buildSummary(project, feasibility, domain) {
    const name    = project.name     || 'This project';
    const idea    = project.oneLineIdea || project.problemStatement || 'an innovative solution';
    const tier    = project.tier     || 'Tier 2';
    const score   = project.totalScore || 0;
    return `${name} is a ${tier} ${domain || 'tech'} project with a viability score of ${score}/100. ` +
           `Classified as "${feasibility.label}", it ${feasibility.detail.toLowerCase()} ` +
           `The core idea — "${idea}" — ${score >= 70 ? 'shows strong market potential and technical merit.' : 'needs refinement in key areas before execution.'}`;
  }

  function buildPitch(project, domain) {
    const name    = project.name          || 'Our product';
    const problem = project.problemStatement || 'a key industry problem';
    const angle   = project.uniqueAngle   || 'a smarter, faster approach';
    return [
      `🎯 Problem: ${problem.slice(0, 120)}${problem.length > 120 ? '...' : ''}`,
      `💡 Solution: ${name} solves this with ${angle.slice(0, 120)}${angle.length > 120 ? '...' : ''}`,
      `📈 Market: ${MARKET_INSIGHTS[domain]?.split('.')[0] || 'Large and growing market with strong demand.'}`,
    ];
  }

  // ── Roadmap Generator ─────────────────────────────────────────────────────
  const PHASE_TEMPLATES = {
    'Portfolio': [
      { week: '1–2',  phase: 'Planning & Design',    tasks: ['Create detailed wireframes','Define core features (MVP scope)','Set up Git repo & project structure','Choose tech stack and configure dev environment'] },
      { week: '3–5',  phase: 'Core Development',     tasks: ['Build data models and database schema','Implement core business logic','Create primary UI components','Connect frontend to backend'] },
      { week: '6–7',  phase: 'Features & Polish',    tasks: ['Add authentication if needed','Implement error handling','Add loading states and animations','Write unit tests for critical paths'] },
      { week: '8',    phase: 'Deployment & Launch',  tasks: ['Deploy to Vercel / Netlify / Railway','Set up custom domain','Write README with screenshots and setup guide','Add to portfolio and LinkedIn'] },
    ],
    'Startup': [
      { week: '1',    phase: 'Discovery & Validation', tasks: ['Interview 10 potential users','Define problem-solution fit','Create landing page + waitlist','Write 1-page business plan'] },
      { week: '2–3',  phase: 'Architecture & Design',  tasks: ['System architecture diagram','Database schema + API design','UI/UX wireframes (Figma)','Set up monorepo + CI/CD pipeline'] },
      { week: '4–7',  phase: 'MVP Development',        tasks: ['Build auth + user management','Implement core product flow','Integrate payments (Stripe)','Basic admin dashboard'] },
      { week: '8–9',  phase: 'Beta Testing',           tasks: ['Onboard 10 beta users','Collect and prioritize feedback','Fix critical bugs','Implement top-requested feature'] },
      { week: '10–12',phase: 'Launch',                 tasks: ['Product Hunt launch','Set up analytics (Mixpanel / PostHog)','Build email drip campaign','Reach out to 50 potential customers'] },
    ],
    'Research': [
      { week: '1–2',  phase: 'Literature Review',    tasks: ['Review 20+ papers on the topic','Define research questions and hypotheses','Select datasets and evaluation metrics','Set up experiment environment'] },
      { week: '3–5',  phase: 'Implementation',       tasks: ['Implement baseline model/system','Run initial experiments','Document methodology','Version control all experiments (MLflow/W&B)'] },
      { week: '6–8',  phase: 'Evaluation',           tasks: ['Compare against SOTA benchmarks','Statistical significance testing','Ablation studies','Visualize results and plots'] },
      { week: '9–10', phase: 'Documentation & Publication', tasks: ['Write technical paper / thesis chapter','Prepare GitHub repo with reproducible code','Create demo/presentation','Submit to conference or publish on ArXiv'] },
    ],
    'Internship': [
      { week: '1',    phase: 'Onboarding',           tasks: ['Understand project requirements','Set up dev environment','Review existing codebase','Meet stakeholders and align expectations'] },
      { week: '2–4',  phase: 'Development',          tasks: ['Complete assigned feature development','Follow team code review process','Write documentation for your code','Daily standups + progress updates'] },
      { week: '5–6',  phase: 'Testing & Integration',tasks: ['Write unit and integration tests','Fix bugs found in code review','Integration testing with team','Prepare demo for mid-review'] },
      { week: '7–8',  phase: 'Delivery & Handoff',   tasks: ['Final demo to stakeholders','Complete all documentation','Code cleanup and PR merge','Handoff notes for next developer'] },
    ],
  };

  function generateRoadmap(project) {
    const type     = project.type || 'Portfolio';
    const phases   = PHASE_TEMPLATES[type] || PHASE_TEMPLATES['Portfolio'];
    const domain   = project.domain || '';
    const hasAI    = (project.scores?.score_aiPotential || 0) >= 7;
    const highScale = (project.scores?.score_scalability || 0) >= 7;

    // Add AI-specific tasks if relevant
    if (hasAI) {
      const buildPhase = phases.find(p => p.phase.includes('Development') || p.phase.includes('Core'));
      if (buildPhase) {
        buildPhase.tasks.push('Integrate AI/ML model or LLM API');
        buildPhase.tasks.push('Implement prompt engineering and response parsing');
      }
    }
    // Add scalability tasks
    if (highScale) {
      const lastPhase = phases[phases.length - 1];
      lastPhase.tasks.push('Load testing and performance benchmarking');
      lastPhase.tasks.push('Set up monitoring and alerting (Grafana / Datadog)');
    }

    // Key milestones
    const milestones = [
      { label: 'Kickoff',     week: 'Week 1',    desc: 'Requirements finalized, dev environment ready' },
      { label: 'First Build', week: phases[1] ? `Week ${phases[1].week.split('–')[0]}` : 'Week 3', desc: 'Working prototype with core feature' },
      { label: 'Beta Ready',  week: phases[Math.floor(phases.length * 0.75)] ? `Week ${phases[Math.floor(phases.length * 0.75)].week.split('–')[0]}` : 'Week 7', desc: 'Feature-complete, testing begins' },
      { label: '🚀 Launch',   week: `Week ${phases[phases.length - 1].week.split('–').pop()}`, desc: 'Deployed and publicly accessible' },
    ];

    return { phases, milestones, totalWeeks: phases[phases.length - 1].week.split('–').pop() };
  }

  // ── PRD Generator ─────────────────────────────────────────────────────────
  function generatePRD(project) {
    const stacks = STACKS[project.domain] || STACKS.Default;
    const analysis = analyzeProject(project);
    const roadmap  = generateRoadmap(project);

    return {
      title:          `Product Requirements Document — ${project.name}`,
      version:        '1.0.0',
      date:           new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      overview: {
        productName:  project.name,
        productType:  project.type,
        oneLinePitch: project.oneLineIdea,
        problemStatement: project.problemStatement,
        uniqueAngle:  project.uniqueAngle,
        targetUsers:  `Developers, ${project.domain || 'tech'} professionals, and end users who face the stated problem`,
      },
      goals: [
        `Validate the core problem: ${(project.problemStatement || '').slice(0, 80)}`,
        `Build an MVP within ${roadmap.totalWeeks} weeks with the minimum viable feature set`,
        `Achieve a viability score above ${project.totalScore + 5}/100 after launch iteration`,
        `Deploy to production and gather real user feedback within first month`,
      ],
      outOfScope: [
        'Internationalization (v1 English-only)',
        'Mobile native app (web-first approach)',
        'Advanced analytics dashboard (post-MVP)',
        'Marketplace or multi-tenant features (V2)',
      ],
      userStories: buildUserStories(project),
      techStack:   stacks,
      successMetrics: [
        '10 active users within first 2 weeks of launch',
        '< 3s page load time on 4G',
        '0 critical security vulnerabilities (OWASP Top 10)',
        'Core user flow completable in < 2 minutes',
        `Viability score maintained above ${project.totalScore}/100`,
      ],
      risks:       analysis.topRisks,
      roadmap:     roadmap.phases,
    };
  }

  function buildUserStories(project) {
    const name = project.name || 'the product';
    return [
      { role: 'New User',      story: `As a new user, I want to sign up and access ${name} in under 60 seconds, so I can evaluate it without friction.` },
      { role: 'Core User',     story: `As a core user, I want to use the primary feature of ${name} to solve my problem, so I save time/effort vs. alternatives.` },
      { role: 'Power User',    story: `As a power user, I want to export or share my data from ${name}, so I can use it across my workflow.` },
      { role: 'Administrator', story: `As an admin, I want to monitor system health and user activity, so I can ensure the product stays reliable.` },
      { role: 'Mobile User',   story: `As a mobile user, I want the core features to work on my phone, so I'm not restricted to a desktop.` },
    ];
  }

  // Public API
  window.AIEngine = {
    analyzeProject,
    generateRoadmap,
    generatePRD,
    getFeasibilityRating,
  };

})();
