/**
 * 孟菲斯 Memphis — DSH skin, ported from aionui-themes. The plugin owns only what it
 * can retract: the body attribute the stylesheet scopes on, the favicon, and
 * the document title. Styles ride the bundle CSS-modules auto-inject. No
 * services, no events, no model traffic — presentation only.
 */
import type { Context } from '@deepseek-ai/cordis'
import css from './style-memphis.module.css'

const SKIN_TITLE = '孟菲斯 Memphis'

/** Per-theme two-tone favicon (primary + hover), inline so the skin carries no assets. */
const FAVICON_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"13\" fill=\"#e6007e\"/><circle cx=\"16\" cy=\"16\" r=\"13\" fill=\"none\" stroke=\"#f0339b\" stroke-width=\"3\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"#f0339b\" opacity=\"0.55\"/></svg>"

export function apply(ctx: Context): void {
  const body = document.body
  const originalTitle = document.title
  body.dataset.dshStyleMemphis = ''

  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.href = `data:image/svg+xml;utf8,${encodeURIComponent(FAVICON_SVG)}`
  document.head.append(favicon)
  document.title = SKIN_TITLE

  void css // the class map is unused by chrome-less skins; import keeps the css auto-inject alive

  ctx.effect(() => () => {
    delete body.dataset.dshStyleMemphis
    favicon.remove()
    if (document.title === SKIN_TITLE) document.title = originalTitle
  }, 'ui-skin-style-memphis: 孟菲斯 Memphis skin')
}
