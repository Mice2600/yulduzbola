// Captures the real app screens from the web build of the app (public/demo) at phone size, 3x.
// Usage: node tools/appshots.mjs <outDir> [lang]   (server must run: node tools/serve.mjs public)
import { chromium } from 'playwright-core'; import fs from 'node:fs'; import path from 'node:path';
const out = path.resolve(process.argv[2] || 'scratch/app'), lang = process.argv[3] || 'uz';
fs.mkdirSync(out, { recursive: true });
const B = 'http://localhost:4173/yulduzbola/demo/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function shot(name, query, route, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(`${B}?reset=1&lang=${lang}&${query}#${route}`, { waitUntil: 'load' });
  await p.waitForFunction(() => !document.getElementById('boot'), null, { timeout: 60000 });
  await p.waitForTimeout(opts.wait ?? 3500);
  if (opts.before) await opts.before(p);
  await p.screenshot({ path: path.join(out, `${name}-${lang}.png`) });
  console.log('saved', name);
  await ctx.close();
}
const only = process.argv[4];
const jobs = {
  profiles: () => shot('profiles', '', '/'),
  home: () => shot('home', 'as=aziz', '/home'),
  homelittle: () => shot('homelittle', 'as=malika', '/home'),
  hometeen: () => shot('hometeen', 'as=jasur', '/home'),
  tasks: () => shot('tasks', 'as=aziz', '/tasks'),
  taskslittle: () => shot('taskslittle', 'as=malika', '/tasks'),
  task: () => shot('task', 'as=aziz', '/task/bed', { before: async (p) => { await p.touchscreen.tap(195, 419); await p.waitForTimeout(7300); } }),
  leaderboard: () => shot('leaderboard', 'as=jasur', '/leaderboard'),
  achievements: () => shot('achievements', 'as=jasur', '/achievements'),
  rewards: () => shot('rewards', 'as=jasur', '/rewards'),
  parent: () => shot('parent', 'parent=1', '/parent'),
  approval: () => shot('approval', 'parent=1&tab=approval', '/parent'),
  pin: () => shot('pin', '', '/parent'),
  approved: () => shot('approved', 'as=aziz', '/home', { before: async (p) => { await p.touchscreen.tap(195, 372); await p.waitForTimeout(1500); } }),
};
for (const [k, f] of Object.entries(jobs)) if (!only || only.split(',').includes(k)) await f();
await browser.close();
