// supabaseClient.js - Supabase client initialization
// Using the CDN-loaded supabase global (window.supabase)

const SUPABASE_URL = 'https://ocpfozfavidwghxtcqjw.supabase.co';

// ⚠️  IMPORTANT: This MUST be the `anon public` JWT key from:
// Supabase Dashboard → Project Settings → API → "anon public"
// It starts with "eyJ..." — NOT the publishable key (sb_publishable_...)
const SUPABASE_ANON_KEY = 'sb_publishable_GJKDKBc_BBmW1c3sU4BGhQ_Z1se-17O';

if (!SUPABASE_ANON_KEY.startsWith('eyJ')) {
  console.warn(
    '⚠️ Project Validator AI: Supabase anon key looks incorrect.\n' +
    'Go to: Supabase Dashboard → Settings → API → "anon public" key\n' +
    'It must start with "eyJ..." — update SUPABASE_ANON_KEY in supabaseClient.js'
  );
}

window._supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

