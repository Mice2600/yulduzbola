// Builds dist/: one page per language, the presentation pages, and everything from public/.
import fs from 'node:fs'; import path from 'node:path';
import { page } from '../src/page.mjs'; import { langs } from '../src/i18n.mjs';
const root = path.resolve(import.meta.dirname, '..'), dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, 'public'), dist, { recursive: true });
for (const f of ['style.css', 'app.js', 'deck.css']) if (fs.existsSync(path.join(root, 'src', f))) fs.copyFileSync(path.join(root, 'src', f), path.join(dist, f));
for (const l of langs) {
  const dir = l === 'uz' ? dist : path.join(dist, l);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(l));
}
if (fs.existsSync(path.join(root, 'src', 'deck.mjs'))) {
  const { deck } = await import('../src/deck.mjs');
  fs.mkdirSync(path.join(dist, 'deck'), { recursive: true });
  for (const l of langs) fs.writeFileSync(path.join(dist, 'deck', `${l}.html`), await deck(l));
}
fs.writeFileSync(path.join(dist, '.nojekyll'), '');
console.log('built', dist);
