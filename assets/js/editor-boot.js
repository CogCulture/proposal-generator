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
  list.innerHTML = '<div class="history-loading">Loading version checkpoints…</div>';

  const versions = await fetchVersionHistory();
  if (!versions.length) {
    list.innerHTML = `
      <div style="padding:24px 16px;text-align:center;">
        <p style="color:#8a857c;font-size:13px;margin-bottom:14px;">No version checkpoints saved yet.</p>
        <button class="btn btn-ghost" onclick="openCheckpointModal()" style="font-size:12px;">🏷️ Save First Milestone</button>
      </div>`;
    return;
  }

  let html = `
    <div style="padding:0 0 14px;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:12px;color:#8a857c;">${versions.length} versions saved</span>
      <button class="btn btn-ghost" onclick="openCheckpointModal()" style="font-size:11.5px;padding:4px 10px;">＋ Tag Milestone</button>
    </div>
  `;

  html += versions.map(v => {
    const isMe = currentUser && v.author_email && currentUser.email && v.author_email.toLowerCase() === currentUser.email.toLowerCase();
    const authorDisplay = isMe ? 'you' : (v.author_email ? v.author_email.split('@')[0] : 'team');
    return `
      <div class="history-item">
        <div class="history-item-info">
          ${v.is_checkpoint ? `<div class="history-checkpoint-badge">★ Milestone</div>` : ''}
          <span class="history-label">${escapeHtml(v.label || 'Save')}</span>
          <div class="history-author">
            <span>👤 ${escapeHtml(authorDisplay)}</span> • <span>${formatHistoryDate(v.created_at)}</span>
          </div>
          <span class="history-ver">v${v.version_number}</span>
        </div>
        <div class="history-actions-col">
          <button class="history-preview-btn" onclick="previewVersion('${v.id}')" title="Preview version details">Preview</button>
          ${_userPermissionRole !== 'viewer' ? `<button class="history-restore-btn" onclick="restoreVersion('${v.id}')" title="Restore this version">Restore</button>` : ''}
        </div>
      </div>
    `;
  }).join('');

  list.innerHTML = html;
}

function closeHistoryPanel() {
  document.getElementById('historyPanel').classList.remove('open');
}

function formatHistoryDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit'
  });
}

function escapeHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── After auth state is known, update editor-specific UI
function updateEditorAuthUI() {
  const saveBtn       = document.getElementById('saveBtn');
  const historyBtn    = document.getElementById('historyBtn');
  const shareBtn      = document.getElementById('shareBtn');
  const checkpointBtn = document.getElementById('checkpointBtn');

  if (currentUser) {
    if (saveBtn && _userPermissionRole !== 'viewer') saveBtn.style.display = 'inline-flex';
    if (historyBtn) historyBtn.style.display = 'inline-flex';
    if (shareBtn)   shareBtn.style.display   = 'inline-flex';
    if (checkpointBtn && _userPermissionRole !== 'viewer') checkpointBtn.style.display = 'inline-flex';
    if (typeof updateCollaboratorUI === 'function') updateCollaboratorUI();
  } else {
    if (saveBtn)       saveBtn.style.display       = 'none';
    if (historyBtn)    historyBtn.style.display    = 'none';
    if (shareBtn)      shareBtn.style.display      = 'none';
    if (checkpointBtn) checkpointBtn.style.display = 'none';
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
