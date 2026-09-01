# AI Systems Atlas — Design System

This document is the enforcement reference for the Atlas. Every page, plate, and diagram must
conform to it. If a change conflicts with a rule here, change the rule first (in a PR that says
why), never silently in the code.

The live artifact: https://claude.ai/code/artifact/8ad0a3c9-318f-41e0-933a-1dfcc20daa89

---

## 1. Principles

1. **Diagram-first.** A reader should grasp the core idea of any plate from the diagram alone,
   without the prose. Prose supports; it never carries.
2. **Color is meaning, never decoration.** Diagrams are neutral by default. Color appears only
   to say something: blue = executing, red = untrusted/risk, green = verified/allowed.
3. **Motion explains or it goes.** Every animation must clarify sequence, causality, data flow,
   or a trust boundary. No ambient effects, no springs on technical flows.
4. **One visual grammar.** Every diagram on the site uses the same node kinds, edge semantics,
   and state colors. A reader who learns one plate can read all of them.
5. **Friendly surface, technical core.** The reading layer (headings, body, labels) is warm,
   sentence-case, and generously sized. The drawing layer (inside SVGs) stays compact mono.
6. **Screenshot-ready.** Any diagram panel, cropped alone, should stand on its own.

---

## 2. Typography

### Faces

| Role | Face | Fallback | Usage |
|---|---|---|---|
| Display / headings / wordmark | **Bricolage Grotesque** (opsz, 400–700) | Plus Jakarta Sans, system-ui | h1–h3, brand |
| Body / UI | **Plus Jakarta Sans** (400–800) | system-ui, sans-serif | everything readable |
| Technical | **IBM Plex Mono** (400–600) | ui-monospace | diagram layer ONLY (see below) |

Self-hosted, not fetched from a third party: `scripts/fonts.mjs` extracts the woff2 files
from the `@fontsource` packages into `src/fonts/` and writes `src/styles/fonts.css`, which
declares the real family names above (never @fontsource's "… Variable" aliases). Latin and
latin-ext subsets only, `display: swap`, `unicode-range` per subset. Regenerate with
`npm run fonts`. Always declare the fallback stacks.

### Where mono is allowed

Mono is reserved for the **diagram/technical layer**: SVG node labels and sublabels, edge
labels, boundary titles, annotations, plate code badges (`H-06`), deep-link routes, token
counts, axis labels, kbd hints, and the tiny `def-line` on preview cards. **Nothing else.**
Captions, buttons, chips, meta labels, and all prose are Plus Jakarta Sans.

### Scale (do not shrink below these)

| Element | Size / weight |
|---|---|
| Body | 16px / 400, line-height 1.65 |
| Hero h1 | clamp(36px, 5vw, 54px) / 600 |
| Page h1 | clamp(32px, 4.6vw, 44px) / 600 |
| Section h2 | 27px / 600 |
| Plate h3 | 26px / 600 |
| Card h3 | 21px · mini-card h4 17px / 700 |
| Lede | 17.5–18px, `--ink2`, max-width 58ch |
| Plate definition | 17px, `--ink2`, max-width 62ch |
| Meta labels ("Key insight") | 13.5px / 700, sentence case, `--ink` |
| Meta text, list rows | 14.5px |
| Step captions | 13.5px |
| Chips | 13px / 600 |
| SVG node label | 11px mono 600 · sublabel 9.5px · edge label 9.5px |

### Hard rules

- **No eyebrows.** No small uppercase letterspaced labels above headings — not on the hero,
  not on collection pages, not on cards, not above plate titles. Plate numbering lives in the
  inline `.code-badge` beside the title, nothing above it.
- **No uppercase-mono UI labels.** Labels like "Key insight", "Failure mode", "Related",
  "Index" are sentence-case bold sans. Uppercase text may appear only *inside* diagrams
  (node labels) and on functional micro-labels (`vs-tag`, budget categories, axis ends).
- Headings get `text-wrap: balance`. Running text stays near 58–65ch.
- Tabular figures (`font-variant-numeric: tabular-nums`) wherever digits align.

---

## 3. Color

All colors are CSS custom properties. **Never hardcode a hex in a component** — components read
tokens, and every color must resolve in the un-stamped (system) theme state: full light palette
on bare `:root`, dark overrides under `@media (prefers-color-scheme: dark)` guarded as
`:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`.

The nav carries a three-state theme control — system (un-stamped, the default), light, dark —
so all three states are real and all three must be checked. The stamp is applied by an inline
script in `Base.astro` before first paint; `src/scripts/theme.js` only drives the button, and
which glyph shows is CSS-driven off `:root[data-theme-pref]` so it can never flash the wrong
one. A reader's explicit choice always beats the OS.

### Core tokens

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `--bg` | `#F6F6F4` | `#121316` | page ground |
| `--panel` | `#FCFCFA` | `#191B1F` | cards, diagram panels |
| `--panel2` | `#F0F0EC` | `#1F2126` | pressed/hover surfaces |
| `--ink` | `#1B1C1E` | `#E8E8E3` | primary text |
| `--ink2` | `#54575C` | `#A6A9AE` | secondary text |
| `--ink3` | `#8B8E93` | `#71747A` | faint labels |
| `--line` | `#DFDFDA` | `#2B2E34` | hairlines, borders |
| `--node-fill` / `--node-line` | `#FFFFFF` / `#C9C9C2` | `#20232A` / `#3A3E46` | diagram nodes |
| `--accent` | `#2757D6` | `#6E95FF` | **active execution only** |
| `--danger` | `#C6402C` | `#E06550` | **untrusted / risk / failure only** |
| `--ok` | `#1F8A5D` | `#48B385` | **verified / allowed / pass only** |
| `--warn` | `#A8770E` | `#D2A035` | preview/status notes |
| `--chartA` / `--chartB` | `#A66A1E` / `#2757D6` | `#AD7D2B` / `#5580EC` | chart series (validated pair) |

### Rules

- Diagrams are **neutral at rest**. Accent/danger/ok appear only through step states
  (`.on`, `.bad`, `.ok`) or permanent semantics (untrusted node, trust boundary).
- Never use `--danger`/`--ok` as generic categorical series colors. Chart series use
  `--chartA`/`--chartB`; this pair passed the CVD/contrast validator on both surfaces —
  any new series color must be re-validated before shipping.
- Never rely on color alone: untrusted is also dashed + warning icon; pass/fail is also
  labeled text (`pass`/`fail`, ✓/✗); regression flags carry a `▼` marker and label.

---

## 4. Layout & spacing

- Content column: **1120px max**, 24px side padding (16px under 640px).
- Diagram panels: `--panel` background, 1px `--line` border, 12px radius, dot grid
  (`radial-gradient` 1px dots, 22px pitch). The dot grid appears **only** behind diagrams.
- Hairline rules (`1px --line`) separate plates and section heads. No heavy dividers, no
  drop-shadow stacking; the single `--shadow` token is for hover lift and the palette only.
- Plate anatomy, in order, always: title row (code badge + h3 + deep-link route on the right)
  → one-line definition → diagram shell (panel + control bar → optional inspector) →
  meta grid (Key insight | Failure mode) → Further reading → Related chips. Further reading
  is external and Related is internal, and internal navigation closes the plate.
- Wide content (diagrams, tables, the map) scrolls inside its own `overflow-x: auto`
  container. The page body never scrolls horizontally, at any viewport.

---

## 5. Diagram grammar

### Node kinds (fixed vocabulary)

`model` ✦ · `tool` ◎ · `user`/`human` (person) · `data` (cylinder) · `untrusted` (warning
triangle, red dashed border, red tint) · `evaluator` (check circle) · `memory` (layers) ·
`policy` (lock) · `env` (globe) · `decision` (diamond, no icon) · `chip` (small plain node).

Do not invent new kinds for one diagram. If a concept doesn't fit, it's probably a `chip`
with a good label.

### Edge semantics

| Mark | Meaning |
|---|---|
| solid line + arrowhead | data flow |
| dashed line | control flow |
| animated blue dashes | active execution (current step) |
| animated red dashes | active malicious/failing flow |
| green line | verified/pass path |
| dashed rounded rect | system boundary; red-tinted = trust boundary; green = enforced-safe zone |
| curved return edge | retry / iteration |
| stacked/fanned nodes | parallelism |
| 0.35–0.45 opacity | inactive branch (via step dimming) |

Every edge that isn't obvious gets a label (`fetch`, `retry with context`, `send(secrets)`).
Labels are 9.5px mono with a `--halo` stroke so they survive crossing lines.

### Geometry conventions

- Coordinates on a ~10px grid; default node 118×40 (50 with sublabel), chips 92×24.
- viewBox widths 520–740; diagrams read left→right or top→bottom, loops return on the
  left or bottom. Avoid crossing edges; when unavoidable, the label halo must keep both legible.
- Keep every label inside the viewBox — check the rendered screenshot, not the numbers.

### Steps

Every major diagram is a step sequence (`n`/`e` active, `ok`/`bad` verdicts, `show` for
ghosts, `cap` caption). 3–9 steps. Captions are one sentence, sentence case; use
`<span class="cap-bad">`/`cap-ok` for FAIL/PASS beats. Failure beats come **before** the
resolution beat — land the risk, then the fix.

---

## 6. Motion

- Step cadence ~1.5–1.9s per step; final step holds ~1s longer, then loops.
- Flow animation is a dash-offset march (0.65s linear, infinite) — never easing bounces,
  never springs, on technical flows. UI hover/transform transitions: 150–300ms ease.
- Autoplay starts when a diagram is ≥30% in view and pauses out of view. A user-initiated
  pause is respected until they press play/replay.
- `prefers-reduced-motion: reduce`: no autoplay, no dash march, no scroll-smooth; step
  controls still work and state changes apply instantly. State is never lost, only the tween.
- Animate only `transform`, `opacity`, `stroke-dashoffset`, and class-driven color — never
  layout properties.

---

## 7. Content rules

- Plate format is fixed: **Title · one-line definition · interactive diagram · Key insight ·
  Failure mode · Further reading · Related.** Definition ≤ 1 sentence; insight and failure
  ≤ 2 sentences each.
- **Every plate cites its sources.** 1–3 entries, by key, from the library in
  `src/data/references.js` — never an inline URL, so each source is defined once and stays
  auditable in one place. Cite what actually speaks to the plate; a plate with no good
  source gets none rather than filler. **Every entry in the library must have been opened
  and checked before it was added** — an arXiv ID against the listing for that exact title,
  a web source against the live page. Never add a citation from memory: a reference atlas
  with a wrong citation is worse than one with no citations.
- Write for a smart engineer with 2 minutes. Concrete beats vague; numbers beat adjectives.
- Annotations live around the diagram, not in paragraphs below it.
- Preview (stub) modules are honestly labeled ("Preview — full interactive plates in
  progress") and still fully designed: code, title, mini diagram, one insight line.
- Plate codes are per-collection series (`H-`, `S-`, `E-`, `X-`, `G-`), sequential, never
  reused after removal.

---

## 8. Accessibility (ship-blocking checklist)

- [ ] Every interactive element reachable by keyboard; visible `:focus-visible` ring.
- [ ] Every diagram SVG has `role="img"` (or `group` when nodes are interactive) and an
      `aria-label` that states the mechanism, not just the title.
- [ ] Clickable SVG nodes: `tabindex="0"`, `role="button"`/`link`, Enter/Space handlers.
- [ ] Step captions in an `aria-live="polite"` region.
- [ ] Nothing meaningful is color-only (see §3).
- [ ] All three theme states checked on every new surface: un-stamped (system), forced light
      on a dark OS, and forced dark on a light OS.
- [ ] Mobile (390px): zero horizontal page overflow; diagrams scale via viewBox.

---

## 9. Adding a new plate (procedure)

The canonical step-by-step, with commands, lives in [README.md](README.md#adding-a-plate).
This section is the design half of it — the rules a new plate is reviewed against.

1. **Define the diagram as data** in `src/data/diagrams.js`: a `DiagramDefinition` with
   `w`/`h`, `aria`, `nodes`, `edges`, optional `bounds`/`notes`, and 3–9 `steps`. Use only
   the node kinds and edge semantics from §5. No bespoke rendering unless the concept truly
   can't be expressed — a custom renderer goes in `src/scripts/custom.js` with its data in
   `src/data/custom-data.js`, and still uses the tokens and panel chrome.
2. **Add the plate entry** to its collection in `src/data/collections.js`: `slug`, `code`
   (per-collection series, sequential, never reused — see §7), `title`, `dg` (or `modes`
   for a variant toggle, or `custom`), `def`, `insight`, `failure`, `related` (real plate
   paths, e.g. `/harnesses/react` — never a bare collection path unless you mean the
   collection index), and `kw`. The route, sitemap entry, JSON-LD, prev/next links and
   search index all derive from this entry.
3. **Build and screenshot**: `npm run build`, then `npm run og -- <collection>/<slug>` to
   generate the share image into `public/og/` (commit it), then `npm run shots`. Check the
   plate in light, dark and 390px for label collisions, viewBox clipping, and both toggle
   modes.
4. **Verify**: `npm run verify` must pass — every route 200, per-plate OG image at
   1200×630, zero console errors, no horizontal overflow. Check the real deep link
   (`/collection/slug`, plus `?mode=` if it has modes) and that search finds it.
5. **Review against §1 principles**: can a cold reader get it from the diagram alone?

---

## 10. Do / Don't

**Do** keep diagrams neutral until a step lights them up · label edges · number plates ·
use chips for small concepts · test both themes and reduced motion · keep captions one
sentence · validate any new chart color pair.

**Don't** add eyebrows or uppercase-mono UI labels · use mono for prose or buttons · add
gradients, glows, glassmorphism, or stock illustration · use red/green for anything but
risk/verified · animate for atmosphere · hardcode colors · let a diagram require the prose
to make sense · ship a plate without its failure mode.
