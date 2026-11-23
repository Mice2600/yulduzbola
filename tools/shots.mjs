// One picture per section, plus an overflow check.
// Usage: node tools/shots.mjs <outDir> <lang> <width> <height> [baseUrl]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [out = 'scratch/shots', lang = 'uz', w = '1440', h = '900', base = 'http://localhost:4173/yulduzbola/'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const mobile = +w < 760;
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
const p = await ctx.newPage();
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await p.goto(base + (lang === 'uz' ? '' : lang + '/'), { waitUntil: 'networkidle' });
await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });

// Text that is clipped inside its own box, and a page wider than the screen.
const report = await p.evaluate(() => {
  const W = document.documentElement.clientWidth;
  const clipped = [];
  for (const e of document.querySelectorAll('h1,h2,h3,p,b,small,button,a,span,li,strong')) {
    if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible' && e.clientWidth > 0) clipped.push(e.tagName + ':' + e.textContent.trim().slice(0, 30));
    const r = e.getBoundingClientRect();
    if (r.width > 0 && r.right > W + 3 && !e.closest('.hero-stars')) clipped.push('OUT ' + e.tagName + ':' + e.textContent.trim().slice(0, 30));
  }
  return { scrollW: document.documentElement.scrollWidth, W, clipped: clipped.slice(0, 12) };
});
console.log(lang, w, JSON.stringify(report), errors.length ? 'ERRORS: ' + errors.join(' | ') : 'no js errors');

const sections = await p.$$('main > section');
for (const [i, el] of sections.entries()) {
  const id = await el.evaluate((s) => s.id || s.className.split(' ')[0]);
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  await el.screenshot({ path: path.join(out, `${lang}-${w}-${String(i).padStart(2, '0')}-${id}.png`) });
}
await browser.close();
