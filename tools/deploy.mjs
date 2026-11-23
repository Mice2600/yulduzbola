// Builds the site and pushes dist/ to the gh-pages branch (served by GitHub Pages).
// Usage: node tools/deploy.mjs [remote url]   (default: the "origin" remote of this repository)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const run = (cmd, args, cwd = root) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });
const remote = process.argv[2] || execFileSync('git', ['remote', 'get-url', 'origin'], { cwd: root }).toString().trim();

run('node', ['tools/build.mjs']);
const gitDir = path.join(dist, '.git');
if (fs.existsSync(gitDir)) fs.rmSync(gitDir, { recursive: true, force: true });
run('git', ['init', '-q', '-b', 'gh-pages'], dist);
run('git', ['add', '-A'], dist);
run('git', ['commit', '-q', '-m', 'Publish site'], dist);
run('git', ['push', '-f', remote, 'gh-pages'], dist);
fs.rmSync(gitDir, { recursive: true, force: true });
console.log('pushed to gh-pages of', remote);
