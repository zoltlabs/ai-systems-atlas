/* ============ legend ============ */
export function legendHTML() {
  const sw = (inner, w = 34, h = 18) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${inner}</svg>`;
  const items = [
    [sw(`<line x1="2" y1="9" x2="24" y2="9" stroke="var(--node-line)" stroke-width="1.4"/><polygon points="32,9 24,5.5 24,12.5" fill="var(--node-line)"/>`), 'data flow'],
    [sw(`<line x1="2" y1="9" x2="24" y2="9" stroke="var(--node-line)" stroke-width="1.4" stroke-dasharray="4 3"/><polygon points="32,9 24,5.5 24,12.5" fill="var(--node-line)"/>`), 'control flow'],
    [sw(`<line x1="2" y1="9" x2="24" y2="9" stroke="var(--accent)" stroke-width="1.6" stroke-dasharray="5 4"/><polygon points="32,9 24,5.5 24,12.5" fill="var(--accent)"/>`), 'active execution'],
    [sw(`<rect x="2" y="2" width="30" height="14" rx="4" fill="var(--danger-soft)" stroke="var(--danger)" stroke-width="1.2" stroke-dasharray="3 2.5"/>`), 'untrusted / risk'],
    [sw(`<rect x="2" y="2" width="30" height="14" rx="4" fill="var(--ok-soft)" stroke="var(--ok)" stroke-width="1.2"/>`), 'verified / allowed'],
    [sw(`<rect x="10" y="7.5" width="13" height="9" rx="2" fill="none" stroke="var(--ink2)" stroke-width="1.3"/><path d="M12.5 7.5V5.6a4 4 0 0 1 8 0v1.9" fill="none" stroke="var(--ink2)" stroke-width="1.3"/>`, 34), 'permission gate'],
    [sw(`<polygon points="17,2 30,9 17,16 4,9" fill="var(--panel2)" stroke="var(--node-line)" stroke-width="1.2"/>`), 'decision'],
    [sw(`<path d="M17 3.5a5.5 5.5 0 1 1-5.2 3.8" fill="none" stroke="var(--ink2)" stroke-width="1.4"/><polygon points="9.5,3.5 13.5,7.5 9,8.8" fill="var(--ink2)"/>`), 'retry / iteration'],
    [sw(`<rect x="4" y="6" width="18" height="9" rx="2.5" fill="var(--node-fill)" stroke="var(--node-line)" stroke-width="1.1"/><rect x="8" y="3.5" width="18" height="9" rx="2.5" fill="var(--node-fill)" stroke="var(--node-line)" stroke-width="1.1"/>`), 'parallel'],
    [sw(`<rect x="2" y="3" width="30" height="12" rx="4" fill="var(--node-fill)" stroke="var(--node-line)" stroke-width="1.1" opacity=".35"/>`), 'inactive branch'],
  ];
  return `<div class="legend" role="img" aria-label="Diagram legend: solid lines are data flow, dashed lines control flow, blue animated lines active execution, red marks untrusted elements, green verified ones, locks permission gates, diamonds decisions.">${items.map(([s, t]) => `<span class="lg">${s}${t}</span>`).join('')}</div>`;
}

