/* ============ OG render entry ============
   Used only by the /og/* render targets that scripts/og.mjs screenshots at
   1200x630. Renders the diagram at its most informative step (the final beat,
   with no step dimming) and mounts custom renderers statically. */
import { renderSVG, Player } from '../engine/engine.js';
import { CUSTOM_MOUNTS } from './custom.js';

function payload(el) {
  const s = el.querySelector(':scope > script[type="application/json"]');
  return s ? JSON.parse(s.textContent) : null;
}

function renderStatic(el, def) {
  const { svg, refs } = renderSVG(def);
  if (def.steps && def.steps.length) {
    const p = new Player(svg, refs, def, null, null);
    p.apply(def.steps.length - 1);
    svg.classList.remove('stepped');
    svg.querySelectorAll('.flash').forEach(x => x.classList.remove('flash'));
  }
  el.innerHTML = '';
  const panel = document.createElement('div'); panel.className = 'dg-panel';
  panel.append(svg);
  el.append(panel);
}

document.querySelectorAll('[data-dg]').forEach(el => { const def = payload(el); if (def) renderStatic(el, def); });
document.querySelectorAll('[data-plate-modes]').forEach(el => { const modes = payload(el); if (modes) renderStatic(el, modes[0].def); });
document.querySelectorAll('[data-custom]').forEach(el => { const fn = CUSTOM_MOUNTS[el.dataset.custom]; if (fn) fn(el, payload(el)); });
document.documentElement.dataset.ogReady = '1';
