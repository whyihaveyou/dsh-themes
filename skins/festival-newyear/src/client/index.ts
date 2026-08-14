/**
 * 跨年夜 — DSH skin, ported from aionui-themes. The plugin owns only what it
 * can retract: the body attribute the stylesheet scopes on, the favicon, and
 * the document title. Styles ride the bundle CSS-modules auto-inject. No
 * services, no events, no model traffic — presentation only.
 */
import type { Context } from '@deepseek-ai/cordis'
import css from './festival-newyear.module.css'

const SKIN_TITLE = '跨年夜'

/** Per-theme two-tone favicon (primary + hover), inline so the skin carries no assets. */
const FAVICON_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"13\" fill=\"#a87b1f\"/><circle cx=\"16\" cy=\"16\" r=\"13\" fill=\"none\" stroke=\"#c19036\" stroke-width=\"3\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"#c19036\" opacity=\"0.55\"/></svg>"

export function apply(ctx: Context): void {
  const body = document.body
  const originalTitle = document.title
  body.dataset.dshFestivalNewyear = ''

  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.href = `data:image/svg+xml;utf8,${encodeURIComponent(FAVICON_SVG)}`
  document.head.append(favicon)
  document.title = SKIN_TITLE

  void css // the class map is unused by chrome-less skins; import keeps the css auto-inject alive

  ctx.effect(() => () => {
    delete body.dataset.dshFestivalNewyear
    favicon.remove()
    if (document.title === SKIN_TITLE) document.title = originalTitle
  }, 'ui-skin-festival-newyear: 跨年夜 skin')
}
