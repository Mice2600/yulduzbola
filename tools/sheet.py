"""Contact sheets of the slides for checking by eye: python -I tools/sheet.py <lang> -> scratch/sheet-<lang>-N.jpg"""
import sys, os, glob
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lang = sys.argv[1]
fs = sorted(glob.glob(os.path.join(ROOT, 'exports', lang, 'slide-*.jpg')))
for g in range(0, len(fs), 4):
    part = fs[g:g + 4]
    c = Image.new('RGB', (1928, 1088 if len(part) > 2 else 544), 'red')
    for i, f in enumerate(part):
        c.paste(Image.open(f).resize((960, 540), Image.LANCZOS), ((i % 2) * 968, (i // 2) * 548))
    c.save(os.path.join(ROOT, 'scratch', f'sheet-{lang}-{g // 4}.jpg'), quality=82)
