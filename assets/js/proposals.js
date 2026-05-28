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
    customServices: customServicesSnap,
    serviceOrder: SERVICE_ORDER,
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

  // Restore custom annexures
  if (snap.customAnnexures) {
    Object.keys(snap.customAnnexures).forEach(id => {
      ANNEXURE_DATA[id] = snap.customAnnexures[id];
    });
  }

  // Restore custom annexure IDs
  if (snap.customAnnexureIds) {
    CUSTOM_ANNEXURE_IDS.clear();
    snap.customAnnexureIds.forEach(id => CUSTOM_ANNEXURE_IDS.add(id));
  }

  initPanel();
  renderPreview();
}

// ── Create a brand-new proposal row in Supabase
async function createProposal(title = 'Untitled Proposal') {
  const db = getDB();
  const snap = captureSnapshot();
  const { data, error } = await db.from('proposals').insert({
    user_id:    currentUser.id,
    title,
    brand_name: snap.brandName || title,
  }).select().single();
  if (error) { alert('Could not create proposal: ' + error.message); return null; }

  // Insert first version
  await db.from('proposal_versions').insert({
    proposal_id: data.id,
    label:       'Initial save',
    snapshot:    snap,
  });
  return data;
}

// ── Save current editor state as a new version of the active proposal
let _activeProposalId = null;
let _autoSaveTimer    = null;

async function saveVersion(label = 'Auto-save') {
  if (!currentUser) return;
  if (!_activeProposalId) {
    // First save ever — create the proposal row
    const snap = captureSnapshot();
    const title = snap.brandName || 'Untitled Proposal';
    const db = getDB();
    const { data, error } = await db.from('proposals').insert({
      user_id: currentUser.id,
      title,
      brand_name: snap.brandName,
    }).select().single();
    if (error) return;
    _activeProposalId = data.id;
    window.history.replaceState({}, '', `editor.html?id=${_activeProposalId}`);
  }

  const db  = getDB();
  const snap = captureSnapshot();
  // Update parent proposal meta
  await db.from('proposals').update({
    brand_name: snap.brandName,
    title: snap.brandName || 'Untitled Proposal',
    updated_at: new Date().toISOString(),
  }).eq('id', _activeProposalId);

  // Append version
  await db.from('proposal_versions').insert({
    proposal_id: _activeProposalId,
    label,
    snapshot: snap,
  });

  showSaveIndicator(label);
}

// ── Auto-save: debounced 30 s after last change
function scheduleAutoSave() {
  if (!currentUser) return;
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
  if (!id || !currentUser) return;
  _activeProposalId = id;

  const db = getDB();
  const { data, error } = await db
    .from('proposal_versions')
    .select('*')
    .eq('proposal_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return;
  applySnapshot(data.snapshot);
}

// ── Fetch version history for history panel
async function fetchVersionHistory() {
  if (!_activeProposalId || !currentUser) return [];
  const { data } = await getDB()
    .from('proposal_versions')
    .select('id, version_number, label, created_at')
    .eq('proposal_id', _activeProposalId)
    .order('created_at', { ascending: false });
  return data || [];
}

// ── Restore a specific version
async function restoreVersion(versionId) {
  const { data, error } = await getDB()
    .from('proposal_versions')
    .select('snapshot')
    .eq('id', versionId)
    .single();
  if (error || !data) return;
  applySnapshot(data.snapshot);
  await saveVersion('Restored version');
}
