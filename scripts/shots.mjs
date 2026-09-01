/* Parity screenshots: home + every collection + a set of plates, each in light,
   dark and 390px mobile. Optionally screenshots the legacy single-page build for
   side-by-side comparison.

   usage: npm run build && npm run shots
          node scripts/shots.mjs --ref /path/to/atlas.html   # also shoot the reference page */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { serveDist } from './serve.mjs';
import { COL_ORDER } from '../src/data/collections.js';

const refArg = process.argv.indexOf('--ref');
const REF = refArg > -1 ? path.resolve(process.argv[refArg + 1]) : null;
const OUT = 'shots';
fs.mkdirSync(OUT, { recursive: true });

const PLATES = [
  'harnesses/actor-verifier',              // step player
  'harnesses/state-machine',               // click-to-inspect
  'security/indirect-prompt-injection',    // mode toggle (attack/defended)
  'evals/regression-evals',                // regression chart
  'context/context-budget',                // budget builder
  'coding-agents/single-vs-multi',         // one agent / multi-agent toggle
];
const pages = [{ name: 'home', route: '/', ref: '#/' }];
for (const c of COL_ORDER) pages.push({ name: c, route: `/${c}`, ref: `#/${c}` });
for (const p of PLATES) pages.push({ name: p.replace('/', '--'), route: `/${p}`, ref: `#/${p}` });

const VARIANTS = [
  { name: 'light', viewport: { width: 1280, height: 900 }, colorScheme: 'light' },
  { name: 'dark', viewport: { width: 1280, height: 900 }, colorScheme: 'dark' },
  { name: 'mobile', viewport: { width: 390, height: 844 }, colorScheme: 'light', isMobile: true, deviceScaleFactor: 2 },
];

const { server, url } = await serveDist('dist');
const browser = await chromium.launch();
const overflow = [];
const errors = [];

async function shoot(target, file, ctx, variant, name) {
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${target}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${target}: ${m.text()}`); });
  await page.goto(target, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1400);
  const sw = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  if (sw[0] > sw[1]) overflow.push(`${name} @ ${variant.name}: scrollWidth ${sw[0]} > innerWidth ${sw[1]}`);
  await page.screenshot({ path: file, fullPage: true });
  await page.close();
}

for (const v of VARIANTS) {
  const ctx = await browser.newContext({ viewport: v.viewport, colorScheme: v.colorScheme, isMobile: !!v.isMobile, deviceScaleFactor: v.deviceScaleFactor || 1 });
  for (const p of pages) {
    await shoot(url + p.route, path.join(OUT, `${p.name}--${v.name}.png`), ctx, v, p.name);
    if (REF) {
      fs.mkdirSync(path.join(OUT, 'ref'), { recursive: true });
      await shoot(`file://${REF}${p.ref}`, path.join(OUT, 'ref', `${p.name}--${v.name}.png`), ctx, v, `ref:${p.name}`);
    }
    process.stdout.write(`\r${v.name}: ${p.name}                    `);
  }
  await ctx.close();
}
console.log(`\nscreenshots in ${OUT}/ (${pages.length} pages × ${VARIANTS.length} variants${REF ? ', plus reference' : ''})`);
await browser.close();
server.close();
if (overflow.length) console.log('HORIZONTAL OVERFLOW:\n  ' + overflow.join('\n  '));
else console.log('no horizontal page overflow on any page/variant');
if (errors.length) console.log('CONSOLE ERRORS:\n  ' + errors.join('\n  '));
else console.log('zero console errors');
process.exit(overflow.filter(o => !o.startsWith('ref:')).length || errors.filter(e => !e.startsWith('file://')).length ? 1 : 0);
