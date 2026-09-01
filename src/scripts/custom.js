/* ============ custom renderers ============
   Comparison map, regression chart, failure taxonomy, outcome/process mismatch,
   context-window anatomy and the budget builder. Ported from atlas/p5_app.js;
   the only behavioural change is that the map navigates to real URLs. */
import { NS, staticSVG } from '../engine/engine.js';
import { HARNESS_MAP, FAILURE_TAXONOMY, CONTEXT_SEGMENTS, BUDGET_ITEMS, BUDGET_MAX } from '../data/custom-data.js';

export const CUSTOM_MOUNTS = {

  map(el) {
    const W = 880, H = 430, x0 = 60, x1 = 850, y0 = 385, y1 = 40;
    const px = v => x0 + v * (x1 - x0), py = v => y0 - v * (y0 - y1);
    let inner = '';
    for (const f of [0.25, 0.5, 0.75]) {
      inner += `<line class="map-grid" x1="${px(f)}" y1="${y1}" x2="${px(f)}" y2="${y0}"/>`;
      inner += `<line class="map-grid" x1="${x0}" y1="${py(f)}" x2="${x1}" y2="${py(f)}"/>`;
    }
    inner += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="var(--line)" stroke-width="1.2"/>`;
    inner += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="var(--line)" stroke-width="1.2"/>`;
    inner += `<text class="map-axis" x="${x0}" y="${y0 + 26}">SIMPLE · CHEAP</text>`;
    inner += `<text class="map-axis" x="${x1}" y="${y0 + 26}" text-anchor="end">COMPLEX · EXPENSIVE →</text>`;
    inner += `<text class="map-axis" x="${x0 - 10}" y="${y0 - 2}" text-anchor="start" transform="rotate(-90 ${x0 - 10} ${y0 - 2})">DETERMINISTIC</text>`;
    inner += `<text class="map-axis" x="${x0 - 10}" y="${y1 + 4}" transform="rotate(-90 ${x0 - 10} ${y1 + 4})" text-anchor="end">AUTONOMOUS →</text>`;
    el.innerHTML = `<div class="map-panel">
      <svg viewBox="0 0 ${W} ${H}" role="group" aria-label="Comparison map of harness patterns positioned by complexity, autonomy and cost. Positions are illustrative.">${inner}</svg>
      <div class="dg-cap" style="padding:8px 6px 6px">circle area ≈ relative cost per task · positions are illustrative, not measured · <b>click a pattern to jump to its plate</b></div>
    </div>`;
    const svg = el.querySelector('svg');
    for (const d of HARNESS_MAP) {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'map-dot'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'link');
      g.setAttribute('aria-label', d.label + ' — jump to plate');
      const cx = px(d.x), cy = py(d.y);
      g.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${d.r}"/><text x="${cx}" y="${cy - d.r - 7}" text-anchor="middle">${d.label}</text>`;
      const go = () => { location.href = '/harnesses/' + d.id; };
      g.addEventListener('click', go);
      g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); } });
      svg.append(g);
    }
  },

  regression(el) {
    const tasks = ['repo QA', 'refactor', 'multi-file bug', 'API design', 'test writing'];
    const A = [62, 71, 55, 68, 74], B = [78, 80, 41, 83, 86];
    const max = 100, regressIdx = 2;
    let groups = '';
    tasks.forEach((t, i) => {
      const reg = i === regressIdx;
      groups += `<div class="rg-group${reg ? ' reg' : ''}">
        <div class="rg-bars">
          <div class="rg-bar a" style="--v:${A[i] / max}" title="Version A · ${t}: ${A[i]}%"><span>${A[i]}</span></div>
          <div class="rg-bar b" style="--v:${B[i] / max}" title="Version B · ${t}: ${B[i]}%"><span>${B[i]}</span></div>
        </div>
        <div class="rg-task">${t}${reg ? '<div class="rg-flag">▼ regression</div>' : ''}</div>
      </div>`;
    });
    el.innerHTML = `<div class="dg-panel" style="padding:18px 18px 12px">
      <div class="rg-head">
        <span class="rg-leg"><i class="rg-sw a"></i>Version A — pass rate %</span>
        <span class="rg-leg"><i class="rg-sw b"></i>Version B (candidate)</span>
        <span class="rg-mean mono">mean: 66 → 74</span>
      </div>
      <div class="regchart" role="img" aria-label="Grouped bar chart: version B beats version A on four of five task families but regresses from 55 to 41 percent on multi-file bug fixing.">${groups}</div>
      <div class="dg-cap" style="padding-top:10px">The mean improved by 8 points. Ship it? <b>Multi-file bugs just got 14 points worse.</b></div>
    </div>`;
    requestAnimationFrame(() => requestAnimationFrame(() => el.querySelectorAll('.rg-bar').forEach(b => b.classList.add('grow'))));
  },

  taxonomy(el) {
    el.innerHTML = `<div class="dg-panel" style="padding:18px 16px 14px">
      <div class="tax" role="list"></div>
      <div class="tax-detail" aria-live="polite"><span class="tag">Where do runs die?</span>Share of 412 failed trajectories by root cause (illustrative). Click a category.</div>
    </div>`;
    const list = el.querySelector('.tax'); const detail = el.querySelector('.tax-detail');
    FAILURE_TAXONOMY.forEach((f) => {
      const row = document.createElement('button');
      row.className = 'tax-row'; row.type = 'button'; row.setAttribute('role', 'listitem');
      row.innerHTML = `<span class="t-name">${f.name}</span><span class="t-bar"><span class="t-fill" style="--w:${f.pct / 22 * 100}%"></span></span><span class="t-pct">${f.pct}%</span>`;
      row.addEventListener('click', () => {
        list.querySelectorAll('.tax-row').forEach(r => r.classList.remove('sel'));
        row.classList.add('sel');
        detail.innerHTML = `<span class="tag">${f.name} · ${f.pct}%</span>${f.desc}`;
      });
      list.append(row);
    });
    requestAnimationFrame(() => requestAnimationFrame(() => el.querySelectorAll('.t-fill').forEach(b => { b.style.width = b.style.getPropertyValue('--w'); })));
  },

  /* data = { lucky, unlucky } diagram definitions, inlined by the page */
  mismatch(el, data) {
    el.innerHTML = `<div class="vs-grid">
      <div class="vs-col">
        <div class="vs-tag risk">LUCKY PASS — outcome ✓ · process ✗</div>
        ${staticSVG(data.lucky)}
        <div class="vs-note">Guessed an API, edited the wrong file first, stumbled into a fix. Outcome metrics score this a win. It will not survive a rerun.</div>
      </div>
      <div class="vs-col">
        <div class="vs-tag safe">PRINCIPLED MISS — outcome ✗ · process ✓</div>
        ${staticSVG(data.unlucky)}
        <div class="vs-note">Read the docs, planned soundly, missed by one index. Outcome metrics score this identical to garbage. It is one small fix from reliable.</div>
      </div>
    </div>`;
  },

  anatomy(el) {
    const notes = [
      'Who the agent is. Small, constant, load-bearing.',
      'App-level rules layered on top.',
      'Every tool schema the model might call — often bigger than people expect.',
      'Facts recalled from long-term stores for this task.',
      'The thing everything else exists to serve. Often the smallest slice.',
      'RAG output. The most volume-per-value sensitive slice.',
      'What the agent already did — grows every step.',
      'What the world said back — grows faster than everything else.',
      'The working state right now.',
    ];
    const total = CONTEXT_SEGMENTS.reduce((s, x) => s + x.tok, 0);
    let segs = '', rows = '';
    CONTEXT_SEGMENTS.forEach((s, i) => {
      const showLab = (s.tok / total) * 420 >= 16;
      segs += `<div class="b-seg ${s.color}" data-h="${(s.tok / total) * 100}" style="height:0%" title="${s.name}: ~${s.tok}k tokens">${showLab ? `<span>${s.name} · ${s.tok}k</span>` : ''}</div>`;
      rows += `<div class="an-note"><b>${s.name} — ~${s.tok}k</b><br>${notes[i]}</div>`;
    });
    el.innerHTML = `<div class="anatomy">
      <div>
        <div class="b-window" style="height:420px" role="img" aria-label="A context window filling with layered segments: instructions, tool definitions, memory, the user goal, retrieved documents, and a majority of previous actions and observations.">${segs}</div>
        <div class="b-readout"><span>window: ${total}k tokens</span><b>100% allocated</b></div>
      </div>
      <div>${rows}</div>
    </div>`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.querySelectorAll('.b-seg').forEach(sg => { sg.style.height = sg.dataset.h + '%'; });
    }));
  },

  budget(el) {
    let items = BUDGET_ITEMS.map(x => ({ ...x }));
    el.innerHTML = `<div class="budget">
      <div class="budget-list" role="group" aria-label="Toggle candidate context items"></div>
      <div class="budget-vis">
        <div class="b-window" role="img" aria-label="Context window usage from the selected items"></div>
        <div class="b-readout"><span>budget: ${BUDGET_MAX}k tokens</span><b class="b-total"></b></div>
        <div class="b-warn"></div>
        <div class="b-hint">Try swapping the “full” variants for their compact alternatives.</div>
      </div>
    </div>`;
    const listEl = el.querySelector('.budget-list');
    const winEl = el.querySelector('.b-window');
    const totalEl = el.querySelector('.b-total');
    const warnEl = el.querySelector('.b-warn');
    const CAT_COLOR = { fixed: 'seg-a', history: 'seg-f', retrieval: 'seg-e', memory: 'seg-c', observations: 'seg-b' };
    function draw() {
      const on = items.filter(x => x.on);
      const total = on.reduce((s, x) => s + x.tok, 0);
      winEl.innerHTML = on.map(x => {
        const lab = (x.tok / BUDGET_MAX) * 320 >= 16 ? `<span>${x.name.length > 30 ? x.name.slice(0, 29) + '…' : x.name} · ${x.tok}k</span>` : '';
        return `<div class="b-seg ${CAT_COLOR[x.cat]}" style="height:${Math.min(100, (x.tok / BUDGET_MAX) * 100)}%" title="${x.name}: ${x.tok}k">${lab}</div>`;
      }).join('');
      const over = total > BUDGET_MAX;
      totalEl.textContent = `${total}k / ${BUDGET_MAX}k`;
      totalEl.classList.toggle('over', over);
      warnEl.classList.toggle('show', over);
      warnEl.textContent = over ? `Over budget by ${total - BUDGET_MAX}k — the harness will truncate something, and it won’t choose wisely.` : '';
      winEl.style.outline = over ? '2px solid var(--danger)' : 'none';
    }
    items.forEach((x, i) => {
      const lab = document.createElement('label');
      lab.className = 'b-item' + (x.on ? '' : ' off');
      lab.innerHTML = `<input type="checkbox" ${x.on ? 'checked' : ''} ${x.lock ? 'disabled' : ''} aria-label="${x.name}, ${x.tok}k tokens">
        <span class="b-name">${x.name}</span><span class="b-cat">${x.cat}</span><span class="b-tok">${x.tok}k</span>`;
      lab.querySelector('input').addEventListener('change', (ev) => {
        items[i].on = ev.target.checked;
        lab.classList.toggle('off', !ev.target.checked);
        draw();
      });
      listEl.append(lab);
    });
    draw();
  },
};
