/* AI Systems Atlas — diagram engine (vanilla JS + SVG). Ported verbatim from atlas/p2_engine.js; framework-free by design. */
/* ============ AI Systems Atlas — diagram engine ============ */
const NS = 'http://www.w3.org/2000/svg';
const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function S(tag, attrs = {}, ...kids) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
  for (const kd of kids) if (kd != null) e.append(kd);
  return e;
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

/* ---------- node icons (16x16, stroke-based) ---------- */
const ICONS = {
  model: ['M8 1.8 L9.6 6.4 L14.2 8 L9.6 9.6 L8 14.2 L6.4 9.6 L1.8 8 L6.4 6.4 Z'],
  tool: ['M8 2.8a5.2 5.2 0 1 0 0 10.4a5.2 5.2 0 0 0 0-10.4Z', 'M8 6.2a1.8 1.8 0 1 0 0 3.6a1.8 1.8 0 0 0 0-3.6Z'],
  user: ['M8 2.6a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5Z', 'M3.2 13.6c0-2.7 2.1-4.2 4.8-4.2s4.8 1.5 4.8 4.2'],
  human: ['M8 2.6a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5Z', 'M3.2 13.6c0-2.7 2.1-4.2 4.8-4.2s4.8 1.5 4.8 4.2'],
  data: ['M3 4.2c0-1.2 2.2-2 5-2s5 .8 5 2s-2.2 2-5 2s-5-.8-5-2Z', 'M3 4.2v7.6c0 1.2 2.2 2 5 2s5-.8 5-2V4.2'],
  untrusted: ['M8 2.2 L14.4 13.4 H1.6 Z', 'M8 6.6v3', 'M8 11.5v.01'],
  evaluator: ['M8 2.2a5.8 5.8 0 1 0 0 11.6a5.8 5.8 0 0 0 0-11.6Z', 'M5.4 8.3l1.8 1.8 3.4-3.9'],
  memory: ['M3.4 4.2h9.2', 'M3.4 8h9.2', 'M3.4 11.8h9.2'],
  policy: ['M4.2 7.2h7.6v6.2H4.2Z', 'M5.6 7.2V5.4a2.4 2.4 0 0 1 4.8 0v1.8'],
  env: ['M8 2.2a5.8 5.8 0 1 0 0 11.6a5.8 5.8 0 0 0 0-11.6Z', 'M8 2.2c-1.9 1.5-1.9 10.1 0 11.6M8 2.2c1.9 1.5 1.9 10.1 0 11.6', 'M2.4 8h11.2'],
};
function iconEl(kind, x, y) {
  const paths = ICONS[kind]; if (!paths) return null;
  const g = S('g', { class: 'nd-icon', transform: `translate(${x},${y})` });
  for (const d of paths) g.append(S('path', { d }));
  return g;
}

/* ---------- node geometry ---------- */
function nodeDims(n) {
  if (n.kind === 'decision') return { w: n.w || 112, h: n.h || 54 };
  if (n.kind === 'chip') return { w: n.w || 92, h: n.h || 24 };
  return { w: n.w || 118, h: n.h || (n.sub ? 50 : 40) };
}
function anchor(n, side) {
  const { w, h } = nodeDims(n);
  switch (side) {
    case 'l': return { x: n.x - w / 2, y: n.y, dx: -1, dy: 0 };
    case 'r': return { x: n.x + w / 2, y: n.y, dx: 1, dy: 0 };
    case 't': return { x: n.x, y: n.y - h / 2, dx: 0, dy: -1 };
    default:  return { x: n.x, y: n.y + h / 2, dx: 0, dy: 1 };
  }
}
function autoSides(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  return Math.abs(dx) >= Math.abs(dy)
    ? [dx >= 0 ? 'r' : 'l', dx >= 0 ? 'l' : 'r']
    : [dy >= 0 ? 'b' : 't', dy >= 0 ? 't' : 'b'];
}

function buildNode(n) {
  const { w, h } = nodeDims(n);
  const cls = ['nd', n.kind || 'model'];
  if (n.ghost) cls.push('ghostn');
  if (n.info) cls.push('click');
  const g = S('g', { class: cls.join(' '), 'data-id': n.id });
  if (n.kind === 'decision') {
    g.append(S('polygon', { class: 'nd-shape', points: `${n.x},${n.y - h/2} ${n.x + w/2},${n.y} ${n.x},${n.y + h/2} ${n.x - w/2},${n.y}` }));
    const t = S('text', { class: 'nd-label', x: n.x, y: n.y + (n.sub ? -1 : 4), 'text-anchor': 'middle' }); t.textContent = n.label; g.append(t);
    if (n.sub) { const s = S('text', { class: 'nd-sub', x: n.x, y: n.y + 13, 'text-anchor': 'middle' }); s.textContent = n.sub; g.append(s); }
  } else if (n.kind === 'chip') {
    g.append(S('rect', { class: 'nd-shape', x: n.x - w/2, y: n.y - h/2, width: w, height: h, rx: 6 }));
    const t = S('text', { class: 'nd-label', x: n.x, y: n.y + 3.5, 'text-anchor': 'middle', style: 'font-size:9.5px' }); t.textContent = n.label; g.append(t);
  } else {
    g.append(S('rect', { class: 'nd-shape', x: n.x - w/2, y: n.y - h/2, width: w, height: h, rx: 9 }));
    const hasIcon = !!ICONS[n.kind || 'model'] && !n.noicon;
    const lx = hasIcon ? n.x - w/2 + 33 : n.x;
    const ta = hasIcon ? 'start' : 'middle';
    if (hasIcon) g.append(iconEl(n.kind || 'model', n.x - w/2 + 10, n.y - 8));
    const t = S('text', { class: 'nd-label', x: lx, y: n.y + (n.sub ? -1.5 : 4), 'text-anchor': ta }); t.textContent = n.label; g.append(t);
    if (n.sub) { const s = S('text', { class: 'nd-sub', x: lx, y: n.y + 12.5, 'text-anchor': ta }); s.textContent = n.sub; g.append(s); }
  }
  if (n.title || n.info) { const ti = S('title'); ti.textContent = n.title || (n.label + ': ' + n.info); g.append(ti); }
  if (n.info) { g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', `${n.label}: inspect role`); }
  return g;
}

function buildEdge(e, byId) {
  let d = e.d;
  if (!d) {
    const a = byId[e.from], b = byId[e.to];
    let [s1, s2] = autoSides(a, b);
    if (e.fromSide) s1 = e.fromSide;
    if (e.toSide) s2 = e.toSide;
    const p1 = anchor(a, s1), p2 = anchor(b, s2);
    if (e.off) { // perpendicular offset for parallel edges
      const o = e.off;
      if (s1 === 'l' || s1 === 'r') p1.y += o; else p1.x += o;
      if (s2 === 'l' || s2 === 'r') p2.y += o; else p2.x += o;
    }
    const straight = (p1.dx !== 0 && Math.abs(p1.y - p2.y) < 1) || (p1.dy !== 0 && Math.abs(p1.x - p2.x) < 1);
    if (straight && !e.bend) {
      d = `M${p1.x} ${p1.y} L${p2.x} ${p2.y}`;
    } else {
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const k = Math.min(Math.max(dist * 0.42, 26), 92);
      const c1x = p1.x + p1.dx * k, c1y = p1.y + p1.dy * k;
      const c2x = p2.x + p2.dx * k, c2y = p2.y + p2.dy * k;
      d = `M${p1.x} ${p1.y} C${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
    }
  }
  const cls = ['edge'];
  if (e.kind === 'ctl') cls.push('ctl');
  if (e.ghost) cls.push('ghostE');
  const g = S('g', { class: cls.join(' '), 'data-id': e.id || `${e.from}-${e.to}` });
  const core = S('path', { class: 'core', d });
  const flow = S('path', { class: 'flow', d });
  g.append(core, flow);
  // geometry probing
  let L = 100, end = { x: 0, y: 0 }, prev = { x: -1, y: 0 }, mid = { x: 0, y: 0 };
  try {
    L = core.getTotalLength();
    end = core.getPointAtLength(L);
    prev = core.getPointAtLength(Math.max(0, L - 1));
    mid = core.getPointAtLength(L * (e.labelT != null ? e.labelT : 0.5));
  } catch (err) { /* detached-geometry unsupported: skip decorations */ }
  const ang = Math.atan2(end.y - prev.y, end.x - prev.x) * 180 / Math.PI;
  if (!e.noArrow) {
    const pts = '0,0 -8.5,4 -8.5,-4';
    g.append(S('polygon', { class: 'ah', points: pts, transform: `translate(${end.x},${end.y}) rotate(${ang})` }));
    g.append(S('polygon', { class: 'ah2', points: pts, transform: `translate(${end.x},${end.y}) rotate(${ang})` }));
  }
  if (e.label) {
    const t = S('text', { class: 'e-label', x: mid.x + (e.lx || 0), y: mid.y + (e.ly != null ? e.ly : -7), 'text-anchor': e.lanchor || 'middle' });
    t.textContent = e.label; g.append(t);
  }
  return g;
}

function buildBoundary(b) {
  const cls = ['bnd', b.kind || 'sys'];
  if (b.ghost) cls.push('ghostB');
  const g = S('g', { class: cls.join(' '), 'data-id': b.id || '' });
  g.append(S('rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: 12 }));
  if (b.label) { const t = S('text', { x: b.x + 12, y: b.y + 17 }); t.textContent = b.label; g.append(t); }
  return g;
}

function buildNote(a) {
  const cls = ['note'];
  if (a.tone === 'danger') cls.push('danger');
  if (a.tone === 'ok') cls.push('okn');
  if (a.ghost) cls.push('ghostA');
  const g = S('g', { class: cls.join(' '), 'data-id': a.id || '' });
  const lines = Array.isArray(a.text) ? a.text : [a.text];
  lines.forEach((ln, i) => {
    const t = S('text', { x: a.x, y: a.y + i * 13, 'text-anchor': a.anchor || 'start' });
    t.textContent = ln; g.append(t);
  });
  if (a.leader) g.append(S('path', { class: 'leader', d: `M${a.leader[0]} ${a.leader[1]} L${a.leader[2]} ${a.leader[3]}` }));
  return g;
}

/* ---------- render a diagram definition into an svg ---------- */
function renderSVG(def) {
  const svg = S('svg', {
    class: 'dg', viewBox: `0 0 ${def.w} ${def.h}`, width: def.w,
    role: 'img', 'aria-label': def.aria || def.title || 'diagram',
  });
  const byId = {};
  for (const n of def.nodes) byId[n.id] = n;
  const refs = { nodes: {}, edges: {}, bounds: {}, notes: {} };
  const gB = S('g'), gE = S('g'), gN = S('g'), gA = S('g');
  svg.append(gB, gE, gN, gA);
  for (const b of def.bounds || []) { const el = buildBoundary(b); refs.bounds[b.id || ''] = el; gB.append(el); }
  for (const e of def.edges || []) { const el = buildEdge(e, byId); refs.edges[e.id || `${e.from}-${e.to}`] = el; gE.append(el); }
  for (const n of def.nodes) { const el = buildNode(n); refs.nodes[n.id] = el; gN.append(el); }
  for (const a of def.notes || []) { const el = buildNote(a); refs.notes[a.id || Math.random()] = el; gA.append(el); }
  return { svg, refs };
}

/* ---------- step player ---------- */
class Player {
  constructor(svg, refs, def, capEl, dotsEl, opts = {}) {
    this.svg = svg; this.refs = refs; this.def = def;
    this.capEl = capEl; this.dotsEl = dotsEl;
    this.steps = def.steps || [];
    this.idx = -1; this.timer = null; this.playing = false;
    this.dur = def.dur || 1700;
    this.onchange = opts.onchange || null;
    this.buildDots();
    this.apply(0);
  }
  buildDots() {
    if (!this.dotsEl) return;
    this.dotsEl.innerHTML = '';
    this.steps.forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'dg-dot'; b.type = 'button';
      b.setAttribute('aria-label', `Step ${i + 1} of ${this.steps.length}`);
      b.addEventListener('click', () => { this.pause(); this.apply(i); });
      this.dotsEl.append(b);
    });
  }
  clearStates() {
    const all = this.svg.querySelectorAll('.nd,.edge');
    all.forEach(el => el.classList.remove('on', 'ok', 'bad', 'okE', 'badE', 'flash'));
    this.svg.querySelectorAll('.ghostn,.ghostE,.ghostB,.ghostA').forEach(el => el.classList.remove('shown'));
  }
  apply(i) {
    if (!this.steps.length) return;
    this.idx = ((i % this.steps.length) + this.steps.length) % this.steps.length;
    const st = this.steps[this.idx];
    this.clearStates();
    const has = (st.n && st.n.length) || (st.e && st.e.length) || (st.ok && st.ok.length) || (st.bad && st.bad.length);
    this.svg.classList.toggle('stepped', !!has && !st.all);
    const add = (ids, map, cls) => (ids || []).forEach(id => { const el = map[id]; if (el) el.classList.add(cls); });
    add(st.n, this.refs.nodes, 'on');
    add(st.ok, this.refs.nodes, 'ok');
    add(st.bad, this.refs.nodes, 'bad');
    add(st.e, this.refs.edges, 'on');
    add(st.okE, this.refs.edges, 'okE');
    add(st.badE, this.refs.edges, 'badE');
    add(st.flash, this.refs.nodes, 'flash');
    for (const id of st.show || []) {
      for (const map of [this.refs.nodes, this.refs.edges, this.refs.bounds, this.refs.notes]) {
        if (map[id]) map[id].classList.add('shown');
      }
    }
    if (this.capEl) this.capEl.innerHTML = `<b>${this.idx + 1}/${this.steps.length}</b>&nbsp; ${st.cap || ''}`;
    if (this.dotsEl) [...this.dotsEl.children].forEach((d, j) => d.classList.toggle('on', j === this.idx));
    if (this.onchange) this.onchange(this.idx, st);
  }
  schedule() {
    clearTimeout(this.timer);
    if (!this.playing) return;
    const st = this.steps[this.idx] || {};
    const hold = (st.d || this.dur) + (this.idx === this.steps.length - 1 ? 1100 : 0);
    this.timer = setTimeout(() => { this.apply(this.idx + 1); this.schedule(); }, hold);
  }
  play() { if (!this.steps.length) return; this.playing = true; this.svg.classList.add('playing'); this.schedule(); this.syncBtn(); }
  pause() { this.playing = false; clearTimeout(this.timer); this.svg.classList.remove('playing'); this.syncBtn(); }
  toggle() { this.playing ? this.pause() : this.play(); }
  next() { this.pause(); this.apply(this.idx + 1); }
  prev() { this.pause(); this.apply(this.idx - 1); }
  replay() { this.apply(0); this.play(); }
  destroy() { this.pause(); }
  syncBtn() {
    if (!this.playBtn) return;
    this.playBtn.innerHTML = this.playing ? ICO.pause : ICO.play;
    this.playBtn.setAttribute('aria-label', this.playing ? 'Pause animation' : 'Play animation');
  }
}

const ICO = {
  play: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1.5l8 4.5-8 4.5z" fill="currentColor"/></svg>',
  pause: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1.5h2.6v9H2.5zM6.9 1.5h2.6v9H6.9z" fill="currentColor"/></svg>',
  prev: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M8.5 1.5L3 6l5.5 4.5zM2.5 1.5h1.4v9H2.5z" fill="currentColor"/></svg>',
  next: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 1.5L9 6l-5.5 4.5zM8.1 1.5h1.4v9H8.1z" fill="currentColor"/></svg>',
  replay: '<svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 2.2a4.8 4.8 0 1 1-4.6 3.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2 1.5v4h4z" fill="currentColor" transform="translate(-.4 -.1) scale(.85)"/></svg>',
};

/* ---------- full interactive mount (panel + controls + modes + inspector) ---------- */
const livePlayers = [];
const dgObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
  for (const en of entries) {
    const p = en.target._player;
    if (!p) continue;
    if (en.isIntersecting && !REDUCED && !p._userPaused) p.play();
    else if (!en.isIntersecting) { p.pause(); }
  }
}, { threshold: 0.3 }) : null;

function mountDiagram(container, spec) {
  const modes = spec.modes || null;
  let modeIdx = 0;
  if (modes && spec.initMode) {
    const mi = modes.findIndex(m => m.id === spec.initMode);
    if (mi >= 0) modeIdx = mi;
  }
  container.innerHTML = '';
  container.classList.add('dg-shell');
  const panel = document.createElement('div'); panel.className = 'dg-panel';
  const bar = document.createElement('div'); bar.className = 'dg-bar';
  container.append(panel, bar);

  let inspectEl = null;
  let player = null;

  function currentDef() { return modes ? modes[modeIdx].def : spec.def; }

  function build() {
    if (player) { player.destroy(); if (dgObserver) dgObserver.unobserve(container); }
    panel.innerHTML = ''; bar.innerHTML = '';
    const def = currentDef();
    const { svg, refs } = renderSVG(def);
    panel.append(svg);

    // mode toggle
    if (modes) {
      const mwrap = document.createElement('div'); mwrap.className = 'dg-modes'; mwrap.setAttribute('role', 'group'); mwrap.setAttribute('aria-label', 'Diagram variant');
      modes.forEach((m, i) => {
        const b = document.createElement('button');
        b.className = 'dg-mode' + (m.cls ? ' ' + m.cls : ''); b.type = 'button';
        b.textContent = m.label;
        b.setAttribute('aria-pressed', String(i === modeIdx));
        b.addEventListener('click', () => { if (i === modeIdx) return; modeIdx = i; build(); if (spec.onMode) spec.onMode(modes[i].id); });
        mwrap.append(b);
      });
      bar.append(mwrap);
    }

    // step controls
    const hasSteps = (def.steps || []).length > 0;
    let capEl = null, dotsEl = null;
    if (hasSteps) {
      const ctr = document.createElement('div'); ctr.className = 'dg-controls';
      const mk = (ico, label, fn) => {
        const b = document.createElement('button'); b.className = 'dg-btn'; b.type = 'button';
        b.innerHTML = ico; b.setAttribute('aria-label', label);
        b.addEventListener('click', fn); return b;
      };
      dotsEl = document.createElement('div'); dotsEl.className = 'dg-dots';
      capEl = document.createElement('div'); capEl.className = 'dg-cap'; capEl.setAttribute('aria-live', 'polite');
      player = new Player(svg, refs, def, capEl, dotsEl);
      const playB = mk(ICO.play, 'Play animation', () => { player._userPaused = player.playing; player.toggle(); });
      player.playBtn = playB;
      ctr.append(
        mk(ICO.prev, 'Previous step', () => { player._userPaused = true; player.prev(); }),
        playB,
        mk(ICO.next, 'Next step', () => { player._userPaused = true; player.next(); }),
        mk(ICO.replay, 'Replay from start', () => { player._userPaused = false; player.replay(); })
      );
      bar.append(ctr, dotsEl, capEl);
      container._player = player;
      if (dgObserver) dgObserver.observe(container);
      livePlayers.push(player);
    } else if (def.caption) {
      capEl = document.createElement('div'); capEl.className = 'dg-cap'; capEl.innerHTML = def.caption;
      bar.append(capEl);
    }

    // node inspector
    const infoNodes = def.nodes.filter(n => n.info);
    if (infoNodes.length) {
      if (!inspectEl) { inspectEl = document.createElement('div'); container.append(inspectEl); }
      inspectEl.className = 'dg-inspect empty';
      inspectEl.innerHTML = 'Click a node to inspect its role.';
      const select = (n) => {
        svg.querySelectorAll('.nd.sel').forEach(x => x.classList.remove('sel'));
        refs.nodes[n.id].classList.add('sel');
        inspectEl.className = 'dg-inspect';
        inspectEl.innerHTML = `<span class="tag">${esc(n.label)}</span><span>${esc(n.info)}</span>`;
      };
      for (const n of infoNodes) {
        const el = refs.nodes[n.id];
        el.addEventListener('click', () => select(n));
        el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(n); } });
      }
    }
  }
  build();
  return { getMode: () => (modes ? modes[modeIdx].id : null) };
}

/* ---------- mini (static, hover-animated) diagram for cards ---------- */
function miniSVG(def) {
  const { svg } = renderSVG(def);
  svg.removeAttribute('width');
  svg.setAttribute('aria-hidden', 'true');
  return svg.outerHTML;
}

/* ============ static svg helper (applies first step's state, no controls) ============ */
function staticSVG(def) {
  const { svg, refs } = renderSVG(def);
  const st = (def.steps && def.steps[0]) || null;
  if (st) {
    const add = (ids, map, cls) => (ids || []).forEach(id => { if (map[id]) map[id].classList.add(cls); });
    add(st.ok, refs.nodes, 'ok'); add(st.bad, refs.nodes, 'bad');
    add(st.okE, refs.edges, 'okE'); add(st.badE, refs.edges, 'badE');
  }
  svg.removeAttribute('width');
  return svg.outerHTML;
}


export { NS, S, esc, ICONS, REDUCED, renderSVG, Player, ICO, livePlayers, dgObserver, mountDiagram, miniSVG, staticSVG };
