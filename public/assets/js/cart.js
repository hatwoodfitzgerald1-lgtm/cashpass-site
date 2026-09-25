/* Your cart: one plan on the glass slot, the sticky summary, the replace notice, Remove, the designed empty state. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q, PLANS, Cart } = CP;
  window.CP_CART_PAGE = true;
  const E = CP.ENTRANCES;
  E['rows-right'] = (s, tl) => { tl.from(q(s, '[data-sum-row], .sum-line, .cta-row'), { x: 24, autoAlpha: 0, stagger: 0.06 }, 0); };

  const full = document.querySelector('[data-cart-full]');
  const empty = document.querySelector('[data-cart-empty]');
  const replace = document.querySelector('[data-cart-replace]');
  const card = document.querySelector('[data-slot-card]');
  const el = (s) => document.querySelector(s);

  // The no script path lands here with ?add=plan; add it and clean the address.
  const params = new URLSearchParams(location.search);
  if (params.get('add') && PLANS[params.get('add')]) { Cart.add(params.get('add')); history.replaceState(null, '', '/cart'); }

  function fill(rec) {
    const p = PLANS[rec.plan];
    el('[data-slot-name]').textContent = p.name;
    el('[data-slot-price]').innerHTML = CP.symWrap(p.priceNumeral);
    el('[data-slot-renew]').textContent = p.renewsShort;
    el('[data-slot-unit]').textContent = p.unitLine;
    el('[data-sum-plan]').textContent = p.name;
    el('[data-sum-price]').innerHTML = CP.symWrap(p.amountDisplay);
    el('[data-sum-total]').innerHTML = CP.symWrap(p.amountDisplay);
    document.title = 'Your cart';
  }
  let shownEmpty = false;
  function render(animateIn) {
    const rec = Cart.read();
    if (rec && rec.plan) {
      fill(rec);
      full.hidden = false; empty.hidden = true;
      if (rec.replaced) { replace.hidden = false; replace.textContent = `Your cart holds one plan. ${PLANS[rec.plan].name} replaced ${PLANS[rec.replaced].name}.`; }
      else replace.hidden = true;
      if (rec.justAdded) {
        CP.toast(rec.replaced ? `Your cart holds one plan. ${PLANS[rec.plan].name} replaced ${PLANS[rec.replaced].name}.` : PLANS[rec.plan].toastAdded, { action: { label: 'Go to checkout', href: '/checkout' } });
        Cart.write({ ...rec, justAdded: false });
      }
      if (hasGsap && !RM) {
        if (animateIn === 'replace') {
          gsap.fromTo(card, { x: 120, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: D.slow, ease: 'walk' });
        } else if (animateIn) {
          gsap.fromTo(card, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: D.slow, ease: 'walk' });
          gsap.from('.slot-ref', { autoAlpha: 0, duration: D.base, delay: 0.4 });
        }
      }
    } else {
      full.hidden = true; empty.hidden = false; replace.hidden = true;
      if (hasGsap && !RM && !shownEmpty) {
        shownEmpty = true;
        const cards = q(empty, '[data-fcard]');
        gsap.from(cards, { yPercent: 60, autoAlpha: 0, duration: D.slow, ease: 'walk', stagger: 0.1 });
        gsap.from(q(empty, '.empty-copy > *'), { autoAlpha: 0, y: 10, stagger: 0.08, delay: 0.4 });
      }
    }
  }
  render(true);

  el('[data-remove]').addEventListener('click', () => {
    const rec = Cart.read(); if (!rec) return;
    const name = PLANS[rec.plan].name;
    const done = () => { Cart.clear(); render(false); CP.toast(`${name} removed. Your cart is empty.`); };
    if (hasGsap && !RM) gsap.to(card, { x: -120, autoAlpha: 0, duration: D.base, ease: 'walk', onComplete: () => { gsap.set(card, { clearProps: 'all' }); done(); } });
    else done();
  });

  // Choosing a second plan while on the cart page slides the first off the glass and the second on.
  document.addEventListener('cp:cart-added', (e) => {
    const rec = e.detail;
    const wasFull = !full.hidden;
    if (hasGsap && !RM && wasFull) {
      gsap.to(card, { x: -120, autoAlpha: 0, duration: D.base, ease: 'walk', onComplete: () => { gsap.set(card, { clearProps: 'all' }); render('replace'); } });
    } else render(true);
    window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
  });
})();
