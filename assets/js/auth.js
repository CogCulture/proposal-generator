// ── AUTH.JS ─────────────────────────────────────────────────
// Handles login / signup modal + session state

let currentUser = null;

// ── Session bootstrap (called on every page load)
async function initAuth() {
  const db = getDB();
  if (!db) return;
  const { data: { session } } = await db.auth.getSession();
  currentUser = session?.user ?? null;
  updateAuthUI();

  db.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    updateAuthUI();
    // If we're on dashboard, reload proposals
    if (typeof loadDashboard === 'function') loadDashboard();
  });
}

// ── UI: sync sidebar login button
function updateAuthUI() {
  const btn   = document.getElementById('authSidebarBtn');
  const label = document.getElementById('authSidebarLabel');
  const avatar = document.getElementById('authAvatar');
  if (!btn) return;

  if (currentUser) {
    const email = currentUser.email || '';
    if (label)  label.textContent = email.split('@')[0];
    if (avatar) avatar.textContent = email[0]?.toUpperCase() ?? '?';
    btn.classList.add('logged-in');
  } else {
    if (label)  label.textContent = 'Login';
    if (avatar) avatar.textContent = '👤';
    btn.classList.remove('logged-in');
  }
}

// ── Modal open/close
function openAuthModal() {
  document.getElementById('authModal').classList.add('open');
  showAuthTab('login');
}
function closeAuthModal() {
  document.getElementById('authModal').classList.remove('open');
  clearAuthError();
  showAuthTab('login'); // Reset view back to login on close
}

function showAuthTab(tab) {
  document.getElementById('loginForm').style.display  = tab === 'login'  ? 'flex' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? 'flex' : 'none';
  
  // Hide verification view and show tabs + tagline again
  const verificationSentView = document.getElementById('verificationSentView');
  if (verificationSentView) verificationSentView.style.display = 'none';
  
  const authTabs = document.querySelector('.auth-tabs');
  if (authTabs) authTabs.style.display = 'flex';
  
  const authTagline = document.querySelector('.auth-tagline');
  if (authTagline) {
    authTagline.style.display = 'block';
    authTagline.textContent = tab === 'login' 
      ? 'Sign in to save and continue your proposals' 
      : 'Create a new account to sync details';
  }

  document.querySelectorAll('.auth-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  clearAuthError();
}

function clearAuthError() {
  const el = document.getElementById('authError');
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}
function showAuthError(msg) {
  const el = document.getElementById('authError');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

// ── Login
async function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn      = document.getElementById('loginSubmitBtn');
  btn.disabled = true; btn.textContent = 'Signing in…';

  const db = getDB();
  const { error } = await db.auth.signInWithPassword({ email, password });
  btn.disabled = false; btn.textContent = 'Sign In';

  if (error) { showAuthError(error.message); return; }
  closeAuthModal();
  if (typeof loadDashboard === 'function') loadDashboard();
  else window.location.href = 'index.html';
}

// ── Sign Up
async function handleSignup(e) {
  e.preventDefault();
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm  = document.getElementById('signupConfirm').value;
  if (password !== confirm) { showAuthError('Passwords do not match.'); return; }

  const btn = document.getElementById('signupSubmitBtn');
  btn.disabled = true; btn.textContent = 'Creating account…';

  const db = getDB();
  const { error } = await db.auth.signUp({ email, password });
  btn.disabled = false; btn.textContent = 'Create Account';

  if (error) { showAuthError(error.message); return; }
  
  showVerificationSent(email);
}

// ── Show premium verification screen
function showVerificationSent(email) {
  // Hide forms, tabs, and taglines
  const authTabs = document.querySelector('.auth-tabs');
  if (authTabs) authTabs.style.display = 'none';
  
  const authTagline = document.querySelector('.auth-tagline');
  if (authTagline) authTagline.style.display = 'none';

  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'none';
  clearAuthError();

  // Show verification view
  const verificationSentView = document.getElementById('verificationSentView');
  const emailDisplay = document.getElementById('verificationEmailDisplay');
  if (emailDisplay) emailDisplay.textContent = email;
  if (verificationSentView) verificationSentView.style.display = 'flex';

  // Customize mail client link dynamically
  const gmailBtn = document.getElementById('btnGmail');
  if (gmailBtn) {
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain === 'gmail.com') {
      gmailBtn.href = 'https://mail.google.com';
      gmailBtn.textContent = 'Open Gmail';
      gmailBtn.style.display = 'flex';
    } else if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com') {
      gmailBtn.href = 'https://outlook.live.com';
      gmailBtn.textContent = 'Open Outlook';
      gmailBtn.style.display = 'flex';
    } else if (domain === 'yahoo.com') {
      gmailBtn.href = 'https://mail.yahoo.com';
      gmailBtn.textContent = 'Open Yahoo Mail';
      gmailBtn.style.display = 'flex';
    } else {
      gmailBtn.href = `https://mail.${domain}`;
      gmailBtn.textContent = 'Open Webmail';
      if (!domain) {
        gmailBtn.style.display = 'none';
      }
    }
  }
}

// ── Logout
async function handleLogout() {
  await getDB().auth.signOut();
  window.location.href = 'index.html';
}

// ── Guard: redirect unauthenticated users
function requireAuth() {
  if (!currentUser) {
    openAuthModal();
    return false;
  }
  return true;
}
