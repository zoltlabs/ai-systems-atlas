/* Acceptance checks against a built site (dist/):
   - every URL in the sitemap returns 200
   - every page has title, description, canonical, og:image, JSON-LD
   - every OG image referenced by a page exists, is a PNG, and is 1200×630
   - every page loads in headless Chromium with zero console errors
   - no horizontal page overflow at 390px
   usage: npm run build && npm run og && npm run verify */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { serveDist } from './serve.mjs';

const SITE = 'https://aisystemsatlas.com';
const fail = [];
const ok = (cond, msg) => { if (!cond) fail.push(msg); };

if (!fs.existsSync('dist/index.html')) { console.error('dist/ not found — run `npm run build` first'); process.exit(1); }
const smIndex = fs.readFileSync('dist/sitemap-index.xml', 'utf8');
const smFiles = [...smIndex.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => path.basename(new URL(m[1]).pathname));
const urls = smFiles.flatMap(f => [...fs.readFileSync(path.join('dist', f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
ok(urls.length > 0, 'sitemap is empty');
ok(!urls.some(u => u.includes('/og/')), 'sitemap leaks /og/ render targets');
ok(!urls.some(u => u.endsWith('/404')), 'sitemap includes the 404 page');

const { server, url: base } = await serveDist('dist');
const toLocal = u => u.replace(SITE, base);

function pngSize(buf) {
  if (buf.length < 24 || buf.toString('ascii', 1, 4) !== 'PNG') return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const seenOg = new Set();
let checked = 0;

for (const u of urls) {
  const local = toLocal(u);
  const res = await fetch(local);
  ok(res.status === 200, `${u} → HTTP ${res.status}`);
  const html = await res.text();
  const pathName = new URL(u).pathname;
  ok(/<title>[^<]+<\/title>/.test(html), `${u}: missing <title>`);
  ok(/name="description" content="[^"]+"/.test(html), `${u}: missing meta description`);
  ok(html.includes(`<link rel="canonical" href="${u}">`) || html.includes(`<link rel="canonical" href="${u}"/>`), `${u}: canonical mismatch`);
  ok(html.includes('application/ld+json'), `${u}: missing JSON-LD`);
  ok(/property="twitter:card"|name="twitter:card"/.test(html), `${u}: missing twitter card`);
  const og = /property="og:image" content="([^"]+)"/.exec(html);
  ok(og, `${u}: missing og:image`);
  if (og) {
    const imgPath = new URL(og[1]).pathname;
    if (!seenOg.has(imgPath)) {
      seenOg.add(imgPath);
      const r = await fetch(base + imgPath);
      ok(r.status === 200, `${u}: og image ${imgPath} → HTTP ${r.status}`);
      if (r.status === 200) {
        const size = pngSize(Buffer.from(await r.arrayBuffer()));
        ok(size && size.w === 1200 && size.h === 630, `${u}: og image ${imgPath} is ${size ? size.w + 'x' + size.h : 'not a PNG'}`);
      }
    }
    if (pathName.split('/').length === 3) ok(imgPath === `/og${pathName}.png`, `${u}: plate OG image is not per-plate (${imgPath})`);
  }

  // runtime: console errors + mobile overflow
  for (const [c, label] of [[ctx, 'desktop'], [mobile, 'mobile']]) {
    const page = await c.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(local, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    ok(errs.length === 0, `${u} (${label}): console errors: ${errs.join(' | ')}`);
    if (label === 'mobile') {
      const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      ok(sw <= iw, `${u}: horizontal overflow at 390px (${sw} > ${iw})`);
    }
    const mounted = await page.evaluate(() => document.querySelectorAll('[data-dg] svg.dg, [data-plate-modes] svg.dg, [data-custom] svg, [data-custom] .b-window, [data-custom] .regchart, [data-custom] .tax').length);
    const expected = await page.evaluate(() => document.querySelectorAll('[data-dg], [data-plate-modes], [data-custom]').length);
    ok(mounted >= expected, `${u} (${label}): ${mounted}/${expected} diagrams mounted`);
    await page.close();
  }
  checked++;
  process.stdout.write(`\r${checked}/${urls.length} ${pathName}                    `);
}

// 404 page
const nf = await fetch(base + '/definitely/not/a/plate');
ok(nf.status === 404, `404 route returned ${nf.status}`);
ok((await nf.text()).includes('NO SUCH PLATE'), '404 page is not the designed one');

await browser.close();
server.close();
console.log(`\nchecked ${checked} sitemap URLs, ${seenOg.size} OG images`);
if (fail.length) { console.log('FAILURES:\n  ' + fail.join('\n  ')); process.exit(1); }
console.log('all checks passed');
