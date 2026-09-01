/* ============ AI Systems Atlas — client entry ============
   One small bundle on every page: the diagram engine, the custom renderers,
   the ⌘K palette and the legacy-hash redirect. Diagram definitions are NOT in
   this bundle — each page inlines only the definitions it renders, as JSON
   next to the mount point (see src/components/Diagram.astro). */
import { mountDiagram, miniSVG, REDUCED } from '../engine/engine.js';
import { CUSTOM_MOUNTS } from './custom.js';
import { initPalette } from './palette.js';
import { initTheme } from './theme.js';

/* ---------- legacy hash routes: #/harnesses/react?mode=x → /harnesses/react?mode=x ---------- */
(function redirectLegacyHash() {
  const m = /^#\/([^?]*)(\?.*)?$/.exec(location.hash);
  if (!m) return;
  const path = '/' + m[1].replace(/\/+$/, '');
  location.replace(path + (m[2] || ''));
})();

function payload(el) {
  const s = el.querySelector(':scope > script[type="application/json"]');
  return s ? JSON.parse(s.textContent) : null;
}

/* ---------- mount every diagram on the page ---------- */
document.querySelectorAll('[data-dg]').forEach(el => {
  const def = payload(el);
  if (def) mountDiagram(el, { def });
});

document.querySelectorAll('[data-plate-modes]').forEach(el => {
  const modes = payload(el);
  if (!modes) return;
  const routed = el.dataset.routed === '1';
  const q = new URLSearchParams(location.search);
  mountDiagram(el, {
    modes,
    initMode: routed ? (q.get('mode') || undefined) : undefined,
    onMode: (id) => {
      if (!routed) return;
      history.replaceState(null, '', location.pathname + '?mode=' + encodeURIComponent(id) + location.hash);
    },
  });
});

document.querySelectorAll('[data-custom]').forEach(el => {
  const fn = CUSTOM_MOUNTS[el.dataset.custom];
  if (fn) fn(el, payload(el));
});

document.querySelectorAll('[data-mini]').forEach(el => {
  const def = payload(el);
  if (def) el.innerHTML = miniSVG(def);
});

/* ---------- in-page plate anchors (#plate-slug on collection pages) ---------- */
function highlightAnchor() {
  const id = location.hash.replace(/^#/, '');
  if (!id.startsWith('plate-')) return;
  const target = document.getElementById(id);
  if (!target) return;
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    document.querySelectorAll('.plate.hl').forEach(x => x.classList.remove('hl'));
    target.classList.add('hl');
    setTimeout(() => target.classList.remove('hl'), 2600);
  });
}
window.addEventListener('hashchange', highlightAnchor);
highlightAnchor();

initTheme();
initPalette();
