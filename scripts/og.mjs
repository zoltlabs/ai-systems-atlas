/* Generate OpenGraph images (1200×630) by screenshotting the /og/* render
   targets of a built site with Playwright. Output goes to public/og/ (committed)
   and is mirrored into dist/og/ so the current build is immediately complete.

   usage: npm run build && npm run og            # all images
          node scripts/og.mjs harnesses/react    # one plate (or "home", "harnesses") */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { serveDist } from './serve.mjs';
import { COLLECTIONS, COL_ORDER } from '../src/data/collections.js';

if (!fs.existsSync('dist/index.html')) { console.error('dist/ not found — run `npm run build` first'); process.exit(1); }

const only = process.argv.slice(2);
const targets = [{ key: 'home', route: '/og/home', out: 'home.png' }];
for (const c of COL_ORDER) {
  targets.push({ key: c, route: `/og/${c}`, out: `${c}.png` });
  for (const p of COLLECTIONS[c].plates) targets.push({ key: `${c}/${p.slug}`, route: `/og/${c}/${p.slug}`, out: `${c}/${p.slug}.png` });
}
const todo = only.length ? targets.filter(t => only.includes(t.key)) : targets;

const { server, url } = await serveDist('dist');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: 'light' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(`${page.url()}: ${e.message}`));
page.on('console', m => { if (m.type() === 'error') errors.push(`${page.url()}: ${m.text()}`); });

let n = 0;
for (const t of todo) {
  await page.goto(url + t.route, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.ogReady === '1');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000); // custom renderers finish their entrance transitions
  const file = path.join('public/og', t.out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  const mirror = path.join('dist/og', t.out);
  fs.mkdirSync(path.dirname(mirror), { recursive: true });
  fs.copyFileSync(file, mirror);
  n++;
  process.stdout.write(`\r${n}/${todo.length} ${t.key}          `);
}
console.log(`\nwrote ${n} OG images to public/og/ (mirrored to dist/og/)`);
await browser.close();
server.close();
if (errors.length) { console.error('console errors while rendering:\n' + errors.join('\n')); process.exit(1); }
