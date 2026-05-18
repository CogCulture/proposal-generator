// ============================================================
//  SUPABASE CONFIGURATION — Fill in your project credentials
// ============================================================
//  Find these in: Supabase Dashboard → Project Settings → API

const SUPABASE_URL = 'https://knjywehplsopyimdlxql.supabase.co';
// ⚠️  Use the ANON / PUBLIC key (starts with eyJ...), NOT the secret key.
// Find it: Supabase Dashboard → Project Settings → API → "anon public"
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtuanl3ZWhwbHNvcHlpbWRseHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MjgyMTMsImV4cCI6MjA5NDQwNDIxM30.DDlnAkbTCgiGf5rd_p1IL3jnMZsasUGAjCbPjgdHf94';

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
