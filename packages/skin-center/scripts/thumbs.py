#!/usr/bin/env python3
"""skin-center thumbnail generator (Pillow).

Usage: python3 thumbs.py <jobs.json> <outDir>
jobs.json: [{ "id": "mario", "light": "/abs/.../light.png", "dark": "..." }]
Outputs <outDir>/<id>.light.webp and <outDir>/<id>.dark.webp at 320x200, q72.
"""
import json, sys, os
from PIL import Image

JOBS, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
jobs = json.load(open(JOBS, encoding="utf-8"))
SIZE = (320, 200)

def thumb(src, dst):
    im = Image.open(src).convert("RGB").resize(SIZE, Image.LANCZOS)
    im.save(dst, "WEBP", quality=72, method=6)

done = 0
for j in jobs:
    for mode in ("light", "dark"):
        src = j.get(mode)
        if not src or not os.path.exists(src):
            continue
        dst = os.path.join(OUT, f"{j['id']}.{mode}.webp")
        try:
            thumb(src, dst)
            done += 1
        except Exception as e:
            print(f"FAIL {j['id']}.{mode}: {e}", file=sys.stderr)
print(f"thumbs written: {done}")
