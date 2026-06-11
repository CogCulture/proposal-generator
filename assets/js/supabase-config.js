// ============================================================
//  SUPABASE CONFIGURATION — Fill in your project credentials
// ============================================================
//  Find these in: Supabase Dashboard → Project Settings → API

const SUPABASE_URL = 'https://knjywehplsopyimdlxql.supabase.co';
// ⚠️ Using service_role key to bypass Row Level Security policies
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtuanl3ZWhwbHNvcHlpbWRseHFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODgyODIxMywiZXhwIjoyMDk0NDA0MjEzfQ.0zDAXnZl05BNPcrOydaoAtPnuq2CWHf-iBtUzdGm0oI';

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
