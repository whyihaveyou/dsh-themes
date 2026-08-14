#!/usr/bin/env python3
"""把 aionui-themes 的昼夜主题对转换为 DSH (DeepSeek Harness) 皮肤包。

用法: python3 tools/convert.py [pair-id ...]   （无参数 = 全部 151 对）

输入:  ../aionui-themes/themes/<id>/  (theme.json + theme.css [+ preview-clean.png])
输出:  skins/<id>/  完整 DSH 皮肤包（skin.json / package.json / cordis.patch.yml /
       tsdown.config.ts / src / tests / preview）

核心映射:
  - AionUi 一主题一模式 → DSH 一个皮肤同时带 light + dark 两套令牌
    （light 挂在 body[data-dsh-<id>]，dark 挂在 body[data-dsh-<id>][data-ds-dark-theme]），
    DSH 的日夜切换按钮因而天然可用。
  - --aou-* 品牌 10 级色阶  → --dsw-static-deepseek-* / --dsw-static-blue-*
  - --bg-* 背景层级        → --dsw-static-neutral-bluish-*
  - --success/--warning/--danger/--info → green/amber/red 家族
  - --brand/--message-user-bg 等 → --dsw-alias-button-* / --dsw-specific-bubble/sidebar-*
  - 签名纹理/动效（body::before/::after、@keyframes、pre/code/blockquote/滚动条等
    通用选择器）按作用域改写后随迁；AionUi 专有类名（.layout-sider 等）的规则丢弃，
    其视觉职责由令牌重映射接管。
"""
import json
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AIONUI = os.path.expanduser("~/aionui-themes/themes")
SKINS = os.path.join(ROOT, "skins")

# 非 -dark/-light 后缀的特殊成对关系: skin id -> (light dir, dark dir)
SPECIAL_PAIRS = {
    "catppuccin": ("catppuccin-latte", "catppuccin-mocha"),
    "one": ("one-light", "one-dark"),
    "retro-terminal": ("retro-terminal-amber", "retro-terminal"),
    "rose-pine": ("rose-pine-dawn", "rose-pine"),
    "tokyo-night": ("tokyo-night-light", "tokyo-night"),
    "night-owl": ("night-owl-light", "night-owl"),
    "github": ("github-light", "github-dark"),
    "vscode-plus": ("vscode-plus-light", "vscode-plus"),
    "kanagawa": ("kanagawa-light", "kanagawa"),
    "ayu": ("ayu-light", "ayu"),
    "darcula": ("darcula-light", "darcula"),
    "palenight": ("palenight-light", "palenight"),
}

# AionUi 专有的选择器片段 —— 含这些的规则在 DSH 里没有对应 DOM，丢弃
AIONUI_ONLY = (
    ".app-titlebar", ".layout-sider", ".message-item", ".message-bubble",
    ".guidContainer", ".guidInputCard", ".arco-layout", ".app-shell",
    ".layout-content", ".settings-", ".markdown-shadow", ".aion-",
    "[class*='guidContainer']", "[class*='chat-layout']", "[class*='conversation']",
)

DEEPSEEK_MAP = [  # dsw 档位 -> 我们的 aou 档
    ("50", 1), ("50p", 2), ("75", 2), ("100", 2), ("200", 3), ("300", 4),
    ("400", 5), ("450", 5), ("500", 6), ("600", 7), ("700-delete", 8),
    ("800", 8), ("900", 9), ("950", 10),
]
NEUTRAL_MAP = [  # neutral-bluish 档 -> 我们的 bg 档
    ("00", "fill-0"), ("50", 1), ("60", 1), ("75", 2), ("100", 2), ("150", 3),
    ("200", 3), ("250", 4), ("300", 4), ("400", 5), ("500", 6), ("550", 6),
    ("600", 8), ("700", 8), ("750", 9), ("800", 9), ("850", 9), ("875", 10),
    ("900", 10), ("950", 10), ("1000", "inverse"),
]


def parse_root_vars(css):
    m = re.search(r":root\s*\{(.*?)\n\}", css, re.S)
    if not m:
        raise ValueError("no :root block")
    out = {}
    for line in m.group(1).splitlines():
        mm = re.match(r"\s*(--[\w-]+)\s*:\s*(.+?);\s*$", line)
        if mm:
            out[mm.group(1)] = mm.group(2)
    return out


def strip_root(css):
    return re.sub(r":root\s*\{.*?\n\}\n?", "", css, count=1, flags=re.S)


def camel(s):
    return "".join(w.capitalize() if i else w for i, w in enumerate(s.split("-")))


def mix(hex_color, other, pct):
    return f"color-mix(in srgb, {hex_color} {pct}%, {other})"


def static_palette(vars_, dark):
    """生成 --dsw-static-* 令牌块"""
    aou = lambda n: vars_.get(f"--aou-{n}", "#888888")
    bg = lambda n: vars_.get(f"--bg-{n}", vars_.get("--bg-base", "#888888"))
    lines = []
    for slot, n in DEEPSEEK_MAP:
        v = aou(n)
        lines.append(f"  --dsw-static-deepseek-{slot}: {v};")
        if slot != "700-delete":
            lines.append(f"  --dsw-static-blue-{slot}: {v};")
    for slot, n in NEUTRAL_MAP:
        key = f"--bg-{n}" if isinstance(n, int) else f"--{n}"
        v = vars_.get(key, bg(1))
        lines.append(f"  --dsw-static-neutral-bluish-{slot}: {v};")
        lines.append(f"  --dsw-static-neutral-{slot}: {v};")
    # 语义色家族：单色 hex 派生档
    for fam, key in (("green", "--success"), ("amber", "--warning"), ("red", "--danger")):
        h = vars_.get(key, "#888888")
        if not h.startswith("#"):
            continue
        soft, deep = ("white", "black") if not dark else ("black", "white")
        lines += [
            f"  --dsw-static-{fam}-50: {mix(h, soft, 10)};",
            f"  --dsw-static-{fam}-100: {mix(h, soft, 20)};",
            f"  --dsw-static-{fam}-400: {h};",
            f"  --dsw-static-{fam}-500: {h};",
            f"  --dsw-static-{fam}-600: {mix(h, 'black', 82)};",
            f"  --dsw-static-{fam}-900: {mix(h, 'black', 35)};",
        ]
    return "\n".join(lines)


def alias_palette(vars_, dark):
    g = lambda k, d="#888888": vars_.get(k, d)
    brand, hover = g("--brand"), g("--brand-hover", g("--brand"))
    aou = lambda n: g(f"--aou-{n}", brand)
    rgb = g("--primary-rgb", "136,136,136")
    tb_a = (0.36, 0.5, 0.6) if not dark else (0.36, 0.5, 0.6)
    return "\n".join([
        f"  --dsw-alias-button-primary-fill: {brand};",
        f"  --dsw-alias-button-primary-hover: {hover};",
        f"  --dsw-alias-button-primary-dimmed: {aou(2)};",
        f"  --dsw-alias-button-info-fill: {brand};",
        f"  --dsw-alias-button-info-hover: {hover};",
        f"  --dsw-alias-button-contrast-fill: {aou(7)};",
        f"  --dsw-alias-button-ghost-active-fill: {g('--brand-light', aou(1))};",
        f"  --dsw-alias-button-ghost-active-hover: {aou(2)};",
        f"  --dsw-alias-button-ghost-active-border: {aou(4)};",
        f"  --dsw-alias-button-elevated-fill: {g('--fill-0')};",
        f"  --dsw-alias-button-floating-fill: {g('--fill-0')};",
        f"  --dsw-alias-button-floating-hover: {g('--bg-hover')};",
        f"  --dsw-alias-button-tool-bar-fill-invisible: rgba({rgb}, {tb_a[0]});",
        f"  --dsw-alias-button-tool-bar-fill: rgba({rgb}, {tb_a[1]});",
        f"  --dsw-alias-button-tool-bar-hover: rgba({rgb}, {tb_a[2]});",
        f"  --dsw-specific-bubble: {g('--message-user-bg')};",
        f"  --dsw-specific-bubble-highlight: {aou(3)};",
        f"  --dsw-specific-input-major: {g('--fill-0')};",
        f"  --dsw-specific-login-input: {g('--fill-0')};",
        f"  --dsw-specific-sidebar-fill: {brand};",
        f"  --dsw-specific-sidebar-nav-item-active: {aou(2)};",
        f"  --dsw-specific-sidebar-nav-item-hover: {g('--bg-hover')};",
        f"  --dsw-specific-sidebar-nav-item-active-accent: {aou(4)};",
    ])


def scope_selector(sel, attr, dark):
    sel = sel.strip()
    if not sel or sel.startswith(("@", "/*")):
        return None
    sel = re.sub(r"^\[data-theme='dark'\]\s*", "", sel)
    if sel == ":root":
        return None
    if sel.startswith("body"):
        rest = sel[4:]
        if any(m in rest for m in AIONUI_ONLY):
            return None
        return f"body[{attr}]" + ("[data-ds-dark-theme]" if dark else "") + rest
    if any(m in sel for m in AIONUI_ONLY):
        return None
    sel = sel.replace(".arco-btn-primary", "button[class*='primary']")
    base = f"body[{attr}]" + ("[data-ds-dark-theme]" if dark else "")
    if sel.startswith(("::", ":-")):
        return base + sel
    return base + " " + sel


def extract_keyframes(css):
    """用括号配平扫描提取 @keyframes（regex 的非贪婪匹配会被顶格闭合括号截断）。"""
    keyframes = []
    while True:
        m = re.search(r"@keyframes\s+([\w-]+)\s*\{", css)
        if not m:
            break
        depth, i = 1, m.end()
        while depth and i < len(css):
            if css[i] == "{":
                depth += 1
            elif css[i] == "}":
                depth -= 1
            i += 1
        keyframes.append((m.group(1), css[m.end():i - 1]))
        css = css[:m.start()] + css[i:]
    return css, keyframes


def port_css(css, attr, dark, skin_id, seen_kf):
    """把一段 AionUi 主题 CSS 改写到 DSH 作用域。seen_kf 跨昼夜去重 keyframes。"""
    css = strip_root(css)
    css = re.sub(r"/\* AionUi Theme Background Start \*/[\s\S]*?/\* AionUi Theme Background End \*/\n?", "", css)
    css = re.sub(r"/\*[^*]*\*/", "", css)  # 去注释（含首行 id 注释）

    css, raw_kfs = extract_keyframes(css)
    keyframes = {}
    for name, body in raw_kfs:
        new = f"{skin_id}-{name}" if not name.startswith(f"{skin_id}-") else name
        if new not in seen_kf:
            seen_kf.add(new)
            keyframes[new] = body
    # animation 引用改名（包括因去重而未再收集的暗色版引用）
    for name, _body in raw_kfs:
        new = f"{skin_id}-{name}" if not name.startswith(f"{skin_id}-") else name
        if new != name:
            css = re.sub(rf"animation(-name)?(\s*:[\s\S]*?)(?<![\w-]){re.escape(name)}(?![\w-])",
                         lambda m: m.group(0).replace(name, new), css)

    out_rules = []
    # 粗粒度解析顶层规则（我们的 CSS 没有嵌套 @media）
    for m in re.finditer(r"([^{}@]+)\{([^{}]*)\}", css):
        sels, body = m.group(1), m.group(2)
        body = body.strip()
        if not body:
            continue
        new_sels = []
        for sel in sels.split(","):
            ns = scope_selector(sel, attr, dark)
            if ns:
                new_sels.append(ns)
        if new_sels:
            out_rules.append(",\n".join(new_sels) + " {\n  " + body.replace("\n", "\n  ") + "\n}")
    kf_text = "\n\n".join(f"@keyframes {n} {{{b}}}" for n, b in keyframes.items())
    return "\n\n".join(out_rules), kf_text


FAVICON = (
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">'
    '<circle cx="16" cy="16" r="13" fill="{c1}"/>'
    '<circle cx="16" cy="16" r="13" fill="none" stroke="{c2}" stroke-width="3"/>'
    '<circle cx="12" cy="12" r="4" fill="{c2}" opacity="0.55"/></svg>'
)

CLIENT_TS = """/**
 * {name} — DSH skin, ported from aionui-themes. The plugin owns only what it
 * can retract: the body attribute the stylesheet scopes on, the favicon, and
 * the document title. Styles ride the bundle CSS-modules auto-inject. No
 * services, no events, no model traffic — presentation only.
 */
import type {{ Context }} from '@deepseek-ai/cordis'
import css from './{id}.module.css'

const SKIN_TITLE = {title_json}

/** Per-theme two-tone favicon (primary + hover), inline so the skin carries no assets. */
const FAVICON_SVG = {favicon}

export function apply(ctx: Context): void {{
  const body = document.body
  const originalTitle = document.title
  body.dataset.{dataset} = ''

  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.href = `data:image/svg+xml;utf8,${{encodeURIComponent(FAVICON_SVG)}}`
  document.head.append(favicon)
  document.title = SKIN_TITLE

  void css // the class map is unused by chrome-less skins; import keeps the css auto-inject alive

  ctx.effect(() => () => {{
    delete body.dataset.{dataset}
    favicon.remove()
    if (document.title === SKIN_TITLE) document.title = originalTitle
  }}, 'ui-skin-{id}: ' + {name_json})
}}
"""

HOST_TS = """/** Host loader entry for the browser-only skin plugin. */

/** Provides no host-side behavior. */
export function apply(): void {}
"""

TEST_TS = """// @vitest-environment jsdom
/**
 * Contract test: apply() mounts the skin surface (body attribute, favicon,
 * title) and retracts everything on fiber dispose, never clobbering a
 * session title projected over the skin title.
 */
import {{ afterEach, describe, expect, it }} from 'vitest'
import {{ Context, type Fiber }} from '@deepseek-ai/cordis'
import {{ apply }} from '../src/client/index.ts'

let fiber: Fiber | undefined

async function mount(): Promise<Fiber> {{
  const f = new Context().plugin({{ apply }})
  await f.await()
  return f
}}

afterEach(async () => {{
  await fiber?.dispose()
  fiber = undefined
  document.head.querySelectorAll('link[rel="icon"]').forEach((l) => l.remove())
  delete document.body.dataset.{dataset}
  document.title = ''
}})

describe({name_json} + ' skin apply', () => {{
  it('mounts attribute, favicon and title', async () => {{
    document.title = 'DeepSeek Harness'
    fiber = await mount()
    expect(document.body.dataset.{dataset}).toBe('')
    expect(document.title).toBe({title_json})
    expect(document.head.querySelector('link[rel="icon"]')).not.toBeNull()
  }})

  it('retracts everything on dispose', async () => {{
    document.title = 'DeepSeek Harness'
    fiber = await mount()
    await fiber.dispose()
    fiber = undefined
    expect(document.body.dataset.{dataset}).toBeUndefined()
    expect(document.head.querySelector('link[rel="icon"]')).toBeNull()
    expect(document.title).toBe('DeepSeek Harness')
  }})

  it('never clobbers a session title', async () => {{
    fiber = await mount()
    document.title = '我的会话 — ' + {title_json}
    await fiber.dispose()
    fiber = undefined
    expect(document.title).toBe('我的会话 — ' + {title_json})
  }})
}})
"""

PACKAGE_JSON = {
    "type": "module",
    "main": "lib/index.js",
    "exports": {".": "./lib/index.js", "./client": "./lib/client.js",
                "./src/*": "./src/*", "./package.json": "./package.json"},
    "dsh": {"bundle": {"patch": "./cordis.patch.yml"},
            "client": {"inject": [], "platform": "web"}},
    "scripts": {"build": "tsdown", "prepare": "tsdown", "test": "vitest run"},
    "license": "Apache-2.0",
    "devDependencies": {
        "jsdom": "29.1.1", "lightningcss": "^1.32.0", "tsdown": "^0.22.2",
        "vite-tsconfig-paths": "^6.1.1", "vitest": "^4.1.8",
        "@deepseek-ai/cordis": "^4.0.1",
    },
    "files": ["lib", "cordis.patch.yml", "skin.json", "preview"],
}

TSDOWN = """import { clientBundle } from '../../shared/tsdown.client.ts'

export default clientBundle('{pkg}', ['src/index.ts'])
"""

TSCONFIG = """{
  "compilerOptions": {
    "target": "ES2024", "module": "ESNext", "moduleResolution": "bundler",
    "allowImportingTsExtensions": true, "jsx": "react-jsx",
    "lib": ["ES2024", "DOM", "DOM.Iterable"], "strict": true,
    "skipLibCheck": true, "isolatedModules": true, "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true, "resolveJsonModule": true, "noEmit": true
  },
  "include": ["src", "tests"]
}
"""

VITEST = """import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths({ projects: ['./tsconfig.vitest.json'] })],
  test: { include: ['tests/**/*.spec.{ts,tsx}'], pool: 'forks' },
})
"""

CSS_MODULES_DTS = """declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}
"""


def load_theme(dir_name):
    d = os.path.join(AIONUI, dir_name)
    meta = json.load(open(os.path.join(d, "theme.json"), encoding="utf-8"))
    css = open(os.path.join(d, "theme.css"), encoding="utf-8").read()
    preview = os.path.join(d, "preview-clean.png")
    return meta, css, preview if os.path.isfile(preview) else None


def find_pairs():
    pairs = dict(SPECIAL_PAIRS)
    covered = {d for pair in SPECIAL_PAIRS.values() for d in pair}
    for d in sorted(os.listdir(AIONUI)):
        if d in covered or not os.path.isdir(os.path.join(AIONUI, d)):
            continue
        if d.endswith("-dark") or d.endswith("-light"):
            base = d.rsplit("-", 1)[0]
            if base in pairs:
                continue
            other = base + ("-light" if d.endswith("-dark") else "-dark")
            if os.path.isdir(os.path.join(AIONUI, other)):
                pairs[base] = (d, other) if d.endswith("-light") else (other, d)
        else:
            # 主版目录：反向版应已把 pairs 填好；兜底独立处理
            if d + "-dark" in os.listdir(AIONUI):
                pairs[d] = (d, d + "-dark")
            elif d + "-light" in os.listdir(AIONUI):
                pairs[d] = (d + "-light", d)
    # 校验每对一昼一夜
    result = {}
    for sid, (ld, dd) in pairs.items():
        lm = json.load(open(os.path.join(AIONUI, ld, "theme.json"), encoding="utf-8"))
        dm = json.load(open(os.path.join(AIONUI, dd, "theme.json"), encoding="utf-8"))
        assert lm["appearance"] == "light" and dm["appearance"] == "dark", f"{sid}: pair mismatch {ld}/{dm}"
        result[sid] = (ld, dd)
    return result


def convert(sid, light_dir, dark_dir, order):
    lm, lcss, lprev = load_theme(light_dir)
    dm, dcss, dprev = load_theme(dark_dir)
    lvars, dvars = parse_root_vars(lcss), parse_root_vars(dcss)

    attr = f"data-dsh-{sid}"
    dataset = "dsh" + camel(sid).capitalize() if False else "dsh" + "".join(w.capitalize() for w in sid.split("-"))
    name = re.sub(r"\s*·\s*[昼夜]$", "", lm["name"])
    pkg = f"@whyihaveyou/dsh-skin-{sid}"

    out = os.path.join(SKINS, sid)
    os.makedirs(os.path.join(out, "src", "client"), exist_ok=True)
    os.makedirs(os.path.join(out, "tests"), exist_ok=True)
    os.makedirs(os.path.join(out, "preview"), exist_ok=True)

    # ---- module.css ----
    font_light = re.search(r"body\s*\{[^}]*font-family:([^;]+);", lcss)
    font_decl = f"  --dsw-font-family: {font_light.group(1).strip()};\n" if font_light else ""
    # 原始变量保留在皮肤作用域内：装饰层的 var(--bg-base) 等引用依赖它们，不污染全局
    light_vars_block = "\n".join(f"  {k}: {v};" for k, v in lvars.items())
    dark_vars_block = "\n".join(f"  {k}: {v};" for k, v in dvars.items())
    blocks = [
        f"/* {sid} — {name} | ported from aionui-themes by dsh-themes converter.\n"
        f"   Light tokens hang on body[{attr}], dark tokens on the same attribute\n"
        f"   plus [data-ds-dark-theme], so the shell day/night toggle keeps working. */",
        f"body[{attr}] {{\n{font_decl}  color: {lvars['--text-primary']};\n  background-color: {lvars['--bg-base']};\n}}",
        f"body[{attr}][data-ds-dark-theme] {{\n  color: {dvars['--text-primary']};\n  background-color: {dvars['--bg-base']};\n}}",
        f"/* --- source palette (scoped): light --- */\nbody[{attr}] {{\n{light_vars_block}\n}}",
        f"/* --- source palette (scoped): dark --- */\nbody[{attr}][data-ds-dark-theme] {{\n{dark_vars_block}\n}}",
        f"/* --- static palette: light --- */\nbody[{attr}] {{\n{static_palette(lvars, False)}\n}}",
        f"/* --- static palette: dark --- */\nbody[{attr}][data-ds-dark-theme] {{\n{static_palette(dvars, True)}\n}}",
        f"/* --- alias & specific: light --- */\nbody[{attr}] {{\n{alias_palette(lvars, False)}\n}}",
        f"/* --- alias & specific: dark --- */\nbody[{attr}][data-ds-dark-theme] {{\n{alias_palette(dvars, True)}\n}}",
    ]
    seen_kf = set()
    lrules, lkf = port_css(lcss, attr, False, sid, seen_kf)
    drules, dkf = port_css(dcss, attr, True, sid, seen_kf)
    if lrules:
        blocks.append(f"/* --- signature decor: light --- */\n{lrules}")
    if drules:
        blocks.append(f"/* --- signature decor: dark --- */\n{drules}")
    if lkf or dkf:
        blocks.append("/* --- keyframes --- */\n" + "\n\n".join(x for x in (lkf, dkf) if x))
    open(os.path.join(out, "src", "client", f"{sid}.module.css"), "w", encoding="utf-8").write(
        "\n\n".join(blocks) + "\n")

    # ---- TS / 配置 ----
    favicon = FAVICON.replace("{c1}", lvars.get("--primary", "#888888")).replace("{c2}", lvars.get("--brand-hover", lvars.get("--primary", "#888888")))
    open(os.path.join(out, "src", "client", "index.ts"), "w", encoding="utf-8").write(
        CLIENT_TS.format(id=sid, name=name, name_json=json.dumps(name), title_json=json.dumps(name), dataset=dataset,
                         favicon=json.dumps(favicon)))
    open(os.path.join(out, "src", "index.ts"), "w").write(HOST_TS)
    open(os.path.join(out, "src", "css-modules.d.ts"), "w").write(CSS_MODULES_DTS)
    open(os.path.join(out, "tests", "apply.spec.ts"), "w", encoding="utf-8").write(
        TEST_TS.format(id=sid, name=name, name_json=json.dumps(name), title_json=json.dumps(name), dataset=dataset))
    open(os.path.join(out, "tsdown.config.ts"), "w").write(TSDOWN.replace("{pkg}", pkg))
    open(os.path.join(out, "tsconfig.vitest.json"), "w").write(TSCONFIG)
    open(os.path.join(out, "vitest.config.ts"), "w").write(VITEST)

    pj = dict(PACKAGE_JSON)
    pj["name"] = pkg
    pj["version"] = "1.0.0"
    pj["description"] = lm.get("description", name)
    json.dump(pj, open(os.path.join(out, "package.json"), "w"), indent=2, ensure_ascii=False)

    open(os.path.join(out, "cordis.patch.yml"), "w").write(
        f"# {sid} skin bundle patch: inserts its dshClient row into the web plugin roster.\n"
        f"- insert:\n    - id: ui-skin-{sid}\n      name: '{pkg}'\n")

    skin_json = {
        "id": sid, "name": name, "nameEn": re.sub(r"\s*(Day|Night|Light|Dark)$", "", lm.get("nameEn", sid)),
        "author": "aionui-themes", "tagline": lm.get("description", name),
        "description": dm.get("description", "") + "（含昼夜双模式）",
        "tags": [t for t in lm.get("tags", []) if t not in ("浅色", "深色")],
        "accent": lvars.get("--primary", "#888888"), "bodyAttr": attr,
        "package": pkg, "wiring": {"id": f"ui-skin-{sid}", "bundleWired": False},
        "preview": {"light": f"skins/{sid}/preview/light.png", "dark": f"skins/{sid}/preview/dark.png"},
        "order": order,
        "source": {"aionui-themes": [light_dir, dark_dir]},
    }
    json.dump(skin_json, open(os.path.join(out, "skin.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)

    if lprev:
        shutil.copy2(lprev, os.path.join(out, "preview", "light.png"))
    if dprev:
        shutil.copy2(dprev, os.path.join(out, "preview", "dark.png"))
    return True


def main():
    pairs = find_pairs()
    print(f"pairs: {len(pairs)}")
    only = sys.argv[1:]
    order = 0
    fails = []
    for sid in sorted(pairs):
        if only and sid not in only:
            continue
        order += 1
        try:
            convert(sid, *pairs[sid], order)
            print(f"OK {sid}")
        except Exception as e:
            fails.append(sid)
            print(f"FAIL {sid}: {e}")
    print(f"done: {order - len(fails)} ok, {len(fails)} fail", fails or "")


if __name__ == "__main__":
    main()
