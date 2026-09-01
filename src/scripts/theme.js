/* ---------- theme control ----------
   Three states, matching what the CSS in atlas.css already supports (DESIGN.md §3):
   "system" leaves the document un-stamped so prefers-color-scheme decides, "light" and
   "dark" stamp data-theme and win over the OS in both directions.

   The stamp itself is applied by a tiny inline script in Base.astro that runs before first
   paint — this module only handles the button, so a slow bundle can never cause a flash of
   the wrong theme. */

export const THEME_KEY = 'atlas-theme';
const ORDER = ['system', 'light', 'dark'];

const LABEL = {
  system: 'Theme: system',
  light: 'Theme: light',
  dark: 'Theme: dark',
};

/* Ground colors for the address-bar tint. The static <meta name="theme-color"> pair in the
   layout is media-query based, which stops being true the moment a reader picks a theme. */
const GROUND = { light: '#F6F6F4', dark: '#121316' };

export function readTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch { return 'system'; }
}

function apply(theme) {
  const root = document.documentElement;
  if (theme === 'system') { root.removeAttribute('data-theme'); root.removeAttribute('data-theme-pref'); }
  else { root.setAttribute('data-theme', theme); root.setAttribute('data-theme-pref', theme); }

  try {
    if (theme === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, theme);
  } catch { /* private mode: the choice just doesn't persist */ }

  const resolved = theme === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.remove());
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.content = GROUND[resolved];
  document.head.appendChild(meta);
}

export function initTheme() {
  const btn = document.querySelector('[data-theme-btn]');
  if (!btn) return;
  let theme = readTheme();

  /* the glyph itself is CSS-driven off <html data-theme-pref> (stamped before first paint),
     so this only keeps the accessible name in step */
  const paint = () => {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    btn.setAttribute('aria-label', `${LABEL[theme]}. Switch to ${next}.`);
    btn.title = `${LABEL[theme]} — switch to ${next}`;
  };

  paint();
  btn.addEventListener('click', () => {
    theme = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    apply(theme);
    paint();
  });

  /* while on "system", follow the OS if it changes under us */
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme === 'system') apply('system');
  });
}
