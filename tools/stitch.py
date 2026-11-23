"""Makes one long JPG with every slide, and the small cover picture the site shows next to the downloads."""
import sys, os, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for lang in sys.argv[1:] or ['uz', 'ru', 'en']:
    files = sorted(glob.glob(os.path.join(ROOT, 'exports', lang, 'slide-*.jpg')))
    if not files:
        continue
    W = 1600
    ims = [Image.open(f).convert('RGB') for f in files]
    ims = [i.resize((W, round(W * i.height / i.width)), Image.LANCZOS) for i in ims]
    gap = 16
    long = Image.new('RGB', (W, sum(i.height for i in ims) + gap * (len(ims) - 1)), '#0d0723')
    y = 0
    for i in ims:
        long.paste(i, (0, y)); y += i.height + gap
    out = os.path.join(ROOT, 'exports', f'yulduzbola-{lang}-all-slides.jpg')
    long.save(out, quality=84, optimize=True)
    ims[0].resize((1200, 675), Image.LANCZOS).save(os.path.join(ROOT, 'public', 'img', f'deck-{lang}.jpg'), quality=84, optimize=True)
    print(lang, 'long JPG', long.size, os.path.getsize(out) // 1024, 'KB')
