/* Cash Pass site script: motion signature, the usher's strip, the glass tile, entrances, the cart, toasts, forms and the SMS block. */
(function () {
  'use strict';
  const html = document.documentElement;
  const body = document.body;
  const RM = html.classList.contains('rm');
  const COARSE = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  const MOBILE = () => window.innerWidth < 900;
  const TOUCH = COARSE || MOBILE();
  const SAVE_DATA = !!(navigator.connection && navigator.connection.saveData);
  const ROUTE = body.getAttribute('data-route') || '/';
  const hasGsap = typeof window.gsap !== 'undefined';

  // ---------- the motion signature: Walk and Rest as GSAP eases ----------
  function bezier(x1, y1, x2, y2) {
    const A = (a, b) => 1 - 3 * b + 3 * a, B = (a, b) => 3 * b - 6 * a, C = (a) => 3 * a;
    const calc = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
    const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) { const s = slope(t, x1, x2); if (Math.abs(s) < 1e-6) break; t -= (calc(t, x1, x2) - x) / s; }
      return calc(t, y1, y2);
    };
  }
  const WALK = bezier(0.46, 0.03, 0.24, 1);
  const REST = bezier(0.05, 0.7, 0.3, 1);
  const D = { fast: 0.18, base: 0.42, slow: 1.1 };
  if (hasGsap) {
    gsap.registerEase('walk', WALK);
    gsap.registerEase('rest', REST);
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
    if (window.Flip) gsap.registerPlugin(Flip);
    gsap.defaults({ ease: 'rest', duration: D.base });
  } else {
    html.classList.add('nomotion');
  }

  // ---------- Lenis, the desktop rail ----------
  let lenis = null;
  if (hasGsap && window.Lenis && !RM && !TOUCH && !MOBILE()) {
    try {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } catch (e) { lenis = null; }
  }
  function scrollToY(y, immediate) {
    if (lenis) lenis.scrollTo(y, { immediate: !!immediate, duration: immediate ? 0 : 1.1, easing: WALK });
    else window.scrollTo({ top: y, behavior: immediate || RM ? 'auto' : 'smooth' });
  }

  // ---------- the usher's strip ----------
  const hdr = document.querySelector('.hdr');
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (hdr) hdr.classList.toggle('hdr--thin', y > 80);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // The nav's Buy Pass is unrimmed while a page's hero Buy Pass is on screen, rimmed once it has scrolled past.
  const navTile = document.querySelector('[data-nav-tile]');
  const heroCta = document.querySelector('[data-hero-cta]');
  const navMode = hdr ? hdr.getAttribute('data-nav-cta') : 'auto';
  if (navTile) {
    if (navMode === 'unrimmed') navTile.classList.add('tile--unrimmed');
    else if (navMode === 'rimmed' || !heroCta) navTile.classList.remove('tile--unrimmed');
    else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => navTile.classList.toggle('tile--unrimmed', en.isIntersecting || en.boundingClientRect.top > 0));
      }, { threshold: 0 });
      io.observe(heroCta);
    }
  }

  // Mobile menu: focus trapped while open, Escape closes, focus returns to Menu.
  const menu = document.querySelector('[data-menu]');
  const menuOpen = document.querySelector('[data-menu-open]');
  const menuClose = document.querySelector('[data-menu-close]');
  function trap(e) {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const f = menu.querySelectorAll('a[href], button:not([disabled])');
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openMenu() {
    menu.hidden = false; menuOpen.setAttribute('aria-expanded', 'true'); body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    menu.addEventListener('keydown', trap);
    (menuClose || menu.querySelector('a')).focus();
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true; menuOpen.setAttribute('aria-expanded', 'false'); body.style.overflow = '';
    if (lenis) lenis.start();
    menu.removeEventListener('keydown', trap);
    menuOpen.focus();
  }
  if (menu && menuOpen) {
    menuOpen.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
  }

  // ---------- toasts ----------
  const toastRegion = document.querySelector('[data-toasts]');
  function toast(text, opts = {}) {
    if (!toastRegion) return;
    Array.from(toastRegion.children).forEach((old) => old.remove());
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML = `<p></p>${opts.action ? `<a href="${opts.action.href}">${opts.action.label}</a>` : ''}<button type="button">Close</button>`;
    el.querySelector('p').textContent = text;
    toastRegion.appendChild(el);
    if (hasGsap && !RM) gsap.from(el, { y: 16, autoAlpha: 0, duration: D.base, ease: 'rest' });
    const remove = () => { if (!el.parentNode) return; if (hasGsap && !RM) gsap.to(el, { autoAlpha: 0, y: 8, duration: D.fast, onComplete: () => el.remove() }); else el.remove(); };
    el.querySelector('button').addEventListener('click', remove);
    setTimeout(remove, opts.timeout || 8000);
    return el;
  }

  // ---------- the cart: one plan, localStorage with an in memory fallback ----------
  const PLANS = (window.CP_PLANS && window.CP_PLANS.plans) || {};
  const Cart = {
    key: 'cashpass.cart', mem: null,
    read() {
      try { const v = JSON.parse(localStorage.getItem(this.key)); if (v && v.plan) { this.mem = v; return v; } return this.mem && this.mem.plan ? this.mem : null; }
      catch (e) { return this.mem && this.mem.plan ? this.mem : null; }
    },
    write(v) {
      this.mem = v;
      try { if (v) localStorage.setItem(this.key, JSON.stringify(v)); else localStorage.removeItem(this.key); } catch (e) { /* memory only */ }
      updateBadge();
      document.dispatchEvent(new CustomEvent('cp:cart', { detail: v }));
    },
    add(plan) {
      if (!PLANS[plan]) return null;
      const prev = this.read();
      const replaced = prev && prev.plan && prev.plan !== plan ? prev.plan : null;
      const rec = { plan, addedAt: Date.now(), justAdded: true, replaced };
      this.write(rec);
      return rec;
    },
    clear() { this.write(null); }
  };
  function updateBadge() {
    const c = Cart.read();
    document.querySelectorAll('[data-cart-link]').forEach((a) => {
      const count = a.querySelector('[data-cart-count]');
      if (c && c.plan) { a.setAttribute('aria-label', 'Cart, 1 plan'); if (count) { count.textContent = '1'; count.hidden = false; } }
      else { a.setAttribute('aria-label', 'Cart, empty'); if (count) { count.hidden = true; } }
    });
    html.classList.toggle('has-cart', !!(c && c.plan));
  }
  updateBadge();
  window.addEventListener('storage', (e) => { if (e.key === Cart.key) updateBadge(); });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-add-plan]');
    if (!a) return;
    const plan = a.getAttribute('data-add-plan');
    if (!PLANS[plan]) return;
    e.preventDefault();
    const rec = Cart.add(plan);
    if (ROUTE === '/cart' && window.CP_CART_PAGE) { document.dispatchEvent(new CustomEvent('cp:cart-added', { detail: rec })); return; }
    window.location.href = '/cart';
  });

  // ---------- hover tilt with a cool glare (INT-006) ----------
  function tilt(els, max = 6) {
    if (RM || TOUCH || !hasGsap) return;
    els.forEach((el) => {
      const rx = gsap.quickTo(el, 'rotationX', { duration: D.base, ease: 'rest' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: D.base, ease: 'rest' });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry((px - 0.5) * 2 * max); rx((0.5 - py) * 2 * max);
        el.style.setProperty('--gx', (px * 100).toFixed(1) + '%'); el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  // ---------- The Last Light: the answer line fades up from black letter by letter ----------
  function lastLight(el, opts = {}) {
    if (!el) return null;
    const txt = el.querySelector('.answer-txt') || el;
    if (RM || !hasGsap || !window.SplitText) { gsap && gsap.set(el, { autoAlpha: 1 }); return null; }
    let split = txt._cpSplit;
    if (!split) {
      split = new SplitText(txt, { type: 'chars', charsClass: 'll-char' });
      txt._cpSplit = split;
    }
    const chars = split.chars;
    const fig = txt.querySelector('.ans-fig');
    const figChars = fig ? chars.filter((c) => fig.contains(c)) : [];
    const rest = chars.filter((c) => !figChars.includes(c));
    const stagger = opts.stagger || 0.028;
    const tl = gsap.timeline({ paused: !!opts.paused });
    gsap.set(el, { autoAlpha: 1 });
    tl.set(chars, { autoAlpha: 0, y: 4 });
    tl.to(rest, { autoAlpha: 1, y: 0, duration: D.base, ease: 'rest', stagger });
    if (figChars.length) {
      tl.to(figChars, { autoAlpha: 1, y: 0, duration: D.base, ease: 'rest', stagger, onStart: () => figChars.forEach((c) => c.classList.add('is-light')) }, '-=0.1');
      tl.add(() => figChars.forEach((c) => c.classList.remove('is-light')), '+=0.42');
    }
    return tl;
  }

  // ---------- numerals that count up ----------
  function countUp(el, target, opts = {}) {
    if (!el) return;
    const txt = typeof target === 'string' ? target : el.textContent;
    const digits = txt.replace(/[^0-9]/g, '');
    const num = parseInt(digits, 10);
    if (isNaN(num) || RM || !hasGsap) return;
    const prefix = txt.match(/^[^0-9]*/)[0];
    const suffix = txt.match(/[^0-9]*$/)[0];
    const pad = /^0/.test(digits) ? digits.length : 0;
    const o = { v: 0 };
    const fmt = (v) => { let s = String(Math.round(v)); if (pad) s = s.padStart(pad, '0'); else s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); return prefix + s + suffix; };
    const symWrap = (s) => s.replace(/(\$|%)/g, '<span class="sym">$1</span>');
    const useSym = !!el.querySelector('.sym') || el.classList.contains('fig');
    return gsap.to(o, { v: num, duration: opts.duration || D.base, ease: 'rest', onUpdate: () => { const s = fmt(o.v); if (useSym) el.innerHTML = `<span class="fig">${symWrap(s)}</span>`; else el.textContent = s; }, onComplete: () => { const s = fmt(num); if (useSym) el.innerHTML = `<span class="fig">${symWrap(s)}</span>`; else el.textContent = s; } });
  }

  // ---------- SVG stroke drawing ----------
  function drawPath(paths, opts = {}) {
    const list = Array.isArray(paths) ? paths : Array.from(paths || []);
    list.forEach((p) => {
      let len = 1000;
      try { len = p.getTotalLength(); } catch (e) { /* not a geometry element */ }
      p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    });
    if (RM || !hasGsap) { list.forEach((p) => { p.style.strokeDashoffset = 0; }); return null; }
    return gsap.to(list, { strokeDashoffset: 0, duration: opts.duration || D.slow, ease: opts.ease || 'walk', stagger: opts.stagger || 0 });
  }

  // ---------- the seal settles in: a 6 degree rotation and one brightening of the pool ----------
  function sealSettle(el) {
    if (!el || RM || !hasGsap) return;
    gsap.fromTo(el, { rotation: -6, autoAlpha: 0.4, filter: 'brightness(.7)' }, { rotation: 0, autoAlpha: 1, filter: 'brightness(1.15)', duration: D.slow, ease: 'walk', onComplete: () => gsap.to(el, { filter: 'brightness(1)', duration: D.base }) });
  }

  // ---------- entrances: one distinct scroll into view choreography per section ----------
  const q = (root, sel) => Array.from(root.querySelectorAll(sel));
  const ENTRANCES = {
    'mask-rise'(s, tl) {
      const items = q(s, '.eyebrow, .h1, .intro, .cta-row, .hero-extra, .subhead, .dek');
      items.forEach((el, i) => {
        if (el.querySelector('.w') || el.classList.contains('cta-row') || !window.SplitText || el.tagName === 'DIV') {
          tl.from(el, { yPercent: 40, autoAlpha: 0, duration: D.base, ease: 'rest' }, i * 0.06);
        } else {
          const sp = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'll' });
          tl.from(sp.lines, { yPercent: 100, autoAlpha: 0, duration: D.base, ease: 'rest', stagger: 0.06 }, i * 0.06);
        }
      });
    },
    'numerals'(s, tl) {
      const items = q(s, '[data-dec], .idx-item');
      tl.from(q(s, '.decided-head > *, .sec-head > *'), { y: 16, autoAlpha: 0, stagger: 0.06 }, 0);
      items.forEach((it, i) => {
        const n = it.querySelector('.numeral');
        const bodyEl = it.querySelector('.dec-body, .idx-body');
        const t = 0.1 + i * 0.18;
        if (n) { tl.add(() => { countUp(n, n.getAttribute('data-numeral') || n.textContent); n.classList.add('numeral--lit'); setTimeout(() => n.classList.remove('numeral--lit'), 700); }, t); tl.from(n, { autoAlpha: 0, duration: D.base }, t); }
        if (bodyEl) tl.from(bodyEl, { autoAlpha: 0, y: 12, duration: D.base }, t + 0.08);
      });
      const media = s.querySelector('[data-in-child="pool-open"]');
      if (media) tl.fromTo(media, { clipPath: 'circle(12% at 50% 50%)', autoAlpha: 0.6 }, { clipPath: 'circle(140% at 50% 50%)', autoAlpha: 1, duration: D.slow, ease: 'walk' }, 0.1);
      const link = s.querySelector('.decided-link, .idx-link');
      if (link) tl.from(link, { autoAlpha: 0 }, '>-0.2');
    },
    'pool-band'(s, tl) {
      const inset = s.querySelector('[data-inset], .band-inset');
      const media = s.querySelector('.moment-media, .band-bg');
      let origin = '75% 50%';
      if (inset) { const r = inset.getBoundingClientRect(), sr = s.getBoundingClientRect(); origin = `${((r.left + r.width / 2 - sr.left) / sr.width * 100).toFixed(1)}% ${((r.top + r.height / 2 - sr.top) / sr.height * 100).toFixed(1)}%`; }
      if (media) tl.fromTo(media, { clipPath: `circle(12% at ${origin})` }, { clipPath: `circle(140% at ${origin})`, duration: D.slow, ease: 'walk' }, 0);
      const copyKids = q(s, '.moment-copy > *, .band-copy > *'); if (copyKids.length) tl.from(copyKids, { y: 12, autoAlpha: 0, stagger: 0.08 }, 0.2);
      if (inset) tl.from(inset, { autoAlpha: 0, y: 12 }, 0.3);
    },
    'deal-right'(s, tl) {
      tl.from(q(s, '.shelf-head > *, .sec-head > *'), { y: 16, autoAlpha: 0, stagger: 0.06 }, 0);
      const items = q(s, '.shelf-item');
      tl.from(items.map((i) => i.querySelector('.phone-slot')), { x: 120, rotation: 6, autoAlpha: 0, duration: D.base, ease: 'walk', stagger: 0.04 }, 0.1);
      tl.from(items.map((i) => i.querySelector('.caption')), { autoAlpha: 0, y: 8, stagger: 0.04 }, 0.35);
      tl.from(q(s, '.shelf-link'), { autoAlpha: 0 }, '>-0.2');
    },
    'count-tiles'(s, tl) {
      tl.from(q(s, '.year-head > *'), { y: 16, autoAlpha: 0, stagger: 0.06 }, 0);
      q(s, '[data-stat]').forEach((tile, i) => {
        const t = 0.1 + i * 0.14;
        tl.from(tile, { autoAlpha: 0, y: 12, duration: D.base }, t);
        tl.add(() => { tile.classList.add('is-lit'); countUp(tile.querySelector('[data-count]'), tile.querySelector('[data-count]').getAttribute('data-count')); }, t + 0.05);
      });
      const ph = s.querySelector('[data-year-phone]');
      if (ph) tl.from(ph.querySelector('.shot'), { yPercent: 30, autoAlpha: 0, duration: D.slow, ease: 'walk' }, 0.5);
      tl.from(q(s, '.year-small, .year > .example'), { autoAlpha: 0, stagger: 0.08 }, '>-0.3');
    },
    'glass-rise'(s, tl) {
      tl.from(q(s, '.plans-head > *, .sec-head > *, .plans-hero > *'), { y: 16, autoAlpha: 0, stagger: 0.06 }, 0);
      const deck = s.querySelector('[data-deck]');
      if (deck) {
        const cards = q(deck, '.plan');
        tl.from(cards, { yPercent: 35, autoAlpha: 0, duration: D.slow, ease: 'walk', stagger: 0.12 }, 0.1);
        const pool = deck.querySelector('[data-pool-el]');
        if (pool) { tl.add(() => { pool.style.transition = 'none'; deck._cpMove && deck._cpMove('free', false); pool.style.opacity = 0; }, 0); tl.to(pool, { opacity: 1, duration: D.base }, 0.4); tl.add(() => { pool.style.transition = ''; deck._cpMove && deck._cpMove(deck.getAttribute('data-pool') || 'pass'); }, 0.55); }
      }
      const tcards = q(s, '[data-tcard]');
      if (tcards.length) tl.from(tcards, { rotationX: -90, transformPerspective: 900, autoAlpha: 0, duration: D.base, ease: 'rest', stagger: 0.08 }, '>-0.4');
      const tails = q(s, '.strip-link, .tstm-label, .grid-line'); if (tails.length) tl.from(tails, { autoAlpha: 0, stagger: 0.06 }, '>-0.2');
    },
    'word-fade'(s, tl) {
      const words = q(s, '.statement-h .w, .pull-h .w');
      if (words.length) tl.from(words, { autoAlpha: 0, y: 6, stagger: 0.04, duration: D.base }, 0);
      const seal = s.querySelector('[data-seal]');
      if (seal) tl.add(() => sealSettle(seal.querySelector('.kit') || seal), 0);
      tl.from(q(s, '.statement-body, .pull-body'), { autoAlpha: 0, y: 12 }, words.length ? words.length * 0.04 : 0.2);
    },
    'spread-slide'(s, tl) {
      tl.from(q(s, '.spread-media'), { y: 24, autoAlpha: 0, duration: D.slow, ease: 'walk' }, 0);
      tl.from(q(s, '.spread-text .h2'), { y: 12, autoAlpha: 0 }, 0.1);
      tl.from(q(s, '.pq'), { y: 12, autoAlpha: 0 }, 0.2);
      tl.from(q(s, '.pq-wrap .edge'), { scaleX: 0, transformOrigin: '50% 50%', duration: D.base, ease: 'walk', stagger: 0.05 }, 0.2);
      tl.from(q(s, '.spread-body, .spread-text > p:last-child'), { autoAlpha: 0, y: 8, stagger: 0.08 }, 0.35);
    },
    'markers'(s, tl) {
      tl.from(q(s, '.q-head > *, .sec-head > *'), { y: 12, autoAlpha: 0, stagger: 0.06 }, 0);
      const rows = q(s, '[data-faq-row]');
      rows.forEach((r, i) => {
        const t = 0.1 + i * 0.06;
        tl.from(r, { autoAlpha: 0, x: -8, duration: D.base }, t);
        const m = r.querySelector('.faq-mark');
        if (m) tl.fromTo(m, { filter: 'brightness(.5)' }, { filter: 'brightness(1.4)', duration: D.fast, yoyo: true, repeat: 1 }, t);
      });
    },
    'edge-draw'(s, tl) {
      const edge = s.querySelector('.edge--sec, .edge');
      if (edge) tl.from(edge, { scaleX: 0, transformOrigin: '0 50%', duration: D.slow, ease: 'walk' }, 0);
      tl.from(q(s, '.sms-lead, .sms-heading, .sms-ic'), { autoAlpha: 0, y: 8, stagger: 0.06 }, 0.3);
      tl.from(q(s, '.sms-form .field, .sms-actions'), { y: 8, autoAlpha: 0, stagger: 0.08, duration: D.base }, 0.45);
    },
    'close'(s, tl) {
      const pool = s.querySelector('.pool-divider');
      if (pool) tl.fromTo(pool, { autoAlpha: 0 }, { autoAlpha: 1, duration: D.slow, ease: 'rest' }, 0);
      tl.from(q(s, '.close-in'), { autoAlpha: 0, y: 10, duration: D.slow, ease: 'rest' }, 0.1);
    },
    'fade-block'(s, tl) { tl.from(s.children, { autoAlpha: 0, duration: D.base, ease: 'rest', stagger: 0.04 }, 0); },
    'rise'(s, tl) { tl.from(s.children, { autoAlpha: 0, y: 16, stagger: 0.08 }, 0); }
  };
  // Page scripts add their own entrances before init through this registry.
  window.CP_ENTRANCES = ENTRANCES;

  function initEntrances() {
    const sections = Array.from(document.querySelectorAll('[data-in]'));
    if (!hasGsap || RM) { sections.forEach((s) => { s.style.opacity = 1; }); return; }
    sections.forEach((s) => {
      const name = s.getAttribute('data-in');
      const fn = ENTRANCES[name] || ENTRANCES.rise;
      const tl = gsap.timeline({ paused: true });
      tl.set(s, { autoAlpha: 1 }, 0);
      let built = false;
      // While a section enters, its CSS transitions are off (.is-entering): a from() tween records its end value from the computed
      // style, and a hover transition on opacity or transform would hand it a value still mid transition, leaving the element dim.
      tl.eventCallback('onComplete', () => s.classList.remove('is-entering'));
      const build = () => { if (built) return; built = true; s.classList.add('is-entering'); try { fn(s, tl); } catch (e) { console.warn('entrance', name, e); tl.set(s, { autoAlpha: 1 }); } };
      ScrollTrigger.create({
        trigger: s, start: 'top 82%', once: true,
        onEnter: () => { build(); tl.play(); }
      });
      // A section already in view at load plays at once.
      const r = s.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.82 && r.bottom > 0) { build(); tl.play(); }
    });
    // Nothing stays hidden if a trigger never fires (very short pages).
    setTimeout(() => sections.forEach((s) => { if (parseFloat(getComputedStyle(s).opacity) === 0 && s.getBoundingClientRect().top < window.innerHeight) gsap.to(s, { autoAlpha: 1 }); }), 2500);
  }

  // ---------- forms: the GOV.UK standard ----------
  const MSG = {
    firstName: 'Enter your first name', lastName: 'Enter your last name', emailEmpty: 'Enter your email address',
    emailFormat: 'Enter an email address in the format name@example.com', phoneEmptyPaid: 'Enter a phone number for your receipt and renewal notices',
    phoneFormat: 'Enter a US phone number with 10 digits, like 303 555 0100', address1: 'Enter the first line of your billing address', city: 'Enter your city',
    state: 'Select your state', zip: 'Enter a ZIP code with 5 digits, like 80202', country: 'Select your country', ccName: 'Enter the name as it appears on your card',
    ccEmpty: 'Enter your card number, digits only', ccLuhn: 'Check your card number. The number you entered does not match a valid card.',
    expMonth: 'Select the month your card expires', expYear: 'Select the year your card expires', expPast: 'Your card\'s expiry date has passed. Use a card that is still valid.',
    csc: 'Enter the security code, 3 digits on the back of your card or 4 on the front',
    ack: 'Confirm you are 18 or older and agree to the Terms of Service and Privacy Policy to continue',
    contactName: 'Enter your name', message: 'Enter your message', quiz: 'Choose one answer to continue', password: 'Enter a password of at least 12 characters',
    failure: 'Sorry, we couldn\'t complete that. Nothing was charged. Try again in a moment, or email support@yourcashpass.com.',
    smsPhoneEmpty: 'Enter your phone number', smsC1: 'Tick the box to agree to the Terms and Privacy Policy', smsC2: 'Tick the box to agree to receive SMS marketing notifications',
    summaryTitle: 'There is a problem', leadOne: 'Fix the item below to continue.', leadMany: 'Fix the items below to continue.'
  };
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const phoneDigits = (v) => { let d = v.replace(/[\s.()\-]/g, ''); if (d.length === 11 && d[0] === '1') d = d.slice(1); return d; };
  const isUsPhone = (v) => /^\d{10}$/.test(phoneDigits(v));
  function luhn(num) {
    const d = num.replace(/\D/g, ''); if (d.length < 13 || d.length > 19) return false;
    let sum = 0, alt = false;
    for (let i = d.length - 1; i >= 0; i--) { let n = +d[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } sum += n; alt = !alt; }
    return sum % 10 === 0;
  }

  // A form controller: fields = [{ id, check: (value, input) => message|null }]; validates on blur after 400ms, never while typing.
  function formController(form, fields, opts = {}) {
    const summary = form.querySelector('[data-err-summary]');
    const list = summary && summary.querySelector('[data-err-list]');
    const lead = summary && summary.querySelector('[data-err-lead]');
    const byId = (id) => form.querySelector('#' + id);
    function setError(id, msg) {
      const input = byId(id); if (!input) return;
      const field = input.closest('[data-field]');
      const err = form.querySelector('#' + id + '-err') || (field && field.querySelector('.field-err'));
      if (msg) {
        field && field.classList.add('field--err');
        input.setAttribute('aria-invalid', 'true');
        if (err) { err.textContent = msg; err.hidden = false; input.setAttribute('aria-describedby', ((input.getAttribute('data-desc') || '') + ' ' + err.id).trim()); }
      } else {
        field && field.classList.remove('field--err');
        input.removeAttribute('aria-invalid');
        if (err) { err.hidden = true; err.textContent = ''; const d = input.getAttribute('data-desc'); if (d) input.setAttribute('aria-describedby', d); else input.removeAttribute('aria-describedby'); }
      }
    }
    function validateField(f) {
      const input = byId(f.id); if (!input) return null;
      if (f.skip && f.skip()) { setError(f.id, null); return null; }
      const value = input.type === 'checkbox' || input.type === 'radio' ? (input.checked ? 'on' : '') : input.value;
      const msg = f.check(value, input) || null;
      setError(f.id, msg);
      return msg;
    }
    fields.forEach((f) => {
      const input = byId(f.id); if (!input) return;
      let t;
      input.addEventListener('blur', () => { clearTimeout(t); t = setTimeout(() => validateField(f), 400); });
      if (input.type === 'checkbox' || input.tagName === 'SELECT') input.addEventListener('change', () => { if (input.getAttribute('aria-invalid')) validateField(f); });
    });
    function validateAll() {
      const errors = [];
      fields.forEach((f) => { const m = validateField(f); if (m) errors.push({ id: f.id, msg: m }); });
      if (summary) {
        if (errors.length) {
          list.innerHTML = errors.map((e) => `<li><a href="#${e.id}">${e.msg}</a></li>`).join('');
          lead.textContent = errors.length === 1 ? MSG.leadOne : MSG.leadMany;
          summary.hidden = false;
          list.querySelectorAll('a').forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); const t = byId(a.getAttribute('href').slice(1)); if (t) { t.focus(); t.scrollIntoView({ block: 'center', behavior: RM ? 'auto' : 'smooth' }); } }));
          summary.focus();
          if (opts.onInvalid) opts.onInvalid(errors);
        } else summary.hidden = true;
      }
      return errors;
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errors = validateAll();
      if (errors.length) return;
      opts.onValid && opts.onValid(form);
    });
    return { validateAll, validateField, setError, fields };
  }

  // ---------- the SMS block ----------
  function initSms(form) {
    const idp = form.id.replace(/-form$/, '');
    const ctrl = formController(form, [
      { id: idp + '-phone', check: (v) => !v.trim() ? MSG.smsPhoneEmpty : (!isUsPhone(v) ? MSG.phoneFormat : null) },
      { id: idp + '-c1', check: (v) => v ? null : MSG.smsC1 },
      { id: idp + '-c2', check: (v) => v ? null : MSG.smsC2 }
    ], {
      onValid: () => {
        const phone = form.querySelector('#' + idp + '-phone').value.trim();
        const p = document.createElement('p');
        p.className = 'sms-status sms-status--done'; p.setAttribute('role', 'status');
        p.textContent = `You're on the list. A confirmation text is on its way to ${phone}.`;
        const heading = form.querySelector('.sms-heading');
        const keep = heading ? heading.outerHTML : '';
        form.innerHTML = keep;
        form.appendChild(p);
        if (hasGsap && !RM) gsap.from(p, { autoAlpha: 0, y: 8 });
      }
    });
    return ctrl;
  }
  document.querySelectorAll('[data-sms-form]').forEach(initSms);

  // ---------- videos: desktop autoplay in view, the mobile encode under 900px, posters under reduced motion ----------
  function initVideos() {
    document.querySelectorAll('video[data-mobile-src]').forEach((v) => {
      if (MOBILE()) {
        const m = v.getAttribute('data-mobile-src');
        v.innerHTML = `<source src="${m}" type="video/mp4">`;
        v.preload = 'none';
        return;
      }
      if (RM || SAVE_DATA) { v.preload = 'none'; return; }
      if (!('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver((es) => es.forEach((en) => {
        if (en.isIntersecting) { if (v.preload === 'none') { v.preload = 'auto'; try { v.load(); } catch (e) {} } v.play().then(() => v.classList.add('is-on')).catch(() => {}); }
        else v.pause();
      }), { threshold: 0.15 });
      io.observe(v);
      document.addEventListener('visibilitychange', () => { if (document.hidden) v.pause(); });
    });
  }
  initVideos();

  // ---------- FAQ rows: the first open on desktop and none on mobile ----------
  if (MOBILE()) document.querySelectorAll('details[data-open-desktop]').forEach((d) => { d.open = false; });

  // ---------- dim the others (legal pages, 404) ----------
  if (body.getAttribute('data-hover') === 'dim') {
    const hs = document.querySelectorAll('.main h1, .main h2, .main h3');
    hs.forEach((h) => {
      const on = () => { body.classList.add('dimming'); h.classList.add('lit-h'); };
      const off = () => { body.classList.remove('dimming'); h.classList.remove('lit-h'); };
      h.addEventListener('mouseenter', on); h.addEventListener('mouseleave', off);
      h.addEventListener('focusin', on); h.addEventListener('focusout', off);
    });
  }

  // ---------- the plan deck: the pool of light rests on Pass and walks to a hovered plan ----------
  function deckPool(deck) {
    if (!deck) return;
    const pool = deck.querySelector('[data-pool-el]'); if (!pool) return;
    const cards = Array.from(deck.querySelectorAll('.plan'));
    const home = deck.getAttribute('data-pool') || 'pass';
    function moveTo(id, light = true) {
      const c = cards.find((x) => x.getAttribute('data-plan') === id);
      if (!c) { pool.classList.add('pool--off'); return; }
      const g = pool.parentElement.getBoundingClientRect();
      const r = c.getBoundingClientRect();
      pool.classList.remove('pool--off');
      pool.style.left = ((r.left + r.width / 2 - g.left) / g.width * 100).toFixed(2) + '%';
      if (light) cards.forEach((x) => x.classList.toggle('plan--lit', x === c));
    }
    deck._cpMove = moveTo;
    requestAnimationFrame(() => moveTo(home));
    window.addEventListener('resize', () => moveTo(deck._cpCurrent || home));
    if (RM || TOUCH) return;
    cards.forEach((c) => {
      c.addEventListener('mouseenter', () => { deck._cpCurrent = c.getAttribute('data-plan'); moveTo(deck._cpCurrent); });
      c.addEventListener('mouseleave', () => { deck._cpCurrent = home; moveTo(home); });
    });
  }

  // ---------- Three.js r128, lazy after first paint, one canvas per page, paused offscreen, disposed on navigation ----------
  let threePromise = null;
  function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.async = true; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  function loadThree() {
    if (threePromise) return threePromise;
    threePromise = new Promise((resolve, reject) => {
      const start = () => loadScript('/assets/vendor/three/three.min.js').then(() => loadScript('/assets/vendor/three/loaders/RGBELoader.js')).then(() => resolve(window.THREE)).catch(reject);
      if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1500 }); else setTimeout(start, 300);
    });
    return threePromise;
  }
  function webglOk() {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
  }
  // Runs one scene: setup(THREE, ctx) returns { update(dt, elapsed), resize(w, h), dispose() }.
  function makeScene(container, setup, opts = {}) {
    if (!container || RM || (TOUCH && !opts.allowTouch) || MOBILE() || !webglOk()) return Promise.resolve(null);
    return loadThree().then((THREE) => {
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = opts.exposure || 1.0;
      const w = container.clientWidth || 800, h = container.clientHeight || 500;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
      container.appendChild(renderer.domElement);
      container.classList.add('has-webgl');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(opts.fov || 35, w / h, 0.1, 100);
      const ctx = { renderer, scene, camera, container, width: w, height: h, visible: true, env: null };
      const api = setup(THREE, ctx) || {};
      let last = performance.now(), elapsed = 0, running = true, visible = true, hidden = document.hidden;
      function frame(now) {
        if (!running) return;
        requestAnimationFrame(frame);
        if (!visible || hidden) return;
        const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now; elapsed += dt;
        api.update && api.update(dt, elapsed);
        renderer.render(scene, camera);
      }
      requestAnimationFrame(frame);
      const io = new IntersectionObserver((es) => es.forEach((en) => { visible = en.isIntersecting; }), { threshold: 0 });
      io.observe(container);
      const onVis = () => { hidden = document.hidden; };
      document.addEventListener('visibilitychange', onVis);
      const onResize = () => { const nw = container.clientWidth, nh = container.clientHeight; if (!nw || !nh) return; renderer.setSize(nw, nh, false); camera.aspect = nw / nh; camera.updateProjectionMatrix(); ctx.width = nw; ctx.height = nh; api.resize && api.resize(nw, nh); };
      window.addEventListener('resize', onResize);
      const dispose = () => {
        running = false; io.disconnect(); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis);
        api.dispose && api.dispose();
        scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) { const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach((m) => { Object.keys(m).forEach((k) => { if (m[k] && m[k].isTexture) m[k].dispose(); }); m.dispose(); }); } });
        if (ctx.env) ctx.env.dispose();
        renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      };
      window.addEventListener('pagehide', dispose, { once: true });
      return { ...ctx, api, dispose };
    }).catch((e) => { console.warn('scene failed', e); return null; });
  }
  // The one HDRI at low intensity, for faint reflections only.
  function loadEnv(THREE, ctx, intensity = 0.05) {
    return new Promise((resolve) => {
      try {
        new THREE.RGBELoader().load('/assets/media/3d/small_empty_room_2_512.hdr', (tex) => {
          const pmrem = new THREE.PMREMGenerator(ctx.renderer);
          const env = pmrem.fromEquirectangular(tex).texture;
          tex.dispose(); pmrem.dispose();
          ctx.scene.environment = env; ctx.env = env;
          ctx.scene.traverse((o) => { if (o.material && 'envMapIntensity' in o.material) o.material.envMapIntensity = intensity; });
          resolve(env);
        }, undefined, () => resolve(null));
      } catch (e) { resolve(null); }
    });
  }
  // A phone: a plane carrying a device shot with alpha, standing upright.
  function phonePlane(THREE, src, height = 1.6) {
    const geo = new THREE.PlaneGeometry(height * 15 / 29, height);
    const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1, side: THREE.DoubleSide, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    new THREE.TextureLoader().load(src, (t) => { t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; mat.map = t; mat.needsUpdate = true; });
    return mesh;
  }
  function glassSlab(THREE, w = 8, d = 4) {
    const geo = new THREE.PlaneGeometry(w, d);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x050202, roughness: 0.62, metalness: 0, clearcoat: 0.22, clearcoatRoughness: 0.55, reflectivity: 0.18 });
    const m = new THREE.Mesh(geo, mat); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; return m;
  }
  function leatherPlane(THREE, w = 30, d = 30) {
    const geo = new THREE.PlaneGeometry(w, d);
    const mat = new THREE.MeshStandardMaterial({ color: 0x2E0B0C, roughness: 0.85, metalness: 0 });
    const tl = new THREE.TextureLoader();
    tl.load('/assets/media/3d/leather_red_03_nor_512.webp', (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / 3, d / 3); mat.normalMap = t; mat.normalScale = new THREE.Vector2(0.6, 0.6); mat.needsUpdate = true; });
    tl.load('/assets/media/3d/leather_red_03_rough_512.webp', (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / 3, d / 3); mat.roughnessMap = t; mat.needsUpdate = true; });
    const m = new THREE.Mesh(geo, mat); m.rotation.x = -Math.PI / 2; m.position.y = -0.01; return m;
  }
  const lerp = (a, b, t) => a + (b - a) * t;

  // ---------- utilities for the page scripts ----------
  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  function renewalDate(from) {
    const d = new Date(from || Date.now()); d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  function money(n) { return '$' + Number(n).toFixed(2); }
  function symWrap(s) { return String(s).replace(/(\$|%)/g, '<span class="sym">$1</span>'); }
  function storageGet(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return window.CP_MEM && window.CP_MEM[key] || null; } }
  function storageSet(key, v) { window.CP_MEM = window.CP_MEM || {}; window.CP_MEM[key] = v; try { if (v === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* memory */ } }

  window.CP = { RM, TOUCH, MOBILE, SAVE_DATA, ROUTE, D, WALK, REST, lenis, scrollToY, toast, Cart, PLANS, tilt, lastLight, countUp, drawPath, sealSettle, formController, MSG, isEmail, isUsPhone, phoneDigits, luhn, ready, renewalDate, money, symWrap, storageGet, storageSet, hasGsap, ENTRANCES, initEntrances, q, deckPool, loadThree, makeScene, loadEnv, phonePlane, glassSlab, leatherPlane, lerp, webglOk };

  // Entrances start after the page script has had a chance to register its own (it runs before DOMContentLoaded completes because scripts are deferred in order).
  ready(() => {
    tilt(Array.from(document.querySelectorAll('[data-tilt]')));
    tilt(Array.from(document.querySelectorAll('.deck .plan')), 6);
    document.querySelectorAll('.plan').forEach((p) => { if (!p.querySelector('.glare')) { const g = document.createElement('span'); g.className = 'glare'; g.setAttribute('aria-hidden', 'true'); p.appendChild(g); } });
    document.querySelectorAll('[data-footer] [data-seal] .kit').forEach((s) => {
      if (!hasGsap || RM) return;
      ScrollTrigger.create({ trigger: s, start: 'top 95%', once: true, onEnter: () => sealSettle(s) });
    });
    // The footer's five cards rise out of the glass and one lights.
    const ftr = document.querySelector('[data-footer]');
    if (ftr && hasGsap && !RM) {
      const cards = ftr.querySelectorAll('[data-fcard]');
      gsap.set(cards, { yPercent: 60, autoAlpha: 0 });
      ScrollTrigger.create({ trigger: ftr.querySelector('.ftr-row4'), start: 'top 90%', once: true, onEnter: () => {
        const tl = gsap.timeline();
        tl.to(cards, { yPercent: 0, autoAlpha: 1, duration: D.slow, ease: 'walk', stagger: 0.1 });
        tl.from(ftr.querySelector('.fcard--lit .mark'), { filter: 'brightness(.3)', duration: D.base }, '-=0.3');
      } });
    }
    // Deferred scripts run while readyState is already 'interactive', so this callback runs before the page script has registered its
    // entrances. Start them on DOMContentLoaded, which fires after every deferred script, so each section gets its own choreography.
    const startEntrances = () => { if (!window.CP_DEFER_ENTRANCES) initEntrances(); };
    if (document.readyState === 'complete') startEntrances(); else document.addEventListener('DOMContentLoaded', startEntrances);
    if (hasGsap && window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 600);
  });
})();
