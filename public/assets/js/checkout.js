/* Checkout: the complete guest checkout for one digital plan, GOV.UK errors, the Luhn check, the Free variant, The Receipt Side. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q, PLANS, Cart, MSG } = CP;
  const E = CP.ENTRANCES;
  const rec = Cart.read();
  if (!rec || !PLANS[rec.plan]) { window.location.replace('/plans'); return; }
  const plan = PLANS[rec.plan];
  const paid = plan.price > 0;
  const form = document.querySelector('[data-co-form]');
  const $ = (s) => document.querySelector(s);
  const renewal = CP.renewalDate();

  // ---------- the variant ----------
  form.setAttribute('data-plan', plan.id);
  q(document, '[data-paid-only]').forEach((el) => { el.hidden = !paid; });
  q(document, '[data-free-only]').forEach((el) => { el.hidden = paid; });
  if (!paid) {
    const phoneField = $('[data-field-id="phone"]');
    phoneField.querySelector('[data-req]').textContent = '(optional)';
    phoneField.querySelector('[data-helper]').textContent = 'Optional on the Free plan.';
    $('[data-disc-lead]').textContent = 'Before you finish, one plain fact.';
  }
  // Numbering keeps its words and closes the gap when the billing section is absent.
  let n = 0;
  q(document, '[data-co-sec]').forEach((sec) => { if (sec.hidden) return; n++; sec.querySelector('[data-co-num]').textContent = String(n); sec.querySelector('[data-co-n]').textContent = String(n); });
  const renewText = paid ? `Renews at $${plan.price} a year on ${renewal}` : 'Never bills';
  ['[data-os-plan]', '[data-cs-plan]', '[data-rc-name]'].forEach((s) => { $(s).textContent = plan.name; });
  ['[data-os-price]', '[data-cs-price]', '[data-os-total]', '[data-cs-total]', '[data-rc-price]', '[data-sum-total-mini]', '[data-bar-total]'].forEach((s) => { const el = $(s); if (el) el.innerHTML = CP.symWrap(plan.amountDisplay); });
  $('[data-os-renew]').textContent = renewText; $('[data-cs-renew]').textContent = renewText;
  $('[data-os-renew-label]').textContent = paid ? 'Renewal' : 'Renewal';
  const payBtn = $('[data-pay]'); payBtn.textContent = plan.payButton;
  const barPay = $('[data-bar-pay]'); if (barPay) barPay.textContent = plan.payButton;

  // ---------- helpers: name on card prefilled, card number grouped, the type detected, the security code length ----------
  const first = $('#first-name'), last = $('#last-name'), ccName = $('#cc-name'), ccNum = $('#cc-number'), csc = $('#cc-csc');
  let ccNameEdited = false;
  ccName.addEventListener('input', () => { ccNameEdited = !!ccName.value.trim(); });
  const prefill = () => { if (!ccNameEdited && !ccName.value.trim() || (!ccNameEdited && ccName.dataset.auto === '1')) { ccName.value = `${first.value.trim()} ${last.value.trim()}`.trim(); ccName.dataset.auto = '1'; } };
  first.addEventListener('blur', prefill); last.addEventListener('blur', prefill);
  const digitsOf = (v) => v.replace(/\D/g, '').slice(0, 19);
  const isAmex = (d) => /^3[47]/.test(d);
  function group(d) {
    if (isAmex(d)) return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(' ');
    return d.replace(/(.{4})/g, '$1 ').trim();
  }
  function typeOf(d) { if (/^4/.test(d)) return 'visa'; if (/^(5[1-5]|2[2-7])/.test(d)) return 'mastercard'; if (isAmex(d)) return 'amex'; if (/^6/.test(d)) return 'discover'; return ''; }
  ccNum.addEventListener('input', () => {
    const d = digitsOf(ccNum.value);
    const caretEnd = ccNum.selectionStart === ccNum.value.length;
    ccNum.value = group(d);
    if (caretEnd) ccNum.setSelectionRange(ccNum.value.length, ccNum.value.length);
    const t = typeOf(d);
    q(document, '[data-cc]').forEach((m) => m.classList.toggle('is-on', m.getAttribute('data-cc') === t));
    csc.maxLength = isAmex(d) ? 4 : 3;
  });
  const cscHelp = $('[data-csc-help]');
  if (cscHelp) cscHelp.addEventListener('click', () => { const open = cscHelp.getAttribute('aria-expanded') !== 'true'; cscHelp.setAttribute('aria-expanded', open ? 'true' : 'false'); $('#cc-csc-help').hidden = !open; });

  // ---------- validation ----------
  const val = (id) => ($('#' + id) || {}).value || '';
  const fields = [
    { id: 'first-name', sec: 'contact', check: (v) => v.trim() ? null : MSG.firstName },
    { id: 'last-name', sec: 'contact', check: (v) => v.trim() ? null : MSG.lastName },
    { id: 'email', sec: 'contact', check: (v) => !v.trim() ? MSG.emailEmpty : (!CP.isEmail(v) ? MSG.emailFormat : null) },
    { id: 'phone', sec: 'contact', check: (v) => { if (!v.trim()) return paid ? MSG.phoneEmptyPaid : null; return CP.isUsPhone(v) ? null : MSG.phoneFormat; } },
    { id: 'address1', sec: 'billing', skip: () => !paid, check: (v) => v.trim() ? null : MSG.address1 },
    { id: 'city', sec: 'billing', skip: () => !paid, check: (v) => v.trim() ? null : MSG.city },
    { id: 'state', sec: 'billing', skip: () => !paid, check: (v) => v ? null : MSG.state },
    { id: 'zip', sec: 'billing', skip: () => !paid, check: (v) => /^\d{5}(-\d{4})?$/.test(v.trim()) ? null : MSG.zip },
    { id: 'country', sec: 'billing', skip: () => !paid, check: (v) => v ? null : MSG.country },
    { id: 'cc-name', sec: 'payment', skip: () => !paid, check: (v) => v.trim() ? null : MSG.ccName },
    { id: 'cc-number', sec: 'payment', skip: () => !paid, check: (v) => { const d = digitsOf(v); if (!d) return MSG.ccEmpty; return CP.luhn(d) ? null : MSG.ccLuhn; } },
    { id: 'cc-exp-month', sec: 'payment', skip: () => !paid, check: (v) => { if (!v) return MSG.expMonth; const y = val('cc-exp-year'); if (y && expired(v, y)) return MSG.expPast; return null; } },
    { id: 'cc-exp-year', sec: 'payment', skip: () => !paid, check: (v) => v ? null : MSG.expYear },
    { id: 'cc-csc', sec: 'payment', skip: () => !paid, check: (v) => { const need = isAmex(digitsOf(val('cc-number'))) ? 4 : 3; return new RegExp(`^\\d{${need}}$`).test(v.trim()) ? null : MSG.csc; } },
    { id: 'ack', sec: 'ack', check: (v) => v ? null : MSG.ack }
  ];
  function expired(m, y) { const now = new Date(); const yy = parseInt(y, 10), mm = parseInt(m, 10); return yy < now.getFullYear() || (yy === now.getFullYear() && mm < now.getMonth() + 1); }
  const ctrl = CP.formController(form, fields, { onValid: submitOrder, onInvalid: () => { payBtn.removeAttribute('aria-busy'); } });

  // ---------- The Receipt Side: the plan card turns as each section completes ----------
  const receipt = $('[data-receipt-plan]');
  const secs = ['contact', 'billing', 'payment', 'ack'];
  function sectionDone(sec) {
    const fs = fields.filter((f) => f.sec === sec && !(f.skip && f.skip()));
    if (!fs.length) return sec === 'billing' || sec === 'payment' ? !paid : false;
    return fs.every((f) => { const input = $('#' + f.id); if (!input) return false; const v = input.type === 'checkbox' ? (input.checked ? 'on' : '') : input.value; return !f.check(v, input); });
  }
  function refreshDone() {
    let count = 0;
    secs.forEach((sec, i) => {
      const done = sectionDone(sec);
      const el = $(`[data-co-sec="${sec}"]`); if (el && !el.hidden) el.classList.toggle('is-done', done);
      const tick = $(`[data-tick="${i + 1}"]`); if (tick) tick.classList.toggle('is-on', done);
      if (done) count++;
    });
    const summaryTick = $('[data-tick="5"]'); if (summaryTick) summaryTick.classList.toggle('is-on', count === secs.length);
    if (receipt && hasGsap && !RM) gsap.to(receipt, { rotationY: -4 * count, transformPerspective: 1000, duration: D.slow, ease: 'walk' });
  }
  form.addEventListener('change', refreshDone); form.addEventListener('focusout', () => setTimeout(refreshDone, 450));

  // ---------- submit: busy state, the order record, the cart cleared, the confirmation ----------
  function submitOrder() {
    payBtn.setAttribute('aria-busy', 'true'); payBtn.disabled = true; payBtn.textContent = plan.payBusy;
    if (barPay) { barPay.disabled = true; barPay.textContent = plan.payBusy; }
    const order = { number: 'CP' + String(Math.floor(100000 + Math.random() * 900000)), plan: plan.id, amount: plan.amountDisplay, renewal: paid ? renewal : 'Never bills', email: val('email').trim(), firstName: val('first-name').trim(), placedAt: Date.now() };
    setTimeout(() => {
      try { CP.storageSet('cashpass.order', order); } catch (e) { /* memory */ }
      Cart.clear();
      window.location.href = '/order-confirmed';
    }, RM ? 200 : 900);
  }
  if (barPay) barPay.addEventListener('click', () => form.requestSubmit ? form.requestSubmit() : payBtn.click());

  // ---------- entrances: each numbered section slides in from the left with its numeral counting ----------
  if (hasGsap && !RM) {
    q(document, '[data-co-sec]').forEach((sec, i) => {
      if (sec.hidden) return;
      // Sections keep visibility so keyboard focus and assistive tech always reach them; they fade and slide in as they enter.
      gsap.set(sec, { opacity: 0, x: -24 });
      let shown = false;
      const reveal = () => {
        if (shown) return; shown = true;
        gsap.to(sec, { opacity: 1, x: 0, duration: D.base, ease: 'walk', clearProps: 'transform' });
        const num = sec.querySelector('[data-co-num]'); CP.countUp(num, num.textContent);
        const fields = q(sec, '.field'); if (fields.length) gsap.fromTo(fields, { y: 4, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: D.base, delay: 0.1, clearProps: 'all' });
      };
      ScrollTrigger.create({ trigger: sec, start: 'top 95%', once: true, onEnter: reveal });
      sec.addEventListener('focusin', reveal);
    });
    gsap.from($('[data-co-summary]'), { x: 40, autoAlpha: 0, duration: D.slow, ease: 'walk', delay: 0.2 });
    gsap.from(q(document, '[data-co-summary] .sum-row'), { autoAlpha: 0, y: 6, stagger: 0.06, delay: 0.6 });
  }

  // ---------- mobile: the summary collapses; a bottom bar repeats the total and the pay button past section 3 ----------
  const toggle = $('[data-sum-toggle]');
  if (toggle) toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  const bar = $('[data-co-bar]');
  if (bar && CP.MOBILE()) {
    bar.hidden = false;
    const pay = $('[data-co-sec="payment"]');
    const io = new IntersectionObserver((es) => { es.forEach((en) => { if (en.boundingClientRect.bottom < 0) bar.classList.add('is-shown'); else bar.classList.remove('is-shown'); }); }, { threshold: 0 });
    io.observe(pay);
    const summarySec = $('[data-co-sec="summary"]');
    const io2 = new IntersectionObserver((es) => { es.forEach((en) => { if (en.isIntersecting) bar.classList.remove('is-shown'); }); }, { threshold: 0.2 });
    io2.observe(summarySec);
  }
})();
