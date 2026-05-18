// ── EDITOR-BOOT.JS ──────────────────────────────────────────
// Bootstraps auth + proposal loading on the proposal editor page

function onEditorAuthClick() {
  if (currentUser) {
    // Toggle a small dropdown or just go to dashboard
    window.location.href = 'index.html';
  } else {
    openAuthModal();
  }
}

function exportGuard() {
  if (!currentUser) { openAuthModal(); return; }
  generatePDF();
}

// ── Open / close history panel
async function openHistoryPanel() {
  if (!currentUser) return;
  document.getElementById('historyPanel').classList.add('open');
  const list = document.getElementById('historyList');
  list.innerHTML = '<div class="history-loading">Loading…</div>';

  const versions = await fetchVersionHistory();
  if (!versions.length) {
    list.innerHTML = '<div class="history-loading">No versions saved yet.</div>';
    return;
  }
  list.innerHTML = versions.map(v => `
    <div class="history-item">
      <div class="history-item-info">
        <span class="history-label">${escapeHtml(v.label || 'Save')}</span>
        <span class="history-time">${formatHistoryDate(v.created_at)}</span>
        <span class="history-ver">v${v.version_number}</span>
      </div>
      <button class="history-restore-btn" onclick="restoreVersion('${v.id}')">Restore</button>
    </div>
  `).join('');
}

function closeHistoryPanel() {
  document.getElementById('historyPanel').classList.remove('open');
}

function formatHistoryDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function escapeHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── After auth state is known, update editor-specific UI
function updateEditorAuthUI() {
  const saveBtn    = document.getElementById('saveBtn');
  const historyBtn = document.getElementById('historyBtn');
  if (currentUser) {
    if (saveBtn)    saveBtn.style.display    = 'inline-flex';
    if (historyBtn) historyBtn.style.display = 'inline-flex';
  } else {
    if (saveBtn)    saveBtn.style.display    = 'none';
    if (historyBtn) historyBtn.style.display = 'none';
  }
}

// ── Boot sequence
(async () => {
  await initAuth();
  updateEditorAuthUI();

  // Load proposal from URL if ?id= present
  if (currentUser) {
    await loadProposalFromURL();
  }

  // Re-hook updateEditorAuthUI into auth changes
  const db = getDB();
  if (db) {
    db.auth.onAuthStateChange(() => {
      updateEditorAuthUI();
    });
  }
})();
