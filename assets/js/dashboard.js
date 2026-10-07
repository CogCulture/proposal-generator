// ── DASHBOARD.JS ────────────────────────────────────────────
// Powers the proposals workspace dashboard page

let _allWorkspaceProposals = [];
let _activeDashboardTab    = 'all'; // 'all' | 'mine' | 'shared'
let _activeShareProposal   = null;

async function loadDashboard() {
  if (!currentUser) {
    document.getElementById('dashLoading').style.display = 'none';
    document.getElementById('dashEmpty').style.display   = 'none';
    document.getElementById('dashContent').style.display = 'none';
    document.getElementById('logoutBtn').style.display   = 'none';
    return;
  }

  document.getElementById('logoutBtn').style.display = 'block';
  document.getElementById('dashLoading').style.display = 'flex';

  const db = getDB();
  const { data: proposals, error } = await db
    .from('proposals')
    .select('*')
    .order('updated_at', { ascending: false });

  document.getElementById('dashLoading').style.display = 'none';

  if (error || !proposals) {
    _allWorkspaceProposals = [];
  } else {
    _allWorkspaceProposals = proposals;
  }

  renderFilteredDashboard();
}

function setDashboardTab(tab) {
  _activeDashboardTab = tab;
  ['tabAll', 'tabMine', 'tabShared'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  const activeBtn = document.getElementById(tab === 'all' ? 'tabAll' : tab === 'mine' ? 'tabMine' : 'tabShared');
  if (activeBtn) activeBtn.classList.add('active');

  renderFilteredDashboard();
}

function renderFilteredDashboard() {
  const myEmail = currentUser?.email?.toLowerCase() || '';
  const myId    = currentUser?.id || '';

  // 1. Categorize proposals
  const mine = _allWorkspaceProposals.filter(p => {
    return p.user_id === myId || (p.owner_email && p.owner_email.toLowerCase() === myEmail);
  });

  const shared = _allWorkspaceProposals.filter(p => {
    const isOwner = p.user_id === myId || (p.owner_email && p.owner_email.toLowerCase() === myEmail);
    if (isOwner) return false;
    const collabs = p.collaborators || [];
    const isInvited = collabs.some(c => c.email && c.email.toLowerCase() === myEmail);
    const isWorkspaceOpen = p.access_level !== 'restricted';
    return isInvited || isWorkspaceOpen;
  });

  const all = _allWorkspaceProposals.filter(p => {
    const isOwner = p.user_id === myId || (p.owner_email && p.owner_email.toLowerCase() === myEmail);
    if (isOwner) return true;
    const collabs = p.collaborators || [];
    const isInvited = collabs.some(c => c.email && c.email.toLowerCase() === myEmail);
    const isWorkspaceOpen = p.access_level !== 'restricted';
    return isInvited || isWorkspaceOpen;
  });

  // Update badge counters
  const cAll = document.getElementById('countAll');
  const cMine = document.getElementById('countMine');
  const cShared = document.getElementById('countShared');
  if (cAll) cAll.textContent = all.length;
  if (cMine) cMine.textContent = mine.length;
  if (cShared) cShared.textContent = shared.length;

  // Select list for current tab
  let displayList = all;
  if (_activeDashboardTab === 'mine')   displayList = mine;
  if (_activeDashboardTab === 'shared') displayList = shared;

  if (displayList.length === 0) {
    document.getElementById('dashEmpty').style.display   = 'flex';
    document.getElementById('dashContent').style.display = 'none';
    return;
  }

  document.getElementById('dashEmpty').style.display   = 'none';
  document.getElementById('dashContent').style.display = 'block';

  const [latest, ...rest] = displayList;

  // ── Latest card
  const latestSection = document.getElementById('latestSection');
  const latestCard    = document.getElementById('latestCard');
  latestSection.style.display = 'block';
  latestCard.innerHTML = buildLatestCard(latest);

  // ── Rest of grid
  const allSection = document.getElementById('allSection');
  const grid       = document.getElementById('proposalsGrid');
  if (rest.length > 0) {
    allSection.style.display = 'block';
    grid.innerHTML = rest.map(p => buildProposalCard(p)).join('');
  } else {
    allSection.style.display = 'none';
  }
}

// ── Build the hero "latest" card
function buildLatestCard(p) {
  const updated = formatDate(p.updated_at);
  const isMeOwner = p.user_id === currentUser?.id || (p.owner_email && p.owner_email.toLowerCase() === currentUser?.email?.toLowerCase());
  const ownerLabel = isMeOwner ? 'You (Owner)' : (p.owner_email ? p.owner_email.split('@')[0] : 'Colleague');
  const collabs = p.collaborators || [];
  const totalMembers = collabs.length + 1;

  return `
    <div class="latest-card" onclick="openProposal('${p.id}')">
      <div class="latest-card-left">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
          <div class="latest-badge" style="margin-bottom:0;">Latest Active</div>
          <span class="card-collab-pill">👥 ${totalMembers} ${totalMembers === 1 ? 'member' : 'members'}</span>
          <span style="font-size:11px;color:var(--muted);">👑 ${escHtml(ownerLabel)}</span>
        </div>
        <h2 class="latest-title">${escHtml(p.title || p.brand_name || 'Untitled')}</h2>
        <p class="latest-meta">Last edited ${updated} • ${p.access_level === 'restricted' ? '🔒 Restricted' : '🏢 Company Workspace'}</p>
        <div class="latest-actions">
          <button class="btn-open" onclick="event.stopPropagation(); openProposal('${p.id}')">
            Continue editing →
          </button>
          <button class="btn-del" onclick="event.stopPropagation(); openDashboardShareModal('${p.id}')" title="Invite colleagues">
            👥 Share
          </button>
          ${isMeOwner ? `
            <button class="btn-del" onclick="event.stopPropagation(); confirmDelete('${p.id}')">
              Delete
            </button>
          ` : ''}
        </div>
      </div>
      <div class="latest-card-right">
        <div class="proposal-thumb">
          <span>${escHtml(p.brand_name || p.title || 'P').charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </div>
  `;
}

// ── Build a small grid card
function buildProposalCard(p) {
  const updated = formatDate(p.updated_at);
  const isMeOwner = p.user_id === currentUser?.id || (p.owner_email && p.owner_email.toLowerCase() === currentUser?.email?.toLowerCase());
  const ownerLabel = isMeOwner ? 'You' : (p.owner_email ? p.owner_email.split('@')[0] : 'Colleague');
  const collabs = p.collaborators || [];
  const totalMembers = collabs.length + 1;

  return `
    <div class="proposal-card" onclick="openProposal('${p.id}')">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div class="card-thumb">
          <span>${escHtml(p.brand_name || p.title || 'P').charAt(0).toUpperCase()}</span>
        </div>
        <span class="card-collab-pill">👥 ${totalMembers}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escHtml(p.title || p.brand_name || 'Untitled')}</h3>
        <p class="card-meta">Edited ${updated}</p>
        <div class="card-owner-meta">
          <span class="card-owner-pill">👑 ${escHtml(ownerLabel)}</span>
          <span>${p.access_level === 'restricted' ? '🔒' : '🏢'}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="card-btn-open" onclick="event.stopPropagation(); openProposal('${p.id}')">Open</button>
        <button class="card-btn-share" onclick="event.stopPropagation(); openDashboardShareModal('${p.id}')" title="Share with colleagues">👥</button>
        ${isMeOwner ? `
          <button class="card-btn-del" onclick="event.stopPropagation(); confirmDelete('${p.id}')" title="Delete proposal">✕</button>
        ` : ''}
      </div>
    </div>
  `;
}

// ── Navigation
function openProposal(id) {
  window.location.href = `editor.html?id=${id}`;
}

function guardAndCreateNew() {
  if (!currentUser) { openAuthModal(); return; }
  window.location.href = 'editor.html';
}

function guardNewProposal(e) {
  if (!currentUser) { e.preventDefault(); openAuthModal(); return false; }
  return true;
}

function onAuthBtnClick() {
  if (currentUser) return;
  openAuthModal();
}

// ── Delete flow
let _pendingDeleteId = null;
function confirmDelete(id) {
  _pendingDeleteId = id;
  const modal = document.getElementById('deleteModal');
  modal.style.display = 'flex';
  document.getElementById('confirmDeleteBtn').onclick = executeDelete;
}
function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
  _pendingDeleteId = null;
}
async function executeDelete() {
  if (!_pendingDeleteId) return;
  const db = getDB();
  await db.from('proposals').delete().eq('id', _pendingDeleteId);
  closeDeleteModal();
  loadDashboard();
}

// ── Dashboard Share Modal Flow
function openDashboardShareModal(proposalId) {
  const proposal = _allWorkspaceProposals.find(p => p.id === proposalId);
  if (!proposal) return;
  _activeShareProposal = proposal;

  const origin = window.location.origin === 'null' ? '' : window.location.origin;
  const linkInput = document.getElementById('shareLinkInput');
  if (linkInput) {
    linkInput.value = `${window.location.protocol}//${window.location.host}${window.location.pathname.replace('index.html', '')}editor.html?id=${proposal.id}`;
  }

  const accessSelect = document.getElementById('accessLevelSelect');
  const accessDesc   = document.getElementById('accessSettingDesc');
  if (accessSelect) {
    accessSelect.value = proposal.access_level || 'workspace';
    if (accessDesc) {
      accessDesc.textContent = accessSelect.value === 'workspace'
        ? 'Anyone in company with link can edit'
        : 'Only explicitly invited collaborators can edit';
    }
  }

  renderDashboardCollaboratorsList();
  document.getElementById('shareModal').classList.add('open');
}

function closeDashboardShareModal() {
  document.getElementById('shareModal').classList.remove('open');
  _activeShareProposal = null;
  const errEl = document.getElementById('shareErrorMsg');
  const sucEl = document.getElementById('shareSuccessMsg');
  if (errEl) errEl.style.display = 'none';
  if (sucEl) sucEl.style.display = 'none';
}

function copyDashboardShareLink() {
  const linkInput = document.getElementById('shareLinkInput');
  if (!linkInput) return;
  linkInput.select();
  navigator.clipboard.writeText(linkInput.value).then(() => {
    const btn = document.getElementById('btnCopyShareLink');
    if (btn) {
      btn.textContent = 'Copied! ✓';
      setTimeout(() => { btn.textContent = 'Copy Link'; }, 2000);
    }
  }).catch(() => {
    document.execCommand('copy');
    alert('Proposal link copied to clipboard!');
  });
}

async function onDashboardAccessLevelChange(newLevel) {
  if (!_activeShareProposal) return;
  _activeShareProposal.access_level = newLevel;

  const desc = document.getElementById('accessSettingDesc');
  if (desc) {
    desc.textContent = newLevel === 'workspace'
      ? 'Anyone in company with link can edit'
      : 'Only explicitly invited collaborators can edit';
  }

  const db = getDB();
  await db.from('proposals').update({ access_level: newLevel }).eq('id', _activeShareProposal.id);
  loadDashboard();
}

function renderDashboardCollaboratorsList() {
  const listEl = document.getElementById('collabList');
  if (!listEl || !_activeShareProposal) return;

  const ownerEmail = _activeShareProposal.owner_email || 'Owner';
  const collabs    = _activeShareProposal.collaborators || [];
  const isMeOwner  = _activeShareProposal.user_id === currentUser?.id || (ownerEmail.toLowerCase() === currentUser?.email?.toLowerCase());

  let html = `
    <div class="collab-row">
      <div class="collab-info">
        <div class="collab-avatar">${ownerEmail.charAt(0).toUpperCase()}</div>
        <div>
          <div class="collab-name">${escHtml(ownerEmail)} ${ownerEmail === currentUser?.email ? '(You)' : ''}</div>
        </div>
      </div>
      <span class="collab-role-tag owner">Owner</span>
    </div>
  `;

  collabs.forEach(c => {
    const isMe = currentUser && c.email.toLowerCase() === currentUser.email.toLowerCase();
    html += `
      <div class="collab-row">
        <div class="collab-info">
          <div class="collab-avatar">${c.email.charAt(0).toUpperCase()}</div>
          <div>
            <div class="collab-name">${escHtml(c.email)} ${isMe ? '(You)' : ''}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="collab-role-tag">${c.role === 'viewer' ? 'Viewer' : 'Editor'}</span>
          ${isMeOwner ? `<button class="collab-btn-remove" onclick="removeDashboardCollaborator('${escHtml(c.email)}')" title="Remove access">✕</button>` : ''}
        </div>
      </div>
    `;
  });

  listEl.innerHTML = html;
}

async function executeDashboardInvite() {
  const input  = document.getElementById('inviteEmailInput');
  const roleEl = document.getElementById('inviteRoleSelect');
  const errEl  = document.getElementById('shareErrorMsg');
  const sucEl  = document.getElementById('shareSuccessMsg');

  errEl.style.display = 'none';
  sucEl.style.display = 'none';

  if (!_activeShareProposal) return;

  const email = (input?.value || '').trim().toLowerCase();
  const role  = roleEl?.value || 'editor';

  if (!email || !email.includes('@')) {
    errEl.textContent = 'Please enter a valid email address.';
    errEl.style.display = 'block';
    return;
  }

  const existing = _activeShareProposal.collaborators || [];
  if (existing.some(c => c.email.toLowerCase() === email)) {
    errEl.textContent = 'This colleague is already invited.';
    errEl.style.display = 'block';
    return;
  }

  existing.push({
    email,
    role,
    added_at: new Date().toISOString(),
    added_by: currentUser?.email || 'team'
  });
  _activeShareProposal.collaborators = existing;

  const db = getDB();
  await db.from('proposals').update({ collaborators: existing }).eq('id', _activeShareProposal.id);

  input.value = '';
  sucEl.innerHTML = `✓ Invited <strong>${email}</strong>!`;
  sucEl.style.display = 'block';

  renderDashboardCollaboratorsList();
  loadDashboard();
}

async function removeDashboardCollaborator(email) {
  if (!_activeShareProposal || !_activeShareProposal.collaborators) return;
  _activeShareProposal.collaborators = _activeShareProposal.collaborators.filter(c => c.email.toLowerCase() !== email.toLowerCase());

  const db = getDB();
  await db.from('proposals').update({ collaborators: _activeShareProposal.collaborators }).eq('id', _activeShareProposal.id);
  renderDashboardCollaboratorsList();
  loadDashboard();
}

// ── Helpers
function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Boot
(async () => {
  await initAuth();
  if (!currentUser) openAuthModal();
  else loadDashboard();
})();
