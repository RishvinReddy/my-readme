// auth.js - Supabase Authentication Module
// Exposes window.AuthAPI for use across all pages.

(function () {
  const supabase = () => window._supabase;

  // ─── Core Auth Operations ─────────────────────────────────────────────────

  async function signUpWithEmail(email, password, displayName) {
    const { data, error } = await supabase().auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split('@')[0] }
      }
    });
    if (error) throw error;
    return data;
  }

  async function signInWithEmail(email, password) {
    const { data, error } = await supabase().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/saved.html'
      }
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await supabase().auth.signOut();
    if (error) throw error;
    window.location.href = 'login.html';
  }

  async function getUser() {
    const { data: { user } } = await supabase().auth.getUser();
    return user;
  }

  async function getSession() {
    const { data: { session } } = await supabase().auth.getSession();
    return session;
  }

  function onAuthStateChange(callback) {
    return supabase().auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  // ─── Auth Guard ───────────────────────────────────────────────────────────

  /**
   * Call on pages that require login.
   * If not logged in, redirect to login.html immediately.
   */
  async function requireAuth() {
    const user = await getUser();
    if (!user) {
      window.location.href = 'login.html';
      return null;
    }
    return user;
  }

  /**
   * Call on login/signup pages.
   * If already logged in, redirect away.
   */
  async function redirectIfLoggedIn(destination = 'saved.html') {
    const user = await getUser();
    if (user) {
      window.location.href = destination;
    }
  }

  // ─── Nav UI Helper ────────────────────────────────────────────────────────

  /**
   * Updates the nav bar based on current auth state.
   * Looks for elements with ids: navUserArea, navSignInBtn
   */
  async function updateNavUI() {
    const user = await getUser();
    const userArea  = document.getElementById('navUserArea');
    const signInBtn = document.getElementById('navSignInBtn');

    if (!userArea && !signInBtn) return;

    if (user) {
      const name = user.user_metadata?.display_name
                || user.user_metadata?.full_name
                || user.email?.split('@')[0]
                || 'User';
      const avatar = user.user_metadata?.avatar_url;

      if (userArea) {
        userArea.classList.remove('hidden');
        userArea.innerHTML = `
          <div class="flex items-center gap-3">
            ${avatar
              ? `<img src="${avatar}" alt="${name}" class="w-8 h-8 rounded-full ring-2 ring-primary-500/50">`
              : `<div class="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-400 font-bold text-sm">${name[0].toUpperCase()}</div>`
            }
            <span class="text-slate-300 text-sm font-medium hidden lg:block">${name}</span>
            <button onclick="window.AuthAPI.signOut()" 
                    class="text-slate-500 hover:text-rose-400 transition-colors text-xs px-2 py-1 rounded-lg border border-white/5 hover:border-rose-500/30">
              <i class="ph ph-sign-out"></i>
            </button>
          </div>
        `;
      }
      if (signInBtn) signInBtn.classList.add('hidden');
    } else {
      if (userArea) userArea.classList.add('hidden');
      if (signInBtn) signInBtn.classList.remove('hidden');
    }
  }

  // Public API
  window.AuthAPI = {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    getUser,
    getSession,
    onAuthStateChange,
    requireAuth,
    redirectIfLoggedIn,
    updateNavUI,
  };

})();
