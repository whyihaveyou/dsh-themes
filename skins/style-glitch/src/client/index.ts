/**
 * 故障艺术 Glitch — DSH skin, ported from aionui-themes. The plugin owns only what it
 * can retract: the body attribute the stylesheet scopes on, the favicon, and
 * the document title. Styles ride the bundle CSS-modules auto-inject. No
 * services, no events, no model traffic — presentation only.
 */
import type { Context } from '@deepseek-ai/cordis'
import css from './style-glitch.module.css'

const SKIN_TITLE = '故障艺术 Glitch'

/** Per-theme two-tone favicon (primary + hover), inline so the skin carries no assets. */
const FAVICON_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"13\" fill=\"#c4005a\"/><circle cx=\"16\" cy=\"16\" r=\"13\" fill=\"none\" stroke=\"#d9337b\" stroke-width=\"3\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"#d9337b\" opacity=\"0.55\"/></svg>"

export function apply(ctx: Context): void {
  const body = document.body
  const originalTitle = document.title
  body.dataset.dshStyleGlitch = ''

  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.href = `data:image/svg+xml;utf8,${encodeURIComponent(FAVICON_SVG)}`
  document.head.append(favicon)
  document.title = SKIN_TITLE

  void css // the class map is unused by chrome-less skins; import keeps the css auto-inject alive

  ctx.effect(() => () => {
    delete body.dataset.dshStyleGlitch
    favicon.remove()
    if (document.title === SKIN_TITLE) document.title = originalTitle
  }, 'ui-skin-style-glitch: 故障艺术 Glitch skin')
}
