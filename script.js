/* ===== Cesar Araujo — Hair Artistry =====
   Vanilla-JS port of the Claude Design `DCLogic` component runtime:
   nav scroll state, reveal-on-scroll entrance, hero parallax, input
   focus accent, the booking form, and a `style-hover` shim that
   reproduces the design's per-element hover styling. */

(function () {
  'use strict';

  function init() {
    var root = document.getElementById('ca-root');
    if (!root) return;

    /* ---- style-hover shim ----------------------------------------
       The source marks hover styling with a custom `style-hover`
       attribute. Apply those declarations property-by-property on
       hover and restore the previous inline value on leave, so we
       never overwrite the reveal animation's opacity/transform. */
    function parseDecls(str) {
      var out = [];
      str.split(';').forEach(function (chunk) {
        var i = chunk.indexOf(':');
        if (i === -1) return;
        var prop = chunk.slice(0, i).trim();
        var val = chunk.slice(i + 1).trim();
        if (prop) out.push([prop, val]);
      });
      return out;
    }
    root.querySelectorAll('[style-hover]').forEach(function (el) {
      var decls = parseDecls(el.getAttribute('style-hover') || '');
      if (!decls.length) return;
      var prev = null;
      el.addEventListener('mouseenter', function () {
        prev = decls.map(function (d) { return [d[0], el.style.getPropertyValue(d[0])]; });
        decls.forEach(function (d) { el.style.setProperty(d[0], d[1]); });
      });
      el.addEventListener('mouseleave', function () {
        if (!prev) return;
        prev.forEach(function (p) {
          if (p[1]) el.style.setProperty(p[0], p[1]);
          else el.style.removeProperty(p[0]);
        });
      });
    });

    /* ---- nav scroll state ---------------------------------------- */
    var nav = document.getElementById('ca-nav');
    function onScroll() {
      if (!nav) return;
      if (window.scrollY > 60) {
        nav.style.background = 'rgba(8,22,15,0.86)';
        nav.style.backdropFilter = 'blur(14px)';
        nav.style.webkitBackdropFilter = 'blur(14px)';
        nav.style.padding = '16px 48px';
        nav.style.borderBottomColor = 'var(--line)';
      } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.webkitBackdropFilter = 'none';
        nav.style.padding = '26px 48px';
        nav.style.borderBottomColor = 'transparent';
      }
    }

    /* ---- reveal-on-scroll ----------------------------------------
       Drive the entrance with a manual rAF tween (writes
       opacity/transform per frame) — robust across browsers. */
    var reveals = Array.prototype.slice.call(root.querySelectorAll('.reveal'));
    var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
    function animateIn(el) {
      if (el.dataset.shown) return;
      el.dataset.shown = '1';
      var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      var dist = 26, dur = 780;
      el.style.setProperty('transition', 'none', 'important');
      setTimeout(function () {
        var start = null;
        var step = function (ts) {
          if (start === null) start = ts;
          var p = (ts - start) / dur; if (p > 1) p = 1;
          var e = easeOut(p);
          el.style.opacity = String(e);
          el.style.transform = e >= 1 ? 'none' : 'translateY(' + ((1 - e) * dist).toFixed(2) + 'px)';
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, delay);
    }
    function revealInView() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < reveals.length; i++) {
        var el = reveals[i];
        if (el.dataset.shown) continue;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > -40) animateIn(el);
      }
    }
    function onScrollAll() { onScroll(); revealInView(); }
    onScrollAll();
    requestAnimationFrame(revealInView);
    window.addEventListener('scroll', onScrollAll, true);
    window.addEventListener('resize', revealInView, { passive: true });
    // last resort: never leave content hidden
    setTimeout(function () {
      reveals.forEach(function (el) {
        if (getComputedStyle(el).opacity !== '1') {
          el.style.opacity = '1'; el.style.transform = 'none'; el.dataset.shown = '1';
        }
      });
    }, 4200);

    /* ---- subtle hero parallax ------------------------------------ */
    var portrait = document.getElementById('ca-hero-portrait');
    if (portrait && window.matchMedia('(pointer:fine)').matches) {
      window.addEventListener('mousemove', function (e) {
        var x = (e.clientX / window.innerWidth - 0.5);
        var y = (e.clientY / window.innerHeight - 0.5);
        portrait.style.transform = 'translate(' + (x * 14) + 'px, ' + (y * 14) + 'px)';
      }, { passive: true });
    }

    /* ---- input focus accent -------------------------------------- */
    root.querySelectorAll('.ca-input').forEach(function (inp) {
      inp.addEventListener('focus', function () { inp.style.borderBottomColor = 'var(--accent)'; });
      inp.addEventListener('blur', function () { inp.style.borderBottomColor = 'var(--line)'; });
    });

    /* ---- booking form -------------------------------------------- */
    var form = root.querySelector('#contact form');
    if (form) {
      var btn = form.querySelector('button[type="submit"]');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!btn) return;
        btn.textContent = 'Request received ✓';
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = 'Request appointment';
          btn.disabled = false;
          form.reset();
        }, 3500);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
