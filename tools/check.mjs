// Exercises everything a visitor can click or drag, and saves pictures.
// Usage: node tools/check.mjs <outDir> [baseUrl] [lang] [width]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [out = 'scratch/check', base = 'http://localhost:4173/yulduzbola/', lang = 'uz', width = '1440'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const mobile = +width < 760;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: +width, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile });
const p = await ctx.newPage();
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
const failed = [];
p.on('response', (r) => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
await p.goto(base + (lang === 'uz' ? '' : lang + '/'), { waitUntil: 'networkidle' });
const stars = async () => +(await p.textContent('#walletN'));
const results = [];
const ok = (name, pass, info = '') => { results.push(`${pass ? 'PASS' : 'FAIL'}  ${name} ${info}`); };
const snap = (n) => p.screenshot({ path: path.join(out, `${lang}-${width}-${n}.png`) });

// 1 hero star
await p.waitForSelector('.fstar', { timeout: 8000 });
await p.waitForTimeout(1800);
await p.evaluate(() => document.querySelector('.fstar:not(.got)').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
ok('hero star gives +1', (await stars()) === 1, `stars=${await stars()}`);

// 2 sweep
await p.locator('#sweepCard').scrollIntoViewIfNeeded();
await p.waitForTimeout(700);
const b = await p.locator('#sweepCard').boundingBox();
await p.mouse.move(b.x + 10, b.y + 20); await p.mouse.down();
for (let y = 0.08; y <= 0.95; y += 0.11) { await p.mouse.move(b.x + b.width * 0.03, b.y + b.height * y, { steps: 4 }); await p.mouse.move(b.x + b.width * 0.97, b.y + b.height * y, { steps: 14 }); if (y > 0.4 && y < 0.52) await snap('sweep-half'); }
await p.mouse.up();
await p.waitForTimeout(1200);
ok('sweep finishes and gives +3', (await p.isVisible('#sweepDone')) && (await stars()) === 4, `stars=${await stars()}`);
await snap('sweep-done');

// 3 calculator: dishes (4) + amazing (+3) + bonus 5 = 12
await p.locator('#calc').scrollIntoViewIfNeeded();
await p.click('#calcTasks button[data-i="1"]'); await p.click('#calcQ button[data-q="amazing"]'); await p.click('#calcB button[data-b="5"]');
ok('calculator 4+3+5', (await p.textContent('#cTotal')).includes('12'), await p.textContent('#cTotal'));
await snap('calc');
await p.click('#calcQ button[data-q="needs"]'); await p.click('#calcB button[data-b="5"]');
ok('calculator needs-more 4-1', (await p.textContent('#cTotal')).includes('3'), await p.textContent('#cTotal'));
await p.click('#calcQ button[data-q="redo"]');
ok('calculator redo shows note', await p.isVisible('#cRedo'));

// 4 age slider
await p.locator('#age').scrollIntoViewIfNeeded();
await p.locator('#age').fill('3');
ok('age 3 -> 2 tasks', (await p.textContent('#ageAvail')).includes('2'), await p.textContent('#ageAvail'));
await p.locator('#age').fill('13'); await p.waitForTimeout(600);
ok('age 13 -> 7 tasks, teen look', (await p.textContent('#ageAvail')).includes('7') && (await p.getAttribute('#agePhones', 'data-g')) === '3');
await snap('age');

// 5 badges
await p.locator('#badges').scrollIntoViewIfNeeded();
const badges = await p.$$('#badges .badge');
for (const x of badges) await x.click();
await p.waitForTimeout(900);
ok('16 badges give 16 + 5', (await stars()) === 25, `stars=${await stars()}`);
await snap('badges');

// 6 rewards
await p.locator('#shop').scrollIntoViewIfNeeded();
await p.click('.reward[data-cost="20"] button');
await p.waitForTimeout(500);
ok('buy for 20', (await stars()) === 5, `stars=${await stars()}`);
await snap('shop');

// 7 live demo
await p.locator('#demoPhone').scrollIntoViewIfNeeded();
await p.click('#demoPlay');
const frame = p.frameLocator('#demoPhone iframe');
await frame.locator('flutter-view, flt-glass-pane').first().waitFor({ timeout: 60000 });
await p.waitForFunction(() => { const f = document.querySelector('#demoPhone iframe'); return f && f.contentDocument && !f.contentDocument.getElementById('boot'); }, null, { timeout: 60000 });
await p.waitForTimeout(2500);
ok('live demo starts', true);
await snap('demo');

// 8 downloads exist
for (const l of ['uz', 'ru', 'en']) for (const s of ['', '-light']) {
  const r = await p.request.get(`${base}downloads/yulduzbola-${l}${s}.pdf`);
  ok(`pdf ${l}${s}`, r.ok() && (await r.body()).subarray(0, 4).toString() === '%PDF', `${((await r.body()).length / 1048576).toFixed(2)} MB`);
}
console.log(results.join('\n'));
console.log(errors.length ? 'JS ERRORS: ' + errors.join(' | ') : 'no js errors', failed.length ? '\nFAILED REQUESTS: ' + failed.join(' | ') : '');
await browser.close();
