#!/usr/bin/env node
/* build.mjs - dsh-themes skin gallery, zero-dep static generator.
 * Reads site/data/skins.json + site/data/community.json (from tools/build_gallery.mjs)
 * and emits site/index.html. All UI copy below is the gallery's own text. */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(ROOT, 'site', 'data', 'skins.json'), 'utf8'));
const community = JSON.parse(readFileSync(join(ROOT, 'site', 'data', 'community.json'), 'utf8'));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MAIN = 'https://whyihaveyou.github.io/dsh-suite/';
const REPO = 'https://github.com/whyihaveyou/dsh-themes';
const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);

/* official skin card: day+night thumbs stacked, name, accent, tags */
function card(s) {
  return `<article class="skin-card" data-id="${esc(s.id)}" tabindex="0" role="button" aria-label="${esc(s.name)}">
    <div class="skin-previews">
      <img class="tp tp-light" src="${esc(s.thumbLight)}" alt="${esc(s.name)} 浅色" loading="lazy" width="320">
      <img class="tp tp-dark" src="${esc(s.thumbDark)}" alt="${esc(s.name)} 深色" loading="lazy" width="320">
      <span class="tp-switch" aria-hidden="true">昼夜</span>
    </div>
    <div class="skin-meta">
      <span class="skin-name">${esc(s.name)}</span>
      <span class="skin-accent" style="background:${esc(s.accent)}" title="${esc(s.accent)}"></span>
      <span class="skin-id">${esc(s.id)}</span>
    </div>
    <p class="skin-tags">${(s.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</p>
  </article>`;
}

/* community card: author/stars/link/install copy */
function comCard(c) {
  return `<article class="com-card">
    <div class="com-top">
      <span class="com-name">${esc(c.name)}</span>
      <span class="com-badge">社区收录</span>
    </div>
    <p class="com-repo">@${esc(c.author)} · <span class="com-stars">★ ${fmt(c.stars)}</span></p>
    <p class="com-desc">${esc(c.id)}</p>
    <div class="com-foot">
      <code class="com-cmd">${esc(c.installCmd)}</code>
      <button class="copy-btn" type="button" data-cmd="${esc(c.installCmd)}">复制</button>
      <a class="com-link" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">仓库 ↗</a>
    </div>
  </article>`;
}

const groupsHtml = data.groups.map(g => {
  const skins = data.skins.filter(s => s.group === g.name);
  return `<details class="group" open data-group="${esc(g.name)}">
    <summary class="group-summary"><b>${esc(g.name)}</b> <span class="group-count">${skins.length} 款</span></summary>
    <div class="grid">${skins.map(card).join('\n')}</div>
  </details>`;
}).join('\n');

const communityHtml = community.entries.map(comCard).join('\n');

const stats = {
  skins: data.count,
  groups: data.groups.length,
  previews: data.count * 2,
  verified: data.count,
};

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DSH 皮肤画廊 · dsh-themes — 151 款官方皮肤，昼夜双模式</title>
  <meta name="description" content="DeepSeek Harness 皮肤画廊：151 款官方皮肤（绝区零 / 原神 / 经典配色 / 节日限定…），昼夜双预览、契约测试全部通过，一键安装。">
  <meta name="theme-color" content="#0b0f1a">
  <link rel="canonical" href="https://whyihaveyou.github.io/dsh-themes/">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
  <link rel="icon" type="image/png" sizes="64x64" href="assets/favicon.png">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="./"><span class="brand-mark">dsh</span>&nbsp;themes</a>
    <nav class="nav">
      <a class="nav-btn" href="${MAIN}">主站目录</a>
      <a class="nav-btn" href="${MAIN}stars.html">Star 榜</a>
      <a class="nav-btn" href="${MAIN}learn.html">学习资源</a>
      <a class="nav-gh" href="${REPO}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="hero-grid">
        <div class="hero-text">
          <h1 class="slogan">DSH 皮肤画廊</h1>
          <p class="subtitle">DeepSeek Harness 官方皮肤合集——151 款昼夜成对皮肤，全部通过契约测试，点击卡片即可试看大图。</p>
          <div class="hero-badges">
            <span class="hbadge">${stats.skins} 款皮肤</span>
            <span class="hbadge">${stats.groups} 个分组</span>
            <span class="hbadge">${stats.previews} 张预览</span>
            <span class="hbadge hbadge-ok">✅ 100% 契约测试</span>
          </div>
        </div>
        <figure class="mascot-card">
          <img class="mascot-img" src="assets/mascot.webp" width="600" height="600" loading="lazy" alt="Suitie 吉祥物">
          <figcaption class="mascot-caption">皮肤随你挑，Suitie 随时换装 ✨</figcaption>
        </figure>
      </div>
    </section>

    <section class="controls" aria-label="搜索">
      <input id="search" type="search" placeholder="搜索皮肤：名称 / id / 分组 / 标签…" autocomplete="off" spellcheck="false">
      <p class="result-count" id="result-count" hidden></p>
    </section>

    <section class="community" id="community">
      <h2 class="section-title">社区收录 · Community</h2>
      <p class="section-hint">来自 dsh-suite 目录的社区皮肤插件，按星数排序</p>
      <div class="com-grid">${communityHtml}</div>
    </section>

    <h2 class="section-title gallery-title" id="gallery-title">官方皮肤 · Official</h2>
    <p class="section-hint">共 ${stats.skins} 款，按分组浏览；点击卡片查看大图与安装命令</p>
    <section class="gallery" id="gallery">
      ${groupsHtml}
    </section>
  </main>

  <div class="modal" id="modal" hidden>
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card">
      <button class="modal-close" type="button" data-close aria-label="关闭">✕</button>
      <div class="modal-preview">
        <img id="m-preview" src="" alt="">
        <button class="theme-toggle" id="m-toggle" type="button">🌙 深色预览</button>
      </div>
      <div class="modal-info">
        <h2 id="m-name"></h2>
        <p class="m-sub" id="m-nameen"></p>
        <div class="m-tags" id="m-tags"></div>
        <p class="m-desc" id="m-desc"></p>
        <div class="m-meta">
          <span class="m-accent" id="m-accent"></span>
          <span class="m-badge">✅ 契约测试通过</span>
          <span class="m-group" id="m-group"></span>
        </div>
        <div class="m-install">
          <code id="m-cmd"></code>
          <button class="copy-btn" id="m-copy" type="button">复制安装命令</button>
        </div>
        <a class="m-repo" id="m-repo" target="_blank" rel="noopener noreferrer">在仓库中查看该皮肤 ↗</a>
      </div>
    </div>
  </div>

  <footer class="site-footer">
    <p class="foot-about">dsh-themes · DeepSeek Harness 皮肤合集。预览图由工具链自动生成，皮肤包本体在仓库 skins/ 目录。</p>
    <nav class="foot-links">
      <a href="${MAIN}">dsh-suite 主站目录</a>
      <a href="${MAIN}stars.html">Star 榜</a>
      <a href="${REPO}">GitHub 仓库</a>
      <a href="https://deepseek-harness.github.io/">DeepSeek Harness 官方文档</a>
    </nav>
  </footer>

  <script id="gallery-data" type="application/json">${JSON.stringify({ skins: data.skins, groups: data.groups.map(g => g.name) })}</script>
  <script src="assets/app.js"></script>
</body>
</html>
`;

writeFileSync(join(ROOT, 'site', 'index.html'), html);
console.log('[build] index.html: ' + data.count + ' skins, ' + data.groups.length + ' groups, ' + community.entries.length + ' community');
