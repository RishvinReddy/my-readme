// supabaseClient.js - Supabase client initialization
// Using the CDN-loaded supabase global (window.supabase)

const SUPABASE_URL = 'https://ocpfozfavidwghxtcqjw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_GJKDKBc_BBmW1c3sU4BGhQ_Z1se-17O';

// createClient is exposed globally by the Supabase CDN script as supabase.createClient
window._supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
