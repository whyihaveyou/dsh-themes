"""skin-center thumbnail + preview generator (Pillow).

Usage: python3 thumbs.py <jobs.json> <thumbsOut> [previewsOut]
jobs.json: [{ "id": "mario", "light": "/abs/.../light.png", "dark": "..." }]
Outputs:
  <thumbsOut>/<id>.light.webp   — 320x200 q72 (grid cards)
  <previewsOut>/<id>.light.webp — 640px wide q80 (detail card, if given)
"""
import json, sys, os
from PIL import Image

JOBS, OUT = sys.argv[1], sys.argv[2]
OUT_PREV = sys.argv[3] if len(sys.argv) > 3 else None
os.makedirs(OUT, exist_ok=True)
if OUT_PREV:
    os.makedirs(OUT_PREV, exist_ok=True)
jobs = json.load(open(JOBS, encoding="utf-8"))
SIZE = (320, 200)
PREV_W = 640

def write(im, dst, w, q):
    im2 = im
    if w:
        h = round(im.height * w / im.width)
        im2 = im.resize((w, h), Image.LANCZOS)
    else:
        im2 = im.resize(SIZE, Image.LANCZOS)
    im2.save(dst, "WEBP", quality=q, method=6)

done = 0
for j in jobs:
    for mode in ("light", "dark"):
        src = j.get(mode)
        if not src or not os.path.exists(src):
            continue
        try:
            im = Image.open(src).convert("RGB")
            write(im, os.path.join(OUT, f"{j['id']}.{mode}.webp"), None, 72)
            if OUT_PREV:
                write(im, os.path.join(OUT_PREV, f"{j['id']}.{mode}.webp"), PREV_W, 80)
            done += 1
        except Exception as e:
            print(f"FAIL {j['id']}.{mode}: {e}", file=sys.stderr)
print(f"thumbs written: {done}")