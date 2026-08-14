#!/usr/bin/env node
/*
 * build_gallery.mjs - gallery manifest generator (zero-dep, node only).
 * Reads skins/<id>/skin.json metadata, README.md group blocks, and the
 * dsh-suite catalog (community skins) and emits:
 *   site/data/skins.json       (151 official skins, grouped, README order)
 *   site/data/community.json   (top community skin plugins by stars)
 * Usage: node tools/build_gallery.mjs [dshSuitePluginsJson, default ../dsh-suite/data/plugins.json]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'site', 'data');
const dshSuiteData = process.argv[2] || join(ROOT, '..', 'dsh-suite', 'data', 'plugins.json');

// 1) skin metadata
const skinsById = {};
for (const d of readdirSync(join(ROOT, 'skins'))) {
  const sp = join(ROOT, 'skins', d, 'skin.json');
  if (!existsSync(sp)) continue;
  skinsById[d] = JSON.parse(readFileSync(sp, 'utf8'));
}

// 2) README groups: <details><summary><b>GROUP</b>（N 个）</summary>...<br>`id`...
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const groups = {};
const groupOrder = [];
const re = /<details[^>]*><summary><b>(.*?)<\/b>（(\d+) 个）<\/summary>([\s\S]*?)<\/details>/g;
let m;
while ((m = re.exec(readme)) !== null) {
  const name = m[1].trim();
  const ids = [...m[3].matchAll(/<br>`([\w-]+)`/g)].map(x => x[1]);
  groups[name] = ids;
  groupOrder.push(name);
}

// 2b) editor picks: classic / durable skins shown in the featured row (curated)
const featuredIds = [
  'catppuccin', 'everforest', 'dracula', 'darcula',        // 经典配色
  'style-art-deco', 'style-dunhuang', 'style-steampunk',   // 美学风格
  'mario',                                                  // 最出圈的游戏皮
];

// 2c) group order: generic groups first, then game-IP groups in README order
const genericFirst = ['经典配色', '美学风格', '节日限定', '系统复古', '彩蛋'];
const rankedGroups = [
  ...genericFirst.filter(g => groups[g]),
  ...groupOrder.filter(g => !genericFirst.includes(g)),
];

// 3) community skins: ui category + skin/theme nature (regex or curated whale/qq family)
const curatedExtra = ['dsh-deep-whale', 'dsh-ui-whale', 'dsh-qq2006', 'harness-whale'];
let community = [];
if (existsSync(dshSuiteData)) {
  const data = JSON.parse(readFileSync(dshSuiteData, 'utf8'));
  const pat = /skin|theme/i;
  community = (data.plugins || [])
    .filter(p => p.category === 'ui')
    .filter(p => {
      const hay = String(p.id || '') + ' ' + String(p.repo || '') + ' ' + String(p.name || '');
      return pat.test(hay) || curatedExtra.includes(p.id);
    })
    .map(p => ({
      id: p.id, name: p.name || p.id, repo: p.repo,
      author: p.author || String(p.repo || '').split('/')[0] || '',
      stars: p.stars || 0,
      url: p.url || (p.repo ? `https://github.com/${p.repo}` : ''),
      installCmd: p.npm ? `dsh plugin add ${p.npm}` : `dsh plugin add git+https://github.com/${p.repo}`,
    }))
    .sort((a, b) => (b.stars - a.stars) || (a.id < b.id ? -1 : 1))
    .slice(0, 12);
}

// 4) assemble skins.json in ranked group order
const skins = rankedGroups.flatMap(g => groups[g].map(id => {
  const s = skinsById[id] || {};
  return {
    id, name: s.name, nameEn: s.nameEn || '', author: s.author || '', tagline: s.tagline || '',
    description: s.description || '', tags: s.tags || [], accent: s.accent || '#4d6bfe', group: g,
    order: s.order || 0, package: s.package || '',
    previewLight: `skins/${id}/preview/light.png`, previewDark: `skins/${id}/preview/dark.png`,
    thumbLight: `assets/thumbs/${id}-l.jpg`, thumbDark: `assets/thumbs/${id}-d.jpg`,
    installCmd: `dsh plugin --profile <profile> add ./dsh-themes/skins/${id}`,
  };
}));
const accounted = new Set(skins.map(s => s.id));
const missing = Object.keys(skinsById).filter(id => !accounted.has(id));
if (missing.length) console.warn('[manifest] unmatched skins: ' + missing.join(','));

const now = new Date().toISOString().slice(0, 10);
writeFileSync(join(OUT, 'skins.json'), JSON.stringify({
  generated: now, count: skins.length,
  groups: rankedGroups.map(g => ({ name: g, count: groups[g].length })),
  featured: featuredIds.filter(id => skinsById[id]),
  skins,
}, null, 1));
writeFileSync(join(OUT, 'community.json'), JSON.stringify({
  generated: now, count: community.length, entries: community,
}, null, 1));
console.log('[manifest] skins.json: ' + skins.length + ' skins / ' + rankedGroups.length + ' groups / featured ' + featuredIds.length);
console.log('[manifest] community.json: ' + community.length + ' entries from ' + dshSuiteData);
