// ============================================================
//  SUPABASE CONFIGURATION — Fill in your project credentials
// ============================================================
//  Find these in: Supabase Dashboard → Project Settings → API

const SUPABASE_URL = 'https://bmhbjdtbvtvhexsvxojt.supabase.co';
// ⚠️ Using service_role key to bypass Row Level Security policies
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaGJqZHRidnR2aGV4c3Z4b2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNzQ0NDgsImV4cCI6MjEwNjg1MDQ0OH0.rx-4Vchf2eA8dFPUSc2vF7IVAHuNRC6mLo6tqtDFY6s';

// Import Supabase client (loaded via CDN in HTML)
// window._supabase is set by the CDN script; we wrap it here.
let _db = null;

function getDB() {
  if (!_db) {
    if (typeof supabase === 'undefined') {
      console.error('[CogCulture] Supabase CDN script not loaded.');
      return null;
    }
    _db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  }
  return _db;
}
