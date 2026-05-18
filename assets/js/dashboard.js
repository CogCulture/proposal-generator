// ── DASHBOARD.JS ────────────────────────────────────────────
// Powers the proposals dashboard page

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
    .eq('user_id', currentUser.id)
    .order('updated_at', { ascending: false });

  document.getElementById('dashLoading').style.display = 'none';

  if (error || !proposals || proposals.length === 0) {
    document.getElementById('dashEmpty').style.display   = 'flex';
    document.getElementById('dashContent').style.display = 'none';
    return;
  }

  document.getElementById('dashEmpty').style.display   = 'none';
  document.getElementById('dashContent').style.display = 'block';

  const [latest, ...rest] = proposals;

  // ── Latest card (continue where you left off)
  const latestSection = document.getElementById('latestSection');
  const latestCard    = document.getElementById('latestCard');
  latestSection.style.display = 'block';
  latestCard.innerHTML = buildLatestCard(latest);

  // ── Rest of proposals grid
  const allSection   = document.getElementById('allSection');
  const grid         = document.getElementById('proposalsGrid');
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
  return `
    <div class="latest-card" onclick="openProposal('${p.id}')">
      <div class="latest-card-left">
        <div class="latest-badge">Latest</div>
        <h2 class="latest-title">${escHtml(p.title)}</h2>
        <p class="latest-meta">Last edited ${updated}</p>
        <div class="latest-actions">
          <button class="btn-open" onclick="event.stopPropagation(); openProposal('${p.id}')">
            Continue editing →
          </button>
          <button class="btn-del" onclick="event.stopPropagation(); confirmDelete('${p.id}')">
            Delete
          </button>
        </div>
      </div>
      <div class="latest-card-right">
        <div class="proposal-thumb">
          <span>${escHtml(p.brand_name || p.title).charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </div>
  `;
}

// ── Build a small grid card
function buildProposalCard(p) {
  const updated = formatDate(p.updated_at);
  return `
    <div class="proposal-card" onclick="openProposal('${p.id}')">
      <div class="card-thumb">
        <span>${escHtml(p.brand_name || p.title).charAt(0).toUpperCase()}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escHtml(p.title)}</h3>
        <p class="card-meta">${updated}</p>
      </div>
      <div class="card-actions">
        <button class="card-btn-open" onclick="event.stopPropagation(); openProposal('${p.id}')">Open</button>
        <button class="card-btn-del"  onclick="event.stopPropagation(); confirmDelete('${p.id}')">✕</button>
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
  if (currentUser) { /* already logged in — do nothing or show profile */ return; }
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
