// 为 DSH 皮肤包生成预览图：直接用转换后的 <id>.module.css（body[data-dsh-<id>] 作用域），
// mock 界面 brand 为 DeepSeek Harness。输出 skins/<id>/preview/{light,dark}.png
// 用法: node tools/shoot_previews.js [skin-id ...]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const SKINS = path.join(ROOT, 'skins');
const AIONUI_MOCK = path.join(process.env.HOME, 'aionui-themes/tools/screenshot/mock.html');

const STABILIZE_CSS = `
  * { animation-duration: 0s !important; animation-delay: 0s !important; transition: none !important; }
`;

// mock 里的 AionUi 组件类（.layout-sider/.app-titlebar 等）在 DSH 皮肤里没有被单独覆写，
// 它们吃 mock 基础样式里的 var(--bg-1)/var(--text-primary) 等变量——这些变量在皮肤的
// 作用域 source palette 里有定义，所以把作用域属性加到 body 上即可让整套配色生效。
function buildHtml(css, attr, dark) {
  let html = fs.readFileSync(AIONUI_MOCK, 'utf8');
  html = html
    .replace(/<html data-theme="[^"]*">/, `<html data-theme="${dark ? 'dark' : 'light'}">`)
    .replace('<title>AionUi Theme Preview</title>', '<title>DSH Skin Preview</title>')
    .replaceAll('AionUi', 'DeepSeek Harness')
    .replace('<body>', `<body ${attr}${dark ? ' data-ds-dark-theme' : ''}>`)
    .replace('<!--THEME_STYLE-->', `<style id="theme">\n${css}\n</style><style>${STABILIZE_CSS}</style>`);
  return html;
}

async function main() {
  const only = process.argv.slice(2);
  const ids = fs.readdirSync(SKINS).filter((d) => {
    if (only.length && !only.includes(d)) return false;
    return fs.existsSync(path.join(SKINS, d, 'src', 'client', `${d}.module.css`));
  }).sort();

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.emulateMedia({ reducedMotion: 'reduce' });

  const results = [];
  for (const id of ids) {
    try {
      const css = fs.readFileSync(path.join(SKINS, id, 'src', 'client', `${id}.module.css`), 'utf8');
      const attr = `data-dsh-${id}`;
      const outDir = path.join(SKINS, id, 'preview');
      fs.mkdirSync(outDir, { recursive: true });
      for (const dark of [false, true]) {
        await page.setContent(buildHtml(css, attr, dark), { waitUntil: 'load' });
        await page.focus('.guidInputCard textarea');
        await page.waitForTimeout(120);
        const out = path.join(outDir, dark ? 'dark.png' : 'light.png');
        await page.screenshot({ path: out });
        results.push({ id, dark, size: fs.statSync(out).size });
      }
      console.log(`OK ${id}`);
    } catch (e) {
      results.push({ id, error: String(e) });
      console.log(`ERR ${id}  ${e.message}`);
    }
  }

  await browser.close();
  const bad = results.filter((r) => r.error || (r.size ?? 0) < 5 * 1024);
  console.log(`\ntotal=${ids.length} skins, shots=${results.length}, suspicious=${bad.length}`);
  if (bad.length) console.log('suspicious:', bad.map((b) => b.id).join(', '));
  process.exit(bad.length ? 1 : 0);
}

main();
