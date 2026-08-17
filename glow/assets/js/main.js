/* ============================================================
   GLOW — interaction layer
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. THEME ---------- */
  (function theme() {
    var root = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem('glow-theme'); } catch (e) {}
    // Dark is the brand default; the system preference never overrides it —
    // only an explicit choice the visitor made before does.
    if (saved !== 'light' && saved !== 'dark') saved = 'dark';
    root.setAttribute('data-theme', saved);
    syncMeta(saved);

    var btn = $('#theme');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      syncMeta(next);
      try { localStorage.setItem('glow-theme', next); } catch (e) {}
    });

    function syncMeta(t) {
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute('content', t === 'dark' ? '#08080B' : '#F2F2F5');
    }
  })();

  /* ---------- 2. PRELOADER ---------- */
  (function loader() {
    var el = $('#loader');
    if (!el) return;
    var hide = function () {
      el.classList.add('done');
      document.body.classList.remove('is-locked');
      setTimeout(function () { el.remove(); }, 800);
    };
    document.body.classList.add('is-locked');
    window.addEventListener('load', function () { setTimeout(hide, reduced ? 100 : 900); });
    setTimeout(hide, 3200); // hard safety net
  })();

  /* ---------- 3. NAV: stuck state, mobile drawer, active link ---------- */
  (function nav() {
    var bar = $('#nav');
    var links = $('#navlinks');
    var burger = $('#burger');
    var items = $$('.nav__link');

    var onScroll = function () {
      if (bar) bar.classList.toggle('stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
        document.documentElement.classList.toggle('is-locked', open);
        burger.innerHTML = open
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
      });
      $$('a', links).forEach(function (a) {
        a.addEventListener('click', function () {
          if (links.classList.contains('open')) burger.click();
        });
      });
    }

    // active section highlight
    var sections = items
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        items.forEach(function (a) {
          a.classList.toggle('current', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  })();

  /* ---------- 4. SCROLL PROGRESS + BACK TO TOP ---------- */
  (function progress() {
    var bar = $('#progress');
    var top = $('#toTop');
    var tick = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      if (bar) bar.style.width = p + '%';
      if (top) top.classList.toggle('on', window.scrollY > 600);
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
  })();

  /* ---------- 5. SCROLL REVEAL ---------- */
  (function reveal() {
    var els = $$('.rv');
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------- 6. COUNTERS ---------- */
  (function counters() {
    var nums = $$('.count');
    if (!nums.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      nums.forEach(function (n) { n.textContent = n.dataset.to; });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });

    function run(el) {
      var to = parseFloat(el.dataset.to) || 0;
      var dur = 1500, t0 = null;
      requestAnimationFrame(function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased).toString();
        if (p < 1) requestAnimationFrame(step);
      });
    }
  })();

  /* ---------- 7. GLASS SPOTLIGHT (pointer-tracked) ---------- */
  (function spotlight() {
    if (isTouch) return;
    $$('.glass--lit').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  })();

  /* ---------- 8. TILT (hero console) ---------- */
  (function tilt() {
    if (isTouch || reduced) return;
    $$('.tilt').forEach(function (el) {
      var parent = el.parentElement;
      parent.addEventListener('pointermove', function (e) {
        var r = parent.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          'rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg) translateZ(0)';
      });
      parent.addEventListener('pointerleave', function () {
        el.style.transform = 'rotateY(0) rotateX(0)';
      });
    });
  })();

  /* ---------- 9. MAGNETIC BUTTONS ---------- */
  (function magnetic() {
    if (isTouch || reduced) return;
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.12 + 'px,' + (y * 0.18 - 2) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  })();

  /* ---------- 10. CURSOR GLOW ---------- */
  (function cursor() {
    var c = $('#cursor');
    if (!c || isTouch || reduced) return;
    var tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY; c.classList.add('on');
    });
    window.addEventListener('pointerleave', function () { c.classList.remove('on'); });
    (function loop() {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      c.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  })();

  /* ---------- 11. HERO CONSOLE SEQUENCE ---------- */
  (function console_() {
    var rows = $$('#flow .flow__row');
    var meter = $('#meter');
    var start = function () {
      rows.forEach(function (r, i) {
        setTimeout(function () { r.classList.add('on'); }, reduced ? 0 : 260 + i * 220);
      });
      setTimeout(function () { if (meter) meter.classList.add('on'); }, reduced ? 0 : 1200);
    };
    if (!rows.length) return;
    setTimeout(start, 1200);
  })();

  /* ---------- 12. APPROACH TIMELINE ---------- */
  (function steps() {
    var wrap = $('#steps');
    var fill = $('#stepsFill');
    if (!wrap) return;
    var nodes = $$('.step', wrap);
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('on'); });
      if (fill) fill.style.width = '88%';
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        nodes.forEach(function (n, i) {
          setTimeout(function () { n.classList.add('on'); }, reduced ? 0 : i * 240);
        });
        if (fill) setTimeout(function () { fill.style.width = '88%'; }, reduced ? 0 : 200);
        obs.disconnect();
      });
    }, { threshold: 0.3 });
    io.observe(wrap);
  })();

  /* ---------- 13. PIXEL PANEL (brand blueprint animation) ---------- */
  (function pixelPanel() {
    var grid = $('#pixelGrid');
    if (!grid) return;
    var colors = ['#29ABE2', '#ED1C24', '#F7941E', '#92278F'];
    // 6x6 map of the GLOW pixel mark: 0 = empty, 1 = ink, 2..5 = brand colours
    var map = [
      2, 0, 3, 3, 2, 0,
      0, 1, 0, 0, 0, 1,
      1, 5, 0, 0, 0, 0,
      5, 1, 0, 4, 2, 5,
      1, 1, 0, 0, 0, 1,
      0, 4, 3, 5, 5, 0
    ];
    var cells = [];
    map.forEach(function () {
      var s = document.createElement('span');
      grid.appendChild(s);
      cells.push(s);
    });

    var paint = function () {
      cells.forEach(function (s, i) {
        var v = map[i];
        setTimeout(function () {
          if (v === 0) { s.style.opacity = '.12'; return; }
          s.style.opacity = '1';
          s.style.background = v === 1 ? 'currentColor' : colors[v - 2];
        }, reduced ? 0 : i * 45);
      });
    };

    if (!('IntersectionObserver' in window)) { paint(); return; }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) { if (e.isIntersecting) { paint(); obs.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(grid);
  })();

  /* ---------- 14. PIXEL FIELD CANVAS ---------- */
  (function field() {
    var cvs = $('#pixel-field');
    if (!cvs || reduced) return;
    var ctx = cvs.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, pixels = [], mouse = { x: -9999, y: -9999 };
    var palette = ['41,171,226', '237,28,36', '247,148,30', '146,39,143'];

    function size() {
      w = cvs.clientWidth; h = cvs.clientHeight;
      cvs.width = w * dpr; cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      var density = Math.max(26, Math.min(70, Math.round((w * h) / 26000)));
      pixels = [];
      for (var i = 0; i < density; i++) {
        pixels.push({
          x: Math.random() * w,
          y: Math.random() * h,
          s: Math.random() < 0.18 ? 6 : 3,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          c: palette[(Math.random() * palette.length) | 0],
          a: 0.10 + Math.random() * 0.24,
          ph: Math.random() * Math.PI * 2
        });
      }
    }

    var t = 0;
    function frame() {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < pixels.length; i++) {
        var p = pixels[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20;

        var dx = p.x - mouse.x, dy = p.y - mouse.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        var near = d < 220 ? 1 - d / 220 : 0;

        var alpha = (p.a + Math.sin(t + p.ph) * 0.06 + near * 0.5);
        ctx.fillStyle = 'rgba(' + p.c + ',' + Math.max(0, Math.min(alpha, 0.9)) + ')';
        // snapped to a 4px lattice — the pixel grid is the brand
        var gx = Math.round(p.x / 4) * 4, gy = Math.round(p.y / 4) * 4;
        var s = p.s + near * 3;
        ctx.fillRect(gx, gy, s, s);

        if (near > 0.15) {
          ctx.strokeStyle = 'rgba(' + p.c + ',' + (near * 0.16) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(gx + s / 2, gy + s / 2);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      requestAnimationFrame(frame);
    }

    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
    window.addEventListener('resize', size);
    size();
    frame();
  })();

  /* ---------- 15. CONTACT FORM ---------- */
  (function form() {
    var f = $('#contactForm');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      ['f-name', 'f-mail', 'f-msg'].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var bad = !el.value.trim() || (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
        el.style.borderColor = bad ? '#ED1C24' : '';
        if (bad) ok = false;
      });
      if (!ok) return;

      var d = new FormData(f);
      var body =
        'الاسم: ' + d.get('name') + '\n' +
        'جهة العمل: ' + (d.get('org') || '—') + '\n' +
        'البريد: ' + d.get('email') + '\n' +
        'الجوال: ' + (d.get('phone') || '—') + '\n' +
        'مجال الاهتمام: ' + d.get('service') + '\n\n' +
        'تفاصيل المشروع:\n' + d.get('message');

      var ok_ = $('#formOk');
      if (ok_) ok_.classList.add('on');
      window.location.href =
        'mailto:info@glows.studio?subject=' +
        encodeURIComponent('طلب مشروع — ' + d.get('service') + ' — ' + d.get('name')) +
        '&body=' + encodeURIComponent(body);
    });
  })();

  /* ---------- 16. MISC ---------- */
  (function misc() {
    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();

    // smooth anchor scroll with nav offset
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
        history.replaceState(null, '', id);
      });
    });
  })();

})();
