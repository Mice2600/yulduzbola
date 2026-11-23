// Tiny static server: serves <root> (default dist) at http://localhost:4173/yulduzbola/
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(process.argv[2] || 'dist'), port = +(process.argv[3] || 4173), base = '/yulduzbola';
const types = { html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', svg: 'image/svg+xml', pdf: 'application/pdf', woff2: 'font/woff2', ttf: 'font/ttf', otf: 'font/otf', wasm: 'application/wasm', mp4: 'video/mp4', bin: 'application/octet-stream', frag: 'text/plain' };
http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (!u.startsWith(base)) { res.writeHead(302, { Location: base + '/' }); return res.end(); }
  let f = path.join(root, u.slice(base.length));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f).slice(1)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
}).listen(port, () => console.log(`serving ${root} at http://localhost:${port}${base}/`));
