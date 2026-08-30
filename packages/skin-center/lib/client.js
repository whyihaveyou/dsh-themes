// skin-center browser half — the "皮肤中心 / Skin Center" settings section.
// Registers into the official `settings.section` list slot (nav + content page,
// same seam General / Models / Plugins use). Manifest + CSS + thumbnails come
// from the host half routes (/skin-center/*) — the client bundle itself stays small.
// v3: day/night 3-state (light / dark / follow system) + skin detail card.
window.__ModuleLoader__.load({
  id: '@dsh-suite/themes',
  factory: (require) => {
    const React = require('react')
    const { useState, useEffect, useRef } = React
    const h = React.createElement

    const NS = 'dshThemes'   // unique locale NS: the web-ui-all bundle ships its own skinCenter dict
    const zh = {
      nav: '皮肤中心', search: '搜索皮肤…', all: '全部分组',
      day: '昼', night: '夜', system: '跟随系统', current: '当前', clearSkin: '清除皮肤',
      loading: '加载中…', count: '款皮肤', filterCount: '匹配',
      hint: '点击卡片试穿并查看详情，再次点击其他卡片切换',
      cssLoadFail: '皮肤样式加载失败',
      random: '随机试穿', favOnly: '只看收藏', recent: '最近试穿',
      fav: '收藏', unfav: '取消收藏',
      author: '作者', tags: '标签', tokens: '令牌数', group: '分组', detail: '皮肤详情',
    }
    const en = {
      nav: 'Skin Center', search: 'Search skins…', all: 'All groups',
      day: 'Day', night: 'Night', system: 'System', current: 'Applied', clearSkin: 'Reset skin',
      loading: 'Loading…', count: 'skins', filterCount: 'matches',
      hint: 'Click a card to try on & view details; click another to switch',
      cssLoadFail: 'Failed to load skin styles',
      random: 'Random skin', favOnly: 'Favorites only', recent: 'Recently tried',
      fav: 'Favorite', unfav: 'Unfavorite',
      author: 'Author', tags: 'Tags', tokens: 'Tokens', group: 'Group', detail: 'Skin details',
    }

    const FAVS_KEY = 'skinCenter:favs'
    const RECENT_KEY = 'skinCenter:recent'
    const MODE_KEY = 'skinCenter:mode'
    const RECENT_MAX = 8

    // ---- styles (dark UI, GitHub-ish) ----
    const S = {
      bar: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' },
      input: { flex: '1 1 220px', minWidth: '180px', background: 'var(--dsw-alias-bg-layer-2)', border: '1px solid var(--dsw-alias-border-l1)', borderRadius: '6px', color: 'var(--dsw-alias-label-primary)', padding: '7px 12px', fontSize: '13px' },
      select: { background: 'var(--dsw-alias-bg-layer-2)', border: '1px solid var(--dsw-alias-border-l1)', borderRadius: '6px', color: 'var(--dsw-alias-label-primary)', padding: '7px 10px', fontSize: '13px' },
      btn: { background: 'transparent', border: '1px solid var(--dsw-alias-border-l1)', borderRadius: '6px', color: 'var(--dsw-alias-label-secondary)', padding: '7px 12px', fontSize: '13px', cursor: 'pointer' },
      btnActive: { background: 'var(--dsw-alias-bg-layer-3)', border: '1px solid var(--dsw-alias-label-secondary)', borderRadius: '6px', color: 'var(--dsw-alias-label-primary)', padding: '7px 12px', fontSize: '13px', cursor: 'pointer' },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '12px' },
      status: { fontSize: '11px', color: 'var(--dsw-alias-label-secondary)', marginBottom: '10px' },
    }

    function loadJSON(key, fallback) {
      try {
        const raw = localStorage.getItem(key)
        return raw === null ? fallback : JSON.parse(raw)
      } catch { return fallback }
    }
    function saveJSON(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota/private mode */ }
    }
    function loadMode() {
      try {
        const v = localStorage.getItem(MODE_KEY)
        return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
      } catch { return 'system' }
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
      return h('div', {
        ref,
        style: { width: '100%', aspectRatio: '16/10', borderRadius: '6px', background: 'var(--dsw-alias-bg-layer-2)', border: '1px solid var(--dsw-alias-bg-layer-3)', overflow: 'hidden' },
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
      const [mode, setMode] = useState(loadMode)
      const [sysDark, setSysDark] = useState(() => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) || false)
      const [group, setGroup] = useState('all')
      const [favOnly, setFavOnly] = useState(false)
      const [favs, setFavs] = useState(() => new Set(loadJSON(FAVS_KEY, [])))
      const [recent, setRecent] = useState(() => loadJSON(RECENT_KEY, []))
      const [applied, setApplied] = useState(null)
      const [selected, setSelected] = useState(null)
      const cssRef = useRef(null)
      const byId = {}
      skins.forEach((s) => { byId[s.id] = s })

      const dark = mode === 'system' ? sysDark : mode === 'dark'

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

      // follow-system: listen to prefers-color-scheme
      useEffect(() => {
        if (!window.matchMedia) return
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = (e) => setSysDark(e.matches)
        if (mq.addEventListener) mq.addEventListener('change', onChange)
        else if (mq.addListener) mq.addListener(onChange)
        return () => {
          if (mq.removeEventListener) mq.removeEventListener('change', onChange)
          else if (mq.removeListener) mq.removeListener(onChange)
        }
      }, [])

      // persist chosen mode
      useEffect(() => {
        try { localStorage.setItem(MODE_KEY, mode) } catch { /* ignore */ }
      }, [mode])

      // apply day/night to the actual UI (skin dark variant) when a skin is on
      useEffect(() => {
        if (!applied) return
        if (dark) document.body.setAttribute('data-ds-dark-theme', '')
        else document.body.removeAttribute('data-ds-dark-theme')
      }, [dark, applied])

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
        setRecent((prev) => {
          const next = [skin.id, ...prev.filter((x) => x !== skin.id)].slice(0, RECENT_MAX)
          saveJSON(RECENT_KEY, next)
          return next
        })
      }

      function clearSkin() { clearSkins(); setApplied(null); setSelected(null) }

      function toggleFav(id) {
        setFavs((prev) => {
          const next = new Set(prev)
          if (next.has(id)) next.delete(id); else next.add(id)
          saveJSON(FAVS_KEY, [...next])
          return next
        })
      }

      function randomSkin() {
        const pool = shown.length ? shown : skins
        if (!pool.length) return
        applySkin(pool[Math.floor(Math.random() * pool.length)])
      }

      const q = search.trim().toLowerCase()
      const searchHit = q
        ? skins.filter((s) => (s.name + ' ' + s.nameEn + ' ' + s.group + ' ' + (s.tags || []).join(' ')).toLowerCase().includes(q))
        : skins
      const favHit = favOnly ? searchHit.filter((s) => favs.has(s.id)) : searchHit
      const groups = [...new Set(skins.map((s) => s.group))].sort((a, b) => a.localeCompare(b, 'zh'))
      const shown = group === 'all' ? favHit : favHit.filter((s) => s.group === group)
      const lastTried = recent.map((id) => byId[id]).filter(Boolean)

      const previewOf = (s, isDark) => '/skin-center/' + (isDark ? (s.preview ? s.preview.dark : s.thumb.dark) : (s.preview ? s.preview.light : s.thumb.light))

      const modeBtns = [
        ['light', '☀️ ' + t('day')],
        ['dark', '🌙 ' + t('night')],
        ['system', '🖥 ' + t('system')],
      ]

      // detail card: dual large previews + meta
      const detailCard = selected
        ? h('div', { 'data-dsh-part': 'card', style: { background: 'var(--dsw-alias-bg-layer-2)', border: '1px solid ' + (selected.accent || 'var(--dsw-alias-border-l1)'), borderRadius: '8px', padding: '12px', marginBottom: '12px' } },
            h('div', { style: { fontSize: '12px', color: 'var(--dsw-alias-label-primary)', fontWeight: '700', marginBottom: '8px' } }, '📋 ' + t('detail')),
            h('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' } },
              h('div', { style: { display: 'flex', gap: '8px', flex: '1 1 340px', minWidth: '280px' } },
                h('div', { style: { flex: 1 } },
                  h(Thumb, { src: previewOf(selected, false), alt: selected.name + ' ' + t('day') }),
                  h('div', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-secondary)', marginTop: '3px', textAlign: 'center' } }, '☀️ ' + t('day'))),
                h('div', { style: { flex: 1 } },
                  h(Thumb, { src: previewOf(selected, true), alt: selected.name + ' ' + t('night') }),
                  h('div', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-secondary)', marginTop: '3px', textAlign: 'center' } }, '🌙 ' + t('night'))),
              ),
              h('div', { style: { flex: '1 1 200px', minWidth: '180px', fontSize: '12px', color: 'var(--dsw-alias-label-primary)', lineHeight: '2' } },
                h('div', { style: { fontWeight: '700', color: selected.accent || 'var(--dsw-alias-label-primary)', fontSize: '13px' } }, selected.name + (selected.nameEn ? ' · ' + selected.nameEn : '')),
                h('div', {}, t('author') + ': ' + (selected.author || '—')),
                h('div', {}, t('tags') + ': ' + ((selected.tags || []).join(' / ') || '—')),
                h('div', {}, t('tokens') + ': ' + (selected.tokens || 0)),
                h('div', {}, t('group') + ': ' + (selected.group || '—')),
                selected.tagline ? h('div', { style: { color: 'var(--dsw-alias-label-secondary)', marginTop: '4px' } }, selected.tagline) : null,
              ),
            ),
          )
        : null

      return h('div', { style: { maxWidth: '980px' }, 'data-dsh-plugin': 'skin-center', 'data-dsh-surface': 'settings' },
        h('div', { style: S.bar },
          h('input', { style: S.input, 'data-dsh-part': 'input', placeholder: t('search'), value: search, onChange: (e) => setSearch(e.target.value) }),
          h('select', { style: S.select, 'data-dsh-part': 'select', value: group, onChange: (e) => setGroup(e.target.value) },
            h('option', { value: 'all' }, t('all')),
            groups.map((g) => h('option', { key: g, value: g }, g))),
          h('div', { style: { display: 'flex', gap: '4px' } },
            modeBtns.map(([m, label]) => h('button', { key: m, 'data-dsh-part': 'button-ghost', style: mode === m ? S.btnActive : S.btn, onClick: () => setMode(m) }, label))),
          h('button', { 'data-dsh-part': 'button-ghost', style: S.btn, onClick: randomSkin, title: t('random') }, '🎲 ' + t('random')),
          h('button', { 'data-dsh-part': 'button-ghost', style: favOnly ? S.btnActive : S.btn, onClick: () => setFavOnly(!favOnly) }, (favOnly ? '♥ ' : '♡ ') + t('favOnly')),
          applied ? h('button', { 'data-dsh-part': 'button-ghost', style: S.btn, onClick: clearSkin }, '✖ ' + t('clearSkin')) : null,
        ),
        h('div', { style: S.status },
          skins.length + ' ' + t('count') + (q || favOnly ? ' · ' + t('filterCount') + ': ' + favHit.length : '') + (group !== 'all' ? ' · ' + group : '') + ' · ' + t('hint')),
        detailCard,
        lastTried.length
          ? h('div', { style: { display: 'flex', gap: '8px', alignItems: 'stretch', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' } },
              h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-secondary)', fontWeight: '700', whiteSpace: 'nowrap', alignSelf: 'center', marginRight: '2px' } }, t('recent')),
              lastTried.map((s) => h('div', {
                key: s.id, 'data-dsh-part': 'card',
                onClick: () => { applySkin(s); setSelected(s) },
                title: s.name,
                style: {
                  flex: '0 0 96px', cursor: 'pointer', background: 'var(--dsw-alias-bg-layer-2)',
                  border: applied === s.bodyAttr ? '1px solid ' + (s.accent || 'var(--dsw-alias-brand-primary)') : '1px solid var(--dsw-alias-border-l1)',
                  borderRadius: '8px', padding: '4px',
                },
              },
                h(Thumb, { src: '/skin-center/' + (dark ? s.thumb.dark : s.thumb.light), alt: s.name }),
                h('div', { style: { fontSize: '10px', color: 'color-mix(in srgb, var(--dsw-alias-label-secondary) 95%, transparent)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, s.name),
              )))
          : null,
        loading ? h('div', { style: { color: 'var(--dsw-alias-label-secondary)', fontSize: '13px' } }, t('loading')) : null,
        h('div', { style: S.grid },
          shown.map((s) => {
            const active = applied === s.bodyAttr
            const isFav = favs.has(s.id)
            return h('div', {
              key: s.id,
              'data-dsh-part': 'card',
              onClick: () => { applySkin(s); setSelected(s) },
              title: s.name + ' (' + s.nameEn + ')',
              style: {
                position: 'relative',
                background: active ? 'color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent)' : 'var(--dsw-alias-bg-layer-2)',
                border: active ? '1px solid ' + (s.accent || 'var(--dsw-alias-brand-primary)') : '1px solid var(--dsw-alias-border-l1)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                transition: 'border-color .15s',
              },
            },
              h(Thumb, { src: '/skin-center/' + (dark ? s.thumb.dark : s.thumb.light), alt: s.name }),
              h('button', {
                title: isFav ? t('unfav') : t('fav'),
                onClick: (e) => { e.stopPropagation(); toggleFav(s.id) },
                style: {
                  position: 'absolute', top: '13px', right: '13px', zIndex: 2,
                  background: 'color-mix(in srgb, var(--dsw-alias-bg-layer-1) 78%, transparent)', border: '1px solid var(--dsw-alias-border-l1)', borderRadius: '6px',
                  color: isFav ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-label-secondary)', cursor: 'pointer',
                  fontSize: '15px', lineHeight: '1', padding: '4px 6px', transition: 'color .15s',
                },
              }, isFav ? '♥' : '♡'),
              h('div', { style: { fontSize: '12px', color: active ? (s.accent || 'var(--dsw-alias-brand-primary)') : 'var(--dsw-alias-label-primary)', fontWeight: active ? '700' : '500', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } },
                s.name + (active ? ' ✓' : '')),
              h('div', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-secondary)', marginTop: '2px' } }, s.group + (s.tokens ? ' · ' + s.tokens + ' tok' : '')),
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
