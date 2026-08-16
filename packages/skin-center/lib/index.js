// skin-center host half — serves the aggregated skin manifest, CSS, and
// thumbnails to the browser half. All payloads are generated assets
// (scripts/generate.mjs scans ../../skins/); nothing is read from skins/ here.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'
import { gzipSync } from 'node:zlib'

export const name = 'skin-center'
export const inject = ['webServer']

const HERE = dirname(fileURLToPath(import.meta.url))
const ASSETS = join(HERE, '..', 'assets')

const manifest = JSON.parse(readFileSync(join(ASSETS, 'manifest.json'), 'utf8'))
const manifestBuf = Buffer.from(JSON.stringify(manifest), 'utf8')
const manifestGz = gzipSync(manifestBuf)
const cssBuf = readFileSync(join(ASSETS, 'skins.css'))
const cssGz = gzipSync(cssBuf)

const MIME = {
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webp': 'image/webp',
}

export function apply(ctx) {
  ctx.effect(() => {
    // gzip-negotiated JSON/CSS payloads
    const payload = (buf, gz, mime) => (req, res) => {
      const ae = String(req.headers['accept-encoding'] || '')
      const useGz = gz && /\bgzip\b/.test(ae)
      res.writeHead(200, {
        'content-type': mime,
        ...(useGz ? { 'content-encoding': 'gzip' } : {}),
        'content-length': useGz ? gz.length : buf.length,
        'cache-control': 'no-store',
      })
      res.end(useGz ? gz : buf)
    }

    const dManifest = ctx.webServer.register({
      kind: 'exact',
      path: '/skin-center/manifest',
      handler: payload(manifestBuf, manifestGz, MIME['.json']),
    })

    const dCss = ctx.webServer.register({
      kind: 'exact',
      path: '/skin-center/css',
      handler: payload(cssBuf, cssGz, MIME['.css']),
    })

    const serveDir = (sub) => (req, res) => {
      const pathname = new URL(req.url ?? '/', 'http://x').pathname
      const file = pathname.slice(`/skin-center/${sub}/`.length)
      if (!file || file.includes('..') || file.includes('/')) {
        res.writeHead(404, { 'content-type': 'text/plain' })
        res.end('not found')
        return
      }
      try {
        const buf = readFileSync(join(ASSETS, sub, file))
        const ext = extname(file).toLowerCase()
        res.writeHead(200, {
          'content-type': MIME[ext] || 'application/octet-stream',
          'content-length': buf.length,
          'cache-control': 'public, max-age=86400',
        })
        res.end(buf)
      } catch {
        res.writeHead(404, { 'content-type': 'text/plain' })
        res.end('not found')
      }
    }

    const dThumbs = ctx.webServer.register({ kind: 'prefix', path: '/skin-center/thumbs', handler: serveDir('thumbs') })
    const dPreviews = ctx.webServer.register({ kind: 'prefix', path: '/skin-center/previews', handler: serveDir('previews') })

    return () => { dManifest(); dCss(); dThumbs(); dPreviews() }
  }, 'skin-center: routes')
}
