#!/usr/bin/env node
/**
 * skin-center manifest/CSS/thumbnail generator.
 *
 * Scans ../../skins/ (read-only — never writes into skins/) and produces
 * packages/skin-center/assets/:
 *   manifest.json  — one entry per skin (id/name/nameEn/group/accent/bodyAttr/…)
 *   skins.css      — concatenated `body[data-dsh-<id>]` CSS from every skin
 *   thumbs/        — compressed previews (320×200 WebP): <id>.light.webp / .dark.webp
 *
 * Run from packages/skin-center/:  node scripts/generate.mjs
 * Thumbnails delegate to scripts/thumbs.py (system python3 + Pillow).
 *
 * Volume: 302 full-size previews are ~67 MB (1280×800 PNG) — too heavy for an
 * npm package. 320×200 WebP q72 ≈ 2 KB each ≈ 0.6 MB total.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const SKINS = resolve(PKG, '..', '..', 'skins')
const ASSETS = join(PKG, 'assets')
const THUMBS = join(ASSETS, 'thumbs')

mkdirSync(THUMBS, { recursive: true })

/** Parse `const css = "…"` out of a skin's compiled lib/client.js. */
function extractCss(clientJsPath) {
  const src = readFileSync(clientJsPath, 'utf8')
  const m = src.match(/const css = ("(?:[^"\\]|\\.)*")/)
  if (!m) return null
  try { return JSON.parse(m[1]) } catch { return null }
}

const skins = []
const cssParts = []
const jobs = []

for (const dir of readdirSync(SKINS).sort()) {
  const skinDir = join(SKINS, dir)
  if (!existsSync(join(skinDir, 'skin.json'))) continue
  let meta
  try { meta = JSON.parse(readFileSync(join(skinDir, 'skin.json'), 'utf8')) } catch { continue }

  const tags = meta.tags || []
  const group = tags[0] === '游戏' && tags.length > 1 ? tags[1] : (tags[0] || '其他')
  const css = extractCss(join(skinDir, 'lib', 'client.js'))
  if (css) cssParts.push(css)

  const id = meta.id || dir
  jobs.push({
    id,
    light: join(skinDir, 'preview', 'light.png'),
    dark: join(skinDir, 'preview', 'dark.png'),
  })

  skins.push({
    id,
    name: meta.name || id,
    nameEn: meta.nameEn || id,
    group,
    collection: tags[0] || '',
    tags,
    accent: meta.accent || '',
    bodyAttr: meta.bodyAttr || `data-dsh-${id}`,
    author: meta.author || '',
    tagline: meta.tagline || '',
    order: meta.order ?? 0,
    thumb: { light: `thumbs/${id}.light.webp`, dark: `thumbs/${id}.dark.webp` },
  })
}

const manifest = { generatedAt: new Date().toISOString(), count: skins.length, skins }
writeFileSync(join(ASSETS, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')
writeFileSync(join(ASSETS, 'skins.css'), cssParts.join('\n'), 'utf8')

writeFileSync('/tmp/skin-center-jobs.json', JSON.stringify(jobs), 'utf8')
execFileSync('python3', [join(HERE, 'thumbs.py'), '/tmp/skin-center-jobs.json', THUMBS], { stdio: 'inherit' })

let thumbBytes = 0
for (const f of readdirSync(THUMBS)) thumbBytes += statSync(join(THUMBS, f)).size
const cssBytes = statSync(join(ASSETS, 'skins.css')).size
const manBytes = statSync(join(ASSETS, 'manifest.json')).size
console.log(`\n=== skin-center assets generated ===`)
console.log(`skins: ${skins.length} (css extracted: ${cssParts.length})`)
console.log(`manifest.json: ${(manBytes / 1024).toFixed(1)} KB`)
console.log(`skins.css:     ${(cssBytes / 1024).toFixed(1)} KB`)
console.log(`thumbs:        ${thumbBytes / 1024 / 1024} MB total (${jobs.length * 2} files, avg ${(thumbBytes / (jobs.length * 2)).toFixed(1)} KB each)`)
console.log(`assets total:  ${((manBytes + cssBytes + thumbBytes) / 1024 / 1024).toFixed(2)} MB (vs ~67 MB raw previews)`)

// pipeline "fail loudly if most skins lost their CSS"
if (cssParts.length < skins.length) {
  console.warn(`WARN: css extracted for ${cssParts.length}/${skins.length} skins — check lib/client.js format`)
  process.exitCode = 1
}
