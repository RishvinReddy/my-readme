// supabaseClient.js - Supabase client initialization
// Using the CDN-loaded supabase global (window.supabase)

const SUPABASE_URL = 'https://ocpfozfavidwghxtcqjw.supabase.co';

// ⚠️  IMPORTANT: This MUST be the `anon public` JWT key from:
// Supabase Dashboard → Project Settings → API → "anon public"
// It starts with "eyJ..." — NOT the publishable key (sb_publishable_...)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcGZvemZhdmlkd2doeHRjcWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTEzODgsImV4cCI6MjA5NDA4NzM4OH0.CgIL_jXa6BBYUxpZ_RfMHcWpFugovGgqqDPAn-CJDQo';

window._supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
