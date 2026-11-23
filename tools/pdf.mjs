// Prints the presentation (dist/deck/<lang>.html) to PDF and fills exports/ with everything upload forms ask for.
// The local server must run (npm run serve). Usage: node tools/pdf.mjs [lang ...]
//   public/downloads/yulduzbola-<lang>.pdf        full PDF (also copied to exports/)
//   public/downloads/yulduzbola-<lang>-light.pdf  light PDF, under 5 MB, links still clickable
//   exports/<lang>/slide-01.jpg ...               one JPG per slide
//   exports/yulduzbola-<lang>-all-slides.jpg      one long JPG (made by tools/stitch.py)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { site } from '../src/site.mjs';

const root = path.resolve(import.meta.dirname, '..');
const want = process.argv.slice(2).length ? process.argv.slice(2) : ['uz', 'ru', 'en'];
const base = 'http://localhost:4173' + site.base;
const dl = path.join(root, 'public', 'downloads'), ex = path.join(root, 'exports');
fs.mkdirSync(dl, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });

for (const lang of want) {
  const dir = path.join(ex, lang);
  fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(`${base}deck/${lang}.html`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);

  // text that does not fit its slide
  const over = await p.evaluate(() => [...document.querySelectorAll('.slide')].map((s, i) => {
    const r = s.getBoundingClientRect(); const bad = [];
    const c = s.querySelector('.corner').getBoundingClientRect();
    for (const e of s.querySelectorAll('h1,h2,h3,p,li,b,small,strong,.corner,.qr')) { const b = e.getBoundingClientRect(); if (b.width && (b.right > r.right + 1 || b.bottom > r.bottom + 1 || b.left < r.left - 1 || b.top < r.top - 1)) bad.push(e.textContent.trim().slice(0, 28));
      else if (!e.closest('.corner') && b.width && b.right > c.left && b.left < c.right && b.bottom > c.top && b.top < c.bottom) bad.push('TOUCHES ADDRESS: ' + e.textContent.trim().slice(0, 24)); }
    return bad.length ? `slide ${i + 1}: ${bad.join(' | ')}` : null;
  }).filter(Boolean));
  console.log(lang, over.length ? 'OVERFLOW ' + over.join(' ;; ') : 'all text inside slides');

  const slides = await p.$$('.slide');
  const light = [];
  for (const [i, s] of slides.entries()) {
    const n = String(i + 1).padStart(2, '0');
    await s.screenshot({ path: path.join(dir, `slide-${n}.jpg`), type: 'jpeg', quality: 92 });
    light.push((await s.screenshot({ type: 'jpeg', quality: 60 })).toString('base64'));
  }
  const full = path.join(dl, `yulduzbola-${lang}.pdf`);
  await p.pdf({ path: full, width: '1920px', height: '1080px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  fs.copyFileSync(full, path.join(ex, `yulduzbola-${lang}.pdf`));

  // light PDF: flat pictures of the slides with a clickable link over each page
  const url = site.url + (lang === 'uz' ? '' : lang + '/');
  const lp = await ctx.newPage();
  await lp.setContent(`<style>@page{size:1920px 1080px;margin:0}*{margin:0}div{width:1920px;height:1080px;position:relative;page-break-after:always}img{width:100%;height:100%;display:block}a{position:absolute;inset:0}</style>` +
    light.map((b) => `<div><img src="data:image/jpeg;base64,${b}"><a href="${url}"></a></div>`).join(''));
  const lightPath = path.join(dl, `yulduzbola-${lang}-light.pdf`);
  await lp.pdf({ path: lightPath, width: '1920px', height: '1080px', printBackground: true });
  fs.copyFileSync(lightPath, path.join(ex, `yulduzbola-${lang}-light.pdf`));
  const mb = (f) => (fs.statSync(f).size / 1048576).toFixed(2) + ' MB';
  console.log(lang, slides.length, 'slides · full', mb(full), '· light', mb(lightPath));
  await ctx.close();
}
await browser.close();
execFileSync('python', ['-I', path.join(root, 'tools', 'stitch.py'), ...want], { stdio: 'inherit' });
