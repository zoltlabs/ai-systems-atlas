/* ============ ⌘K search palette ============
   Ported from atlas/p5_app.js. The index is inlined by the layout as JSON
   (#searchIndex) so every page can search without shipping the plate copy. */
export function initPalette() {
  const pal = document.getElementById('pal');
  const palScrim = document.getElementById('palScrim');
  const palInput = document.getElementById('palInput');
  const palList = document.getElementById('palList');
  const idxEl = document.getElementById('searchIndex');
  if (!pal || !palInput || !palList || !idxEl) return;
  const SEARCH_INDEX = JSON.parse(idxEl.textContent || '[]');
  let palSel = 0, palResults = [];

  function openPal() {
    pal.classList.add('open'); palScrim.classList.add('open');
    palInput.value = ''; runSearch(''); palInput.focus();
  }
  function closePal() { pal.classList.remove('open'); palScrim.classList.remove('open'); }
  function runSearch(qs) {
    const terms = qs.toLowerCase().split(/\s+/).filter(Boolean);
    palResults = SEARCH_INDEX.filter(it => {
      if (!terms.length) return true;
      const hay = (it.title + ' ' + it.col + ' ' + it.code + ' ' + it.kw).toLowerCase();
      return terms.every(t => hay.includes(t));
    }).slice(0, 12);
    palSel = 0;
    drawPal();
  }
  function drawPal() {
    if (!palResults.length) { palList.innerHTML = '<div class="pal-empty">No concepts match.</div>'; return; }
    palList.innerHTML = palResults.map((r, i) => `
      <button class="pal-item${i === palSel ? ' sel' : ''}" role="option" aria-selected="${i === palSel}" data-i="${i}">
        <span class="pi-col">${r.col}</span><span class="pi-title">${r.title}</span><span class="pi-code">${r.code}</span>
      </button>`).join('');
    palList.querySelectorAll('.pal-item').forEach(b => b.addEventListener('click', () => go(+b.dataset.i)));
  }
  function go(i) {
    const r = palResults[i]; if (!r) return;
    closePal();
    if (location.pathname === r.route) { window.scrollTo({ top: 0 }); return; }
    location.href = r.route;
  }
  palInput.addEventListener('input', () => runSearch(palInput.value));
  palInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); palSel = Math.min(palSel + 1, palResults.length - 1); drawPal(); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); palSel = Math.max(palSel - 1, 0); drawPal(); }
    else if (ev.key === 'Enter') { ev.preventDefault(); go(palSel); }
    else if (ev.key === 'Escape') closePal();
  });
  palScrim.addEventListener('click', closePal);
  window.addEventListener('keydown', (ev) => {
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') { ev.preventDefault(); pal.classList.contains('open') ? closePal() : openPal(); }
    else if (ev.key === 'Escape' && pal.classList.contains('open')) closePal();
  });
  document.querySelectorAll('[data-search-btn]').forEach(b => b.addEventListener('click', openPal));
}
