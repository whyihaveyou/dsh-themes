/**
 * 崩坏星穹铁道 · 三月七 — DSH skin, ported from aionui-themes. The plugin owns only what it
 * can retract: the body attribute the stylesheet scopes on, the favicon, and
 * the document title. Styles ride the bundle CSS-modules auto-inject. No
 * services, no events, no model traffic — presentation only.
 */
import type { Context } from '@deepseek-ai/cordis'
import css from './hsr-march7.module.css'

const SKIN_TITLE = '崩坏星穹铁道 · 三月七'

/** Per-theme two-tone favicon (primary + hover), inline so the skin carries no assets. */
const FAVICON_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"16\" r=\"13\" fill=\"#d0448c\"/><circle cx=\"16\" cy=\"16\" r=\"13\" fill=\"none\" stroke=\"#b8377a\" stroke-width=\"3\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"#b8377a\" opacity=\"0.55\"/></svg>"

export function apply(ctx: Context): void {
  const body = document.body
  const originalTitle = document.title
  body.dataset.dshHsrMarch7 = ''

  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.href = `data:image/svg+xml;utf8,${encodeURIComponent(FAVICON_SVG)}`
  document.head.append(favicon)
  document.title = SKIN_TITLE

  void css // the class map is unused by chrome-less skins; import keeps the css auto-inject alive

  ctx.effect(() => () => {
    delete body.dataset.dshHsrMarch7
    favicon.remove()
    if (document.title === SKIN_TITLE) document.title = originalTitle
  }, 'ui-skin-hsr-march7: 崩坏星穹铁道 · 三月七 skin')
}
