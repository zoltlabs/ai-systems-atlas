/* Tiny static server for dist/ with Vercel-style clean URLs (used by og/shots/verify). */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

export function serveDist(dir = 'dist', port = 0) {
  const root = path.resolve(dir);
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
      const base = path.join(root, p);
      if (!base.startsWith(root)) { res.writeHead(403); res.end(); return; }
      const tries = [base, base + '.html', path.join(base, 'index.html')];
      let hit = tries.find(f => fs.existsSync(f) && fs.statSync(f).isFile());
      let status = 200;
      if (!hit) { hit = path.join(root, '404.html'); status = 404; if (!fs.existsSync(hit)) { res.writeHead(404); res.end('not found'); return; } }
      res.writeHead(status, { 'content-type': MIME[path.extname(hit)] || 'application/octet-stream' });
      fs.createReadStream(hit).pipe(res);
    });
    server.listen(port, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }));
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { url } = await serveDist(process.argv[2] || 'dist', Number(process.argv[3] || 4321));
  console.log('serving', url);
}
