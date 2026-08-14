#!/usr/bin/env python3
"""make_thumbs.py - generate gallery thumbnails (320px wide JPEG q82, light+dark).
   Output: site/assets/thumbs/<id>-l.jpg / <id>-d.jpg. Original previews untouched.
   Requires Pillow. Env: THUMB_W, THUMB_Q."""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKINS = os.path.join(ROOT, 'skins')
OUT = os.path.join(ROOT, 'site', 'assets', 'thumbs')
os.makedirs(OUT, exist_ok=True)

W = int(os.environ.get('THUMB_W', '320'))
Q = int(os.environ.get('THUMB_Q', '82'))
ids = sorted(d for d in os.listdir(SKINS) if os.path.isdir(os.path.join(SKINS, d)))
made = 0
total_in = total_out = 0

for sid in ids:
    for mode, suf in (('light', 'l'), ('dark', 'd')):
        src = os.path.join(SKINS, sid, 'preview', mode + '.png')
        dst = os.path.join(OUT, sid + '-' + suf + '.jpg')
        if not os.path.exists(src):
            print('! missing ' + src)
            continue
        im = Image.open(src).convert('RGB')
        total_in += os.path.getsize(src)
        w = W
        h = round(im.height * w / im.width)
        im = im.resize((w, h), Image.LANCZOS)
        im.save(dst, 'JPEG', quality=Q, optimize=True)
        total_out += os.path.getsize(dst)
        made += 1

print('[thumbs] %d generated (%d skins x2): in %.1f MB -> out %.1f MB' % (made, len(ids), total_in / 1048576, total_out / 1048576))
