// ── PROPOSALS.JS ────────────────────────────────────────────
// CRUD + versioning for proposals in Supabase

// ── Capture full editor state as a plain JSON-serialisable object
function captureSnapshot() {
  // Convert Sets → Arrays for JSON serialisation
  const selectedSer = {};
  Object.keys(selectedItems).forEach(svcId => {
    selectedSer[svcId] = {};
    Object.keys(selectedItems[svcId]).forEach(bi => {
      selectedSer[svcId][bi] = Array.from(selectedItems[svcId][bi]);
    });
  });

  // Extract custom services structure
  const customServicesSnap = {};
  Object.keys(SERVICES).forEach(id => {
    if (id.startsWith('custom_')) {
      customServicesSnap[id] = {
        section: SERVICES[id].section,
        name: SERVICES[id].name,
        blocks: SERVICES[id].blocks
      };
    }
  });

  return {
    brandName:      document.getElementById('brandInput')?.value ?? '',
    ambassador:     document.getElementById('ambassadorInput')?.value ?? '',
    cost:           document.getElementById('costInput')?.value ?? '',
    payment:        document.getElementById('paymentInput')?.value ?? '',
    retainerLabel:  document.getElementById('retainerLabelInput')?.value ?? 'Retainer Cost',
    paymentLabel:   document.getElementById('paymentLabelInput')?.value ?? 'Mode of Payment',
    serviceNameOverrides: serviceNameOverrides,
    serviceDescriptionOverrides: serviceDescriptionOverrides,
    selectedItems:  selectedSer,
    expandedBlocks,
    annexureEnabled,
    disabledAnnexures:    Array.from(disabledAnnexures),
    disabledAnnexureRows: Array.from(disabledAnnexureRows),
    disabledAnnexureSections: Array.from(disabledAnnexureSections),
    annexureOverrides,
    annexureTaskOverrides,
    annexureDetailOverrides,
    annexureNotesOverrides,
    annexureCatOverrides,
    annexureHeadingOverrides,
    customAnnexureIds: Array.from(CUSTOM_ANNEXURE_IDS),
    customAnnexures: (() => {
      const snap = {};
      CUSTOM_ANNEXURE_IDS.forEach(id => {
        if (ANNEXURE_DATA[id]) {
          snap[id] = {
            title: ANNEXURE_DATA[id].title,
            subtitle: ANNEXURE_DATA[id].subtitle,
            sections: ANNEXURE_DATA[id].sections
          };
        }
      });
      return snap;
    })(),
    annexureDataSnap: (() => {
      const snap = {};
      Object.keys(ANNEXURE_DATA).forEach(id => {
        snap[id] = {
          title: ANNEXURE_DATA[id].title,
          subtitle: ANNEXURE_DATA[id].subtitle,
          sections: ANNEXURE_DATA[id].sections
        };
      });
      return snap;
    })(),
    customServices: customServicesSnap,
    serviceOrder: SERVICE_ORDER,
    serviceAnnexureMapSnap: SERVICE_ANNEXURE_MAP,
    // Custom items / blocks users may have added
    serviceBlocks: (() => {
      const out = {};
      Object.keys(SERVICES).forEach(id => {
        if (SERVICES[id].blocks) {
          out[id] = SERVICES[id].blocks.map(b => ({ title: b.title, para: b.para || '', items: [...b.items] }));
        }
      });
      return out;
    })(),
  };
}

// ── Restore editor state from a snapshot object
function applySnapshot(snap) {
  if (!snap) return;
  if (snap.brandName    !== undefined) document.getElementById('brandInput').value      = snap.brandName;
  if (snap.ambassador   !== undefined) document.getElementById('ambassadorInput').value = snap.ambassador;
  if (snap.cost         !== undefined) document.getElementById('costInput').value        = snap.cost;
  if (snap.payment      !== undefined) document.getElementById('paymentInput').value     = snap.payment;

  if (snap.retainerLabel) {
    const rInput = document.getElementById('retainerLabelInput');
    if (rInput) rInput.value = snap.retainerLabel;
    retainerLabelOverride = snap.retainerLabel;
  } else {
    const rInput = document.getElementById('retainerLabelInput');
    if (rInput) rInput.value = "Retainer Cost";
    retainerLabelOverride = "Retainer Cost";
  }
  if (snap.paymentLabel) {
    const pInput = document.getElementById('paymentLabelInput');
    if (pInput) pInput.value = snap.paymentLabel;
    paymentLabelOverride = snap.paymentLabel;
  } else {
    const pInput = document.getElementById('paymentLabelInput');
    if (pInput) pInput.value = "Mode of Payment";
    paymentLabelOverride = "Mode of Payment";
  }

  if (snap.serviceNameOverrides) {
    for (let key in snap.serviceNameOverrides) delete serviceNameOverrides[key];
    Object.assign(serviceNameOverrides, snap.serviceNameOverrides);
  } else {
    for (let key in serviceNameOverrides) delete serviceNameOverrides[key];
  }

  if (snap.serviceDescriptionOverrides) {
    for (let key in snap.serviceDescriptionOverrides) delete serviceDescriptionOverrides[key];
    Object.assign(serviceDescriptionOverrides, snap.serviceDescriptionOverrides);
  } else {
    for (let key in serviceDescriptionOverrides) delete serviceDescriptionOverrides[key];
  }

  // Restore custom services first
  if (snap.customServices) {
    Object.keys(snap.customServices).forEach(id => {
      SERVICES[id] = snap.customServices[id];
    });
  }

  // Restore service order
  if (snap.serviceOrder) {
    Object.keys(snap.serviceOrder).forEach(sec => {
      SERVICE_ORDER[sec] = snap.serviceOrder[sec];
    });
  }

  // Restore custom service blocks first
  if (snap.serviceBlocks) {
    Object.keys(snap.serviceBlocks).forEach(id => {
      if (SERVICES[id] && SERVICES[id].blocks) {
        snap.serviceBlocks[id].forEach((snapBlock, bi) => {
          if (SERVICES[id].blocks[bi]) {
            if (snapBlock.title !== undefined) SERVICES[id].blocks[bi].title = snapBlock.title;
            if (snapBlock.para  !== undefined) SERVICES[id].blocks[bi].para  = snapBlock.para;
            if (snapBlock.items !== undefined) SERVICES[id].blocks[bi].items = snapBlock.items;
          } else {
            SERVICES[id].blocks[bi] = snapBlock;
          }
        });
      }
    });
  }

  // Restore Sets
  Object.keys(snap.selectedItems || {}).forEach(svcId => {
    selectedItems[svcId] = {};
    Object.keys(snap.selectedItems[svcId]).forEach(bi => {
      selectedItems[svcId][bi] = new Set(snap.selectedItems[svcId][bi]);
    });
  });

  if (snap.expandedBlocks) Object.assign(expandedBlocks, snap.expandedBlocks);
  if (snap.annexureEnabled !== undefined) annexureEnabled = snap.annexureEnabled;

  if (snap.disabledAnnexures)        snap.disabledAnnexures.forEach(v => disabledAnnexures.add(v));
  if (snap.disabledAnnexureRows)     snap.disabledAnnexureRows.forEach(v => disabledAnnexureRows.add(v));
  if (snap.disabledAnnexureSections) snap.disabledAnnexureSections.forEach(v => disabledAnnexureSections.add(v));

  Object.assign(annexureOverrides,       snap.annexureOverrides       || {});
  Object.assign(annexureTaskOverrides,   snap.annexureTaskOverrides   || {});
  Object.assign(annexureDetailOverrides, snap.annexureDetailOverrides || {});
  Object.assign(annexureNotesOverrides,  snap.annexureNotesOverrides  || {});
  Object.assign(annexureCatOverrides,    snap.annexureCatOverrides    || {});
  Object.assign(annexureHeadingOverrides,  snap.annexureHeadingOverrides  || {});

  // Restore all annexure titles and section names
  if (snap.annexureDataSnap) {
    Object.keys(snap.annexureDataSnap).forEach(id => {
      ANNEXURE_DATA[id] = snap.annexureDataSnap[id];
    });
  } else if (snap.customAnnexures) {
    Object.keys(snap.customAnnexures).forEach(id => {
      ANNEXURE_DATA[id] = snap.customAnnexures[id];
    });
  }

  // Restore custom annexure IDs
  if (snap.customAnnexureIds) {
    CUSTOM_ANNEXURE_IDS.clear();
    snap.customAnnexureIds.forEach(id => CUSTOM_ANNEXURE_IDS.add(id));
  }

  // Restore the dynamic SERVICE_ANNEXURE_MAP mapping
  if (snap.serviceAnnexureMapSnap) {
    Object.assign(SERVICE_ANNEXURE_MAP, snap.serviceAnnexureMapSnap);
  }

  initPanel();
  renderPreview();
}

// ── Proposal State & Collaboration
let _activeProposalId    = null;
let _autoSaveTimer       = null;
let _currentProposalMeta = null;
let _userPermissionRole  = 'owner'; // 'owner' | 'editor' | 'viewer'
let _isLoadingProposal   = false;

// ── Create a brand-new proposal row
async function createProposal(title = 'Untitled Proposal') {
  const db = getDB();
  const snap = captureSnapshot();
  const ownerEmail = currentUser?.email || 'user@cogculture.agency';
  const { data, error } = await db.from('proposals').insert({
    user_id:       currentUser.id,
    owner_email:   ownerEmail,
    title,
    brand_name:    snap.brandName || title,
    access_level:  'workspace',
    collaborators: []
  }).select().single();
  if (error) { alert('Could not create proposal: ' + error.message); return null; }

  _activeProposalId    = data.id;
  _currentProposalMeta = data;
  _userPermissionRole  = 'owner';

  // Insert first version
  await db.from('proposal_versions').insert({
    proposal_id:   data.id,
    label:         'Initial save',
    snapshot:      snap,
    author_email:  ownerEmail,
    is_checkpoint: false
  });

  updateCollaboratorUI();
  return data;
}

// ── Save current editor state as a new version
async function saveVersion(label = 'Auto-save', isCheckpoint = false, notes = '') {
  if (!currentUser) return;
  if (_userPermissionRole === 'viewer') return; // Read-only users cannot save

  const authorEmail = currentUser.email || 'team@cogculture.agency';

  if (!_activeProposalId) {
    // First save ever — create proposal row
    const snap = captureSnapshot();
    const title = snap.brandName || 'Untitled Proposal';
    const db = getDB();
    const { data, error } = await db.from('proposals').insert({
      user_id:       currentUser.id,
      owner_email:   authorEmail,
      title,
      brand_name:    snap.brandName || title,
      access_level:  'workspace',
      collaborators: []
    }).select().single();
    if (error) return;
    _activeProposalId    = data.id;
    _currentProposalMeta = data;
    _userPermissionRole  = 'owner';
    window.history.replaceState({}, '', `editor.html?id=${_activeProposalId}`);
    updateCollaboratorUI();
  }

  const db   = getDB();
  const snap = captureSnapshot();

  // Update parent proposal meta
  await db.from('proposals').update({
    brand_name: snap.brandName,
    title:      snap.brandName || 'Untitled Proposal',
    updated_at: new Date().toISOString(),
  }).eq('id', _activeProposalId);

  // Append version with author attribution & checkpoint flag
  await db.from('proposal_versions').insert({
    proposal_id:   _activeProposalId,
    label,
    snapshot:      snap,
    author_email:  authorEmail,
    is_checkpoint: isCheckpoint,
    notes:         notes || ''
  });

  showSaveIndicator(label);
}

// ── Auto-save: debounced 30 s after last change
function scheduleAutoSave() {
  if (!currentUser || _userPermissionRole === 'viewer' || _isLoadingProposal) return;
  clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(() => saveVersion('Auto-save'), 30000);
}

// ── Show transient "Saved" indicator in top bar
function showSaveIndicator(label) {
  let el = document.getElementById('saveIndicator');
  if (!el) return;
  el.textContent = `✓ ${label}`;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 2500);
}

// ── Load a proposal by ID from the URL query param (?id=...)
async function loadProposalFromURL() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) return;
  _activeProposalId = id;
  _isLoadingProposal = true;

  const db = getDB();
  if (!db) {
    _isLoadingProposal = false;
    return;
  }

  // 1. Fetch proposal row to check ownership and permissions
  try {
    const { data: propRow } = await db
      .from('proposals')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (propRow) {
      _currentProposalMeta = propRow;

      // Check user permissions safely
      if (!currentUser) {
        _userPermissionRole = 'viewer';
      } else {
        const myEmail = (currentUser.email || '').toLowerCase();
        const isOwner = (currentUser.id && propRow.user_id === currentUser.id) ||
                        (propRow.owner_email && propRow.owner_email.toLowerCase() === myEmail);
        const collabs = propRow.collaborators || [];
        const collabMatch = collabs.find(c => c.email && c.email.toLowerCase() === myEmail);

        if (isOwner) {
          _userPermissionRole = 'owner';
        } else if (collabMatch) {
          _userPermissionRole = collabMatch.role || 'editor';
        } else if (propRow.access_level === 'restricted') {
          _userPermissionRole = 'viewer';
        } else {
          _userPermissionRole = 'editor'; // Workspace open access
        }
      }

      applyPermissionMode(_userPermissionRole);
      updateCollaboratorUI();
    }
  } catch (err) {
    console.warn('Could not load proposal meta:', err);
  }

  // 2. Fetch latest snapshot
  try {
    const { data, error } = await db
      .from('proposal_versions')
      .select('*')
      .eq('proposal_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.warn('Could not load proposal version:', error);
      _isLoadingProposal = false;
      return;
    }
    applySnapshot(data.snapshot);
  } catch (verErr) {
    console.warn('Error fetching snapshot:', verErr);
  } finally {
    _isLoadingProposal = false;
  }
}

// ── Apply Read-Only restrictions if viewer
function applyPermissionMode(role) {
  const banner = document.getElementById('readOnlyBanner');
  const saveBtn = document.getElementById('saveBtn');
  const checkpointBtn = document.getElementById('checkpointBtn');

  if (role === 'viewer') {
    if (banner) banner.style.display = 'flex';
    if (saveBtn) saveBtn.style.display = 'none';
    if (checkpointBtn) checkpointBtn.style.display = 'none';

    // Disable input fields
    ['brandInput', 'ambassadorInput', 'costInput', 'paymentInput', 'tncInput'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = true;
    });
  } else {
    if (banner) banner.style.display = 'none';
    if (saveBtn && currentUser) saveBtn.style.display = 'inline-flex';
    if (checkpointBtn && currentUser) checkpointBtn.style.display = 'inline-flex';

    ['brandInput', 'ambassadorInput', 'costInput', 'paymentInput', 'tncInput'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = false;
    });
  }
}

// ── UI: Update collaboration indicators and share modal content
function updateCollaboratorUI() {
  const shareBtn = document.getElementById('shareBtn');
  const badge = document.getElementById('collabCountBadge');
  const ownerBadge = document.getElementById('collabOwnerBadge');
  const checkpointBtn = document.getElementById('checkpointBtn');

  if (!currentUser) return;

  if (shareBtn) shareBtn.style.display = 'inline-flex';
  if (checkpointBtn && _userPermissionRole !== 'viewer') checkpointBtn.style.display = 'inline-flex';

  const collabs = _currentProposalMeta?.collaborators || [];
  const totalPeople = collabs.length + 1; // +1 for owner
  if (badge) badge.textContent = totalPeople;

  if (ownerBadge && _currentProposalMeta) {
    const isOwner = _userPermissionRole === 'owner';
    const ownerName = (_currentProposalMeta.owner_email || 'Owner').split('@')[0];
    ownerBadge.textContent = isOwner ? '👑 You (Owner)' : `👑 ${ownerName}`;
    ownerBadge.style.display = 'inline-flex';
  }

  // Update share link input
  const linkInput = document.getElementById('shareLinkInput');
  if (linkInput) {
    const origin = window.location.origin === 'null' ? '' : window.location.origin;
    linkInput.value = _activeProposalId 
      ? `${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${_activeProposalId}`
      : window.location.href;
  }

  // Update access level dropdown
  const accessSelect = document.getElementById('accessLevelSelect');
  const accessDesc = document.getElementById('accessSettingDesc');
  if (accessSelect && _currentProposalMeta) {
    accessSelect.value = _currentProposalMeta.access_level || 'workspace';
    if (accessDesc) {
      accessDesc.textContent = accessSelect.value === 'workspace'
        ? 'Anyone in company with link can edit'
        : 'Only explicitly invited collaborators can edit';
    }
  }

  // Render collaborators list inside modal
  renderCollaboratorsList();
}

function renderCollaboratorsList() {
  const listEl = document.getElementById('collabList');
  if (!listEl) return;

  const ownerEmail = _currentProposalMeta?.owner_email || currentUser?.email || 'Owner';
  const collabs    = _currentProposalMeta?.collaborators || [];
  const isMeOwner  = _userPermissionRole === 'owner';

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
          ${isMeOwner ? `<button class="collab-btn-remove" onclick="removeCollaborator('${escHtml(c.email)}')" title="Remove access">✕</button>` : ''}
        </div>
      </div>
    `;
  });

  listEl.innerHTML = html;
}

// ── Share Modal Actions
async function openShareModal() {
  if (!_activeProposalId) {
    await saveVersion('Initial save');
  }
  updateCollaboratorUI();
  document.getElementById('shareModal').classList.add('open');
}

function closeShareModal() {
  document.getElementById('shareModal').classList.remove('open');
  const errEl = document.getElementById('shareErrorMsg');
  const sucEl = document.getElementById('shareSuccessMsg');
  if (errEl) errEl.style.display = 'none';
  if (sucEl) sucEl.style.display = 'none';
}

function copyShareLink() {
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

async function onAccessLevelChange(newLevel) {
  if (!_activeProposalId) return;
  if (!_currentProposalMeta) _currentProposalMeta = {};
  _currentProposalMeta.access_level = newLevel;

  const desc = document.getElementById('accessSettingDesc');
  if (desc) {
    desc.textContent = newLevel === 'workspace'
      ? 'Anyone in company with link can edit'
      : 'Only explicitly invited collaborators can edit';
  }

  const db = getDB();
  await db.from('proposals').update({ access_level: newLevel }).eq('id', _activeProposalId);
}

async function executeInvite() {
  const input  = document.getElementById('inviteEmailInput');
  const roleEl = document.getElementById('inviteRoleSelect');
  const errEl  = document.getElementById('shareErrorMsg');
  const sucEl  = document.getElementById('shareSuccessMsg');

  errEl.style.display = 'none';
  sucEl.style.display = 'none';

  const email = (input?.value || '').trim().toLowerCase();
  const role  = roleEl?.value || 'editor';

  if (!email || !email.includes('@')) {
    errEl.textContent = 'Please enter a valid email address.';
    errEl.style.display = 'block';
    return;
  }

  if (currentUser && email === currentUser.email.toLowerCase()) {
    errEl.textContent = 'You are already the owner/editor of this proposal.';
    errEl.style.display = 'block';
    return;
  }

  if (!_currentProposalMeta) _currentProposalMeta = { collaborators: [] };
  const existing = _currentProposalMeta.collaborators || [];
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
  _currentProposalMeta.collaborators = existing;

  const db = getDB();
  if (_activeProposalId) {
    await db.from('proposals').update({ collaborators: existing }).eq('id', _activeProposalId);
  }

  input.value = '';
  sucEl.innerHTML = `✓ Invited <strong>${email}</strong> (${role})! <a href="mailto:${email}?subject=Collaboration%20invite%20on%20CogCulture%20Proposal&body=Hey%2C%0A%0AI've%20invited%20you%20to%20collaborate%20on%20our%20proposal.%20You%20can%20open%20and%20edit%20it%20here%3A%0A${encodeURIComponent(document.getElementById('shareLinkInput').value)}" style="color:#6bcb77;text-decoration:underline;margin-left:6px;" target="_blank">Send email notification</a>`;
  sucEl.style.display = 'block';

  renderCollaboratorsList();
  updateCollaboratorUI();
}

async function removeCollaborator(email) {
  if (!_currentProposalMeta || !_currentProposalMeta.collaborators) return;
  _currentProposalMeta.collaborators = _currentProposalMeta.collaborators.filter(c => c.email.toLowerCase() !== email.toLowerCase());

  const db = getDB();
  if (_activeProposalId) {
    await db.from('proposals').update({ collaborators: _currentProposalMeta.collaborators }).eq('id', _activeProposalId);
  }
  renderCollaboratorsList();
  updateCollaboratorUI();
}

// ── Checkpoint Modal Actions
function openCheckpointModal() {
  document.getElementById('checkpointModal').classList.add('open');
  const input = document.getElementById('checkpointNameInput');
  if (input) { input.value = ''; input.focus(); }
  const notes = document.getElementById('checkpointNotesInput');
  if (notes) notes.value = '';
}

function closeCheckpointModal() {
  document.getElementById('checkpointModal').classList.remove('open');
}

async function executeSaveCheckpoint() {
  const name = document.getElementById('checkpointNameInput')?.value.trim() || 'Milestone Checkpoint';
  const notes = document.getElementById('checkpointNotesInput')?.value.trim() || '';

  await saveVersion(name, true, notes);
  closeCheckpointModal();
  showSaveIndicator(`Milestone: ${name}`);
}

// ── Fetch Version History
async function fetchVersionHistory() {
  if (!_activeProposalId || !currentUser) return [];
  const { data } = await getDB()
    .from('proposal_versions')
    .select('id, version_number, label, created_at, author_email, is_checkpoint, notes')
    .eq('proposal_id', _activeProposalId)
    .order('created_at', { ascending: false });
  return data || [];
}

// ── Preview a specific version before restoring
let _pendingRestoreVersionId = null;

async function previewVersion(versionId) {
  _pendingRestoreVersionId = versionId;
  const db = getDB();
  const { data, error } = await db
    .from('proposal_versions')
    .select('*')
    .eq('id', versionId)
    .single();

  if (error || !data) return;

  const snap = data.snapshot || {};
  document.getElementById('previewModalTitle').textContent = `Version ${data.version_number} — ${data.label || 'Save'}`;
  document.getElementById('previewModalSubtitle').textContent = `Saved ${formatDate(data.created_at)} by ${data.author_email || 'team'}`;

  // Count services
  const selectedCount = Object.keys(snap.selectedItems || {}).reduce((acc, k) => {
    return acc + Object.keys(snap.selectedItems[k] || {}).reduce((c, bi) => c + (snap.selectedItems[k][bi]?.length || 0), 0);
  }, 0);

  const contentEl = document.getElementById('previewModalContent');
  contentEl.innerHTML = `
    <div style="margin-bottom:8px;"><strong>Brand Name:</strong> ${escHtml(snap.brandName || 'Untitled')}</div>
    <div style="margin-bottom:8px;"><strong>Ambassador:</strong> ${escHtml(snap.ambassador || 'None')}</div>
    <div style="margin-bottom:8px;"><strong>Commercials:</strong> ${escHtml(snap.retainerLabel || 'Retainer')}: ${escHtml(snap.cost || 'Not set')} | ${escHtml(snap.paymentLabel || 'Mode')}: ${escHtml(snap.payment || 'Monthly Advance')}</div>
    <div style="margin-bottom:8px;"><strong>Deliverables:</strong> ${selectedCount} selected tasks across services</div>
    ${data.notes ? `<div style="margin-top:12px;padding:8px 12px;background:rgba(255,255,255,0.05);border-radius:6px;border-left:3px solid #c8372b;"><strong>Notes:</strong> ${escHtml(data.notes)}</div>` : ''}
  `;

  document.getElementById('btnRestoreFromPreview').onclick = () => {
    closeVersionPreviewModal();
    restoreVersion(versionId);
  };

  document.getElementById('versionPreviewModal').classList.add('open');
}

function closeVersionPreviewModal() {
  document.getElementById('versionPreviewModal').classList.remove('open');
  _pendingRestoreVersionId = null;
}

// ── Restore a specific version
async function restoreVersion(versionId) {
  if (_userPermissionRole === 'viewer') {
    alert('You have Viewer access only. You cannot restore versions.');
    return;
  }
  const { data, error } = await getDB()
    .from('proposal_versions')
    .select('snapshot, version_number, label')
    .eq('id', versionId)
    .single();
  if (error || !data) return;

  if (confirm(`Restore Version ${data.version_number} (${data.label || 'Checkpoint'})? This will update your editor to this state.`)) {
    applySnapshot(data.snapshot);
    await saveVersion(`Restored from v${data.version_number}`);
    closeHistoryPanel();
    alert(`Restored version ${data.version_number} successfully!`);
  }
}
