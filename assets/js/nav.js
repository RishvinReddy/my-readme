/* nav.js — Universal Premium Navigation
   Auto-injects into every page, removes old nav, handles auth state */
(function () {
  const PAGES = [
    { href: 'index.html',       label: 'Home',      icon: 'ph-house' },
    { href: 'analyze.html',     label: 'Analyze',   icon: 'ph-clipboard' },
    { href: 'saved.html',       label: 'Saved',     icon: 'ph-folder-open' },
    { href: 'compare.html',     label: 'Compare',   icon: 'ph-scales' },
    { href: 'marketplace.html', label: 'Marketplace',icon:'ph-storefront' },
  ];
  const TOOLS = [
    { href:'roadmap.html',    label:'Roadmap Generator',  icon:'ph-fill ph-map-trifold',  color:'var(--color-p4-deepteal)' },
    { href:'prd.html',        label:'PRD Generator',      icon:'ph-fill ph-file-text',    color:'var(--color-p2-lightblue)' },
    { href:'github.html',     label:'GitHub Analyzer',    icon:'ph-fill ph-github-logo',  color:'var(--color-p1-teal)' },
    { href:'hackathon.html',  label:'Hackathon Mode',     icon:'ph-fill ph-timer',        color:'var(--color-p3-coralred)' },
    null,
    { href:'collaborate.html',label:'Team Collaborate',   icon:'ph-fill ph-users-three',  color:'var(--color-p6-periwinkle)' },
  ];

  function currentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }
  function isActive(href) {
    const cur = currentPage();
    return cur === href || (cur === '' && href === 'index.html');
  }

  function buildNav() {
    const cur = currentPage();
    const mainLinks = PAGES.map(p => `
      <a href="${p.href}" class="nav-top-link ${isActive(p.href)?'nav-active':''}">
        <i class="${p.icon} nav-link-icon"></i>
        ${p.label}
        ${isActive(p.href) ? '<span class="nav-active-dot"></span>' : ''}
      </a>`).join('');

    const toolItems = TOOLS.map(t => t === null
      ? '<div class="nav-drop-divider"></div>'
      : `<a href="${t.href}" class="nav-drop-item ${isActive(t.href)?'nav-drop-active':''}">
           <span class="nav-drop-icon" style="color:${t.color};"><i class="${t.icon}"></i></span>
           ${t.label}
         </a>`).join('');

    return `
<style>
/* ── Nav Reset & Base ───────────────────────────────────── */
#site-nav *{box-sizing:border-box;margin:0;padding:0;}
#site-nav{
  position:sticky;top:0;z-index:999;width:100%;
  background:rgba(6,6,15,0.88);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(255,131,36,.15);
  font-family:'Inter',sans-serif;
}
#site-nav::after{
  content:'';display:block;height:1px;
  background:linear-gradient(90deg,transparent,var(--color-p1-orange,#FF8324) 30%,var(--color-p4-deepteal,#0091B9) 70%,transparent);
}

/* ── Inner Bar ──────────────────────────────────────────── */
.nav-inner{
  max-width:1280px;margin:0 auto;
  padding:0 24px;height:64px;
  display:flex;align-items:center;gap:0;
}

/* ── Logo ───────────────────────────────────────────────── */
.nav-logo{
  display:flex;align-items:center;gap:10px;text-decoration:none;
  flex-shrink:0;margin-right:32px;
}
.nav-logo-icon{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,var(--color-p1-orange,#FF8324),var(--color-p2-coral,#FF6B45));
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 16px rgba(255,131,36,.35);
  transition:box-shadow .3s,transform .3s;
}
.nav-logo:hover .nav-logo-icon{box-shadow:0 0 28px rgba(255,131,36,.6);transform:rotate(-8deg) scale(1.05);}
.nav-logo-icon i{font-size:20px;color:#fff;}
.nav-logo-text{
  font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;
  background:linear-gradient(90deg,#fff 0%,var(--color-p6-lightorange,#F8A679) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;white-space:nowrap;
}

/* ── Main Links ─────────────────────────────────────────── */
.nav-links{display:flex;align-items:center;gap:2px;flex:1;}
.nav-top-link{
  position:relative;display:flex;align-items:center;gap:6px;
  padding:8px 13px;border-radius:10px;
  color:#94a3b8;font-size:13.5px;font-weight:500;
  text-decoration:none;transition:all .2s;white-space:nowrap;
}
.nav-top-link:hover{color:#fff;background:rgba(255,255,255,.05);}
.nav-active{color:#fff !important;}
.nav-link-icon{font-size:14px;opacity:.7;}
.nav-active-dot{
  position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);
  width:16px;height:2px;border-radius:2px;
  background:linear-gradient(90deg,var(--color-p1-orange,#FF8324),var(--color-p2-coral,#FF6B45));
}

/* ── Tools Dropdown ─────────────────────────────────────── */
.nav-tools-wrap{position:relative;}
.nav-tools-btn{
  display:flex;align-items:center;gap:6px;
  padding:8px 13px;border-radius:10px;border:none;cursor:pointer;
  background:rgba(255,131,36,.06);border:1px solid rgba(255,131,36,.18);
  color:var(--color-p6-lightorange,#F8A679);font-size:13.5px;font-weight:500;
  transition:all .2s;font-family:'Inter',sans-serif;
}
.nav-tools-btn:hover{background:rgba(255,131,36,.12);border-color:rgba(255,131,36,.35);}
.nav-tools-btn .caret{font-size:11px;transition:transform .25s;}
.nav-tools-open .caret{transform:rotate(180deg);}
.nav-dropdown{
  position:absolute;top:calc(100% + 12px);right:0;width:230px;
  background:rgba(10,10,20,.96);border:1px solid rgba(255,131,36,.18);
  border-radius:16px;padding:8px;
  box-shadow:0 16px 48px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.04);
  opacity:0;visibility:hidden;transform:translateY(-8px);
  transition:all .25s cubic-bezier(.16,1,.3,1);
  backdrop-filter:blur(24px);
}
.nav-tools-open .nav-dropdown{opacity:1;visibility:visible;transform:translateY(0);}
.nav-drop-item{
  display:flex;align-items:center;gap:10px;
  padding:9px 12px;border-radius:10px;
  color:#94a3b8;font-size:13px;text-decoration:none;
  transition:all .15s;
}
.nav-drop-item:hover{background:rgba(255,255,255,.05);color:#fff;}
.nav-drop-active{color:#fff;background:rgba(255,131,36,.07);}
.nav-drop-icon{width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;}
.nav-drop-divider{height:1px;background:rgba(255,255,255,.06);margin:6px 0;}

/* ── Right Auth ─────────────────────────────────────────── */
.nav-right{display:flex;align-items:center;gap:10px;margin-left:16px;flex-shrink:0;}
.nav-signin{
  display:flex;align-items:center;gap:7px;
  padding:8px 18px;border-radius:10px;
  background:linear-gradient(135deg,var(--color-p1-orange,#FF8324),var(--color-p2-coral,#FF6B45));
  border:none;color:#fff;font-size:13px;font-weight:600;cursor:pointer;
  text-decoration:none;transition:all .25s;font-family:'Inter',sans-serif;
  box-shadow:0 0 18px rgba(255,131,36,.25);
}
.nav-signin:hover{box-shadow:0 0 28px rgba(255,131,36,.5);transform:translateY(-1px);}
.nav-avatar{
  width:36px;height:36px;border-radius:10px;border:2px solid rgba(255,131,36,.4);
  background:linear-gradient(135deg,var(--color-p1-orange),var(--color-p4-deepteal,#0091B9));
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-size:14px;font-weight:700;cursor:pointer;
  position:relative;transition:border-color .2s;
}
.nav-avatar:hover{border-color:var(--color-p1-orange);}
.nav-avatar-menu{
  position:absolute;top:calc(100% + 10px);right:0;width:200px;
  background:rgba(10,10,20,.96);border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:8px;
  box-shadow:0 16px 48px rgba(0,0,0,.6);
  opacity:0;visibility:hidden;transform:translateY(-6px);
  transition:all .2s;backdrop-filter:blur(24px);
}
.nav-avatar-wrap{position:relative;}
.nav-avatar-wrap.open .nav-avatar-menu{opacity:1;visibility:visible;transform:translateY(0);}
.nav-avatar-name{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:6px;}
.nav-avatar-name p{font-size:13px;font-weight:600;color:#fff;}
.nav-avatar-name span{font-size:11px;color:#475569;}
.nav-avatar-link{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;color:#94a3b8;font-size:13px;text-decoration:none;transition:all .15s;}
.nav-avatar-link:hover{background:rgba(255,255,255,.05);color:#fff;}
.nav-signout{background:none;border:none;width:100%;text-align:left;cursor:pointer;font-family:'Inter',sans-serif;}

/* ── Mobile Hamburger ───────────────────────────────────── */
.nav-hamburger{
  display:none;flex-direction:column;gap:5px;cursor:pointer;
  background:none;border:none;padding:8px;border-radius:8px;
  transition:background .2s;margin-left:auto;
}
.nav-hamburger:hover{background:rgba(255,255,255,.05);}
.ham-line{width:22px;height:2px;background:#94a3b8;border-radius:2px;transition:all .3s;}
.nav-hamburger.open .ham-line:nth-child(1){transform:translateY(7px) rotate(45deg);background:var(--color-p1-orange);}
.nav-hamburger.open .ham-line:nth-child(2){opacity:0;}
.nav-hamburger.open .ham-line:nth-child(3){transform:translateY(-7px) rotate(-45deg);background:var(--color-p1-orange);}

/* ── Mobile Drawer ──────────────────────────────────────── */
.nav-drawer{
  position:fixed;inset:0;z-index:998;
  opacity:0;visibility:hidden;transition:all .3s;
}
.nav-drawer.open{opacity:1;visibility:visible;}
.nav-drawer-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);}
.nav-drawer-panel{
  position:absolute;top:0;right:0;bottom:0;width:280px;
  background:rgba(8,8,18,.97);border-left:1px solid rgba(255,131,36,.15);
  padding:24px;overflow-y:auto;
  transform:translateX(100%);transition:transform .3s cubic-bezier(.16,1,.3,1);
  display:flex;flex-direction:column;gap:6px;
}
.nav-drawer.open .nav-drawer-panel{transform:translateX(0);}
.nav-drawer-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.06);}
.nav-drawer-logo{display:flex;align-items:center;gap:8px;}
.nav-drawer-logo i{font-size:22px;color:var(--color-p1-orange);}
.nav-drawer-logo span{font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;color:#fff;}
.nav-drawer-close{background:none;border:none;color:#64748b;cursor:pointer;font-size:20px;padding:4px;}
.drawer-section{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#334155;font-weight:600;padding:12px 8px 6px;}
.drawer-link{
  display:flex;align-items:center;gap:10px;padding:10px 12px;
  border-radius:10px;text-decoration:none;color:#94a3b8;
  font-size:14px;transition:all .15s;
}
.drawer-link:hover{background:rgba(255,255,255,.05);color:#fff;}
.drawer-link.active{background:rgba(255,131,36,.08);color:var(--color-p6-lightorange);border:1px solid rgba(255,131,36,.15);}
.drawer-link i{font-size:16px;width:20px;text-align:center;}
.drawer-divider{height:1px;background:rgba(255,255,255,.05);margin:8px 0;}
.drawer-cta{
  margin-top:auto;padding-top:16px;border-top:1px solid rgba(255,255,255,.06);
}

/* ── Responsive ─────────────────────────────────────────── */
@media(max-width:1024px){.nav-logo-text{display:none;}}
@media(max-width:820px){
  .nav-links,.nav-tools-wrap{display:none!important;}
  .nav-hamburger{display:flex!important;}
  .nav-right .nav-signin{display:none!important;}
}
</style>

<div class="nav-inner">
  <!-- Logo -->
  <a href="index.html" class="nav-logo">
    <div class="nav-logo-icon"><i class="ph-fill ph-rocket-launch"></i></div>
    <span class="nav-logo-text">Project Validator AI</span>
  </a>

  <!-- Main Links -->
  <nav class="nav-links">
    ${mainLinks}
  </nav>

  <!-- Tools Dropdown -->
  <div class="nav-tools-wrap" id="navToolsWrap">
    <button class="nav-tools-btn" id="navToolsBtn">
      <i class="ph ph-squares-four" style="font-size:15px;"></i>
      Tools
      <i class="ph ph-caret-down caret"></i>
    </button>
    <div class="nav-dropdown" id="navDropdown">
      ${toolItems}
    </div>
  </div>

  <!-- Right Side -->
  <div class="nav-right">
    <div id="navAuthArea"></div>
    <a href="login.html" id="navSignInBtn" class="nav-signin" style="display:none;">
      <i class="ph ph-sign-in" style="font-size:15px;"></i> Sign In
    </a>
  </div>

  <!-- Hamburger -->
  <button class="nav-hamburger" id="navHamburger" aria-label="Menu">
    <span class="ham-line"></span>
    <span class="ham-line"></span>
    <span class="ham-line"></span>
  </button>
</div>

<!-- Mobile Drawer -->
<div class="nav-drawer" id="navDrawer">
  <div class="nav-drawer-backdrop" id="navDrawerBackdrop"></div>
  <div class="nav-drawer-panel">
    <div class="nav-drawer-head">
      <div class="nav-drawer-logo">
        <i class="ph-fill ph-rocket-launch"></i>
        <span>Project Validator AI</span>
      </div>
      <button class="nav-drawer-close" id="navDrawerClose"><i class="ph ph-x"></i></button>
    </div>

    <span class="drawer-section">Main</span>
    ${PAGES.map(p=>`<a href="${p.href}" class="drawer-link ${isActive(p.href)?'active':''}"><i class="${p.icon}"></i>${p.label}</a>`).join('')}

    <div class="drawer-divider"></div>
    <span class="drawer-section">Tools</span>
    ${TOOLS.filter(Boolean).map(t=>`<a href="${t.href}" class="drawer-link ${isActive(t.href)?'active':''}"><i class="${t.icon}" style="color:${t.color};"></i>${t.label}</a>`).join('')}

    <div class="drawer-cta" id="drawerAuth"></div>
  </div>
</div>`;
  }

  function init() {
    // Remove old nav if present
    document.querySelector('nav.glass')?.remove();

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.id = 'site-nav';
    wrapper.innerHTML = buildNav();
    document.body.insertAdjacentElement('afterbegin', wrapper);

    // Tools dropdown toggle
    const toolsWrap = document.getElementById('navToolsWrap');
    const toolsBtn  = document.getElementById('navToolsBtn');
    if (toolsBtn) {
      toolsBtn.addEventListener('click', e => {
        e.stopPropagation();
        toolsWrap.classList.toggle('nav-tools-open');
      });
      document.addEventListener('click', () => toolsWrap.classList.remove('nav-tools-open'));
    }

    // Mobile drawer
    const hamburger = document.getElementById('navHamburger');
    const drawer    = document.getElementById('navDrawer');
    const backdrop  = document.getElementById('navDrawerBackdrop');
    const closeBtn  = document.getElementById('navDrawerClose');
    function openDrawer()  { drawer.classList.add('open');    hamburger.classList.add('open');    document.body.style.overflow='hidden'; }
    function closeDrawer() { drawer.classList.remove('open'); hamburger.classList.remove('open'); document.body.style.overflow='';       }
    hamburger?.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
    backdrop?.addEventListener('click', closeDrawer);
    closeBtn?.addEventListener('click', closeDrawer);

    // Auth state
    loadAuthState();
  }

  async function loadAuthState() {
    try {
      if (!window._supabase) return showSignIn();
      const { data: { user } } = await window._supabase.auth.getUser();
      if (user) showAvatar(user);
      else showSignIn();
    } catch { showSignIn(); }
  }

  function showSignIn() {
    const btn = document.getElementById('navSignInBtn');
    if (btn) btn.style.display = 'flex';
    const da = document.getElementById('drawerAuth');
    if (da) da.innerHTML = `<a href="login.html" class="nav-signin" style="display:flex;width:100%;justify-content:center;"><i class="ph ph-sign-in" style="font-size:15px;"></i> Sign In</a>`;
  }

  function showAvatar(user) {
    const initials = (user.user_metadata?.display_name || user.email || '?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const email = user.email || '';
    const name  = user.user_metadata?.display_name || email.split('@')[0] || 'User';

    const area = document.getElementById('navAuthArea');
    if (area) {
      area.innerHTML = `
        <div class="nav-avatar-wrap" id="avatarWrap">
          <div class="nav-avatar" id="navAvatar" title="${email}">${initials}</div>
          <div class="nav-avatar-menu">
            <div class="nav-avatar-name">
              <p>${name}</p>
              <span>${email}</span>
            </div>
            <a href="saved.html" class="nav-avatar-link"><i class="ph ph-folder-open"></i> My Projects</a>
            <a href="collaborate.html" class="nav-avatar-link"><i class="ph ph-users-three"></i> Collaborate</a>
            <div class="nav-drop-divider"></div>
            <button class="nav-avatar-link nav-signout" id="navSignOut"><i class="ph ph-sign-out"></i> Sign Out</button>
          </div>
        </div>`;
      document.getElementById('navAvatar')?.addEventListener('click', e => {
        e.stopPropagation();
        document.getElementById('avatarWrap')?.classList.toggle('open');
      });
      document.addEventListener('click', () => document.getElementById('avatarWrap')?.classList.remove('open'));
      document.getElementById('navSignOut')?.addEventListener('click', async () => {
        await window._supabase?.auth.signOut();
        window.location.href = 'index.html';
      });
    }

    // Drawer auth
    const da = document.getElementById('drawerAuth');
    if (da) da.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:rgba(255,131,36,.06);border:1px solid rgba(255,131,36,.15);">
        <div class="nav-avatar" style="width:32px;height:32px;font-size:12px;">${initials}</div>
        <div><p style="font-size:13px;font-weight:600;color:#fff;">${name}</p><p style="font-size:11px;color:#475569;">${email}</p></div>
      </div>
      <button style="margin-top:10px;width:100%;padding:10px;border-radius:10px;background:rgba(250,47,57,.08);border:1px solid rgba(250,47,57,.2);color:#f87171;font-size:13px;cursor:pointer;font-family:inherit;" onclick="window._supabase?.auth.signOut().then(()=>window.location.href='index.html')">
        <i class="ph ph-sign-out"></i> Sign Out
      </button>`;
  }

  // Run after DOM + Supabase are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
