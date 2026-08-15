/* dsh-themes 皮肤画廊 · 前端交互（零依赖）
   搜索/分组过滤 / 详情浮层（昼夜切换）/ 复制安装命令 */
(function () {
  'use strict';

  var root = document.getElementById('gallery-data');
  if (!root) return;
  var data = JSON.parse(root.textContent);
  var skins = data.skins || [];
  var byId = {};
  skins.forEach(function (s) { byId[s.id] = s; });

  var $search = document.getElementById('search');
  var $count = document.getElementById('result-count');
  var $modal = document.getElementById('modal');
  var $preview = document.getElementById('m-preview');
  var $toggle = document.getElementById('m-toggle');
  var $mCopy = document.getElementById('m-copy');
  var cur = null, dark = false;

  /* ---- 搜索过滤（名称/id/分组/标签） ---- */
  function norm(x) { return String(x || '').toLowerCase(); }
  function matches(s, q) {
    return norm(s.id + ' ' + s.name + ' ' + s.nameEn + ' ' + s.group + ' ' + (s.tags || []).join(' ')).indexOf(q) >= 0;
  }
  function applySearch() {
    var q = norm($search.value).trim();
    var shown = 0;
    var cards = document.querySelectorAll('.skin-card');
    cards.forEach(function (c) {
      var s = byId[c.getAttribute('data-id')];
      var hit = !q || matches(s, q);
      c.style.display = hit ? '' : 'none';
      if (hit) shown++;
    });
    document.querySelectorAll('.group').forEach(function (g) {
      var any = g.querySelector('.skin-card:not([style*="display: none"])') !== null;
      if (!q) { g.removeAttribute('hidden'); g.open = true; }
      else { g.hidden = !any; }
    });
    var gTitle = document.getElementById('gallery-title');
    if (gTitle) gTitle.style.display = q && shown === 0 ? 'none' : '';
    if (q) { $count.hidden = false; $count.textContent = '匹配 ' + shown + ' / ' + skins.length + ' 款皮肤'; }
    else { $count.hidden = true; $count.textContent = ''; }
  }
  $search.addEventListener('input', applySearch);

  /* ---- 详情浮层 ---- */
  function openModal(id) {
    cur = byId[id];
    if (!cur) return;
    dark = false;
    $preview.src = cur.previewLight;
    document.getElementById('m-name').textContent = cur.name;
    document.getElementById('m-nameen').textContent = (cur.nameEn || '') + ' · ' + cur.id;
    document.getElementById('m-tags').innerHTML = (cur.tags || []).map(function (t) {
      return '<span class="tag">' + String(t).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      }) + '</span>';
    }).join('');
    document.getElementById('m-desc').textContent = cur.tagline || cur.description || '';
    document.getElementById('m-accent').style.background = cur.accent;
    document.getElementById('m-group').textContent = '分组：' + cur.group;
    var cmd = cur.installCmd;
    document.getElementById('m-cmd').textContent = cmd;
    $mCopy.setAttribute('data-cmd', cmd);
    var repoLink = document.getElementById('m-repo');
    repoLink.href = 'https://github.com/whyihaveyou/dsh-themes/tree/main/skins/' + encodeURIComponent(cur.id);
    toggleLabel();
    $modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    $modal.hidden = true;
    document.body.style.overflow = '';
  }
  function toggleLabel() {
    $toggle.textContent = dark ? '☀️ 浅色预览' : '🌙 深色预览';
  }
  $toggle.addEventListener('click', function () {
    if (!cur) return;
    dark = !dark;
    $preview.src = dark ? cur.previewDark : cur.previewLight;
    toggleLabel();
  });
  /* 随机试穿 */
  var $random = document.getElementById('random-btn');
  if ($random) {
    $random.addEventListener('click', function () {
      openModal(skins[Math.floor(Math.random() * skins.length)].id);
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) { closeModal(); return; }
    var card = e.target.closest('.skin-card');
    if (card) openModal(card.getAttribute('data-id'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$modal.hidden) closeModal();
  });

  /* ---- 复制安装命令（社区卡 + 浮层，事件委托） ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;
    var cmd = btn.getAttribute('data-cmd');
    if (!cmd) return;
    function done() {
      var prev = btn.textContent;
      btn.textContent = '✓ 已复制';
      btn.classList.add('copied');
      setTimeout(function () { btn.textContent = prev; btn.classList.remove('copied'); }, 2200);
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = cmd; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (err) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cmd).then(done, function () { fallback(); });
    } else { fallback(); }
  });
})();
