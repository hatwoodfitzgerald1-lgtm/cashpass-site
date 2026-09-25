/* Plans: The Third Card (the CSS glass stage that tilts to a reading angle), the flip hover, the sticky summary, the accordion with media reveal. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q, PLANS } = CP;
  const E = CP.ENTRANCES;

  // The flip: each word turns on its horizontal axis and shows itself in Instrument Serif for the length of the hover.
  if (!CP.TOUCH) {
    document.querySelectorAll('.main h1, .main .sec-head h2, .main .close-h, .main .before-head h2, .main .three-faq h2, .main .pull-h, .main .faq-h, .main .spec-lead h3').forEach((el) => {
      if (el.querySelector('.flipw') || el.closest('.plan')) return;
      const text = el.textContent;
      el.setAttribute('aria-label', text);
      el.innerHTML = text.split(' ').map((w) => { const safe = w.replace(/&/g, '&amp;').replace(/</g, '&lt;'); return `<span class="flipw"><span class="fa">${safe}</span><span class="fb" aria-hidden="true">${safe}</span></span>`; }).join(' ');
    });
  }

  E['rows-left'] = (s, tl) => {
    tl.from(s.querySelector('.spec-summary'), { x: -16, autoAlpha: 0 }, 0);
    q(s, '.spec-plan').forEach((p, i) => {
      const t = 0.1 + i * 0.12;
      tl.from(p.querySelector('.spec-lead'), { autoAlpha: 0, x: -16 }, t);
      const rows = q(p, '[data-spec-row]');
      tl.from(rows, { x: -24, autoAlpha: 0, duration: D.base, stagger: 0.04 }, t + 0.05);
      tl.from(rows.map((r) => r.querySelector('.bullet')), { filter: 'brightness(.4)', stagger: 0.04, duration: D.fast }, t + 0.1);
    });
    const pq = s.querySelector('[data-type-on]');
    if (pq && !RM) {
      const text = pq.textContent; const chars = text.split('');
      pq.setAttribute('aria-label', text);
      pq.innerHTML = chars.map((c) => `<span class="tc" aria-hidden="true">${c === ' ' ? '&nbsp;' : c.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join('');
      tl.from(q(pq, '.tc'), { autoAlpha: 0, duration: 0.02, stagger: 0.028, ease: 'none' }, '>-0.1');
      tl.from(q(s, '.pull .edge'), { scaleX: 0, transformOrigin: '50% 50%', duration: D.slow, ease: 'walk' }, '<');
    }
  };
  E['edge-rows'] = (s, tl) => {
    const band = s.querySelector('.before-band');
    if (band) tl.fromTo(band, { scale: 1.04 }, { scale: 1, duration: D.slow, ease: 'rest' }, 0);
    tl.from(s.querySelector('.before-head'), { autoAlpha: 0, y: 12 }, 0.1);
    q(s, '[data-acc-row]').forEach((r, i) => {
      tl.from(r, { autoAlpha: 0, duration: D.base }, 0.2 + i * 0.06);
      tl.fromTo(r, { backgroundImage: 'linear-gradient(90deg, rgba(233,241,248,.5), rgba(233,241,248,.5))', backgroundSize: '0 1px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 0' }, { backgroundSize: '100% 1px', duration: D.base, ease: 'walk' }, 0.2 + i * 0.06);
    });
    tl.from(s.querySelector('[data-acc-media]'), { autoAlpha: 0, y: 12 }, 0.3);
  };
  E['flip-cards'] = (s, tl) => {
    tl.from(s.querySelector('.three-faq h2'), { y: 12, autoAlpha: 0 }, 0);
    q(s, '[data-faq-row]').forEach((r, i) => { tl.from(r, { autoAlpha: 0, x: -8 }, 0.1 + i * 0.06); const m = r.querySelector('.faq-mark'); if (m) tl.fromTo(m, { filter: 'brightness(.5)' }, { filter: 'brightness(1.4)', duration: D.fast, yoyo: true, repeat: 1 }, 0.1 + i * 0.06); });
    tl.from(q(s, '[data-tcard]'), { rotationX: -90, transformPerspective: 900, autoAlpha: 0, duration: D.base, stagger: 0.08 }, 0.25);
    tl.from(s.querySelector('.tstm-label'), { autoAlpha: 0 }, '>-0.1');
  };

  // ---------- The Third Card: the stage tilts from table level to a reading angle as the page opens ----------
  const third = document.querySelector('[data-third-card] .deck');
  if (third && hasGsap && !RM) {
    if (CP.TOUCH) gsap.set(third, { rotationX: 0 });
    else {
      gsap.set(third, { rotationX: 12, transformOrigin: '50% 100%', transformPerspective: 1800 });
      gsap.to(third, { rotationX: 0, ease: 'none', scrollTrigger: { trigger: third, start: 'top 95%', end: 'top 25%', scrub: 0.6 } });
    }
  }
  CP.deckPool && CP.deckPool(document.querySelector('[data-deck]'));

  // ---------- the sticky summary follows the hovered plan, and the pool follows the hover ----------
  const sumText = document.querySelector('[data-spec-text]');
  const sumLink = document.querySelector('[data-spec-link]');
  const deck = document.querySelector('[data-deck]');
  function setSummary(id) {
    const p = PLANS[id]; if (!p || !sumText) return;
    sumText.textContent = p.stickySummary;
    if (sumLink) { sumLink.textContent = p.name; sumLink.setAttribute('href', '#plan-' + id); }
    if (hasGsap && !RM) gsap.fromTo(sumText, { autoAlpha: 0.4, y: 4 }, { autoAlpha: 1, y: 0, duration: D.fast });
    q(document, '.spec-plan').forEach((sp) => sp.classList.toggle('is-hot', sp.getAttribute('data-spec-plan') === id));
  }
  q(document, '.deck .plan, .spec-plan').forEach((el) => {
    const id = el.getAttribute('data-plan') || el.getAttribute('data-spec-plan');
    el.addEventListener('mouseenter', () => { setSummary(id); if (deck && deck._cpMove && el.classList.contains('spec-plan')) deck._cpMove(id); });
    el.addEventListener('mouseleave', () => { setSummary('pass'); if (deck && deck._cpMove && el.classList.contains('spec-plan')) deck._cpMove('pass'); });
    el.addEventListener('focusin', () => setSummary(id));
  });

  // ---------- accordion with media reveal: one row open, the matching screen fades up ----------
  const rows = q(document, '[data-acc-row]');
  const shots = q(document, '[data-acc-shot]');
  rows.forEach((r) => r.addEventListener('toggle', () => {
    if (!r.open) return;
    rows.forEach((o) => { if (o !== r) o.open = false; });
    const id = r.getAttribute('data-shot');
    shots.forEach((sh) => sh.classList.toggle('is-active', sh.getAttribute('data-acc-shot') === id));
    const active = shots.find((sh) => sh.getAttribute('data-acc-shot') === id);
    if (active && hasGsap && !RM) gsap.fromTo(active, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: D.base, ease: 'rest' });
  }));

  // ---------- mobile: a fixed bottom bar shows the last tapped plan's price, renewal line and purchase button ----------
  if (CP.MOBILE()) {
    const bar = document.createElement('div');
    bar.className = 'plans-bar'; bar.setAttribute('aria-live', 'polite');
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:90;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px var(--gutter);min-height:56px;background:rgba(62,17,19,.96);box-shadow:inset 0 1px 0 rgba(233,241,248,.4)';
    const set = (id) => { const p = PLANS[id]; bar.innerHTML = `<span class="price-line" style="line-height:1.2">${p.name}. ${p.priceDisplay}. ${p.renewsShort}.</span><a class="tile ${p.ctaStyle === 'filled' ? '' : 'tile--ghost'}" style="min-height:44px" href="/cart?add=${id}" data-add-plan="${id}">${p.cta}</a>`; };
    set('pass'); document.body.appendChild(bar);
    // The bar never hides the last tile: the page keeps room for it and scroll into view stops above it.
    document.documentElement.style.scrollPaddingBottom = '88px'; document.body.style.paddingBottom = '72px';
    q(document, '.deck .plan').forEach((el) => el.addEventListener('click', (e) => { if (!e.target.closest('a')) set(el.getAttribute('data-plan')); }));
  }
})();
