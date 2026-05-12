const selectedItems = {};

function allItemsInBlock(svcId, blockIdx) {
  const block = SERVICES[svcId].blocks[blockIdx];
  const set = selectedItems[svcId]?.[blockIdx];
  if (!set) return false;
  const count = block.items.length;
  if (count === 0) return set.has("__selected__");
  return set.size === count;
}
function anyItemsInBlock(svcId, blockIdx) {
  const block = SERVICES[svcId].blocks[blockIdx];
  const set = selectedItems[svcId]?.[blockIdx];
  if (!set) return false;
  if (block.items.length === 0) return set.has("__selected__");
  return set.size > 0;
}
function anyItemsInService(svcId) {
  return SERVICES[svcId].blocks.some((_, bi) => anyItemsInBlock(svcId, bi));
}
function allItemsInService(svcId) {
  return SERVICES[svcId].blocks.every((_, bi) => allItemsInBlock(svcId, bi));
}
function ensureState(svcId, blockIdx) {
  if (!selectedItems[svcId]) selectedItems[svcId] = {};
  if (!selectedItems[svcId][blockIdx]) selectedItems[svcId][blockIdx] = new Set();
}
function selectAllInBlock(svcId, blockIdx) {
  ensureState(svcId, blockIdx);
  const count = SERVICES[svcId].blocks[blockIdx].items.length;
  if (count === 0) selectedItems[svcId][blockIdx] = new Set(["__selected__"]);
  else selectedItems[svcId][blockIdx] = new Set([...Array(count).keys()]);
}
function deselectAllInBlock(svcId, blockIdx) {
  ensureState(svcId, blockIdx);
  selectedItems[svcId][blockIdx] = new Set();
}
function selectAllInService(svcId) {
  SERVICES[svcId].blocks.forEach((_, bi) => selectAllInBlock(svcId, bi));
}
function deselectAllInService(svcId) {
  SERVICES[svcId].blocks.forEach((_, bi) => deselectAllInBlock(svcId, bi));
}

function initPanel() {
  const container = document.getElementById('dynamicServices');
  if (!container) return;
  container.innerHTML = '';
  const sections = {};
  Object.keys(SERVICES).forEach(id => {
    const s = SERVICES[id].section || 'Others';
    if (!sections[s]) sections[s] = [];
    sections[s].push(id);
  });

  Object.keys(sections).forEach(sectionName => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section-group';
    sectionDiv.innerHTML = `<div class="section-label">${sectionName}</div>`;

    sections[sectionName].forEach(svcId => {
      const svc = SERVICES[svcId];
      const svcRow = document.createElement('div');
      svcRow.className = 'service-row';
      svcRow.dataset.id = svcId;
      svcRow.onclick = (e) => toggleService(e, svcId);
      svcRow.innerHTML = `
        <div class="checkbox"><svg class="checkbox-mark" viewBox="0 0 10 7" fill="none"><polyline points="1,3.5 4,6.5 9,1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="service-info">
          <div class="service-name">${svc.name}</div>
          <div class="service-sub">${(svc.blocks || []).map(b => b.title || '').filter(t => t).join(', ') || 'Service Details'}</div>
        </div>
        <button class="svc-expand-btn" onclick="toggleExpand(event,'${svcId}')"><span class="svc-expand-arrow" id="svc-arrow-${svcId}">▼</span></button>
      `;
      sectionDiv.appendChild(svcRow);

      const blocksCont = document.createElement('div');
      blocksCont.className = 'blocks-container';
      blocksCont.id = 'blocks-' + svcId;
      blocksCont.innerHTML = svc.blocks.map((block, bi) => `
        <div class="block-row" id="block-row-${svcId}-${bi}" onclick="toggleBlock(event,'${svcId}',${bi})">
          <div class="block-checkbox">
            <svg class="block-checkbox-mark" viewBox="0 0 10 7" fill="none"><polyline points="1,3.5 4,6.5 9,1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span class="block-name">${block.title || (svc.name + ' Sub-Block ' + (bi + 1))}</span>
          <button class="block-expand-btn" onclick="toggleBlockExpand(event,'${svcId}',${bi})">
            <span class="block-expand-arrow" id="block-arrow-${svcId}-${bi}">▼</span>
          </button>
        </div>
        <div class="items-container" id="items-${svcId}-${bi}">
          ${(block.items || []).map((item, ii) => `
            <div class="item-row" id="item-row-${svcId}-${bi}-${ii}" onclick="toggleItem(event,'${svcId}',${bi},${ii})">
              <div class="item-checkbox">
                <svg class="item-checkbox-mark" viewBox="0 0 10 7" fill="none"><polyline points="1,3.5 4,6.5 9,1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="item-name">${item}</span>
            </div>
          `).join('')}
          <div class="item-add-input-wrapper">
            <span class="add-plus-icon">+</span>
            <input class="inline-add-input" placeholder="Add custom item..." onkeydown="handleItemAdd(event, '${svcId}', ${bi})">
          </div>
        </div>
      `).join('') + `
        <div class="block-add-input-wrapper">
          <span class="add-plus-icon">+</span>
          <input class="inline-add-input" style="font-weight:500;" placeholder="Add sub-heading..." onkeydown="handleBlockAdd(event, '${svcId}')">
        </div>
      `;
      sectionDiv.appendChild(blocksCont);
    });
    container.appendChild(sectionDiv);
  });
  refreshAllUI();
}

function handleItemAdd(e, svcId, bi) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (!val) return;
    SERVICES[svcId].blocks[bi].items.push(val);
    ensureState(svcId, bi);
    selectedItems[svcId][bi].add(SERVICES[svcId].blocks[bi].items.length - 1);
    e.target.value = '';
    initPanel();
    renderPreview();
    setTimeout(() => {
      const inputs = document.querySelectorAll(`#items-${svcId}-${bi} .inline-add-input`);
      if (inputs.length) inputs[0].focus();
    }, 10);
  }
}

function handleBlockAdd(e, svcId) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (!val) return;
    SERVICES[svcId].blocks.push({ title: val, items: [] });
    const bi = SERVICES[svcId].blocks.length - 1;
    ensureState(svcId, bi);
    e.target.value = '';
    initPanel();
    renderPreview();
    setTimeout(() => {
      const inputs = document.querySelectorAll(`#items-${svcId}-${bi} .inline-add-input`);
      if (inputs.length) inputs[0].focus();
    }, 10);
  }
}

function toggleExpand(e, svcId) {
  e.stopPropagation();
  const el = document.getElementById('blocks-' + svcId);
  const arrow = document.getElementById('svc-arrow-' + svcId);
  if (!el || !arrow) return;
  const open = el.classList.toggle('open');
  arrow.classList.toggle('open', open);
}

function toggleBlockExpand(e, svcId, bi) {
  e.stopPropagation();
  const el = document.getElementById(`items-${svcId}-${bi}`);
  const arrow = document.getElementById(`block-arrow-${svcId}-${bi}`);
  if (!el || !arrow) return;
  const open = el.classList.toggle('open');
  arrow.classList.toggle('open', open);
}

function toggleService(e, svcId) {
  if (allItemsInService(svcId)) deselectAllInService(svcId);
  else selectAllInService(svcId);
  refreshServiceUI(svcId);
  updateCount();
  renderPreview();
}

function toggleBlock(e, svcId, bi) {
  e.stopPropagation();
  if (allItemsInBlock(svcId, bi)) deselectAllInBlock(svcId, bi);
  else selectAllInBlock(svcId, bi);
  refreshServiceUI(svcId);
  updateCount();
  renderPreview();
}

function toggleItem(e, svcId, bi, ii) {
  e.stopPropagation();
  ensureState(svcId, bi);
  if (selectedItems[svcId][bi].has(ii)) selectedItems[svcId][bi].delete(ii);
  else selectedItems[svcId][bi].add(ii);
  refreshServiceUI(svcId);
  updateCount();
  renderPreview();
}

function refreshServiceUI(svcId) {
  const svc = SERVICES[svcId];
  const svcRow = document.querySelector(`.service-row[data-id="${svcId}"]`);
  if (!svcRow) return;
  const hasAny = anyItemsInService(svcId);
  const hasAll = allItemsInService(svcId);
  svcRow.classList.toggle('active', hasAny);
  const cb = svcRow.querySelector('.checkbox');
  const mark = svcRow.querySelector('.checkbox-mark');
  
  if (hasAny && !hasAll) {
    cb.style.background = 'rgba(200,55,43,0.5)';
    cb.style.borderColor = 'var(--red)';
    if (mark) mark.style.opacity = '1';
  } else {
    cb.style.background = '';
    cb.style.borderColor = '';
    if (mark) mark.style.opacity = '';
  }

  svc.blocks.forEach((block, bi) => {
    const blockRow = document.getElementById(`block-row-${svcId}-${bi}`);
    if (!blockRow) return;
    const anyB = anyItemsInBlock(svcId, bi);
    const allB = allItemsInBlock(svcId, bi);
    blockRow.classList.remove('active', 'partial');
    if (allB) blockRow.classList.add('active');
    else if (anyB) blockRow.classList.add('partial');
    (block.items || []).forEach((_, ii) => {
      const itemRow = document.getElementById(`item-row-${svcId}-${bi}-${ii}`);
      if (!itemRow) return;
      const checked = selectedItems[svcId]?.[bi]?.has(ii);
      itemRow.classList.toggle('active', !!checked);
    });
  });
}

function refreshAllUI() {
  Object.keys(SERVICES).forEach(refreshServiceUI);
}

function toggleAll() {
  const all = Object.keys(SERVICES);
  const anySelected = all.some(id => anyItemsInService(id));
  if (anySelected) all.forEach(id => deselectAllInService(id));
  else all.forEach(id => selectAllInService(id));
  refreshAllUI();
  updateCount();
  renderPreview();
}

function clearAll() {
  Object.keys(SERVICES).forEach(id => deselectAllInService(id));
  const bInput = document.getElementById('brandInput');
  const cInput = document.getElementById('costInput');
  const pInput = document.getElementById('paymentInput');
  const aInput = document.getElementById('ambassadorInput');
  if (bInput) bInput.value = '';
  if (cInput) cInput.value = '';
  if (pInput) pInput.value = '';
  if (aInput) aInput.value = '';
  refreshAllUI();
  updateCount();
  renderPreview();
}

function updateCount() {
  const active = Object.keys(SERVICES).filter(id => anyItemsInService(id));
  const badge = document.getElementById('countBadge');
  const btn = document.getElementById('selectAllBtn');
  if (badge) badge.textContent = active.length;
  if (btn) {
    const allSelected = active.length === Object.keys(SERVICES).length;
    btn.textContent = allSelected ? 'Deselect all' : 'Select all';
  }
}

function getActiveBlocksForSlide(svcId) {
  const svc = SERVICES[svcId];
  const result = [];
  svc.blocks.forEach((block, bi) => {
    const itemSet = selectedItems[svcId]?.[bi];
    const activeItems = (block.items || []).filter((_, ii) => itemSet?.has(ii));
    const isSelected = (activeItems.length > 0) || (block.items.length === 0 && itemSet);
    if (isSelected) result.push({ ...block, items: activeItems });
  });
  return result;
}

function renderPreview() {
  const brand = document.getElementById('brandInput')?.value.trim() || 'Your Brand';
  const ambassadorName = document.getElementById('ambassadorInput')?.value.trim() || 'Brand Ambassador';
  const costValue = document.getElementById('costInput')?.value.trim() || 'xxxx';
  const paymentValue = document.getElementById('paymentInput')?.value.trim() || 'Monthly Advance';
  const scroll = document.getElementById('previewScroll');
  if (!scroll) return;
  const selectedList = Object.keys(SERVICES).filter(id => anyItemsInService(id));

  if (!selectedList.length && !document.getElementById('brandInput')?.value.trim()) {
    scroll.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><h3>Start building your proposal</h3><p>Enter a brand name and select services from the left panel. Your proposal will appear here in real time.</p></div>`;
    const pCount = document.getElementById('pageCount');
    if (pCount) pCount.textContent = '0 slides';
    return;
  }

  let slides = [];
  slides.push(`
    <div class="slide">
      <div class="slide-inner">
        <div style="position:absolute;inset:0;">
          <img src="assets/img/first-page.png" style="width:100%; height:100%; object-fit:cover; display:block;" draggable="false" />
        </div>
      </div>
    </div>
  `);

  if (selectedList.length > 0) {
    const allContentItems = [];
    selectedList.filter(id => id !== 'annexures').forEach((svcId) => {
      const svc = SERVICES[svcId];
      const blocks = getActiveBlocksForSlide(svcId);
      blocks.forEach(block => allContentItems.push({ svcName: svc.name, block }));
    });

    let slideGroups = [];
    let currentGroup = [];
    let currentScore = 0;
    let isFirstSlide = true;
    let lastSvcName = "";
    const ITEM_SCORE = 1.1, BLOCK_TITLE_SCORE = 2.5, SVC_TITLE_SCORE = 3.5, DIVIDER_SCORE = 2;
    const FIRST_PAGE_LIMIT = 24, NORMAL_PAGE_LIMIT = 34;

    allContentItems.forEach(item => {
      let itemScore = 0;
      if (item.svcName !== lastSvcName) {
        itemScore += SVC_TITLE_SCORE;
        if (currentGroup.length > 0) itemScore += DIVIDER_SCORE;
      }
      itemScore += BLOCK_TITLE_SCORE;
      if (item.block.para) itemScore += Math.ceil(item.block.para.length / 80) + 2;
      if (item.block.items) itemScore += (item.block.items.length * ITEM_SCORE);
      if (item.block.boldItems) item.block.boldItems.forEach(bi => itemScore += Math.ceil((bi.bold.length + bi.text.length) / 80) * ITEM_SCORE);

      const limit = isFirstSlide ? FIRST_PAGE_LIMIT : NORMAL_PAGE_LIMIT;
      if (currentScore + itemScore > limit && currentGroup.length > 0) {
        slideGroups.push(currentGroup);
        currentGroup = [];
        currentScore = 0;
        isFirstSlide = false;
        lastSvcName = "";
      }
      currentGroup.push(item);
      currentScore += itemScore;
      lastSvcName = item.svcName;
    });
    if (currentGroup.length > 0) slideGroups.push(currentGroup);

    let globalLastSvc = "";
    slideGroups.forEach((group, gIdx) => {
      const isFirstSlideOfContent = (gIdx === 0);
      let bodyHTML = "";
      let slidePrevSvc = "";

      group.forEach((item, i) => {
        if (item.svcName !== globalLastSvc) {
          if (i > 0) bodyHTML += `<div class="plus-divider">+</div>`;
          bodyHTML += `<div class="service-slide-title">${item.svcName}</div>`;
          globalLastSvc = item.svcName;
        } else if (i > 0 && item.svcName !== slidePrevSvc) {
          bodyHTML += `<div class="plus-divider">+</div>`;
        }
        slidePrevSvc = item.svcName;
        const block = item.block;
        const displayTitle = block.title ? block.title.replace(/{Ambassador}/g, ambassadorName) : '';
        let blockBodyHTML = '';
        if (block.para) blockBodyHTML += `<p class="service-block-para">${block.para}</p>`;
        if (block.boldItems && block.boldItems.length) {
          blockBodyHTML += `<ul class="service-block-items">` + block.boldItems.map(bi => `<li><strong>${bi.bold}</strong>${bi.text}</li>`).join('') + `</ul>`;
        }
        if (block.items && block.items.length) {
          blockBodyHTML += `<ul class="service-block-items">` + block.items.map(it => `<li>${it.replace(/{Ambassador}/g, ambassadorName)}</li>`).join('') + `</ul>`;
        }
        bodyHTML += `
          <div class="service-block${displayTitle ? '' : ' service-block--no-title'}">
            ${displayTitle ? `<div class="service-block-title">${displayTitle}</div>` : ''}
            ${blockBodyHTML}
          </div>
        `;
      });

      slides.push(`
        <div class="slide">
          <div class="slide-inner"><div class="slide-content">
            <div class="slide-header"><img src="assets/img/header.png" style="width:100%; height:auto; display:block;" /></div>
            <div class="slide-body">
              ${isFirstSlideOfContent ? `
                <div class="intro-client">Client | <strong>${brand}</strong></div>
                <div class="intro-body">Post our discussions, here's a 'Tailor Made' proposal in detail. Please go through it carefully. We will be happy to explain to you each and every point that is written here. Happy to be working with you soon.</div>
                <div class="plus-divider">+</div>
              ` : ''}
              <div class="scope-heading">SCOPE OF WORK</div>
              <div class="plus-divider">+</div>
              ${bodyHTML}
            </div>
            <div class="slide-footer"><img src="assets/img/footer.png" style="width:100%; height:auto; display:block;" /></div>
          </div></div>
        </div>
      `);
    });
  }

  if (selectedList.length > 0) {
    slides.push(`
      <div class="slide">
        <div class="slide-inner"><div class="slide-content">
          <div class="slide-header"><img src="assets/img/header.png" style="width:100%;" /></div>
          <div class="slide-body">
            <div class="commercials-title">Commercials</div>
            <div class="intro-plus">+</div>
            <div class="retainer-label">Retainer Cost</div>
            <div class="retainer-amount">RS. ${costValue}</div>
            <div class="payment-label">Mode of Payment</div>
            <div class="payment-value">${paymentValue}</div>
            <div class="intro-plus">+</div>
            <div class="tnc-title">Terms and Conditions</div>
            <ul class="tnc-list">
              <li>The commercials do not include third-party costs such as AI Licenses, photo banks, music, etc. they will be charged on actuals.</li>
              <li>Shoots will be charged separately.</li>
              <li>The agency will charge a 15% fee for all third-party facilitation.</li>
              <li>Travel/boarding/lodging outside NCR will be on actuals.</li>
              <li>All applicable taxes as per GOI will be extra.</li>
            </ul>
          </div>
          <div class="slide-footer"><img src="assets/img/footer.png" style="width:100%;" /></div>
        </div></div>
      </div>
    `);
  }

  if (selectedItems['annexures'] && selectedItems['annexures'][0]) {
    const annexItems = selectedItems['annexures'][0];
    const files = ['Annexure_A.jpg', 'Annexure_B1.jpg', 'Annexure_B2.jpg', 'Annexure_C.jpg'];
    files.forEach((file, idx) => {
      if (annexItems.has(idx)) {
        slides.push(`
          <div class="slide">
            <div class="slide-inner">
              <div style="position:absolute;inset:0;"><img src="assets/img/${file}" style="width:100%; height:100%; object-fit:contain; display:block;" /></div>
            </div>
          </div>
        `);
      }
    });
  }

  slides.push(`
    <div class="slide">
      <div class="slide-inner">
        <div style="position:absolute;inset:0;"><img src="assets/img/second-page.png" style="width:100%; height:100%; object-fit:cover; display:block;" /></div>
      </div>
    </div>
  `);

  scroll.innerHTML = slides.join('');
  const pCount = document.getElementById('pageCount');
  if (pCount) pCount.textContent = `${slides.length} slide${slides.length !== 1 ? 's' : ''}`;
}

async function generatePDF() {
  if (!window.jspdf || !window.html2canvas) { alert("Libraries are still loading..."); return; }
  const active = Object.keys(selectedItems).some(k => Object.keys(selectedItems[k]).some(b => selectedItems[k][b].size > 0));
  if (!active && !document.getElementById('brandInput')?.value.trim()) { alert('Add content first.'); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: [720, 1018] });
  const slides = document.querySelectorAll('.slide');
  const overlay = document.getElementById('loadingOverlay');
  const progress = document.getElementById('loadingProgress');
  if (overlay) overlay.classList.add('active');

  await new Promise(r => setTimeout(r, 500));

  for (let i = 0; i < slides.length; i++) {
    if (progress) progress.textContent = `Slide ${i + 1} of ${slides.length}…`;
    const slide = slides[i];
    const images = Array.from(slide.querySelectorAll('img'));
    await Promise.all(images.map(img => img.complete ? Promise.resolve() : new Promise(resolve => { img.onload = resolve; img.onerror = resolve; })));
    await new Promise(r => setTimeout(r, 100));
    const canvas = await html2canvas(slide, { scale: 3, useCORS: true, logging: false, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    if (i > 0) doc.addPage();
    doc.addImage(imgData, 'JPEG', 0, 0, 720, 1018);
  }

  const brand = document.getElementById('brandInput')?.value.trim() || 'Proposal';
  doc.save(`CogCulture_${brand.replace(/\s+/g, '_')}.pdf`);
  if (overlay) overlay.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  initPanel();
  renderPreview();
});
