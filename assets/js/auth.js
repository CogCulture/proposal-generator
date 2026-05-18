// ── AUTH.JS ─────────────────────────────────────────────────
// Handles custom database-backed login / signup modal + session state

let currentUser = null;

// Pure JS SHA-256 password hashing (Web Crypto API)
async function hashPassword(password) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Session bootstrap (called on every page load)
async function initAuth() {
  const storedUser = localStorage.getItem('custom_user');
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
    } catch (e) {
      currentUser = null;
      localStorage.removeItem('custom_user');
    }
  } else {
    currentUser = null;
  }
  updateAuthUI();
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

  // Sync editor specific UI elements if present
  if (typeof updateEditorAuthUI === 'function') {
    updateEditorAuthUI();
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
  if (!db) {
    showAuthError('Database connection not available.');
    btn.disabled = false; btn.textContent = 'Sign In';
    return;
  }

  try {
    // 1. Fetch user from custom_users table by email
    const { data: userRow, error } = await db
      .from('custom_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      showAuthError('Error checking credentials: ' + error.message);
      btn.disabled = false; btn.textContent = 'Sign In';
      return;
    }

    if (!userRow) {
      showAuthError('Invalid email or password.');
      btn.disabled = false; btn.textContent = 'Sign In';
      return;
    }

    // 2. Hash the input password and compare with stored password_hash
    const passwordHash = await hashPassword(password);
    if (userRow.password_hash !== passwordHash) {
      showAuthError('Invalid email or password.');
      btn.disabled = false; btn.textContent = 'Sign In';
      return;
    }

    // 3. Set session
    currentUser = { id: userRow.id, email: userRow.email };
    localStorage.setItem('custom_user', JSON.stringify(currentUser));
    
    closeAuthModal();
    updateAuthUI();

    if (typeof loadDashboard === 'function') {
      loadDashboard();
    }
  } catch (err) {
    showAuthError('Unexpected error: ' + err.message);
  } finally {
    btn.disabled = false; btn.textContent = 'Sign In';
  }
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
  if (!db) {
    showAuthError('Database connection not available.');
    btn.disabled = false; btn.textContent = 'Create Account';
    return;
  }

  try {
    // 1. Check if user already exists
    const { data: existingUser, error: checkError } = await db
      .from('custom_users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      showAuthError('Error checking email: ' + checkError.message);
      btn.disabled = false; btn.textContent = 'Create Account';
      return;
    }

    if (existingUser) {
      showAuthError('An account with this email already exists.');
      btn.disabled = false; btn.textContent = 'Create Account';
      return;
    }

    // 2. Hash password and insert into custom_users
    const passwordHash = await hashPassword(password);
    const { data: newRow, error: insertError } = await db
      .from('custom_users')
      .insert({ email, password_hash: passwordHash })
      .select()
      .single();

    if (insertError) {
      showAuthError('Could not create account: ' + insertError.message);
      btn.disabled = false; btn.textContent = 'Create Account';
      return;
    }

    // 3. Log them in directly (NO verification required!)
    currentUser = { id: newRow.id, email: newRow.email };
    localStorage.setItem('custom_user', JSON.stringify(currentUser));
    
    closeAuthModal();
    updateAuthUI();

    if (typeof loadDashboard === 'function') {
      loadDashboard();
    }
  } catch (err) {
    showAuthError('Unexpected error during signup: ' + err.message);
  } finally {
    btn.disabled = false; btn.textContent = 'Create Account';
  }
}

// ── Logout
async function handleLogout() {
  currentUser = null;
  localStorage.removeItem('custom_user');
  updateAuthUI();
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
