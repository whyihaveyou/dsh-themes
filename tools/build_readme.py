#!/usr/bin/env python3
"""生成 dsh-themes 的中文 README：按系列分组展示全部皮肤（含预览图）。"""
import json
import os
from collections import OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKINS = os.path.join(ROOT, "skins")
AIONUI = os.path.expanduser("~/aionui-themes/themes")

SERIES_ORDER = ["绝区零", "超级马里奥", "塞尔达传说", "宝可梦", "迪士尼", "街头霸王",
                "原神", "崩坏星穹铁道", "游戏", "经典配色", "美学风格",
                "节日限定", "系统复古", "彩蛋"]
# franchise 归并：角色系列里的其他游戏 IP 没有统一 franchise，按前缀归到「游戏」
GAME_PREFIXES = ("game-", "mario-", "zelda-", "pokemon-", "street-fighter", "mickey-", "donald-")


def series_of(meta, src_franchise):
    if src_franchise:
        return src_franchise
    return "其他"


def main():
    groups = OrderedDict()
    skins = []
    for sid in sorted(os.listdir(SKINS)):
        sj = os.path.join(SKINS, sid, "skin.json")
        if not os.path.isfile(sj):
            continue
        meta = json.load(open(sj, encoding="utf-8"))
        # 从源 AionUi 主题拿 franchise
        franchise = None
        src = meta.get("source", {}).get("aionui-themes")
        if src:
            tj = os.path.join(AIONUI, src[0], "theme.json")
            if os.path.isfile(tj):
                franchise = json.load(open(tj, encoding="utf-8")).get("franchise")
        if franchise in ("超级马里奥", "塞尔达传说", "宝可梦", "迪士尼", "街头霸王") and not sid.startswith(GAME_PREFIXES[:1]):
            pass
        if franchise in ("超级马里奥", "塞尔达传说", "宝可梦", "迪士尼", "街头霸王"):
            pass
        series = franchise or "其他"
        # 批次二的游戏 IP franchise 多为作品名（Minecraft、Portal 等），归到「其他游戏」
        if series not in SERIES_ORDER:
            series = "其他游戏"
        groups.setdefault(series, []).append(meta)
        skins.append(meta)

    total = len(skins)
    lines = [
        "# DSH Themes · DeepSeek Harness 皮肤合集",
        "",
        f"为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) Web UI 打造的 **{total} 个皮肤**，"
        "全部迁移自 [aionui-themes](https://github.com/whyihaveyou/aionui-themes)（302 套 AionUi 主题，昼夜成对合并而来）。"
        "皮肤格式与契约参考 [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) 的官方皮肤标准。",
        "",
        "每个皮肤都是一个**自包含的 DSH 插件包**：",
        "",
        "- **昼夜一体**：浅色令牌挂在 `body[data-dsh-<id>]`，深色令牌挂在 `body[data-dsh-<id>][data-ds-dark-theme]`，DSH 的日夜切换按钮直接可用",
        "- **设计令牌重映射**：`--dsw-static-deepseek-*` / `--dsw-static-neutral-bluish-*` / `--dsw-alias-button-*` / `--dsw-specific-bubble/sidebar-*` 全套重映射，按钮、气泡、侧栏、输入框随主题变色",
        "- **签名纹理与动效随迁**：每个主题的专属 CSS 纹理（brick 纹、扫描线、数字雨、樱花飘落……）与 @keyframes 动效全部保留，作用域隔离不污染其他皮肤",
        "- **专属 favicon 与标题**：按主题主色生成",
        "- **热插拔契约**：`apply(ctx)` 写入的一切在 dispose 时全部收回（含契约测试 `tests/apply.spec.ts`）",
        "",
        "## 安装",
        "",
        "```bash",
        "git clone https://github.com/whyihaveyou/dsh-themes.git",
        "# 安装单个皮肤（以马力欧为例；lib/ 已随仓库预构建，无需本地构建）",
        "dsh plugin --profile <你的profile> add ./dsh-themes/skins/mario",
        "```",
        "",
        "或在皮肤中心（skin-center）里试穿/启用。",
        "",
        "## 皮肤一览",
        "",
    ]
    for series in SERIES_ORDER + ["其他游戏", "其他"]:
        metas = groups.get(series)
        if not metas:
            continue
        lines.append(f"<details open><summary><b>{series}</b>（{len(metas)} 个）</summary>")
        lines.append("")
        lines.append("| 皮肤 | 浅色预览 | 深色预览 |")
        lines.append("|---|---|---|")
        for m in metas:
            lp = f"skins/{m['id']}/preview/light.png"
            dp = f"skins/{m['id']}/preview/dark.png"
            lines.append(f"| **{m['name']}**<br>`{m['id']}` | ![{m['name']} 浅色]({lp}) | ![{m['name']} 深色]({dp}) |")
        lines.append("")
        lines.append("</details>")
        lines.append("")

    lines += [
        "## 目录结构",
        "",
        "```",
        "skins/<id>/",
        "├── skin.json            # 皮肤元数据（名称/主色/bodyAttr/预览）",
        "├── package.json         # DSH 插件包声明（dsh.bundle.patch）",
        "├── cordis.patch.yml     # bundle patch（安装时插入 ui-skin-<id> 行）",
        "├── tsdown.config.ts     # 构建配置（shared/tsdown.client.ts 预设）",
        "├── src/",
        "│   ├── index.ts         # host 入口（无操作）",
        "│   └── client/",
        "│       ├── index.ts     # apply(ctx)：body 属性 + favicon + 标题，dispose 全收回",
        "│       └── <id>.module.css  # 令牌重映射 + 签名纹理/动效（昼夜双作用域）",
        "├── tests/apply.spec.ts  # 契约测试",
        "└── preview/             # 意境预览图（浅色/深色）",
        "```",
        "",
        "## 工具",
        "",
        "- `python3 tools/convert.py` — 从 aionui-themes 批量重新生成全部皮肤包",
        "- `python3 tools/validate_skin.py` — 结构校验（作用域/令牌/keyframes 闭环/文件完整性）",
        "- `python3 tools/build_readme.py` — 重新生成本 README",
        "",
        "## 致谢",
        "",
        "- 皮肤契约与插件标准参考 [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)",
        "- 经典配色系列色板来自各方案官方定义（Catppuccin / Dracula / Nord / Tokyo Night / Gruvbox / Solarized / Rosé Pine / Everforest / Atom / Monokai / Night Owl / Synthwave '84 / Kanagawa / Ayu / GitHub Primer / Material Theme / VS Code / JetBrains / Flexoki）",
        "- 角色名称与形象版权归米哈游 / 任天堂 / 迪士尼 / 卡普空等各自厂商所有，本项目为粉丝向非商业作品",
        "",
        "## License",
        "",
        "Apache-2.0",
    ]
    open(os.path.join(ROOT, "README.md"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"README.md generated: {total} skins, series: {', '.join(f'{k}({len(v)})' for k, v in groups.items())}")


if __name__ == "__main__":
    main()
