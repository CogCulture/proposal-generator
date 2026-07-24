// ── ADMIN.JS ─────────────────────────────────────────────────
// Admin panel logic: load users, change passwords, toggle admin

let allUsers = [];
let targetUserId   = null;
let targetUserEmail = null;

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await initAuth();          // from auth.js — loads currentUser from localStorage
  await guardAdmin();        // block if not admin
  await loadUsers();
  setupSearch();
});

// ── Guard: only admins allowed ────────────────────────────────
async function guardAdmin() {
  if (!currentUser) {
    showBlocked('You must be logged in to view this page.');
    return;
  }

  const db = getDB();
  const { data, error } = await db
    .from('custom_users')
    .select('is_admin')
    .eq('id', currentUser.id)
    .maybeSingle();

  if (error || !data || !data.is_admin) {
    showBlocked('You do not have admin privileges.');
    return;
  }

  // All good — show the panel
  document.getElementById('adminPanel').style.display = 'block';
  document.getElementById('blockedScreen').style.display = 'none';

  // Show logged-in user in topbar
  const el = document.getElementById('topbarUser');
  if (el) el.textContent = currentUser.email;
}

function showBlocked(msg) {
  document.getElementById('adminPanel').style.display = 'none';
  const screen = document.getElementById('blockedScreen');
  screen.style.display = 'flex';
  const msgEl = document.getElementById('blockedMsg');
  if (msgEl) msgEl.textContent = msg;
}

// ── Load all users ────────────────────────────────────────────
async function loadUsers() {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = `
    <tr><td colspan="5">
      <div class="table-message">
        <div class="table-spinner"></div>
        Loading users…
      </div>
    </td></tr>`;

  const db = getDB();
  const { data, error } = await db
    .from('custom_users')
    .select('id, email, is_admin, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="table-message">Error loading users: ${error.message}</div></td></tr>`;
    return;
  }

  allUsers = data || [];
  renderUsers(allUsers);

  // Update stats
  document.getElementById('statTotal').textContent  = allUsers.length;
  document.getElementById('statAdmins').textContent = allUsers.filter(u => u.is_admin).length;
}

// ── Render user rows ──────────────────────────────────────────
function renderUsers(users) {
  const tbody = document.getElementById('usersTableBody');

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="table-message">No users found.</div></td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => {
    const joined = u.created_at
      ? new Date(u.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
      : '—';
    const isMe = currentUser && u.id === currentUser.id;
    return `
      <tr>
        <td class="user-email">
          ${u.email}
          ${isMe ? '<span style="color:var(--muted);font-size:11px;margin-left:6px">(you)</span>' : ''}
        </td>
        <td><span class="user-id">${u.id.slice(0, 8)}…</span></td>
        <td>${u.is_admin
          ? '<span class="badge-admin">Admin</span>'
          : '<span class="badge-user">User</span>'}</td>
        <td class="joined-date">${joined}</td>
        <td>
          <div class="actions-cell">
            <button class="btn-change-pw" onclick="openChangePwModal('${u.id}', '${u.email.replace(/'/g,"\\'")}')">
              Change Password
            </button>
            ${!isMe ? `
            <button class="btn-toggle-admin" onclick="toggleAdmin('${u.id}', ${!!u.is_admin}, this)">
              ${u.is_admin ? 'Remove Admin' : 'Make Admin'}
            </button>` : ''}
          </div>
        </td>
      </tr>`;
  }).join('');
}

// ── Search/filter ─────────────────────────────────────────────
function setupSearch() {
  document.getElementById('searchInput').addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    const filtered = q ? allUsers.filter(u => u.email.toLowerCase().includes(q)) : allUsers;
    renderUsers(filtered);
  });
}

// ── Change Password Modal ─────────────────────────────────────
function openChangePwModal(userId, email) {
  targetUserId    = userId;
  targetUserEmail = email;

  document.getElementById('modalTargetEmail').textContent = email;
  document.getElementById('newPassword').value    = '';
  document.getElementById('confirmPassword').value = '';
  document.getElementById('modalError').style.display   = 'none';
  document.getElementById('modalSuccess').style.display = 'none';
  document.getElementById('confirmPwBtn').disabled = false;
  document.getElementById('confirmPwBtn').textContent = 'Update Password';

  document.getElementById('changePwModal').classList.add('open');
  setTimeout(() => document.getElementById('newPassword').focus(), 200);
}

function closeChangePwModal() {
  document.getElementById('changePwModal').classList.remove('open');
  targetUserId    = null;
  targetUserEmail = null;
}

// ── Confirm new password ──────────────────────────────────────
async function confirmChangePassword() {
  const newPw  = document.getElementById('newPassword').value;
  const confPw = document.getElementById('confirmPassword').value;
  const errEl  = document.getElementById('modalError');
  const sucEl  = document.getElementById('modalSuccess');
  const btn    = document.getElementById('confirmPwBtn');

  errEl.style.display = 'none';
  sucEl.style.display = 'none';

  if (!newPw || newPw.length < 6) {
    errEl.textContent = 'Password must be at least 6 characters.';
    errEl.style.display = 'block';
    return;
  }
  if (newPw !== confPw) {
    errEl.textContent = 'Passwords do not match.';
    errEl.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Updating…';

  try {
    const hash = await hashPassword(newPw);   // from auth.js
    const db   = getDB();                      // from supabase-config.js

    const { error } = await db
      .from('custom_users')
      .update({ password_hash: hash })
      .eq('id', targetUserId);

    if (error) throw error;

    sucEl.textContent = `Password updated for ${targetUserEmail}!`;
    sucEl.style.display = 'block';
    btn.textContent = 'Done ✓';
    showToast(`Password changed for ${targetUserEmail}`, 'success');

    setTimeout(closeChangePwModal, 1400);
  } catch (err) {
    errEl.textContent = 'Error: ' + err.message;
    errEl.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Update Password';
  }
}

// ── Toggle Admin role ─────────────────────────────────────────
async function toggleAdmin(userId, currentIsAdmin, btn) {
  const newVal = !currentIsAdmin;
  btn.disabled = true;

  const db = getDB();
  const { error } = await db
    .from('custom_users')
    .update({ is_admin: newVal })
    .eq('id', userId);

  if (error) {
    showToast('Error: ' + error.message, 'error');
    btn.disabled = false;
    return;
  }

  showToast(newVal ? 'Admin role granted!' : 'Admin role removed.', 'success');
  await loadUsers();   // refresh table
}

// ── Toast notification ────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => { t.className = 'toast'; }, 3200);
}

// ── Logout ────────────────────────────────────────────────────
function adminLogout() {
  localStorage.removeItem('custom_user');
  window.location.href = 'index.html';
}
