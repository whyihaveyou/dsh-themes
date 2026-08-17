# DSH Themes · DeepSeek Harness 皮肤合集

为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) Web UI 打造的 **151 个皮肤**，全部迁移自 [aionui-themes](https://github.com/whyihaveyou/aionui-themes)（302 套 AionUi 主题，昼夜成对合并而来）。皮肤格式与契约参考 [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) 的官方皮肤标准。

每个皮肤都是一个**自包含的 DSH 插件包**：

- **昼夜一体**：浅色令牌挂在 `body[data-dsh-<id>]`，深色令牌挂在 `body[data-dsh-<id>][data-ds-dark-theme]`，DSH 的日夜切换按钮直接可用
- **设计令牌重映射**：`--dsw-static-deepseek-*` / `--dsw-static-neutral-bluish-*` / `--dsw-alias-button-*` / `--dsw-specific-bubble/sidebar-*` 全套重映射，按钮、气泡、侧栏、输入框随主题变色
- **签名纹理与动效随迁**：每个主题的专属 CSS 纹理（brick 纹、扫描线、数字雨、樱花飘落……）与 @keyframes 动效全部保留，作用域隔离不污染其他皮肤
- **专属 favicon 与标题**：按主题主色生成
- **热插拔契约**：`apply(ctx)` 写入的一切在 dispose 时全部收回（含契约测试 `tests/apply.spec.ts`）

## 安装

```bash
git clone https://github.com/whyihaveyou/dsh-themes.git
# 安装单个皮肤（以马力欧为例；lib/ 已随仓库预构建，无需本地构建）
dsh plugin --profile <你的profile> add ./dsh-themes/skins/mario
```

或在皮肤中心（skin-center）里试穿/启用。

## 皮肤一览

<details open><summary><b>绝区零</b>（43 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **绝区零 · 爱丽丝**<br>`zzz-alice` | ![绝区零 · 爱丽丝 浅色](skins/zzz-alice/preview/light.png) | ![绝区零 · 爱丽丝 深色](skins/zzz-alice/preview/dark.png) |
| **绝区零 · 安比**<br>`zzz-anby` | ![绝区零 · 安比 浅色](skins/zzz-anby/preview/light.png) | ![绝区零 · 安比 深色](skins/zzz-anby/preview/dark.png) |
| **绝区零 · 安东**<br>`zzz-anton` | ![绝区零 · 安东 浅色](skins/zzz-anton/preview/light.png) | ![绝区零 · 安东 深色](skins/zzz-anton/preview/dark.png) |
| **绝区零 · 耀嘉音**<br>`zzz-astra` | ![绝区零 · 耀嘉音 浅色](skins/zzz-astra/preview/light.png) | ![绝区零 · 耀嘉音 深色](skins/zzz-astra/preview/dark.png) |
| **绝区零 · 般岳**<br>`zzz-banyue` | ![绝区零 · 般岳 浅色](skins/zzz-banyue/preview/light.png) | ![绝区零 · 般岳 深色](skins/zzz-banyue/preview/dark.png) |
| **绝区零 · 本**<br>`zzz-ben` | ![绝区零 · 本 浅色](skins/zzz-ben/preview/light.png) | ![绝区零 · 本 深色](skins/zzz-ben/preview/dark.png) |
| **绝区零 · 比利**<br>`zzz-billy` | ![绝区零 · 比利 浅色](skins/zzz-billy/preview/light.png) | ![绝区零 · 比利 深色](skins/zzz-billy/preview/dark.png) |
| **绝区零 · 柏妮思**<br>`zzz-burnice` | ![绝区零 · 柏妮思 浅色](skins/zzz-burnice/preview/light.png) | ![绝区零 · 柏妮思 深色](skins/zzz-burnice/preview/dark.png) |
| **绝区零 · 凯撒**<br>`zzz-caesar` | ![绝区零 · 凯撒 浅色](skins/zzz-caesar/preview/light.png) | ![绝区零 · 凯撒 深色](skins/zzz-caesar/preview/dark.png) |
| **绝区零 · 可琳**<br>`zzz-corin` | ![绝区零 · 可琳 浅色](skins/zzz-corin/preview/light.png) | ![绝区零 · 可琳 深色](skins/zzz-corin/preview/dark.png) |
| **绝区零 · 艾莲**<br>`zzz-ellen` | ![绝区零 · 艾莲 浅色](skins/zzz-ellen/preview/light.png) | ![绝区零 · 艾莲 深色](skins/zzz-ellen/preview/dark.png) |
| **绝区零 · 伊芙琳**<br>`zzz-evelyn` | ![绝区零 · 伊芙琳 浅色](skins/zzz-evelyn/preview/light.png) | ![绝区零 · 伊芙琳 深色](skins/zzz-evelyn/preview/dark.png) |
| **绝区零 · 格莉丝**<br>`zzz-grace` | ![绝区零 · 格莉丝 浅色](skins/zzz-grace/preview/light.png) | ![绝区零 · 格莉丝 深色](skins/zzz-grace/preview/dark.png) |
| **绝区零 · 悠真**<br>`zzz-harumasa` | ![绝区零 · 悠真 浅色](skins/zzz-harumasa/preview/light.png) | ![绝区零 · 悠真 深色](skins/zzz-harumasa/preview/dark.png) |
| **绝区零 · 雨果**<br>`zzz-hugo` | ![绝区零 · 雨果 浅色](skins/zzz-hugo/preview/light.png) | ![绝区零 · 雨果 深色](skins/zzz-hugo/preview/dark.png) |
| **绝区零 · 简**<br>`zzz-jane` | ![绝区零 · 简 浅色](skins/zzz-jane/preview/light.png) | ![绝区零 · 简 深色](skins/zzz-jane/preview/dark.png) |
| **绝区零 · 橘福福**<br>`zzz-jufufu` | ![绝区零 · 橘福福 浅色](skins/zzz-jufufu/preview/light.png) | ![绝区零 · 橘福福 深色](skins/zzz-jufufu/preview/dark.png) |
| **绝区零 · 珂蕾妲**<br>`zzz-koleda` | ![绝区零 · 珂蕾妲 浅色](skins/zzz-koleda/preview/light.png) | ![绝区零 · 珂蕾妲 深色](skins/zzz-koleda/preview/dark.png) |
| **绝区零 · 莱特**<br>`zzz-lighter` | ![绝区零 · 莱特 浅色](skins/zzz-lighter/preview/light.png) | ![绝区零 · 莱特 深色](skins/zzz-lighter/preview/dark.png) |
| **绝区零 · 露西**<br>`zzz-lucy` | ![绝区零 · 露西 浅色](skins/zzz-lucy/preview/light.png) | ![绝区零 · 露西 深色](skins/zzz-lucy/preview/dark.png) |
| **绝区零 · 莱卡恩**<br>`zzz-lycaon` | ![绝区零 · 莱卡恩 浅色](skins/zzz-lycaon/preview/light.png) | ![绝区零 · 莱卡恩 深色](skins/zzz-lycaon/preview/dark.png) |
| **绝区零 · 星见雅**<br>`zzz-miyabi` | ![绝区零 · 星见雅 浅色](skins/zzz-miyabi/preview/light.png) | ![绝区零 · 星见雅 深色](skins/zzz-miyabi/preview/dark.png) |
| **绝区零 · 猫又**<br>`zzz-nekomata` | ![绝区零 · 猫又 浅色](skins/zzz-nekomata/preview/light.png) | ![绝区零 · 猫又 深色](skins/zzz-nekomata/preview/dark.png) |
| **绝区零 · 妮可**<br>`zzz-nicole` | ![绝区零 · 妮可 浅色](skins/zzz-nicole/preview/light.png) | ![绝区零 · 妮可 深色](skins/zzz-nicole/preview/dark.png) |
| **绝区零 · 奥菲丝**<br>`zzz-orphie` | ![绝区零 · 奥菲丝 浅色](skins/zzz-orphie/preview/light.png) | ![绝区零 · 奥菲丝 深色](skins/zzz-orphie/preview/dark.png) |
| **绝区零 · 潘引壶**<br>`zzz-panyinhu` | ![绝区零 · 潘引壶 浅色](skins/zzz-panyinhu/preview/light.png) | ![绝区零 · 潘引壶 深色](skins/zzz-panyinhu/preview/dark.png) |
| **绝区零 · 派派**<br>`zzz-piper` | ![绝区零 · 派派 浅色](skins/zzz-piper/preview/light.png) | ![绝区零 · 派派 深色](skins/zzz-piper/preview/dark.png) |
| **绝区零 · 波可娜**<br>`zzz-pulchra` | ![绝区零 · 波可娜 浅色](skins/zzz-pulchra/preview/light.png) | ![绝区零 · 波可娜 深色](skins/zzz-pulchra/preview/dark.png) |
| **绝区零 · 青衣**<br>`zzz-qingyi` | ![绝区零 · 青衣 浅色](skins/zzz-qingyi/preview/light.png) | ![绝区零 · 青衣 深色](skins/zzz-qingyi/preview/dark.png) |
| **绝区零 · 丽娜**<br>`zzz-rina` | ![绝区零 · 丽娜 浅色](skins/zzz-rina/preview/light.png) | ![绝区零 · 丽娜 深色](skins/zzz-rina/preview/dark.png) |
| **绝区零 · 席德**<br>`zzz-seed` | ![绝区零 · 席德 浅色](skins/zzz-seed/preview/light.png) | ![绝区零 · 席德 深色](skins/zzz-seed/preview/dark.png) |
| **绝区零 · 赛斯**<br>`zzz-seth` | ![绝区零 · 赛斯 浅色](skins/zzz-seth/preview/light.png) | ![绝区零 · 赛斯 深色](skins/zzz-seth/preview/dark.png) |
| **绝区零 · 11号**<br>`zzz-soldier11` | ![绝区零 · 11号 浅色](skins/zzz-soldier11/preview/light.png) | ![绝区零 · 11号 深色](skins/zzz-soldier11/preview/dark.png) |
| **绝区零 · 苍角**<br>`zzz-soukaku` | ![绝区零 · 苍角 浅色](skins/zzz-soukaku/preview/light.png) | ![绝区零 · 苍角 深色](skins/zzz-soukaku/preview/dark.png) |
| **绝区零 · 扳机**<br>`zzz-trigger` | ![绝区零 · 扳机 浅色](skins/zzz-trigger/preview/light.png) | ![绝区零 · 扳机 深色](skins/zzz-trigger/preview/dark.png) |
| **绝区零 · 薇薇安**<br>`zzz-vivian` | ![绝区零 · 薇薇安 浅色](skins/zzz-vivian/preview/light.png) | ![绝区零 · 薇薇安 深色](skins/zzz-vivian/preview/dark.png) |
| **绝区零 · 月城柳**<br>`zzz-yanagi` | ![绝区零 · 月城柳 浅色](skins/zzz-yanagi/preview/light.png) | ![绝区零 · 月城柳 深色](skins/zzz-yanagi/preview/dark.png) |
| **绝区零 · 叶瞬光**<br>`zzz-yeshunguang` | ![绝区零 · 叶瞬光 浅色](skins/zzz-yeshunguang/preview/light.png) | ![绝区零 · 叶瞬光 深色](skins/zzz-yeshunguang/preview/dark.png) |
| **绝区零 · 伊德海莉**<br>`zzz-yidhari` | ![绝区零 · 伊德海莉 浅色](skins/zzz-yidhari/preview/light.png) | ![绝区零 · 伊德海莉 深色](skins/zzz-yidhari/preview/dark.png) |
| **绝区零 · 仪玄**<br>`zzz-yixuan` | ![绝区零 · 仪玄 浅色](skins/zzz-yixuan/preview/light.png) | ![绝区零 · 仪玄 深色](skins/zzz-yixuan/preview/dark.png) |
| **绝区零 · 浮波柚叶**<br>`zzz-yuzuha` | ![绝区零 · 浮波柚叶 浅色](skins/zzz-yuzuha/preview/light.png) | ![绝区零 · 浮波柚叶 深色](skins/zzz-yuzuha/preview/dark.png) |
| **绝区零 · 照**<br>`zzz-zhao` | ![绝区零 · 照 浅色](skins/zzz-zhao/preview/light.png) | ![绝区零 · 照 深色](skins/zzz-zhao/preview/dark.png) |
| **绝区零 · 朱鸢**<br>`zzz-zhuyuan` | ![绝区零 · 朱鸢 浅色](skins/zzz-zhuyuan/preview/light.png) | ![绝区零 · 朱鸢 深色](skins/zzz-zhuyuan/preview/dark.png) |

</details>

<details open><summary><b>超级马里奥</b>（6 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **超级马里奥**<br>`mario` | ![超级马里奥 浅色](skins/mario/preview/light.png) | ![超级马里奥 深色](skins/mario/preview/dark.png) |
| **超级马里奥 · 库巴**<br>`mario-bowser` | ![超级马里奥 · 库巴 浅色](skins/mario-bowser/preview/light.png) | ![超级马里奥 · 库巴 深色](skins/mario-bowser/preview/dark.png) |
| **超级马里奥 · 路易吉**<br>`mario-luigi` | ![超级马里奥 · 路易吉 浅色](skins/mario-luigi/preview/light.png) | ![超级马里奥 · 路易吉 深色](skins/mario-luigi/preview/dark.png) |
| **超级马里奥 · 桃花公主**<br>`mario-peach` | ![超级马里奥 · 桃花公主 浅色](skins/mario-peach/preview/light.png) | ![超级马里奥 · 桃花公主 深色](skins/mario-peach/preview/dark.png) |
| **超级马里奥 · 奇诺比奥**<br>`mario-toad` | ![超级马里奥 · 奇诺比奥 浅色](skins/mario-toad/preview/light.png) | ![超级马里奥 · 奇诺比奥 深色](skins/mario-toad/preview/dark.png) |
| **超级马里奥 · 耀西**<br>`mario-yoshi` | ![超级马里奥 · 耀西 浅色](skins/mario-yoshi/preview/light.png) | ![超级马里奥 · 耀西 深色](skins/mario-yoshi/preview/dark.png) |

</details>

<details open><summary><b>塞尔达传说</b>（1 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **塞尔达传说 · 林克**<br>`zelda-link` | ![塞尔达传说 · 林克 浅色](skins/zelda-link/preview/light.png) | ![塞尔达传说 · 林克 深色](skins/zelda-link/preview/dark.png) |

</details>

<details open><summary><b>宝可梦</b>（8 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **宝可梦 · 皮卡丘**<br>`pikachu` | ![宝可梦 · 皮卡丘 浅色](skins/pikachu/preview/light.png) | ![宝可梦 · 皮卡丘 深色](skins/pikachu/preview/dark.png) |
| **宝可梦 · 喷火龙**<br>`pokemon-charizard` | ![宝可梦 · 喷火龙 浅色](skins/pokemon-charizard/preview/light.png) | ![宝可梦 · 喷火龙 深色](skins/pokemon-charizard/preview/dark.png) |
| **宝可梦 · 伊布**<br>`pokemon-eevee` | ![宝可梦 · 伊布 浅色](skins/pokemon-eevee/preview/light.png) | ![宝可梦 · 伊布 深色](skins/pokemon-eevee/preview/dark.png) |
| **宝可梦 · 耿鬼**<br>`pokemon-gengar` | ![宝可梦 · 耿鬼 浅色](skins/pokemon-gengar/preview/light.png) | ![宝可梦 · 耿鬼 深色](skins/pokemon-gengar/preview/dark.png) |
| **宝可梦 · 超梦**<br>`pokemon-mewtwo` | ![宝可梦 · 超梦 浅色](skins/pokemon-mewtwo/preview/light.png) | ![宝可梦 · 超梦 深色](skins/pokemon-mewtwo/preview/dark.png) |
| **宝可梦 · 谜拟丘**<br>`pokemon-mimikyu` | ![宝可梦 · 谜拟丘 浅色](skins/pokemon-mimikyu/preview/light.png) | ![宝可梦 · 谜拟丘 深色](skins/pokemon-mimikyu/preview/dark.png) |
| **宝可梦 · 卡比兽**<br>`pokemon-snorlax` | ![宝可梦 · 卡比兽 浅色](skins/pokemon-snorlax/preview/light.png) | ![宝可梦 · 卡比兽 深色](skins/pokemon-snorlax/preview/dark.png) |
| **宝可梦 · 月亮伊布**<br>`pokemon-umbreon` | ![宝可梦 · 月亮伊布 浅色](skins/pokemon-umbreon/preview/light.png) | ![宝可梦 · 月亮伊布 深色](skins/pokemon-umbreon/preview/dark.png) |

</details>

<details open><summary><b>迪士尼</b>（2 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **唐老鸭**<br>`donald-duck` | ![唐老鸭 浅色](skins/donald-duck/preview/light.png) | ![唐老鸭 深色](skins/donald-duck/preview/dark.png) |
| **米老鼠**<br>`mickey-mouse` | ![米老鼠 浅色](skins/mickey-mouse/preview/light.png) | ![米老鼠 深色](skins/mickey-mouse/preview/dark.png) |

</details>

<details open><summary><b>街头霸王</b>（1 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **街头霸王**<br>`street-fighter` | ![街头霸王 浅色](skins/street-fighter/preview/light.png) | ![街头霸王 深色](skins/street-fighter/preview/dark.png) |

</details>

<details open><summary><b>原神</b>（10 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **原神 · 神里绫华**<br>`genshin-ayaka` | ![原神 · 神里绫华 浅色](skins/genshin-ayaka/preview/light.png) | ![原神 · 神里绫华 深色](skins/genshin-ayaka/preview/dark.png) |
| **原神 · 芙宁娜**<br>`genshin-furina` | ![原神 · 芙宁娜 浅色](skins/genshin-furina/preview/light.png) | ![原神 · 芙宁娜 深色](skins/genshin-furina/preview/dark.png) |
| **原神 · 甘雨**<br>`genshin-ganyu` | ![原神 · 甘雨 浅色](skins/genshin-ganyu/preview/light.png) | ![原神 · 甘雨 深色](skins/genshin-ganyu/preview/dark.png) |
| **原神 · 胡桃**<br>`genshin-hutao` | ![原神 · 胡桃 浅色](skins/genshin-hutao/preview/light.png) | ![原神 · 胡桃 深色](skins/genshin-hutao/preview/dark.png) |
| **原神 · 可莉**<br>`genshin-klee` | ![原神 · 可莉 浅色](skins/genshin-klee/preview/light.png) | ![原神 · 可莉 深色](skins/genshin-klee/preview/dark.png) |
| **原神 · 纳西妲**<br>`genshin-nahida` | ![原神 · 纳西妲 浅色](skins/genshin-nahida/preview/light.png) | ![原神 · 纳西妲 深色](skins/genshin-nahida/preview/dark.png) |
| **原神 · 雷电将军**<br>`genshin-raiden` | ![原神 · 雷电将军 浅色](skins/genshin-raiden/preview/light.png) | ![原神 · 雷电将军 深色](skins/genshin-raiden/preview/dark.png) |
| **原神 · 散兵**<br>`genshin-wanderer` | ![原神 · 散兵 浅色](skins/genshin-wanderer/preview/light.png) | ![原神 · 散兵 深色](skins/genshin-wanderer/preview/dark.png) |
| **原神 · 魈**<br>`genshin-xiao` | ![原神 · 魈 浅色](skins/genshin-xiao/preview/light.png) | ![原神 · 魈 深色](skins/genshin-xiao/preview/dark.png) |
| **原神 · 钟离**<br>`genshin-zhongli` | ![原神 · 钟离 浅色](skins/genshin-zhongli/preview/light.png) | ![原神 · 钟离 深色](skins/genshin-zhongli/preview/dark.png) |

</details>

<details open><summary><b>崩坏星穹铁道</b>（8 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **崩坏星穹铁道 · 黄泉**<br>`hsr-acheron` | ![崩坏星穹铁道 · 黄泉 浅色](skins/hsr-acheron/preview/light.png) | ![崩坏星穹铁道 · 黄泉 深色](skins/hsr-acheron/preview/dark.png) |
| **崩坏星穹铁道 · 丹恒**<br>`hsr-danheng` | ![崩坏星穹铁道 · 丹恒 浅色](skins/hsr-danheng/preview/light.png) | ![崩坏星穹铁道 · 丹恒 深色](skins/hsr-danheng/preview/dark.png) |
| **崩坏星穹铁道 · 流萤**<br>`hsr-firefly` | ![崩坏星穹铁道 · 流萤 浅色](skins/hsr-firefly/preview/light.png) | ![崩坏星穹铁道 · 流萤 深色](skins/hsr-firefly/preview/dark.png) |
| **崩坏星穹铁道 · 景元**<br>`hsr-jingyuan` | ![崩坏星穹铁道 · 景元 浅色](skins/hsr-jingyuan/preview/light.png) | ![崩坏星穹铁道 · 景元 深色](skins/hsr-jingyuan/preview/dark.png) |
| **崩坏星穹铁道 · 卡芙卡**<br>`hsr-kafka` | ![崩坏星穹铁道 · 卡芙卡 浅色](skins/hsr-kafka/preview/light.png) | ![崩坏星穹铁道 · 卡芙卡 深色](skins/hsr-kafka/preview/dark.png) |
| **崩坏星穹铁道 · 三月七**<br>`hsr-march7` | ![崩坏星穹铁道 · 三月七 浅色](skins/hsr-march7/preview/light.png) | ![崩坏星穹铁道 · 三月七 深色](skins/hsr-march7/preview/dark.png) |
| **崩坏星穹铁道 · 银狼**<br>`hsr-silverwolf` | ![崩坏星穹铁道 · 银狼 浅色](skins/hsr-silverwolf/preview/light.png) | ![崩坏星穹铁道 · 银狼 深色](skins/hsr-silverwolf/preview/dark.png) |
| **崩坏星穹铁道 · 花火**<br>`hsr-sparkle` | ![崩坏星穹铁道 · 花火 浅色](skins/hsr-sparkle/preview/light.png) | ![崩坏星穹铁道 · 花火 深色](skins/hsr-sparkle/preview/dark.png) |

</details>

<details open><summary><b>经典配色</b>（20 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **Ayu Light**<br>`ayu` | ![Ayu Light 浅色](skins/ayu/preview/light.png) | ![Ayu Light 深色](skins/ayu/preview/dark.png) |
| **Catppuccin Latte**<br>`catppuccin` | ![Catppuccin Latte 浅色](skins/catppuccin/preview/light.png) | ![Catppuccin Latte 深色](skins/catppuccin/preview/dark.png) |
| **IntelliJ Light**<br>`darcula` | ![IntelliJ Light 浅色](skins/darcula/preview/light.png) | ![IntelliJ Light 深色](skins/darcula/preview/dark.png) |
| **Dracula**<br>`dracula` | ![Dracula 浅色](skins/dracula/preview/light.png) | ![Dracula 深色](skins/dracula/preview/dark.png) |
| **Everforest**<br>`everforest` | ![Everforest 浅色](skins/everforest/preview/light.png) | ![Everforest 深色](skins/everforest/preview/dark.png) |
| **Flexoki**<br>`flexoki` | ![Flexoki 浅色](skins/flexoki/preview/light.png) | ![Flexoki 深色](skins/flexoki/preview/dark.png) |
| **GitHub Light**<br>`github` | ![GitHub Light 浅色](skins/github/preview/light.png) | ![GitHub Light 深色](skins/github/preview/dark.png) |
| **Gruvbox**<br>`gruvbox` | ![Gruvbox 浅色](skins/gruvbox/preview/light.png) | ![Gruvbox 深色](skins/gruvbox/preview/dark.png) |
| **Kanagawa Lotus**<br>`kanagawa` | ![Kanagawa Lotus 浅色](skins/kanagawa/preview/light.png) | ![Kanagawa Lotus 深色](skins/kanagawa/preview/dark.png) |
| **Monokai**<br>`monokai` | ![Monokai 浅色](skins/monokai/preview/light.png) | ![Monokai 深色](skins/monokai/preview/dark.png) |
| **Night Owl Light**<br>`night-owl` | ![Night Owl Light 浅色](skins/night-owl/preview/light.png) | ![Night Owl Light 深色](skins/night-owl/preview/dark.png) |
| **Nord**<br>`nord` | ![Nord 浅色](skins/nord/preview/light.png) | ![Nord 深色](skins/nord/preview/dark.png) |
| **One Light**<br>`one` | ![One Light 浅色](skins/one/preview/light.png) | ![One Light 深色](skins/one/preview/dark.png) |
| **Material Theme Lighter**<br>`palenight` | ![Material Theme Lighter 浅色](skins/palenight/preview/light.png) | ![Material Theme Lighter 深色](skins/palenight/preview/dark.png) |
| **Retro Terminal Amber**<br>`retro-terminal` | ![Retro Terminal Amber 浅色](skins/retro-terminal/preview/light.png) | ![Retro Terminal Amber 深色](skins/retro-terminal/preview/dark.png) |
| **Rosé Pine Dawn**<br>`rose-pine` | ![Rosé Pine Dawn 浅色](skins/rose-pine/preview/light.png) | ![Rosé Pine Dawn 深色](skins/rose-pine/preview/dark.png) |
| **Solarized Light**<br>`solarized` | ![Solarized Light 浅色](skins/solarized/preview/light.png) | ![Solarized Light 深色](skins/solarized/preview/dark.png) |
| **Synthwave '84**<br>`synthwave84` | ![Synthwave '84 浅色](skins/synthwave84/preview/light.png) | ![Synthwave '84 深色](skins/synthwave84/preview/dark.png) |
| **Tokyo Night Day**<br>`tokyo-night` | ![Tokyo Night Day 浅色](skins/tokyo-night/preview/light.png) | ![Tokyo Night Day 深色](skins/tokyo-night/preview/dark.png) |
| **Light+**<br>`vscode-plus` | ![Light+ 浅色](skins/vscode-plus/preview/light.png) | ![Light+ 深色](skins/vscode-plus/preview/dark.png) |

</details>

<details open><summary><b>美学风格</b>（20 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **Art Deco 装饰艺术**<br>`style-art-deco` | ![Art Deco 装饰艺术 浅色](skins/style-art-deco/preview/light.png) | ![Art Deco 装饰艺术 深色](skins/style-art-deco/preview/dark.png) |
| **包豪斯 Bauhaus**<br>`style-bauhaus` | ![包豪斯 Bauhaus 浅色](skins/style-bauhaus/preview/light.png) | ![包豪斯 Bauhaus 深色](skins/style-bauhaus/preview/dark.png) |
| **田园 Cottagecore**<br>`style-cottagecore` | ![田园 Cottagecore 浅色](skins/style-cottagecore/preview/light.png) | ![田园 Cottagecore 深色](skins/style-cottagecore/preview/dark.png) |
| **暗黑学术**<br>`style-dark-academia` | ![暗黑学术 浅色](skins/style-dark-academia/preview/light.png) | ![暗黑学术 深色](skins/style-dark-academia/preview/dark.png) |
| **手绘涂鸦 Doodle**<br>`style-doodle` | ![手绘涂鸦 Doodle 浅色](skins/style-doodle/preview/light.png) | ![手绘涂鸦 Doodle 深色](skins/style-doodle/preview/dark.png) |
| **敦煌壁画**<br>`style-dunhuang` | ![敦煌壁画 浅色](skins/style-dunhuang/preview/light.png) | ![敦煌壁画 深色](skins/style-dunhuang/preview/dark.png) |
| **星云 Galaxy**<br>`style-galaxy` | ![星云 Galaxy 浅色](skins/style-galaxy/preview/light.png) | ![星云 Galaxy 深色](skins/style-galaxy/preview/dark.png) |
| **玻璃拟态 Glassmorphism**<br>`style-glassmorphism` | ![玻璃拟态 Glassmorphism 浅色](skins/style-glassmorphism/preview/light.png) | ![玻璃拟态 Glassmorphism 深色](skins/style-glassmorphism/preview/dark.png) |
| **故障艺术 Glitch**<br>`style-glitch` | ![故障艺术 Glitch 浅色](skins/style-glitch/preview/light.png) | ![故障艺术 Glitch 深色](skins/style-glitch/preview/dark.png) |
| **水墨 Ink Wash**<br>`style-ink-wash` | ![水墨 Ink Wash 浅色](skins/style-ink-wash/preview/light.png) | ![水墨 Ink Wash 深色](skins/style-ink-wash/preview/dark.png) |
| **马卡龙 Macaron**<br>`style-macaron` | ![马卡龙 Macaron 浅色](skins/style-macaron/preview/light.png) | ![马卡龙 Macaron 深色](skins/style-macaron/preview/dark.png) |
| **孟菲斯 Memphis**<br>`style-memphis` | ![孟菲斯 Memphis 浅色](skins/style-memphis/preview/light.png) | ![孟菲斯 Memphis 深色](skins/style-memphis/preview/dark.png) |
| **莫兰迪 Morandi**<br>`style-morandi` | ![莫兰迪 Morandi 浅色](skins/style-morandi/preview/light.png) | ![莫兰迪 Morandi 深色](skins/style-morandi/preview/dark.png) |
| **新中式 Neo-Chinese**<br>`style-neo-chinese` | ![新中式 Neo-Chinese 浅色](skins/style-neo-chinese/preview/light.png) | ![新中式 Neo-Chinese 深色](skins/style-neo-chinese/preview/dark.png) |
| **极简纸 Paper Minimal**<br>`style-paper-minimal` | ![极简纸 Paper Minimal 浅色](skins/style-paper-minimal/preview/light.png) | ![极简纸 Paper Minimal 深色](skins/style-paper-minimal/preview/dark.png) |
| **像素艺术**<br>`style-pixel-art` | ![像素艺术 浅色](skins/style-pixel-art/preview/light.png) | ![像素艺术 深色](skins/style-pixel-art/preview/dark.png) |
| **洛可可 Rococo**<br>`style-rococo` | ![洛可可 Rococo 浅色](skins/style-rococo/preview/light.png) | ![洛可可 Rococo 深色](skins/style-rococo/preview/dark.png) |
| **蒸汽朋克 Steampunk**<br>`style-steampunk` | ![蒸汽朋克 Steampunk 浅色](skins/style-steampunk/preview/light.png) | ![蒸汽朋克 Steampunk 深色](skins/style-steampunk/preview/dark.png) |
| **蒸汽波 Vaporwave**<br>`style-vaporwave` | ![蒸汽波 Vaporwave 浅色](skins/style-vaporwave/preview/light.png) | ![蒸汽波 Vaporwave 深色](skins/style-vaporwave/preview/dark.png) |
| **Y2K 千禧**<br>`style-y2k` | ![Y2K 千禧 浅色](skins/style-y2k/preview/light.png) | ![Y2K 千禧 深色](skins/style-y2k/preview/dark.png) |

</details>

<details open><summary><b>节日限定</b>（10 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **圣诞节**<br>`festival-christmas` | ![圣诞节 浅色](skins/festival-christmas/preview/light.png) | ![圣诞节 深色](skins/festival-christmas/preview/dark.png) |
| **端午**<br>`festival-dragonboat` | ![端午 浅色](skins/festival-dragonboat/preview/light.png) | ![端午 深色](skins/festival-dragonboat/preview/dark.png) |
| **万圣节**<br>`festival-halloween` | ![万圣节 浅色](skins/festival-halloween/preview/light.png) | ![万圣节 深色](skins/festival-halloween/preview/dark.png) |
| **元宵**<br>`festival-lantern` | ![元宵 浅色](skins/festival-lantern/preview/light.png) | ![元宵 深色](skins/festival-lantern/preview/dark.png) |
| **中秋**<br>`festival-midautumn` | ![中秋 浅色](skins/festival-midautumn/preview/light.png) | ![中秋 深色](skins/festival-midautumn/preview/dark.png) |
| **跨年夜**<br>`festival-newyear` | ![跨年夜 浅色](skins/festival-newyear/preview/light.png) | ![跨年夜 深色](skins/festival-newyear/preview/dark.png) |
| **七夕**<br>`festival-qixi` | ![七夕 浅色](skins/festival-qixi/preview/light.png) | ![七夕 深色](skins/festival-qixi/preview/dark.png) |
| **樱花季**<br>`festival-sakura` | ![樱花季 浅色](skins/festival-sakura/preview/light.png) | ![樱花季 深色](skins/festival-sakura/preview/dark.png) |
| **春节**<br>`festival-spring` | ![春节 浅色](skins/festival-spring/preview/light.png) | ![春节 深色](skins/festival-spring/preview/dark.png) |
| **情人节**<br>`festival-valentine` | ![情人节 浅色](skins/festival-valentine/preview/light.png) | ![情人节 深色](skins/festival-valentine/preview/dark.png) |

</details>

<details open><summary><b>系统复古</b>（10 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **Windows Vista Aero**<br>`os-aero` | ![Windows Vista Aero 浅色](skins/os-aero/preview/light.png) | ![Windows Vista Aero 深色](skins/os-aero/preview/dark.png) |
| **Windows XP Bliss**<br>`os-bliss` | ![Windows XP Bliss 浅色](skins/os-bliss/preview/light.png) | ![Windows XP Bliss 深色](skins/os-bliss/preview/dark.png) |
| **红白机 FC**<br>`os-fc` | ![红白机 FC 浅色](skins/os-fc/preview/light.png) | ![红白机 FC 深色](skins/os-fc/preview/dark.png) |
| **Game Boy**<br>`os-gameboy` | ![Game Boy 浅色](skins/os-gameboy/preview/light.png) | ![Game Boy 深色](skins/os-gameboy/preview/dark.png) |
| **iOS**<br>`os-ios` | ![iOS 浅色](skins/os-ios/preview/light.png) | ![iOS 深色](skins/os-ios/preview/dark.png) |
| **Windows XP Luna**<br>`os-luna` | ![Windows XP Luna 浅色](skins/os-luna/preview/light.png) | ![Windows XP Luna 深色](skins/os-luna/preview/dark.png) |
| **macOS Aqua**<br>`os-macos-aqua` | ![macOS Aqua 浅色](skins/os-macos-aqua/preview/light.png) | ![macOS Aqua 深色](skins/os-macos-aqua/preview/dark.png) |
| **MS-DOS**<br>`os-msdos` | ![MS-DOS 浅色](skins/os-msdos/preview/light.png) | ![MS-DOS 深色](skins/os-msdos/preview/dark.png) |
| **Windows 95**<br>`os-win95` | ![Windows 95 浅色](skins/os-win95/preview/light.png) | ![Windows 95 深色](skins/os-win95/preview/dark.png) |
| **Winamp**<br>`os-winamp` | ![Winamp 浅色](skins/os-winamp/preview/light.png) | ![Winamp 深色](skins/os-winamp/preview/dark.png) |

</details>

<details open><summary><b>彩蛋</b>（2 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **黑客帝国 Matrix**<br>`egg-matrix` | ![黑客帝国 Matrix 浅色](skins/egg-matrix/preview/light.png) | ![黑客帝国 Matrix 深色](skins/egg-matrix/preview/dark.png) |
| **吃豆人 Pac-Man**<br>`egg-pacman` | ![吃豆人 Pac-Man 浅色](skins/egg-pacman/preview/light.png) | ![吃豆人 Pac-Man 深色](skins/egg-pacman/preview/dark.png) |

</details>

<details open><summary><b>其他游戏</b>（10 个）</summary>

| 皮肤 | 浅色预览 | 深色预览 |
|---|---|---|
| **Among Us**<br>`game-amongus` | ![Among Us 浅色](skins/game-amongus/preview/light.png) | ![Among Us 深色](skins/game-amongus/preview/dark.png) |
| **集合啦动物森友会**<br>`game-animalcrossing` | ![集合啦动物森友会 浅色](skins/game-animalcrossing/preview/light.png) | ![集合啦动物森友会 深色](skins/game-animalcrossing/preview/dark.png) |
| **赛博朋克2077**<br>`game-cyberpunk2077` | ![赛博朋克2077 浅色](skins/game-cyberpunk2077/preview/light.png) | ![赛博朋克2077 深色](skins/game-cyberpunk2077/preview/dark.png) |
| **艾尔登法环**<br>`game-eldenring` | ![艾尔登法环 浅色](skins/game-eldenring/preview/light.png) | ![艾尔登法环 深色](skins/game-eldenring/preview/dark.png) |
| **空洞骑士**<br>`game-hollowknight` | ![空洞骑士 浅色](skins/game-hollowknight/preview/light.png) | ![空洞骑士 深色](skins/game-hollowknight/preview/dark.png) |
| **星之卡比**<br>`game-kirby` | ![星之卡比 浅色](skins/game-kirby/preview/light.png) | ![星之卡比 深色](skins/game-kirby/preview/dark.png) |
| **我的世界 · 苦力怕**<br>`game-minecraft` | ![我的世界 · 苦力怕 浅色](skins/game-minecraft/preview/light.png) | ![我的世界 · 苦力怕 深色](skins/game-minecraft/preview/dark.png) |
| **传送门**<br>`game-portal` | ![传送门 浅色](skins/game-portal/preview/light.png) | ![传送门 深色](skins/game-portal/preview/dark.png) |
| **星露谷物语**<br>`game-stardew` | ![星露谷物语 浅色](skins/game-stardew/preview/light.png) | ![星露谷物语 深色](skins/game-stardew/preview/dark.png) |
| **俄罗斯方块**<br>`game-tetris` | ![俄罗斯方块 浅色](skins/game-tetris/preview/light.png) | ![俄罗斯方块 深色](skins/game-tetris/preview/dark.png) |

</details>

## 目录结构

```
skins/<id>/
├── skin.json            # 皮肤元数据（名称/主色/bodyAttr/预览）
├── package.json         # DSH 插件包声明（dsh.bundle.patch）
├── cordis.patch.yml     # bundle patch（安装时插入 ui-skin-<id> 行）
├── tsdown.config.ts     # 构建配置（shared/tsdown.client.ts 预设）
├── src/
│   ├── index.ts         # host 入口（无操作）
│   └── client/
│       ├── index.ts     # apply(ctx)：body 属性 + favicon + 标题，dispose 全收回
│       └── <id>.module.css  # 令牌重映射 + 签名纹理/动效（昼夜双作用域）
├── tests/apply.spec.ts  # 契约测试
└── preview/             # 意境预览图（浅色/深色）
```

## 工具

- `python3 tools/convert.py` — 从 aionui-themes 批量重新生成全部皮肤包
- `python3 tools/validate_skin.py` — 结构校验（作用域/令牌/keyframes 闭环/文件完整性）
- `python3 tools/build_readme.py` — 重新生成本 README

## 致谢

- 皮肤契约与插件标准参考 [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)
- 经典配色系列色板来自各方案官方定义（Catppuccin / Dracula / Nord / Tokyo Night / Gruvbox / Solarized / Rosé Pine / Everforest / Atom / Monokai / Night Owl / Synthwave '84 / Kanagawa / Ayu / GitHub Primer / Material Theme / VS Code / JetBrains / Flexoki）
- 角色名称与形象版权归米哈游 / 任天堂 / 迪士尼 / 卡普空等各自厂商所有，本项目为粉丝向非商业作品

## 相关项目

- 🌐 [dsh-suite 目录网站](https://whyihaveyou.github.io/dsh-suite/) — 在线逛全部插件，带兼容徽章与搜索
- 📦 [dsh-suite 主仓](https://github.com/whyihaveyou/dsh-suite) — DSH 插件活目录 + 内置商店 + 脚手架
- 📖 [DSH 中文文档 · dsh-docs.com](https://dsh-docs.com) — 中文教程与文档，开箱即用无需翻墙
- 📕 [DSH 插件开发指南](https://github.com/whyihaveyou/dsh-plugin-tutorial) — 中英双语成书
- 🖥 [dsh-workstation](https://github.com/whyihaveyou/dsh-workstation) — 一体化工作台（🚧 开发中）

## License

Apache-2.0
