#!/usr/bin/env python3
"""make_thumbs.py - generate gallery thumbnails + previews from skin previews.
   Thumbs:   site/assets/thumbs/<id>-l.jpg   (320px  JPEG q82, grid)
   Previews: site/assets/previews/<id>-l.jpg (800px  JPEG q85, detail modal)
   Original previews in skins/ untouched. Requires Pillow.
   Env: THUMB_W, THUMB_Q, PREVIEW_W, PREVIEW_Q."""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKINS = os.path.join(ROOT, 'skins')
OUT = os.path.join(ROOT, 'site', 'assets', 'thumbs')
os.makedirs(OUT, exist_ok=True)

W = int(os.environ.get('THUMB_W', '320'))
Q = int(os.environ.get('THUMB_Q', '82'))
PW = int(os.environ.get('PREVIEW_W', '800'))
PQ = int(os.environ.get('PREVIEW_Q', '85'))
OUT_PREV = os.path.join(ROOT, 'site', 'assets', 'previews')
os.makedirs(OUT_PREV, exist_ok=True)
ids = sorted(d for d in os.listdir(SKINS) if os.path.isdir(os.path.join(SKINS, d)))
made = 0
total_in = total_out = 0

for sid in ids:
    for mode, suf in (('light', 'l'), ('dark', 'd')):
        src = os.path.join(SKINS, sid, 'preview', mode + '.png')
        if not os.path.exists(src):
            print('! missing ' + src)
            continue
        im = Image.open(src).convert('RGB')
        total_in += os.path.getsize(src)
        # thumbnail (grid)
        w = W
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(os.path.join(OUT, sid + '-' + suf + '.jpg'), 'JPEG', quality=Q, optimize=True)
        # preview (detail modal)
        pw = PW
        ph = round(im.height * pw / im.width)
        im.resize((pw, ph), Image.LANCZOS).save(os.path.join(OUT_PREV, sid + '-' + suf + '.jpg'), 'JPEG', quality=PQ, optimize=True)
        total_out += os.path.getsize(os.path.join(OUT, sid + '-' + suf + '.jpg')) + os.path.getsize(os.path.join(OUT_PREV, sid + '-' + suf + '.jpg'))
        made += 1

print('[thumbs] %d generated (%d skins x2): in %.1f MB -> out %.1f MB (thumbs+previews)' % (made, len(ids), total_in / 1048576, total_out / 1048576))
