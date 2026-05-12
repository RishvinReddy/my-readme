// os-engine.js - The Heuristic Brain of the AI Developer OS
// Generates intelligent data across Engineering, Business, Productivity, and Career domains.

window.OSEngine = {
  analyze: function(idea) {
    const text = idea.toLowerCase();
    
    // Core Detectors
    const isAI = text.includes('ai') || text.includes('llm') || text.includes('gpt') || text.includes('model');
    const isSaaS = text.includes('saas') || text.includes('b2b') || text.includes('subscription');
    const isWeb3 = text.includes('crypto') || text.includes('blockchain') || text.includes('web3') || text.includes('nft');
    const isMobile = text.includes('app') || text.includes('ios') || text.includes('android');
    const isRealtime = text.includes('chat') || text.includes('realtime') || text.includes('live') || text.includes('sync');
    const isSecurity = text.includes('security') || text.includes('auth') || text.includes('crypto') || text.includes('compliance');

    return {
      engineering: this._getEngineering(isAI, isWeb3, isMobile, isRealtime),
      startup: this._getStartup(isSaaS, isAI, isWeb3),
      productivity: this._getProductivity(isAI, isMobile, isWeb3, isRealtime),
      career: this._getCareer(isAI, isSecurity, isWeb3, isSaaS)
    };
  },

  _getEngineering: function(isAI, isWeb3, isMobile, isRealtime) {
    let stack = [
      { role: 'Frontend', tool: 'React / Next.js' },
      { role: 'Backend', tool: 'Node.js / Express' },
      { role: 'Database', tool: 'Supabase PostgreSQL' },
      { role: 'Deployment', tool: 'Vercel / GitHub Pages' }
    ];
    let apis = ['Stripe', 'Resend', 'Google OAuth'];
    let security = [
      'Basic Auth Vulnerabilities',
      'CORS Misconfiguration',
      'SQL Injection Vectors'
    ];
    let costs = { hosting: '$20/mo', database: '$25/mo', apis: '$10/mo', total: '$55/mo' };

    if (isAI) {
      stack[2] = { role: 'Database', tool: 'Supabase + PgVector' };
      stack.push({ role: 'AI Engine', tool: 'OpenAI API / LangChain' });
      apis.push('OpenAI API', 'Pinecone');
      security.push('Prompt Injection Risks', 'API Key Exposure', 'Data Poisoning');
      costs.apis = '$150/mo (High LLM usage)';
      costs.total = '$195/mo';
    }
    if (isRealtime) {
      stack.push({ role: 'Realtime', tool: 'Socket.io + Redis' });
      apis.push('Pusher / Ably');
      security.push('WebSocket Hijacking', 'DDoS via open sockets');
    }
    if (isWeb3) {
      stack.push({ role: 'Smart Contracts', tool: 'Solidity / Hardhat' });
      apis.push('Alchemy', 'Infura', 'WalletConnect');
      security.push('Reentrancy Attacks', 'Front-running (MEV)', 'Wallet Drainers');
      costs.apis = '$50/mo (Node providers)';
    }

    return { stack, apis, security, costs };
  },

  _getStartup: function(isSaaS, isAI, isWeb3) {
    let viability = { score: 75, verdict: 'Solid Market Fit' };
    let pricing = ['Freemium (Basic features free)', 'Pro Tier ($15/mo)'];
    let competitorInsights = ['Highly fragmented market', 'Incumbents are slow and bloated'];
    let pitch = "A modern, lightweight alternative to legacy systems, designed for speed and ease of use.";

    if (isAI) {
      viability = { score: 92, verdict: 'High Growth Potential' };
      pricing = ['Usage-based (Pay per token/credit)', 'Enterprise ($499/mo)'];
      competitorInsights = ['High hype cycle', 'Fast-moving startups', 'Defensibility comes from proprietary data'];
      pitch = "Leveraging autonomous AI agents to eliminate 80% of manual work in this sector.";
    }
    if (isSaaS) {
      viability = { score: 88, verdict: 'Proven B2B Demand' };
      pricing = ['Per-seat pricing ($12/user/mo)', 'Annual Contracts ($1,200/yr)'];
      competitorInsights = ['High switching costs', 'Feature parity is hard to achieve'];
    }
    if (isWeb3) {
      viability = { score: 65, verdict: 'Niche / High Risk' };
      pricing = ['Transaction Fees (0.1%)', 'Tokenomics / Protocol revenue'];
      pitch = "Decentralizing trust and removing middlemen through immutable smart contracts.";
    }

    return { viability, pricing, competitorInsights, pitch };
  },

  _getProductivity: function(isAI, isMobile, isWeb3, isRealtime) {
    let sprint = [
      'Week 1: Setup Supabase, Auth, and basic UI shell.',
      'Week 2: Build core CRUD features and database schema.',
      'Week 3: Integrate primary APIs and refine UX.',
      'Week 4: Testing, bug fixing, and Vercel deployment.'
    ];
    let roles = ['Full-Stack Developer', 'UI/UX Designer'];
    let mvp = "Cut out user profiles and advanced settings. Hardcode the landing page. Focus ONLY on the core transaction loop.";
    let skillGaps = ['Advanced React Patterns', 'Database Indexing'];

    if (isAI) {
      sprint.splice(2, 0, 'Week 2.5: Setup Vector DB and write LLM prompts/RAG pipeline.');
      roles.push('Prompt Engineer / AI Dev');
      mvp = "Use a simple generic chatbot UI. Hardcode the system prompt. Don't build custom knowledge bases yet—just prove the LLM can handle the core logic.";
      skillGaps.push('RAG Architecture', 'Prompt Engineering');
    }
    if (isRealtime) {
      roles.push('Backend Engineer (WebSockets)');
      skillGaps.push('Redis Pub/Sub', 'WebSocket Scaling');
    }

    return { sprint, roles, mvp, skillGaps };
  },

  _getCareer: function(isAI, isSecurity, isWeb3, isSaaS) {
    let resumeScore = 70;
    let recruiterReaction = "Solid project. Shows they can build end-to-end applications and understand basic architecture.";
    let tags = ['Full-Stack', 'CRUD'];

    if (isSaaS) {
      resumeScore += 10;
      recruiterReaction = "Great B2B product focus. Shows understanding of authentication, databases, and real-world product thinking.";
      tags.push('Product Engineering', 'B2B');
    }
    if (isAI) {
      resumeScore += 15;
      recruiterReaction = "Extremely relevant. Startups are desperately hiring engineers who know how to integrate LLMs and build RAG pipelines.";
      tags.push('AI/LLM Integration', 'Vector DBs');
    }
    if (isSecurity) {
      resumeScore += 5;
      recruiterReaction = "Impressive focus on security. Most junior/mid developers ignore this, making this candidate stand out for enterprise roles.";
      tags.push('Cybersecurity', 'Auth Flows');
    }
    if (isWeb3) {
      recruiterReaction = "Highly attractive to Web3 startups, but might be seen as overly niche by traditional Web2 companies.";
      tags.push('Smart Contracts', 'dApps');
    }

    // Cap at 99
    if (resumeScore > 99) resumeScore = 99;

    return { resumeScore, recruiterReaction, tags };
  }
};
