// os-engine.js - The 50-Feature AI Developer OS Heuristic Brain

window.OSEngine = {
  analyze: function(idea) {
    const text = idea.toLowerCase();
    
    // Core Detectors
    const isAI = text.includes('ai') || text.includes('llm') || text.includes('gpt') || text.includes('agent');
    const isSaaS = text.includes('saas') || text.includes('b2b') || text.includes('dashboard');
    const isWeb3 = text.includes('crypto') || text.includes('blockchain') || text.includes('web3') || text.includes('nft');
    const isMobile = text.includes('app') || text.includes('ios') || text.includes('android');
    const isRealtime = text.includes('chat') || text.includes('live') || text.includes('sync');
    const isSecurity = text.includes('security') || text.includes('auth') || text.includes('crypto');

    return {
      cat1_eng: this._c1(isAI, isWeb3, isRealtime, isMobile),
      cat2_prod: this._c2(isAI, isMobile, isWeb3, isRealtime),
      cat3_biz: this._c3(isSaaS, isAI, isWeb3),
      cat4_git: this._c4(isAI, isSaaS),
      cat5_code: this._c5(isAI, isWeb3),
      cat6_hack: this._c6(isAI, isWeb3, isRealtime),
      cat7_collab: this._c7(),
      cat8_adv: this._c8(isAI, isRealtime, isWeb3),
      cat9_car: this._c9(isAI, isSecurity, isWeb3, isSaaS),
      cat10_fut: this._c10(isAI)
    };
  },

  // 1. ENGINEERING INTELLIGENCE
  _c1: function(isAI, isWeb3, isRealtime, isMobile) {
    let architect = "Client App -> API Gateway -> Auth Service -> Core Backend -> Primary DB";
    let stack = ['React', 'Node.js', 'PostgreSQL', 'Vercel'];
    let security = ['Basic Auth Flaws', 'CORS Misconfig', 'SQL Injection'];
    let cost = '$50/mo';
    let deploy = 'Deploy frontend to Vercel, backend to Render, DB on Supabase.';
    let api = ['Stripe', 'Resend', 'Google Auth'];

    if (isAI) {
      architect = "Client App -> Edge Functions -> Auth -> Vector DB & Core DB -> LLM Provider";
      stack = ['Next.js', 'Python FastAPI', 'PgVector', 'Vercel'];
      security.push('Prompt Injection', 'Data Poisoning', 'API Token Leak');
      cost = '$150/mo (High Token Cost)';
      deploy = 'Deploy Edge functions on Vercel, Python workers on AWS/Render.';
      api.push('OpenAI', 'Pinecone', 'LangChain');
    }
    if (isWeb3) {
      architect = "dApp Client -> Wallet Provider -> RPC Node -> Smart Contract";
      stack.push('Solidity', 'Hardhat', 'ethers.js');
      security.push('Reentrancy Attacks', 'Smart Contract Bugs');
      api.push('Alchemy', 'WalletConnect');
    }
    if (isRealtime) {
      architect = "Client -> Load Balancer -> WebSocket Servers -> Redis PubSub -> DB";
      stack.push('Socket.io', 'Redis');
      api.push('Pusher');
    }
    return { f1_architect: architect, f2_stack: stack, f3_security: security, f4_cost: cost, f5_deploy: deploy, f6_api: api };
  },

  // 2. PRODUCTIVITY
  _c2: function(isAI, isMobile, isWeb3, isRealtime) {
    let sprint = ['W1: Auth & Schema', 'W2: Core API', 'W3: Frontend', 'W4: Polish & Launch'];
    let learn = ['REST APIs', 'React State', 'Database Design'];
    let skillgap = ['Advanced System Design', 'DevOps'];
    let role = ['Full-Stack Dev', 'UI Designer'];
    let time = '4-6 Weeks';
    let bug = 'State sync issues, slow DB queries.';

    if (isAI) {
      learn.push('RAG Architecture', 'Prompt Engineering');
      skillgap.push('Vector Databases', 'LLM Fine-tuning');
      role.push('AI Engineer');
      bug = 'LLM Hallucinations, High Latency API calls, Context Window Limits.';
      time = '6-8 Weeks';
    }
    if (isRealtime) {
      role.push('Backend Engineer (Sockets)');
      bug = 'WebSocket disconnects, Redis memory leaks.';
    }
    return { f7_sprint: sprint, f8_learn: learn, f9_skillgap: skillgap, f10_role: role, f11_time: time, f12_bug: bug };
  },

  // 3. STARTUP
  _c3: function(isSaaS, isAI, isWeb3) {
    let viability = '75/100 - Solid standard market';
    let competitor = ['Incumbents are bloated', 'High fragmentation'];
    let monetization = ['Freemium', 'Ads', 'Pro Tier'];
    let investor = 'Focus on user acquisition metrics before pitching.';
    let pitchdeck = 'Problem: Slow manual workflows. Solution: Automated tracking. Market: $1B+ TAM.';

    if (isSaaS) {
      viability = '88/100 - Strong B2B Demand';
      monetization = ['Per-seat pricing', 'Enterprise Tier'];
      investor = 'Highly scalable recurring revenue. Needs strong GTM strategy.';
    }
    if (isAI) {
      viability = '95/100 - High Hype / High Growth';
      competitor.push('Rapidly evolving AI startups', 'OpenAI eating features');
      monetization = ['Usage-based / Pay-per-token'];
      pitchdeck = 'Problem: 80% of time wasted on manual data. Solution: Autonomous AI agent pipeline.';
    }
    return { f13_viability: viability, f14_competitor: competitor, f15_monetization: monetization, f16_investor: investor, f17_pitchdeck: pitchdeck };
  },

  // 4. GITHUB
  _c4: function(isAI, isSaaS) {
    let repo = 'Standard monorepo: /frontend, /backend, /docs';
    let readme = 'Needs architecture diagram, local setup steps, and env vars list.';
    let codebase = 'Medium complexity. Ensure clean separation of concerns.';
    let opensource = 'Moderate. Good for portfolio, hard to build huge community.';
    let archquality = '80/100 - Standard MVC structure.';

    if (isAI) {
      repo = 'Monorepo: /client, /api, /ai-workers, /notebooks';
      readme = 'CRITICAL: Must explain how to provision Vector DB and get LLM keys.';
      opensource = 'High Potential. Open source AI tools attract massive GitHub stars.';
    }
    return { f18_repo: repo, f19_readme: readme, f20_codebase: codebase, f21_opensource: opensource, f22_archquality: archquality };
  },

  // 5. CODING ECOSYSTEM
  _c5: function(isAI, isWeb3) {
    let prd = 'Core features: Auth, Dashboard, CRUD entities, Settings.';
    let trd = 'Node.js API, JWT Auth, Postgres JSONB fields.';
    let schema = 'Users (id, email), Projects (id, user_id, data).';
    let apiroute = 'POST /api/v1/auth/login, GET /api/v1/data, PUT /api/v1/data/:id';
    let prompt = 'Not heavily prompt-dependent.';
    let docs = 'Use Swagger/OpenAPI for REST docs. Storybook for UI.';

    if (isAI) {
      schema = 'Users, Documents (id, text, embedding vector), Logs.';
      apiroute = 'POST /api/v1/generate, GET /api/v1/history';
      prompt = 'System: You are an expert assistant. Context: {doc}. Query: {input}';
    }
    return { f23_prd: prd, f24_trd: trd, f25_schema: schema, f26_apiroute: apiroute, f27_prompt: prompt, f28_docs: docs };
  },

  // 6. HACKATHON
  _c6: function(isAI, isWeb3, isRealtime) {
    let success = '65% - Needs extreme polish to stand out.';
    let mvpcomp = 'Hardcode the user profile and settings. Build only ONE working end-to-end flow.';
    let teamopt = '2 Devs, 1 UI/Pitch Specialist.';
    let demoday = 'Start with the problem. Show the "Aha!" moment in 30 seconds. End with future vision.';

    if (isAI) {
      success = '85% - Judges love AI. High wow factor.';
      mvpcomp = 'Use OpenAI API directly from frontend if needed to save time. Mock the DB.';
    }
    return { f29_success: success, f30_mvpcomp: mvpcomp, f31_teamopt: teamopt, f32_demoday: demoday };
  },

  // 7. COLLABORATION
  _c7: function() {
    return {
      f33_workspace: 'Recommend: Notion for docs, Discord for live chat, GitHub for code.',
      f34_boards: 'Linear or GitHub Projects for issue tracking.',
      f35_meeting: 'Daily 15-min standup: Blockers, Yesterday, Today.',
      f36_codereview: 'Require 1 approval for PRs. Enforce ESLint & Prettier.'
    };
  },

  // 8. ADVANCED AI
  _c8: function(isAI, isRealtime, isWeb3) {
    let mentor = 'Focus on shipping the MVP before worrying about microservices or scaling.';
    let simulator = 'At 10k users, your primary DB will become the bottleneck. Plan for read replicas.';
    let risk = 'High risk of scope creep. Feature bloat will delay launch.';
    let evolution = 'V1: MVP. V2: Paid tiers. V3: Team collaboration features.';

    if (isAI) {
      risk = 'High risk of API costs exploding and LLM rate limits breaking the app.';
      simulator = 'At 10k users, OpenAI API limits will throttle you. Need fallback models.';
    }
    return { f37_mentor: mentor, f38_simulator: simulator, f39_risk: risk, f40_evolution: evolution };
  },

  // 9. CAREER
  _c9: function(isAI, isSecurity, isWeb3, isSaaS) {
    let resume = '70/100';
    let portfolio = 'Top 30% of junior/mid portfolios.';
    let align = 'Full-Stack Developer, Web Engineer.';
    let recruiter = 'Solid CRUD project. Shows competence.';

    if (isSaaS) { resume = '80/100'; recruiter = 'Great B2B product sense. Shows they can build real tools.'; }
    if (isAI) { resume = '95/100'; portfolio = 'Top 5% (Highly trending)'; align = 'AI Engineer, Backend Dev'; recruiter = 'Will definitely get an interview. Startups are desperate for LLM integration skills.'; }
    return { f41_resume: resume, f42_portfolio: portfolio, f43_align: align, f44_recruiter: recruiter };
  },

  // 10. FUTURE
  _c10: function(isAI) {
    let agent = 'Can be broken down into discrete UI components for reuse.';
    let discovery = 'Trend alignment: Moderate.';
    let incubator = 'Validate problem by interviewing 5 potential users before coding.';
    let rep = '+50 Engineering Score for shipping a full product.';
    let research = 'Look into similar open-source repos for architecture inspiration.';
    let copilot = 'I recommend keeping the scope tight. Ready to write code when you are.';

    if (isAI) {
      agent = 'High potential. The core logic can be sold as a standalone API agent.';
      discovery = 'Trend alignment: 99% (Viral potential).';
    }
    return { f45_agent: agent, f46_discovery: discovery, f47_incubator: incubator, f48_rep: rep, f49_research: research, f50_copilot: copilot };
  }
};
