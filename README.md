# AI Systems Atlas

**Understand AI systems visually.** — [aisystemsatlas.com](https://aisystemsatlas.com)

An interactive visual atlas of AI agent architecture: harness patterns, safety and
security, evals, context engineering and memory, and coding-agent architectures.
56 plates, each a step-animated SVG diagram with a real URL, per-page SEO, an OG card,
⌘K search, and attack/defense or variant toggles where the concept calls for one.

Built with Astro 5 (static output) and a framework-free diagram engine (vanilla JS + SVG).
Deployed on Vercel.

> **Read [DESIGN.md](DESIGN.md) before changing anything visual.** It is the enforcement
> reference for typography, color tokens, the diagram grammar, motion and accessibility.

## Layout

| Path | What lives there |
|---|---|
| `src/styles/atlas.css` | The design system as CSS: theme tokens, layout, diagram styles. Ported verbatim from the original; site-only additions are at the bottom. |
| `src/engine/engine.js` | The diagram engine: SVG renderer, node/edge builders, step player, mode toggles, node inspector. Framework-free by design. |
| `src/data/diagrams.js` | Every `DiagramDefinition` (nodes, edges, bounds, notes, steps), keyed by id. |
| `src/data/collections.js` | Collections and plates: slug, code, definition, insight, failure mode, related chips, search keywords. Also builds `SEARCH_INDEX` and `PLATE_LOOKUP`. |
| `src/data/custom-data.js` | Data for the custom renderers (harness map, failure taxonomy, window anatomy, budget builder). |
| `src/data/card-minis.js` | Mini diagrams for the home-page collection cards. |
| `src/scripts/atlas.js` | The one client bundle: mounts diagrams from inline JSON, custom renderers, ⌘K palette, legacy `#/` redirect. |
| `src/scripts/custom.js` | Custom renderers: comparison map, regression chart, taxonomy, outcome/process mismatch, anatomy, budget builder. |
| `src/components/Diagram.astro` | A diagram mount point. Inlines the definition as JSON next to the mount and renders a same-size placeholder (no layout shift). |
| `src/components/Plate.astro` | Plate anatomy: title row → definition → diagram shell → Key insight / Failure mode → Related. |
| `src/pages/` | `/`, `/[collection]`, `/[collection]/[slug]`, `/404`, and the `/og/*` render targets used to generate share images. |
| `scripts/og.mjs` | Screenshots every `/og/*` target at 1200×630 into `public/og/`. |
| `scripts/shots.mjs` | Parity screenshots (home, collections, plates × light/dark/390px). |
| `scripts/verify.mjs` | Acceptance checks: sitemap 200s, meta/JSON-LD, OG images, console errors, mobile overflow. |

## Routes

- `/` · `/harnesses` · `/security` · `/evals` · `/context` · `/coding-agents`
- `/[collection]/[slug]` for every plate, e.g. `/harnesses/actor-verifier`,
  `/security/indirect-prompt-injection?mode=secure`
- Legacy hash URLs (`#/harnesses/react`) redirect client-side to the real path.

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build      # static site → dist/
npm run og         # regenerate OG images from the build (Playwright)
npm run verify     # acceptance checks against dist/
npm run shots      # parity screenshots → shots/
```

`npm run shots -- --ref /path/to/atlas.html` also screenshots the legacy single-page
build for side-by-side comparison.

## Adding a plate

1. **Define the diagram as data** in `src/data/diagrams.js`: a `DiagramDefinition` with
   `w`/`h`, `aria`, `nodes`, `edges`, optional `bounds`/`notes`, and 3–9 `steps`. Use only
   the node kinds and edge semantics from DESIGN.md §5. If the concept truly can't be
   expressed with the grammar, add a custom renderer to `src/scripts/custom.js` (it must
   still use the tokens and panel chrome) and any data it needs to `src/data/custom-data.js`.
2. **Add the plate entry** to its collection in `src/data/collections.js`: `slug`, `code`
   (per-collection series `H-`/`S-`/`E-`/`X-`/`G-`, sequential, never reused), `title`,
   `dg` (or `modes` for a variant toggle, or `custom`), `def`, `insight`, `failure`,
   `related` (real paths, e.g. `/harnesses/react`), and `kw` for search. The route,
   sitemap entry, JSON-LD, prev/next links and search index are all derived from this.
3. **Build and screenshot**: `npm run build && npm run og -- <collection>/<slug>` generates
   the plate's share image into `public/og/` (commit it). Then `npm run shots` and check the
   plate in light, dark and 390px for label collisions, viewBox clipping, and both toggle
   modes.
4. **Verify**: `npm run verify` must pass (every route 200, OG image present at 1200×630,
   zero console errors, no horizontal overflow).
5. **Review against DESIGN.md §1** — can a cold reader get it from the diagram alone? — and
   open a PR with the data change, the OG image and the screenshots.

## Deploy

Vercel builds with `npm run build` and serves `dist/`. `vercel.json` sets clean URLs, no
trailing slashes, immutable caching for hashed `/_astro/*` assets, and basic security
headers. OG images are generated locally and committed (Playwright is not run on Vercel).
