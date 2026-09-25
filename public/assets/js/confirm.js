/* Order confirmed: The Light Stays On, the details, the activation line, the optional password after the order. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q, PLANS, MSG } = CP;
  const E = CP.ENTRANCES;
  const order = CP.storageGet('cashpass.order');
  if (!order || !PLANS[order.plan]) { window.location.replace('/plans'); return; }
  const plan = PLANS[order.plan];
  const paid = plan.price > 0;
  const $ = (s) => document.querySelector(s);
  const h = $('[data-confirm-headline]');
  h.textContent = plan.confirmHeadline; $('#confirm-h').setAttribute('aria-label', plan.confirmHeadline);
  q(document, '[data-confirm-number], [data-cf-number]').forEach((el) => { el.textContent = order.number; });
  $('[data-cf-name]').textContent = plan.name;
  $('[data-cf-price]').innerHTML = CP.symWrap(plan.amountDisplay);
  $('[data-cf-renew]').textContent = paid ? plan.renewsShort : 'Never bills';
  $('[data-cf-unit]').textContent = plan.unitLine;
  $('[data-cf-plan]').textContent = plan.name;
  $('[data-cf-amount]').innerHTML = CP.symWrap(plan.amountDisplay);
  $('[data-cf-renews]').textContent = paid ? `${order.renewal}, at $${plan.price} a year` : 'Never bills';
  $('[data-cf-email]').textContent = order.email;
  // The order line, the details and the activation line ship hidden with empty values; they show once the order has filled them.
  q(document, '[data-confirm-line], [data-cf-details], [data-activation-line]').forEach((el) => { el.hidden = false; });

  E['rows-right'] = (s, tl) => { tl.from(s.querySelector('h2'), { autoAlpha: 0 }, 0); tl.from(q(s, '[data-detail]'), { x: 24, autoAlpha: 0, stagger: 0.08 }, 0.1); };
  E['type-line'] = (s, tl) => {
    tl.add(() => CP.sealSettle(s.querySelector('[data-seal] .kit')), 0);
    const line = s.querySelector('[data-activation-line]');
    if (line && !RM) {
      const nodes = Array.from(line.childNodes);
      const text = line.textContent; line.setAttribute('aria-label', text);
      const frag = document.createDocumentFragment();
      nodes.forEach((nd) => { if (nd.nodeType === 3) { nd.textContent.split('').forEach((c) => { const sp = document.createElement('span'); sp.className = 'tc'; sp.setAttribute('aria-hidden', 'true'); sp.textContent = c; frag.appendChild(sp); }); } else frag.appendChild(nd); });
      line.innerHTML = ''; line.appendChild(frag);
      tl.from(q(line, '.tc'), { autoAlpha: 0, duration: 0.02, stagger: 0.012, ease: 'none' }, 0.1);
    }
    tl.from(s.querySelector('.activation-receipt'), { autoAlpha: 0, y: 8 }, '>-0.2');
    tl.from(s.querySelector('.cta-row'), { y: 16, autoAlpha: 0 }, '>-0.1');
  };
  E['fade-last'] = (s, tl) => { tl.fromTo(s.querySelector('.account-form'), { autoAlpha: 0 }, { autoAlpha: 0.6, duration: D.base }, 0); tl.to(s.querySelector('.account-form'), { autoAlpha: 1, duration: D.base, ease: 'rest' }, D.base + 0.2); tl.from(s.querySelector('.help-line'), { autoAlpha: 0 }, 0.3); };

  // The Light Stays On: the headline arrives as The Last Light, the card lights, the seal settles.
  CP.ready(() => {
    const stage = $('[data-confirm-stage]');
    if (hasGsap && !RM) {
      gsap.from(stage.querySelector('[data-confirm-card]'), { yPercent: 30, autoAlpha: 0, duration: D.slow, ease: 'walk', delay: 0.1 });
      CP.sealSettle(stage.querySelector('[data-seal] .kit'));
      gsap.from($('[data-confirm-line]'), { autoAlpha: 0, y: 8, delay: 0.5 });
      CP.lastLight($('#confirm-h'));
      // The seal responds to the pointer with a slight tilt.
      if (!CP.TOUCH) CP.tilt([stage.querySelector('[data-seal]')], 8);
    } else gsap && gsap.set($('#confirm-h'), { autoAlpha: 1 });
  });

  // ---------- the optional password, after the order ----------
  const form = $('[data-account-form]');
  const acct = $('[data-account]');
  if (form) {
    form.addEventListener('focusin', () => form.classList.add('is-full'));
    const pw = $('#pw');
    const toggle = $('[data-pw-toggle]');
    if (toggle) toggle.addEventListener('click', () => { const show = pw.type === 'password'; pw.type = show ? 'text' : 'password'; toggle.setAttribute('aria-pressed', show ? 'true' : 'false'); toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); });
    CP.formController(form, [{ id: 'pw', check: (v) => v.length >= 12 ? null : MSG.password }], {
      onValid: () => {
        CP.storageSet('cashpass.account', { email: order.email, createdAt: Date.now() });
        const p = document.createElement('p'); p.className = 'account-status'; p.setAttribute('role', 'status'); p.textContent = 'Account created. Sign in later with this email.';
        form.innerHTML = ''; form.appendChild(p); form.classList.add('is-full');
      }
    });
    const skip = $('[data-skip-account]');
    if (skip) skip.addEventListener('click', (e) => { e.preventDefault(); if (hasGsap && !RM) gsap.to(form, { autoAlpha: 0, duration: D.base, onComplete: () => { form.hidden = true; } }); else form.hidden = true; });
  }
})();
