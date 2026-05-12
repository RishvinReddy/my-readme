/* nav.js — Centered Floating Pill Navigation */
(function () {
  const cur = window.location.pathname.split('/').pop() || 'index.html';
  const active = h => cur === h || (cur === '' && h === 'index.html') ? 'nav-active' : '';

  const CSS = `
<style>
#site-nav{position:sticky;top:16px;z-index:999;display:flex;justify-content:center;padding:0 16px;pointer-events:none;font-family:'Inter',sans-serif;}
.nav-pill{
  pointer-events:all;
  display:flex;align-items:center;gap:0;
  background:rgba(12,12,22,0.92);
  border:1px solid rgba(255,131,36,.2);
  border-radius:100px;
  padding:6px 8px 6px 14px;
  box-shadow:0 4px 32px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.04);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  max-width:760px;width:100%;
  position:relative;
}
/* Logo */
.np-logo{display:flex;align-items:center;gap:9px;text-decoration:none;margin-right:16px;flex-shrink:0;}
.np-logo-icon{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--color-p1-orange,#FF8324),var(--color-p2-coral,#FF6B45));display:flex;align-items:center;justify-content:center;box-shadow:0 0 14px rgba(255,131,36,.4);transition:transform .3s,box-shadow .3s;}
.np-logo:hover .np-logo-icon{transform:rotate(-10deg) scale(1.08);box-shadow:0 0 24px rgba(255,131,36,.6);}
.np-logo-icon i{font-size:17px;color:#fff;}
.np-logo-text{font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;background:linear-gradient(90deg,#fff,var(--color-p6-lightorange,#F8A679));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;white-space:nowrap;}
/* Links */
.np-links{display:flex;align-items:center;gap:2px;flex:1;}
.np-link{position:relative;display:flex;align-items:center;gap:5px;padding:7px 12px;border-radius:100px;color:#94a3b8;font-size:13px;font-weight:500;text-decoration:none;transition:all .2s;white-space:nowrap;background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;}
.np-link:hover,.np-link.nav-active{color:#fff;background:rgba(255,255,255,.07);}
.np-link .caret{font-size:10px;transition:transform .25s;}
.np-link.dd-open .caret{transform:rotate(180deg);}
.np-link-dot{position:absolute;bottom:4px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--color-p1-orange,#FF8324);}
/* Right */
.np-right{display:flex;align-items:center;gap:8px;margin-left:8px;flex-shrink:0;}
.np-signin{color:#94a3b8;font-size:13px;font-weight:500;text-decoration:none;padding:7px 12px;border-radius:100px;transition:all .2s;}
.np-signin:hover{color:#fff;background:rgba(255,255,255,.07);}
.np-cta{display:flex;align-items:center;gap:6px;padding:8px 18px;border-radius:100px;background:linear-gradient(135deg,var(--color-p1-orange,#FF8324),var(--color-p2-coral,#FF6B45));color:#fff;font-size:13px;font-weight:600;text-decoration:none;transition:all .25s;white-space:nowrap;border:none;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:0 0 16px rgba(255,131,36,.3);}
.np-cta:hover{box-shadow:0 0 26px rgba(255,131,36,.55);transform:scale(1.03);}
.np-avatar{width:32px;height:32px;border-radius:50%;border:2px solid rgba(255,131,36,.5);background:linear-gradient(135deg,var(--color-p1-orange),var(--color-p4-deepteal,#0091B9));display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s;position:relative;}
.np-avatar:hover{border-color:var(--color-p1-orange);}
/* Avatar dropdown */
.np-avatar-wrap{position:relative;}
.np-avatar-menu{position:absolute;top:calc(100% + 14px);right:0;width:200px;background:rgba(10,10,20,.97);border:1px solid rgba(255,131,36,.18);border-radius:16px;padding:8px;box-shadow:0 16px 48px rgba(0,0,0,.7);opacity:0;visibility:hidden;transform:translateY(-6px);transition:all .2s;backdrop-filter:blur(24px);}
.np-avatar-wrap.open .np-avatar-menu{opacity:1;visibility:visible;transform:translateY(0);}
.np-am-head{padding:10px 12px;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,.06);}
.np-am-head p{font-size:13px;font-weight:600;color:#fff;}
.np-am-head span{font-size:11px;color:#475569;}
.np-am-link{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;color:#94a3b8;font-size:13px;text-decoration:none;transition:all .15s;background:none;border:none;width:100%;text-align:left;cursor:pointer;font-family:'Inter',sans-serif;}
.np-am-link:hover{background:rgba(255,255,255,.06);color:#fff;}

/* ── MEGA DROPDOWN ─────────────────────────────────── */
.np-mega{
  position:absolute;top:calc(100% + 14px);left:50%;transform:translateX(-50%) translateY(-8px);
  width:600px;background:rgba(10,10,22,.97);
  border:1px solid rgba(255,131,36,.15);border-radius:20px;
  box-shadow:0 20px 60px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.03);
  backdrop-filter:blur(24px);
  opacity:0;visibility:hidden;
  transition:all .25s cubic-bezier(.16,1,.3,1);
  padding:0;overflow:hidden;pointer-events:none;
}
.np-mega.mega-open{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0);pointer-events:all;}
/* Grid */
.mega-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;}
.mega-col{padding:20px;}
.mega-col + .mega-col{border-left:1px solid rgba(255,255,255,.05);}
.mega-section-title{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#475569;font-weight:600;margin-bottom:12px;}
.mega-card{display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:12px;text-decoration:none;transition:all .18s;margin-bottom:4px;}
.mega-card:hover{background:rgba(255,255,255,.05);}
.mega-card-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:17px;}
.mega-card-text p{font-size:13px;font-weight:600;color:#e2e8f0;margin-bottom:2px;}
.mega-card-text span{font-size:11px;color:#64748b;line-height:1.4;}
/* Footer bar */
.mega-footer{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.015);}
.mega-footer-left{display:flex;align-items:center;gap:10px;}
.mega-footer-icon{width:32px;height:32px;border-radius:8px;background:rgba(255,131,36,.1);border:1px solid rgba(255,131,36,.2);display:flex;align-items:center;justify-content:center;color:var(--color-p1-orange);}
.mega-footer-left p{font-size:13px;font-weight:600;color:#fff;}
.mega-footer-left span{font-size:11px;color:#64748b;}
.mega-footer-btn{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:100px;background:rgba(255,131,36,.1);border:1px solid rgba(255,131,36,.25);color:var(--color-p6-lightorange);font-size:12px;font-weight:600;text-decoration:none;transition:all .2s;white-space:nowrap;}
.mega-footer-btn:hover{background:rgba(255,131,36,.2);border-color:rgba(255,131,36,.45);}

/* Mobile */
.np-hamburger{display:none;flex-direction:column;gap:4px;background:none;border:none;cursor:pointer;padding:8px;margin-left:auto;}
.ham{width:18px;height:2px;background:#94a3b8;border-radius:2px;transition:all .3s;}
.np-hamburger.open .ham:nth-child(1){transform:translateY(6px) rotate(45deg);background:var(--color-p1-orange);}
.np-hamburger.open .ham:nth-child(2){opacity:0;}
.np-hamburger.open .ham:nth-child(3){transform:translateY(-6px) rotate(-45deg);background:var(--color-p1-orange);}
.nav-drawer{position:fixed;inset:0;z-index:998;opacity:0;visibility:hidden;transition:all .3s;}
.nav-drawer.open{opacity:1;visibility:visible;}
.nav-drawer-bg{position:absolute;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);}
.nav-drawer-panel{position:absolute;top:0;right:0;bottom:0;width:270px;background:rgba(8,8,18,.98);border-left:1px solid rgba(255,131,36,.15);padding:20px;overflow-y:auto;transform:translateX(100%);transition:transform .3s cubic-bezier(.16,1,.3,1);}
.nav-drawer.open .nav-drawer-panel{transform:translateX(0);}
.drawer-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.06);}
.drawer-close{background:none;border:none;color:#64748b;cursor:pointer;font-size:18px;}
.drawer-lbl{font-size:10px;color:#334155;text-transform:uppercase;letter-spacing:.07em;font-weight:600;padding:10px 8px 6px;}
.d-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;text-decoration:none;color:#94a3b8;font-size:13.5px;transition:all .15s;}
.d-link:hover{background:rgba(255,255,255,.05);color:#fff;}
.d-link.active{background:rgba(255,131,36,.08);color:var(--color-p6-lightorange,#F8A679);border:1px solid rgba(255,131,36,.15);}
.d-link i{font-size:15px;width:18px;text-align:center;}
.d-div{height:1px;background:rgba(255,255,255,.05);margin:8px 0;}
@media(max-width:768px){.np-links,.np-right .np-signin,.np-mega-trigger{display:none!important;}.np-hamburger{display:flex!important;}}
@media(max-width:520px){.np-logo-text{display:none;}}
</style>`;

  const TOOLS_DATA = [
    { href:'os.html',           label:'AI Developer OS',  desc:'50-in-1 Intelligence Hub',    icon:'ph-fill ph-cpu',          bg:'rgba(139,145,221,.15)', color:'var(--color-p6-periwinkle)' },
    { href:'architecture.html',label:'Architecture AI',   desc:'Generate system diagrams',    icon:'ph-fill ph-tree-structure',bg:'rgba(139,145,221,.1)', color:'var(--color-p6-periwinkle)' },
    { href:'business.html',    label:'Startup Canvas',    desc:'Business model generator',    icon:'ph-fill ph-chart-pie-slice',bg:'rgba(255,208,89,.1)',  color:'var(--color-p3-mustard)' },
    { href:'roadmap.html',    label:'Roadmap Generator',  desc:'12-week execution plan',      icon:'ph-fill ph-map-trifold',  bg:'rgba(0,145,185,.12)',   color:'var(--color-p4-deepteal)' },
    { href:'prd.html',        label:'PRD Generator',      desc:'Auto-build requirements docs', icon:'ph-fill ph-file-text',    bg:'rgba(149,209,220,.1)',  color:'var(--color-p2-lightblue)' },
    { href:'github.html',     label:'GitHub Analyzer',   desc:'Grade repo portfolio-readiness',icon:'ph-fill ph-github-logo',  bg:'rgba(0,156,154,.1)',   color:'var(--color-p1-teal)' },
    { href:'hackathon.html',  label:'Hackathon Mode',    desc:'24-hour battle plan + win %',   icon:'ph-fill ph-timer',        bg:'rgba(255,105,105,.1)', color:'var(--color-p3-coralred)' },
    { href:'marketplace.html',label:'Idea Marketplace',  desc:'Browse community projects',     icon:'ph-fill ph-storefront',   bg:'rgba(255,131,36,.1)',  color:'var(--color-p1-orange)' },
    { href:'collaborate.html',label:'Team Collaborate',  desc:'Share & invite teammates',      icon:'ph-fill ph-users-three',  bg:'rgba(139,145,221,.1)', color:'var(--color-p6-periwinkle)' },
  ];

  const toolCards = (items) => items.map(t => `
    <a href="${t.href}" class="mega-card">
      <div class="mega-card-icon" style="background:${t.bg};"><i class="${t.icon}" style="color:${t.color};"></i></div>
      <div class="mega-card-text"><p>${t.label}</p><span>${t.desc}</span></div>
    </a>`).join('');

  const NAV_LINKS = [
    { href:'index.html',    label:'Home' },
    { href:'analyze.html',  label:'Analyze' },
    { href:'saved.html',    label:'Saved' },
    { href:'compare.html',  label:'Compare' },
  ];

  const DRAWER_PAGES = [
    ...NAV_LINKS.map(l=>({...l, icon:'ph ph-circle'})),
    null,
    ...TOOLS_DATA.map(t=>({href:t.href,label:t.label,icon:t.icon,color:t.color})),
  ];

  const html = `
${CSS}
<div class="nav-pill">
  <a href="index.html" class="np-logo">
    <div class="np-logo-icon"><i class="ph-fill ph-rocket-launch"></i></div>
    <span class="np-logo-text">Project Validator AI</span>
  </a>

  <div class="np-links">
    ${NAV_LINKS.map(l=>`<a href="${l.href}" class="np-link ${active(l.href)}">${l.label}${active(l.href)?'<span class="np-link-dot"></span>':''}</a>`).join('')}

    <!-- Tools mega trigger -->
    <button class="np-link np-mega-trigger" id="megaTrigger">
      Tools <i class="ph ph-caret-down caret"></i>
    </button>
  </div>

  <div class="np-right">
    <a href="login.html" id="npSignIn" class="np-signin" style="display:none;">Sign in</a>
    <a href="analyze.html" class="np-cta" id="npCTA">
      <i class="ph ph-plus" style="font-size:13px;"></i> New Project
    </a>
    <div class="np-avatar-wrap" id="npAvatarWrap" style="display:none;">
      <div class="np-avatar" id="npAvatar">U</div>
      <div class="np-avatar-menu">
        <div class="np-am-head"><p id="npAMName">User</p><span id="npAMEmail"></span></div>
        <a href="profile.html"    class="np-am-link"><i class="ph ph-user"></i> My Profile</a>
        <a href="saved.html"      class="np-am-link"><i class="ph ph-folder-open"></i> My Projects</a>
        <a href="collaborate.html"class="np-am-link"><i class="ph ph-users-three"></i> Collaborate</a>
        <div style="height:1px;background:rgba(255,255,255,.06);margin:6px 0;"></div>
        <button class="np-am-link" id="npSignOut"><i class="ph ph-sign-out"></i> Sign Out</button>
      </div>
    </div>
  </div>

  <button class="np-hamburger" id="npHam" aria-label="Menu">
    <span class="ham"></span><span class="ham"></span><span class="ham"></span>
  </button>

  <!-- Mega Dropdown -->
  <div class="np-mega" id="megaDrop">
    <div class="mega-grid">
      <div class="mega-col">
        <p class="mega-section-title">Core Tools</p>
        ${toolCards(TOOLS_DATA.slice(0,5))}
      </div>
      <div class="mega-col">
        <p class="mega-section-title">Platform</p>
        ${toolCards(TOOLS_DATA.slice(5))}
      </div>
    </div>
    <div class="mega-footer">
      <div class="mega-footer-left">
        <div class="mega-footer-icon"><i class="ph ph-book-open-text"></i></div>
        <div><p>Full Platform Guide</p><span>Everything in one place</span></div>
      </div>
      <a href="analyze.html" class="mega-footer-btn">Start Analyzing <i class="ph ph-arrow-right"></i></a>
    </div>
  </div>
</div>

<!-- Mobile Drawer -->
<div class="nav-drawer" id="npDrawer">
  <div class="nav-drawer-bg" id="npDrawerBg"></div>
  <div class="nav-drawer-panel">
    <div class="drawer-top">
      <div style="display:flex;align-items:center;gap:8px;">
        <div class="np-logo-icon" style="width:28px;height:28px;"><i class="ph-fill ph-rocket-launch" style="font-size:14px;color:#fff;"></i></div>
        <span style="font-family:'Outfit',sans-serif;font-weight:700;font-size:14px;color:#fff;">Project Validator AI</span>
      </div>
      <button class="drawer-close" id="npDrawerClose"><i class="ph ph-x"></i></button>
    </div>
    <span class="drawer-lbl">Navigation</span>
    ${NAV_LINKS.map(l=>`<a href="${l.href}" class="d-link ${active(l.href)}">${l.label}</a>`).join('')}
    <div class="d-div"></div>
    <span class="drawer-lbl">Tools</span>
    ${TOOLS_DATA.map(t=>`<a href="${t.href}" class="d-link ${active(t.href)}"><i class="${t.icon}" style="color:${t.color};"></i>${t.label}</a>`).join('')}
    <div style="margin-top:auto;padding-top:20px;border-top:1px solid rgba(255,255,255,.06);" id="npDrawerAuth"></div>
  </div>
</div>`;

  function init() {
    document.querySelector('nav.glass')?.remove();
    const wrap = document.createElement('div');
    wrap.id = 'site-nav';
    Object.assign(wrap.style, { position:'sticky', top:'16px', zIndex:'999', display:'flex', justifyContent:'center', padding:'0 16px' });
    wrap.innerHTML = html;
    document.body.insertAdjacentElement('afterbegin', wrap);

    // Mega dropdown
    const trigger = document.getElementById('megaTrigger');
    const drop    = document.getElementById('megaDrop');
    trigger?.addEventListener('click', e => { e.stopPropagation(); trigger.classList.toggle('dd-open'); drop.classList.toggle('mega-open'); });
    document.addEventListener('click', () => { trigger?.classList.remove('dd-open'); drop?.classList.remove('mega-open'); });
    drop?.addEventListener('click', e => e.stopPropagation());

    // Mobile
    const ham    = document.getElementById('npHam');
    const drawer = document.getElementById('npDrawer');
    const bg     = document.getElementById('npDrawerBg');
    const dclose = document.getElementById('npDrawerClose');
    const open  = () => { drawer.classList.add('open');    ham.classList.add('open');    document.body.style.overflow='hidden'; };
    const close = () => { drawer.classList.remove('open'); ham.classList.remove('open'); document.body.style.overflow=''; };
    ham?.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
    bg?.addEventListener('click', close);
    dclose?.addEventListener('click', close);

    // Auth
    loadAuth();
  }

  async function loadAuth() {
    try {
      if (!window._supabase) return showSignedOut();
      const { data:{ user } } = await window._supabase.auth.getUser();
      user ? showSignedIn(user) : showSignedOut();
    } catch { showSignedOut(); }
  }

  function showSignedOut() {
    document.getElementById('npSignIn').style.display = 'inline-flex';
    const da = document.getElementById('npDrawerAuth');
    if (da) da.innerHTML = `<a href="login.html" class="np-cta" style="width:100%;justify-content:center;display:flex;"><i class="ph ph-sign-in" style="font-size:13px;"></i> Sign In</a>`;
  }

  function showSignedIn(user) {
    document.getElementById('npSignIn').style.display = 'none';
    document.getElementById('npCTA').style.display = 'none';
    const wrap = document.getElementById('npAvatarWrap');
    wrap.style.display = 'block';
    const initials = (user.user_metadata?.display_name || user.email || 'U').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const name  = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';
    document.getElementById('npAvatar').textContent = initials;
    document.getElementById('npAMName').textContent  = name;
    document.getElementById('npAMEmail').textContent = user.email || '';

    document.getElementById('npAvatar')?.addEventListener('click', e => { e.stopPropagation(); wrap.classList.toggle('open'); });
    document.addEventListener('click', () => wrap.classList.remove('open'));
    document.getElementById('npSignOut')?.addEventListener('click', async () => { await window._supabase?.auth.signOut(); window.location.href='index.html'; });

    const da = document.getElementById('npDrawerAuth');
    if (da) da.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:rgba(255,131,36,.07);border:1px solid rgba(255,131,36,.15);margin-bottom:10px;"><div class="np-avatar" style="width:30px;height:30px;font-size:11px;">${initials}</div><div><p style="font-size:13px;font-weight:600;color:#fff;">${name}</p><p style="font-size:11px;color:#475569;">${user.email||''}</p></div></div><button onclick="window._supabase?.auth.signOut().then(()=>window.location.href='index.html')" style="width:100%;padding:9px;border-radius:10px;background:rgba(250,47,57,.08);border:1px solid rgba(250,47,57,.2);color:#f87171;font-size:13px;cursor:pointer;font-family:inherit;"><i class="ph ph-sign-out"></i> Sign Out</button>`;
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
