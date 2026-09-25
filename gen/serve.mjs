// Local preview that behaves like the Astro catch all: routes from src/site, static files from public, 404 with status.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { SITE, PUBLIC } from './lib/html.mjs';

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.mjs': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.hdr': 'application/octet-stream', '.xml': 'application/xml', '.txt': 'text/plain' };
const port = parseInt(process.argv[2] || '8787', 10);
const aliases = { '/terms/': '/terms-of-service/', '/privacy/': '/privacy-policy/' };
http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (path.extname(url)) {
    const file = path.join(PUBLIC, url);
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404); res.end('not found'); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'no-cache' });
      fs.createReadStream(file).pipe(res);
    });
    return;
  }
  if (!url.endsWith('/')) url += '/';
  if (aliases[url]) url = aliases[url];
  let file = path.join(SITE, 'src', 'site', url, 'index.html');
  let status = 200;
  if (url === '/404/' || !fs.existsSync(file)) { file = path.join(SITE, 'src', 'site', '404', 'index.html'); status = 404; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(500); res.end('no page'); return; }
    res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log('preview on http://127.0.0.1:' + port));
