/* Shared Playwright launch for the og / shots / verify scripts.

   Playwright normally resolves its own downloaded browser by revision, which means these
   scripts only run on a machine whose install matches the pinned @playwright/test version.
   CHROME_PATH points them at an existing Chromium instead — CI images, nix, sandboxes and
   anywhere `npx playwright install` isn't wanted. */
import { chromium } from 'playwright';

export function launchBrowser(opts = {}) {
  const executablePath = process.env.CHROME_PATH || undefined;
  return chromium.launch({ ...opts, ...(executablePath ? { executablePath } : {}) });
}

/* The layout loads three families from fonts.googleapis.com with a render-blocking
   <link>. Left alone, every page load in these scripts waits on a third-party origin —
   slow where it is reachable, and a multi-second stall per page where it is not. Screenshot
   scripts need the real faces, so only verify (which checks structure, not glyphs) calls
   this. */
export async function stubWebfonts(context) {
  await context.route('https://fonts.googleapis.com/**', r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await context.route('https://fonts.gstatic.com/**', r => r.abort());
}
