// mentor.js - Global AI Mentor System
// A context-aware, rule-based AI mentor widget.
// Injects a floating panel on every page. No API key needed.

(function () {
  'use strict';

  // ── Knowledge Base ────────────────────────────────────────────────────────
  const KB = {
    architecture: [
      { q: ['architecture','structure','folder','modular','files'], a: '**Modular Architecture** is key for scaling. Separate concerns: UI layer, business logic, data layer. In JS, use the Module Pattern (IIFE) or ES Modules. Each file should do ONE thing. Your current project already follows this with scoring.js, auth.js, storage.js — keep that discipline.' },
      { q: ['api','rest','backend','server'], a: '**API Design**: Always return consistent JSON shapes: `{ data, error, meta }`. Use HTTP status codes correctly (200 success, 400 user error, 500 server error). For Supabase, use Row-Level Security instead of writing your own access control — it\'s faster and safer.' },
      { q: ['database','schema','table','sql'], a: '**Database Design**: Normalize aggressively for relational data. Use JSONB only for truly nested/variable structures. Every table needs: `id UUID PRIMARY KEY`, `created_at TIMESTAMPTZ`, and RLS enabled. For Supabase, index columns you filter by frequently.' },
      { q: ['scalable','scale','production'], a: '**Scalability**: At early stage, optimize for developer speed not performance. Use managed services (Supabase, Vercel) to avoid ops overhead. Only optimize when you have real users proving the bottleneck exists. Premature optimization kills more startups than scaling issues.' },
    ],
    techstack: [
      { q: ['react','next','vue','svelte','frontend'], a: '**Frontend Stack 2024**: Next.js + Tailwind CSS + Supabase is the fastest path to production. If you want to stay vanilla JS (like this project), that\'s perfectly valid — it forces you to learn fundamentals deeply. React later becomes trivial if you master DOM, events, and async JS first.' },
      { q: ['python','fastapi','node','express','backend'], a: '**Backend Choice**: FastAPI (Python) for AI/ML projects. Node.js/Express for rapid full-stack JS. Supabase replaces 80% of backend code for CRUD apps. Only build a custom backend when you have a specific requirement Supabase can\'t handle.' },
      { q: ['ai','openai','gemini','llm','gpt','langchain'], a: '**AI Integration**: Start with OpenAI API (GPT-4o-mini is cheap and fast). Use structured outputs (JSON mode) — never parse free-form AI text. LangChain is overkill for most projects. Learn prompt engineering: system prompt → user message → constrained output format.' },
      { q: ['supabase','firebase','database','auth'], a: '**Supabase vs Firebase**: Supabase = PostgreSQL (SQL, open source, self-hostable). Firebase = NoSQL (easier to start, harder to query). For structured data with relations, Supabase wins. Your auth is already set up — make sure RLS policies are correct before going public.' },
    ],
    career: [
      { q: ['resume','cv','portfolio','recruiter'], a: '**Resume Impact**: Projects score highest when they: (1) solve a real problem, (2) have a live demo URL, (3) have a clean GitHub with good README, (4) use modern tech (TypeScript, AI, cloud). One exceptional project beats 10 tutorials every time. This platform you\'re building is Tier 4 quality.' },
      { q: ['internship','job','interview','hire'], a: '**Getting Hired**: Build projects aligned with the company\'s tech stack. Research their stack on StackShare or their engineering blog. Leetcode is table stakes — but system design + real project demos separate candidates. Your GitHub should have pinned repos with live demos.' },
      { q: ['github','repo','open source'], a: '**GitHub Profile**: Pin 3–4 best repos. Every repo needs: clear README, live demo link, proper description, topics/tags. Commit consistently (even small commits show activity). Contribute to 1 open-source project in your domain — even docs PRs count.' },
      { q: ['startup','entrepreneur','business','saas'], a: '**Startup Advice**: Validate before building. Talk to 10 potential users before writing a line of code. Build the minimum that proves the concept. Charge money from day 1 (even $1) — it validates real demand. This Project Validator platform itself could be a real SaaS.' },
    ],
    hackathon: [
      { q: ['hackathon','24h','48h','sprint','mvp'], a: '**Hackathon Strategy**: Win by execution, not idea. Judges see 50+ projects — you have 90 seconds to wow them. Demo the WOW moment first. Use a reliable stack you know well. Hardcode data for the demo if needed — a polished fake beats a broken real. Practice your pitch 5 times minimum.' },
      { q: ['team','collaborate','pair','partner'], a: '**Hackathon Team**: Ideal hackathon team: 1 frontend, 1 backend, 1 "business/pitch" person. Avoid 5-person teams — too much coordination overhead. Define feature ownership in hour 1. Use separate git branches. Merge only working code to main.' },
    ],
    general: [
      { q: ['learn','study','skill','improve'], a: '**Learning Path 2024**: (1) JavaScript fundamentals deeply, (2) Async/await + API integration, (3) One modern framework (Next.js), (4) SQL + database design, (5) AI API integration, (6) DevOps basics (Vercel/Railway). Build one project at each step — don\'t just read docs.' },
      { q: ['project','idea','build','create'], a: '**Project Selection**: Use the BUILD/SKIP framework: Build if score ≥ 70/100 AND it has a demo-able outcome in ≤ 8 weeks. Skip if it\'s a tutorial clone or has no clear user. The best project is one that scratches your own itch — you understand the problem deeply.' },
      { q: ['ai','machine learning','data science'], a: '**AI/ML Career**: Python is mandatory. Start with scikit-learn (classical ML), then PyTorch/TensorFlow. LLM engineering (prompt + RAG + agents) is the hottest skill in 2024. Build projects that use AI as a tool, not as the entire project — AI-powered X beats pure AI research for most jobs.' },
      { q: ['money','monetize','revenue','pricing'], a: '**Monetization**: SaaS pricing: Freemium (limited features) → $15–$29/month Solo → $49–$99/month Team. Never price below $10/month — support costs more than revenue. Build for a specific person: "For developers who need X" beats "for everyone".' },
    ],
  };

  // Page-context greetings
  const PAGE_CONTEXT = {
    'analyze.html':    { greeting: 'I see you\'re analyzing a project! Need help with scoring criteria, understanding the weights, or deciding if an idea is worth building?', quickTips: ['Scoring advice', 'AI integration tips', 'Stack selection'] },
    'dashboard.html':  { greeting: 'Looking at your project results! I can explain any score, suggest improvements, or help you plan next steps.', quickTips: ['Improve your score', 'Build vs skip decision', 'Roadmap advice'] },
    'saved.html':      { greeting: 'Your project vault! Ask me to help you compare ideas, prioritize which to build first, or improve any of your projects.', quickTips: ['Which to build first?', 'Portfolio strategy', 'Project prioritization'] },
    'github.html':     { greeting: 'Analyzing a GitHub repo! I can help you interpret the scores, improve your own repos, or understand what recruiters look for.', quickTips: ['Improve README', 'Repo best practices', 'Recruiter impact'] },
    'hackathon.html':  { greeting: 'Hackathon mode! I\'m your rapid strategy advisor. Ask me anything about scoping, tech choices, or winning strategies.', quickTips: ['Winning strategy', 'Fastest stack', 'Pitch advice'] },
    'roadmap.html':    { greeting: 'Planning your roadmap! I can help you estimate timelines, suggest milestones, or refine your development phases.', quickTips: ['Timeline advice', 'MVP definition', 'Phase planning'] },
    'marketplace.html':{ greeting: 'Browsing the Idea Marketplace! I can help you find the best projects to build or improve your own idea\'s appeal.', quickTips: ['Best ideas to build', 'Improve your post', 'Market research'] },
    'default':         { greeting: 'Hi! I\'m your AI Project Mentor. I can help with architecture, tech stack, career advice, hackathon strategies, and more.', quickTips: ['Architecture advice', 'Career tips', 'Startup advice'] },
  };

  // ── Response Engine ───────────────────────────────────────────────────────
  function findAnswer(input) {
    const text = input.toLowerCase();
    const allCategories = [...KB.architecture, ...KB.techstack, ...KB.career, ...KB.hackathon, ...KB.general];

    for (const item of allCategories) {
      if (item.q.some(keyword => text.includes(keyword))) {
        return item.a;
      }
    }
    // Fallback
    return 'Great question! For the most precise advice: (1) Be specific about your tech stack and goal, (2) Share your project type (SaaS, AI, portfolio), (3) Tell me your timeline. Try asking something like "How do I improve my GitHub README?" or "What stack should I use for an AI SaaS?"';
  }

  function formatAnswer(raw) {
    return raw.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
  }

  // ── Widget HTML ───────────────────────────────────────────────────────────
  function createWidget() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const ctx  = PAGE_CONTEXT[page] || PAGE_CONTEXT['default'];

    const div = document.createElement('div');
    div.id = 'mentorWidget';
    div.innerHTML = `
      <!-- Trigger Button -->
      <button id="mentorTrigger"
        class="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(139,92,246,0.7)]"
        title="Open AI Mentor">
        <i class="ph-fill ph-robot text-2xl" id="mentorIcon"></i>
        <span id="mentorBadge" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-dark-900 animate-pulse"></span>
      </button>

      <!-- Panel -->
      <div id="mentorPanel"
        class="fixed bottom-24 right-6 z-50 w-80 md:w-96 glass rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden transition-all duration-300 opacity-0 invisible translate-y-4"
        style="max-height:520px;">

        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-primary-600/20 to-accent-500/10">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
              <i class="ph-fill ph-robot text-primary-400 text-lg"></i>
            </div>
            <div>
              <p class="text-white font-bold text-sm">AI Mentor</p>
              <p class="text-xs text-emerald-400 flex items-center gap-1"><span class="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span> Online</p>
            </div>
          </div>
          <button id="mentorClose" class="text-slate-500 hover:text-white transition-colors p-1">
            <i class="ph ph-x text-lg"></i>
          </button>
        </div>

        <!-- Messages -->
        <div id="mentorMessages" class="flex-1 overflow-y-auto p-4 space-y-3" style="min-height:200px;max-height:300px;">
          <!-- Greeting injected on open -->
        </div>

        <!-- Quick Tips -->
        <div class="px-4 pb-2 flex flex-wrap gap-2" id="mentorQuickTips">
          ${ctx.quickTips.map(t => `
            <button onclick="window.MentorAPI.sendQuick('${t}')"
              class="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-primary-500/40 transition-all">
              ${t}
            </button>`).join('')}
        </div>

        <!-- Input -->
        <div class="p-3 border-t border-white/10 flex gap-2">
          <input id="mentorInput" type="text" placeholder="Ask anything..." maxlength="200"
            class="flex-1 bg-dark-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
            onkeydown="if(event.key==='Enter') window.MentorAPI.send()">
          <button onclick="window.MentorAPI.send()"
            class="w-9 h-9 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-400 hover:bg-primary-500/40 transition-all flex items-center justify-center flex-shrink-0">
            <i class="ph-fill ph-paper-plane-tilt"></i>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(div);

    // Store context for greeting
    window._mentorCtx = ctx;
  }

  // ── Public API ────────────────────────────────────────────────────────────
  function appendMessage(role, text, typing = false) {
    const box = document.getElementById('mentorMessages');
    if (!box) return;
    const msg = document.createElement('div');
    msg.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`;
    if (role === 'mentor') {
      msg.innerHTML = `
        <div class="w-6 h-6 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0 mb-1">
          <i class="ph-fill ph-robot text-primary-400 text-xs"></i>
        </div>
        <div class="max-w-[85%] px-3 py-2 rounded-2xl rounded-bl-sm bg-white/[0.04] border border-white/8 text-sm text-slate-300 leading-relaxed ${typing ? 'opacity-60' : ''}">
          ${typing ? '<span class="flex gap-1 items-center h-4"><span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:0s"></span><span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:0.1s"></span><span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:0.2s"></span></span>' : formatAnswer(text)}
        </div>`;
    } else {
      msg.innerHTML = `<div class="max-w-[85%] px-3 py-2 rounded-2xl rounded-br-sm bg-primary-500/15 border border-primary-500/20 text-sm text-slate-200">${text}</div>`;
    }
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
    return msg;
  }

  function send() {
    const input = document.getElementById('mentorInput');
    const q = input?.value.trim();
    if (!q) return;
    input.value = '';
    appendMessage('user', q);
    // Typing indicator
    const typingEl = appendMessage('mentor', '', true);
    setTimeout(() => {
      typingEl?.remove();
      appendMessage('mentor', findAnswer(q));
    }, 600 + Math.random() * 400);
  }

  function sendQuick(tip) {
    appendMessage('user', tip);
    const typingEl = appendMessage('mentor', '', true);
    setTimeout(() => {
      typingEl?.remove();
      appendMessage('mentor', findAnswer(tip));
    }, 600);
  }

  function openMentor() {
    const panel = document.getElementById('mentorPanel');
    const icon  = document.getElementById('mentorIcon');
    const badge = document.getElementById('mentorBadge');
    if (!panel) return;
    panel.classList.remove('opacity-0', 'invisible', 'translate-y-4');
    if (icon) icon.className = 'ph ph-x text-2xl';
    if (badge) badge.classList.add('hidden');

    // Show greeting once
    const msgs = document.getElementById('mentorMessages');
    if (msgs && msgs.children.length === 0) {
      setTimeout(() => {
        appendMessage('mentor', window._mentorCtx?.greeting || PAGE_CONTEXT.default.greeting);
      }, 200);
    }
  }

  function closeMentor() {
    const panel = document.getElementById('mentorPanel');
    const icon  = document.getElementById('mentorIcon');
    if (!panel) return;
    panel.classList.add('opacity-0', 'invisible', 'translate-y-4');
    if (icon) icon.className = 'ph-fill ph-robot text-2xl';
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    createWidget();
    document.getElementById('mentorTrigger')?.addEventListener('click', () => {
      const panel = document.getElementById('mentorPanel');
      const isOpen = !panel?.classList.contains('invisible');
      isOpen ? closeMentor() : openMentor();
    });
    document.getElementById('mentorClose')?.addEventListener('click', closeMentor);
  }

  window.MentorAPI = { send, sendQuick, open: openMentor, close: closeMentor };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
