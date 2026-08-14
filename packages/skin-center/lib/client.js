// skin-center browser half — the "皮肤中心 / Skin Center" settings section.
// Registers into the official `settings.section` list slot (nav + content page,
// same seam General / Models / Plugins use). Manifest + CSS + thumbnails come
// from the host half routes (/skin-center/*) — the client bundle itself stays small.
window.__ModuleLoader__.load({
  id: '@dsh-suite/themes',
  factory: (require) => {
    const React = require('react')
    const { useState, useEffect, useRef } = React
    const h = React.createElement

    const NS = 'skinCenter'
    const zh = {
      nav: '皮肤中心', search: '搜索皮肤…', all: '全部分组',
      day: '昼', night: '夜', current: '当前', clearSkin: '清除皮肤',
      loading: '加载中…', count: '款皮肤', filterCount: '匹配',
      hint: '点击卡片试穿，再次点击其他卡片切换', cssLoadFail: '皮肤样式加载失败',
    }
    const en = {
      nav: 'Skin Center', search: 'Search skins…', all: 'All groups',
      day: 'Day', night: 'Night', current: 'Applied', clearSkin: 'Reset skin',
      loading: 'Loading…', count: 'skins', filterCount: 'matches',
      hint: 'Click a card to try on; click another to switch', cssLoadFail: 'Failed to load skin styles',
    }

    // ---- styles (dark UI, GitHub-ish) ----
    const S = {
      bar: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' },
      input: { flex: '1 1 220px', minWidth: '180px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', padding: '7px 12px', fontSize: '13px' },
      select: { background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', padding: '7px 10px', fontSize: '13px' },
      btn: { background: 'transparent', border: '1px solid #30363d', borderRadius: '6px', color: '#8b949e', padding: '7px 12px', fontSize: '13px', cursor: 'pointer' },
      btnActive: { background: '#21262d', border: '1px solid #8b949e', borderRadius: '6px', color: '#e6edf3', padding: '7px 12px', fontSize: '13px', cursor: 'pointer' },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '12px' },
      status: { fontSize: '11px', color: '#8b949e', marginBottom: '10px' },
    }

    // Lazy thumbnail: IntersectionObserver gates the fetch; failed images hide.
    function Thumb(props) {
      const ref = useRef(null)
      const [show, setShow] = useState(false)
      const [failed, setFailed] = useState(false)
      useEffect(() => {
        const el = ref.current
        if (!el) return
        if ('IntersectionObserver' in window) {
          const io = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { setShow(true); io.disconnect() }
          }, { rootMargin: '300px' })
          io.observe(el)
          return () => io.disconnect()
        }
        setShow(true)
      }, [])
      if (failed) return null
      // ref lives on the container; the <img> is only created once show=true —
      // an early empty-src <img> fires onError immediately and self-hides.
      return h('div', {
        ref,
        style: { width: '100%', aspectRatio: '16/10', borderRadius: '6px', background: '#0d1117', border: '1px solid #21262d', overflow: 'hidden' },
      },
        show
          ? h('img', {
              src: props.src,
              loading: 'lazy',
              alt: props.alt || '',
              onError: () => setFailed(true),
              style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
            })
          : null,
      )
    }

    /** Remove every previously-applied skin attribute from <body>. */
    function clearSkins() {
      for (const a of [...document.body.attributes]) {
        if (a.name.startsWith('data-dsh-')) document.body.removeAttribute(a.name)
      }
    }

    function Panel(props) {
      const t = props.t
      const [skins, setSkins] = useState([])
      const [loading, setLoading] = useState(true)
      const [search, setSearch] = useState('')
      const [dark, setDark] = useState(false)
      const [group, setGroup] = useState('all')
      const [applied, setApplied] = useState(null)
      const cssRef = useRef(null)

      useEffect(() => {
        let alive = true
        fetch('/skin-center/manifest')
          .then((r) => r.json())
          .then((m) => { if (alive) { setSkins(m.skins || []); setLoading(false) } })
          .catch(() => { if (alive) setLoading(false) })
        return () => { alive = false }
      }, [])

      // detect an already-applied skin on mount
      useEffect(() => {
        const attr = [...document.body.attributes].find((a) => a.name.startsWith('data-dsh-'))
        if (attr) setApplied(attr.name)
      }, [])

      async function applySkin(skin) {
        try {
          if (!cssRef.current) {
            const css = await fetch('/skin-center/css').then((r) => r.text())
            const style = document.createElement('style')
            style.id = 'skin-center-css'
            style.textContent = css
            document.head.appendChild(style)
            cssRef.current = style
          }
          clearSkins()
          document.body.setAttribute(skin.bodyAttr, '')
          setApplied(skin.bodyAttr)
        } catch { /* keep UI alive */ }
      }

      function clearSkin() { clearSkins(); setApplied(null) }

      const q = search.trim().toLowerCase()
      const filtered = q
        ? skins.filter((s) => (s.name + ' ' + s.nameEn + ' ' + s.group + ' ' + (s.tags || []).join(' ')).toLowerCase().includes(q))
        : skins
      const groups = [...new Set(skins.map((s) => s.group))].sort((a, b) => a.localeCompare(b, 'zh'))
      const shown = group === 'all' ? filtered : filtered.filter((s) => s.group === group)

      return h('div', { style: { maxWidth: '980px' } },
        h('div', { style: S.bar },
          h('input', { style: S.input, placeholder: t('search'), value: search, onChange: (e) => setSearch(e.target.value) }),
          h('select', { style: S.select, value: group, onChange: (e) => setGroup(e.target.value) },
            h('option', { value: 'all' }, t('all')),
            groups.map((g) => h('option', { key: g, value: g }, g))),
          h('button', { style: dark ? S.btnActive : S.btn, onClick: () => setDark(!dark) }, (dark ? '🌙 ' : '☀️ ') + (dark ? t('night') : t('day'))),
          applied ? h('button', { style: S.btn, onClick: clearSkin }, '✖ ' + t('clearSkin')) : null,
        ),
        h('div', { style: S.status },
          skins.length + ' ' + t('count') + (q ? ' · ' + t('filterCount') + ': ' + filtered.length + ' · ' + group : '') + ' · ' + t('hint')),
        loading ? h('div', { style: { color: '#8b949e', fontSize: '13px' } }, t('loading')) : null,
        h('div', { style: S.grid },
          shown.map((s) => {
            const active = applied === s.bodyAttr
            return h('div', {
              key: s.id,
              onClick: () => applySkin(s),
              title: s.name + ' (' + s.nameEn + ')',
              style: {
                background: active ? 'rgba(63,185,80,0.08)' : '#161b22',
                border: active ? '1px solid ' + (s.accent || '#3fb950') : '1px solid #30363d',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                transition: 'border-color .15s',
              },
            },
              h(Thumb, { src: '/skin-center/' + (dark ? s.thumb.dark : s.thumb.light), alt: s.name }),
              h('div', { style: { fontSize: '12px', color: active ? (s.accent || '#3fb950') : '#e6edf3', fontWeight: active ? '700' : '500', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } },
                s.name + (active ? ' ✓' : '')),
              h('div', { style: { fontSize: '10px', color: '#8b949e', marginTop: '2px' } }, s.group),
            )
          })),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        try {
          ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'skin-center: dicts')
          const t = ctx.locale.bind(NS)
          ctx.slots.inject('settings.section', () => ctx.slots.register({
            name: 'settings.section',
            id: 'skin-center',
            order: 60,
            label: () => t('nav'),
            locale: NS,
          }, Panel))
        } catch (e) {
          console.error('[skin-center] apply failed:', e)
        }
      },
    }
  },
})
