"""Prepares pictures for the site: photos (scratch/gen), app screens (scratch/app), task art (the app's assets).
Run: python -I tools/images.py [path to the app project]"""
import sys, glob, os
from PIL import Image, ImageEnhance
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = sys.argv[1] if len(sys.argv) > 1 else r'E:\Programs\yulduzbola'
out = os.path.join(ROOT, 'public', 'img')
for d in ('', 'app', 'tasks'): os.makedirs(os.path.join(out, d), exist_ok=True)

def save(im, name, w, q=84):
    im = im.convert('RGB')
    if im.width > w: im = im.resize((w, round(w * im.height / im.width)), Image.LANCZOS)
    im.save(os.path.join(out, name), quality=q, optimize=True, progressive=True)
    print(name, im.size, os.path.getsize(os.path.join(out, name)) // 1024, 'KB')

g = lambda n: Image.open(os.path.join(ROOT, 'scratch', 'gen', n + '.png'))
hero = g('hero'); save(hero, 'hero.jpg', 2200)
w, h = hero.size  # phone crop: the boy and the stars, portrait
save(hero.crop((int(w * .22), 0, int(w * .88), h)), 'hero-m.jpg', 1100)
f = g('father'); save(f.crop((0, 0, f.width, int(f.height * .86))), 'father.jpg', 1600)
save(g('girl'), 'girl.jpg', 1200); save(g('teen'), 'teen.jpg', 1600); save(g('night'), 'night.jpg', 2200)

for p in glob.glob(os.path.join(ROOT, 'scratch', 'app', '*-??.png')):
    im = Image.open(p).convert('RGB').resize((780, 1688), Image.LANCZOS)
    n = os.path.basename(p)[:-4] + '.webp'; im.save(os.path.join(out, 'app', n), quality=88, method=6)
print('app screens done')
for p in glob.glob(os.path.join(APP, 'assets', 'images', 'task-*.*')):
    n = os.path.basename(p).split('.')[0].replace('task-', '')
    Image.open(p).convert('RGB').resize((640, 640), Image.LANCZOS).save(os.path.join(out, 'tasks', n + '.webp'), quality=86, method=6)
print('task art done')
