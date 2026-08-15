# @dsh-suite/themes — 151 款 DSH 皮肤聚合 / 151-skin pack for DSH Web UI

> 把 dsh-themes 的 151 个皮肤包**一包打尽**：一个 npm 包 + 一个「皮肤中心」试穿面板。

## 安装 / Install

```sh
dsh plugin --profile web add @dsh-suite/themes
```

重启 `dsh web` 后，Settings → **皮肤中心 / Skin Center** 即可用。

## 功能 / Features

- **试穿**: 点卡片即写 `body[data-dsh-<id>]` 属性切肤（CSS 变量实时生效），再次点击其他卡片切换，✖ 清除皮肤。
- **151 款皮肤**: 分组（绝区零 / 原神 / 经典配色 / 节日限定 …，游戏系按品牌分组）、搜索（中文名/英文名/分组/标签）。
- **昼夜预览**: 昼/夜切换预览各皮肤的 light/dark 缩略图；实际昼夜跟随 DSH 主题（`data-ds-dark-theme`）。
- **懒加载**: 缩略图经 IntersectionObserver 视口按需加载，151 卡不全量拉图。
- **收藏**: 卡片 ♡/♥ 收藏按钮，localStorage 持久化（重开面板/重启 DSH 仍在），网格顶部「♡ 只看收藏」开关。
- **最近试穿**: 最近试穿的 8 款皮肤在网格上方横向展示，点击可再次应用。
- **随机一款**: 工具条「🎲 随机试穿」从当前筛选结果（无筛选则全部 151 款）随机应用一款。

## 体积 / Volume

| 内容 | 体积 |
|---|---|
| 原始预览图（151×2 PNG, 1280×800） | ~67 MB |
| 打包后 assets（320×200 WebP q72 缩略图 + manifest + 全量 CSS） | **~4.2 MB**（压缩 16×） |
| skins.css（151 皮肤全量 CSS，试穿时经宿主 gzip 按需拉取） | 3.2 MB raw / 0.44 MB gzip |

## 生成 / Regenerate

皮肤清单、CSS、缩略图全部由脚本从 `skins/` 扫描生成，**不手写**：

```sh
cd packages/skin-center && node scripts/generate.mjs   # 需要系统 python3 + Pillow（缩略图）
```

产物 `assets/manifest.json`、`assets/skins.css`、`assets/thumbs/*.webp` 随包发布。

## 宿主路由 / Host routes

`/skin-center/manifest`（gzip JSON）、`/skin-center/css`（gzip CSS）、`/skin-center/thumbs/*`（缩略图）。

## 关系 / Architecture

- 单皮肤包（`skins/*`）：cordis.patch.yml 插入 `ui-skin-<id>` roster + client.js 注入 `body[data-dsh-<id>]` CSS。
- 本聚合包：**不等价替换**单包，而是宿主半批量服务全部皮肤资产 + 浏览器半统一试穿面板；已装单包与聚合包共存互不干扰（CSS 同选择器幂等）。
