#!/usr/bin/env python3
"""DSH 皮肤包结构校验：python3 tools/validate_skin.py [skins/<id> ...]"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKINS = os.path.join(ROOT, "skins")

REQUIRED_FILES = [
    "skin.json", "package.json", "cordis.patch.yml", "tsdown.config.ts",
    "src/index.ts", "src/client/index.ts", "tests/apply.spec.ts",
    "preview/light.png", "preview/dark.png",
]
REQUIRED_SKIN_KEYS = ["id", "name", "nameEn", "author", "tagline", "tags",
                      "accent", "bodyAttr", "package", "wiring", "preview", "order"]


def fail(sid, msg):
    print(f"FAIL {sid}: {msg}")
    return False


def check(d):
    sid = os.path.basename(d.rstrip("/"))
    for f in REQUIRED_FILES:
        if not os.path.isfile(os.path.join(d, f)):
            return fail(sid, f"missing {f}")
    css_files = [f for f in os.listdir(os.path.join(d, "src", "client")) if f.endswith(".module.css")]
    if css_files != [f"{sid}.module.css"]:
        return fail(sid, f"module.css mismatch: {css_files}")

    meta = json.load(open(os.path.join(d, "skin.json"), encoding="utf-8"))
    for k in REQUIRED_SKIN_KEYS:
        if k not in meta:
            return fail(sid, f"skin.json missing {k}")
    if meta["id"] != sid:
        return fail(sid, "skin.json id != dir")
    if meta["bodyAttr"] != f"data-dsh-{sid}":
        return fail(sid, "bodyAttr mismatch")

    pkg = json.load(open(os.path.join(d, "package.json"), encoding="utf-8"))
    if pkg["name"] != f"@whyihaveyou/dsh-skin-{sid}":
        return fail(sid, "package name mismatch")
    if meta["package"] != pkg["name"] or meta["wiring"]["id"] != f"ui-skin-{sid}":
        return fail(sid, "wiring mismatch")

    css = open(os.path.join(d, "src", "client", f"{sid}.module.css"), encoding="utf-8").read()
    stripped = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    stripped = re.sub(r"'[^']*'|\"[^\"]*\"", "", stripped)
    if stripped.count("{") != stripped.count("}"):
        return fail(sid, "unbalanced braces")
    attr = f"[data-dsh-{sid}]"
    if f"body{attr}" not in css:
        return fail(sid, "missing scoped body selector")
    if f"body{attr}[data-ds-dark-theme]" not in css:
        return fail(sid, "missing dark variant scope")
    if ":root" in stripped:
        return fail(sid, "unscoped :root leaked")
    if "--dsw-static-deepseek-500" not in css or "--dsw-alias-button-primary-fill" not in css:
        return fail(sid, "missing token remaps")
    # keyframes 引用闭环（先于作用域检查把 @keyframes 块剥离）
    defined = set(re.findall(r"@keyframes\s+([\w-]+)", css))
    used = set(re.findall(r"animation:\s*([\w-]+)", css)) | set(re.findall(r"animation-name:\s*([\w-]+)", css))
    missing = {u for u in used if u not in defined and u not in ("none",)}
    if missing:
        return fail(sid, f"keyframes used but not defined: {missing}")
    # 所有规则选择器必须带皮肤作用域（@keyframes 用括号配平剥离）
    no_kf = stripped
    while True:
        m = re.search(r"@keyframes\s+[\w-]+\s*\{", no_kf)
        if not m:
            break
        depth, i = 1, m.end()
        while depth and i < len(no_kf):
            if no_kf[i] == "{":
                depth += 1
            elif no_kf[i] == "}":
                depth -= 1
            i += 1
        no_kf = no_kf[:m.start()] + no_kf[i:]
    for m in re.finditer(r"(^|\})([^{}@]+)\{", no_kf):
        for sel in m.group(2).split(","):
            sel = sel.strip()
            if sel and not sel.startswith(f"body{attr}"):
                return fail(sid, f"unscoped selector: {sel[:60]}")

    ts = open(os.path.join(d, "src", "client", "index.ts"), encoding="utf-8").read()
    dataset = "dsh" + "".join(w.capitalize() for w in sid.split("-"))
    if f"body.dataset.{dataset}" not in ts:
        return fail(sid, "dataset mismatch in index.ts")
    print(f"OK {sid}")
    return True


def main():
    dirs = sys.argv[1:] or [os.path.join(SKINS, d) for d in sorted(os.listdir(SKINS))]
    ok = sum(1 for d in dirs if os.path.isdir(d) and check(d))
    print(f"---\n{ok}/{len(dirs)} passed")
    sys.exit(0 if ok == len(dirs) else 1)


if __name__ == "__main__":
    main()
