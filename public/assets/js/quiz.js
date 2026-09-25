/* Find your plan: Three questions, one light. Real radios in fieldsets, a deterministic mapping, the pool of light walking on the CSS glass stage, a live region and the plan's purchase button on the result. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q, PLANS, MSG } = CP;
  const E = CP.ENTRANCES;
  const form = document.querySelector('[data-quiz]'); if (!form) return;
  const progress = form.querySelector('[data-progress]');
  const hint = form.querySelector('[data-hint]');
  const stage = document.querySelector('[data-light-stage]');
  const pool = stage && stage.querySelector('[data-ls-pool]');
  const stageCards = stage ? q(stage, '.plan') : [];
  const region = document.querySelector('[data-result-region]');
  const prompt = document.querySelector('[data-result-prompt]');
  const bodyEl = document.querySelector('[data-result-body]');
  const line = document.querySelector('[data-result-line]');
  const till = document.querySelector('[data-result-till]');
  const reasons = document.querySelector('[data-result-reasons]');
  const lower = document.querySelector('[data-result-lower]');
  const planWrap = document.querySelector('[data-result-plan]');
  const planCard = document.querySelector('[data-result-card]');
  const others = document.querySelector('[data-result-others]');
  const live = document.querySelector('[data-result-live]');
  const resultSec = document.querySelector('[data-result]');
  const bg = resultSec && resultSec.querySelector('.band-bg');

  const PLAN_BY_Q1 = ['free', 'pass', 'family'];
  const TILL = ['At Lantern Row Market: Tap Grocery 6%', 'At Lantern Row Cafe: Tap Everyday 4%, it codes as Dining', 'At the marketplace: Tap Marketplace 5%', 'Everywhere else: Tap Flat 2%'];
  // Q3: 0 Every quarter, 1 Sometimes, 2 I forget, 3 I don't have one. Sometimes and I forget share one reason set.
  const REASONS = {
    free: {
      forget: ['One to three cards. Enter them by hand, write your rules, and the answer at the till costs nothing.', 'No connection to a bank and no card on file. Free stays free.'],
      every: ['One to three cards, and you activate every quarter on your own. Free gives the answer at the till and stays out of the way.', 'No connection to a bank and no card on file. Free stays free.'],
      none: ['One to three cards and no rotating card. Enter them by hand, write your rules, and the answer at the till costs nothing.', 'No connection to a bank and no card on file. Free stays free.']
    },
    pass: {
      forget: ['Four cards or more, and you\'d rather not remember the quarters. Pass reminds you before each one opens and nudges while a card sits unactivated.', 'Unlimited cards, connected read only. Your last twelve months sort by merchant, and Pass proposes your rules.', 'Every cap tracked to the dollar, every annual fee taken off in the Ledger.'],
      every: ['Four cards or more, and you already activate every quarter. What\'s left is the caps and the fees, and Pass tracks both to the dollar.', 'Unlimited cards, connected read only. Your last twelve months sort by merchant, and Pass proposes your rules.'],
      none: ['Four cards or more. Pass connects all of them read only, sorts your last twelve months by merchant, and proposes your rules.', 'Every cap tracked to the dollar, every annual fee taken off in the Ledger.']
    },
    family: {
      forget: ['Two wallets or more under one roof, and the quarters get forgotten. The reminder goes to every phone in the house.', 'One rule set in up to five pockets. Written once, live at every till in the house.', 'Each person keeps their own cards and login. The house sees totals, never transactions.'],
      every: ['Two wallets or more under one roof. One rule set in up to five pockets, one bill.', 'Every cap and every fee tracked for each person, and one household total with fees taken off.', 'Each person keeps their own cards and login. The house sees totals, never transactions.'],
      none: ['Two wallets or more under one roof. One rule set in up to five pockets, one bill.', 'Each person keeps their own cards and login. The house sees totals, never transactions.']
    }
  };
  const Q3KEY = ['every', 'forget', 'forget', 'none'];

  const answers = { q1: null, q2: null, q3: null };
  let lastInputWasKeyboard = false;
  document.addEventListener('keydown', () => { lastInputWasKeyboard = true; }, true);
  document.addEventListener('pointerdown', () => { lastInputWasKeyboard = false; }, true);

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const fig = (s) => `<span class="fig">${esc(s).replace(/(\$|%)/g, '<span class="sym">$1</span>')}</span>`;
  const mark = '<svg class="mark bullet" viewBox="12 14 40 25" width="12" height="8" aria-hidden="true" focusable="false"><rect class="mark-card" x="12.9" y="14.9" width="38.2" height="23.2" rx="3"/><rect class="mark-bar" x="17" y="33" width="9" height="2" rx="1"/></svg>';
  function planCardHtml(id) {
    const p = PLANS[id];
    const tile = p.ctaStyle === 'filled' ? 'tile' : 'tile tile--ghost';
    return `<article class="plan plan--${id} plan--lit" data-plan="${id}">
      <div class="plan-head"><h3 class="plan-name"><span class="plan-chip">${esc(p.name)}</span></h3>${p.tag ? `<span class="plan-tag">${esc(p.tag)}</span>` : ''}</div>
      <p class="plan-price"><span class="plan-num">${fig(p.priceNumeral)}</span>${p.priceSuffix ? ` <span class="plan-cadence">${esc(p.priceSuffix)}</span>` : ''}</p>
      <p class="plan-under">${esc(p.underPrice)}</p>${p.cancelLine ? `<p class="plan-cancel">${esc(p.cancelLine)}</p>` : ''}
      <p class="plan-who">${esc(p.whoLine)}</p><p class="plan-unit">${esc(p.unitLine)}</p>
      <ul class="plan-list">${p.inclusions.map((i) => `<li>${mark}<span>${esc(i)}</span></li>`).join('')}</ul>
      <p class="plan-renew">${esc(p.renewalLine)}</p>
      <div class="plan-cta"><a class="${tile} tile--full" href="/cart?add=${id}" data-add-plan="${id}">${esc(p.cta)}</a>${id === 'pass' ? '<span class="price-line price-line--card">$59 a year. Cancel any time.</span>' : ''}</div>
    </article>`;
  }

  function poolTo(id, dim) {
    if (!pool) return;
    const c = stageCards.find((x) => x.getAttribute('data-plan') === id);
    if (!c) { pool.classList.add('pool--off'); return; }
    const g = pool.parentElement.getBoundingClientRect(), r = c.getBoundingClientRect();
    pool.classList.remove('pool--off');
    pool.style.left = ((r.left + r.width / 2 - g.left) / g.width * 100).toFixed(2) + '%';
    pool.style.opacity = dim ? 0.45 : 1;
    pool.style.width = dim ? '60%' : '';
  }
  function setProgress() {
    const n = ['q1', 'q2', 'q3'].filter((k) => answers[k] !== null).length;
    if (progress) { progress.textContent = n === 0 ? '' : `${n} of 3`; if (CP.MOBILE()) document.documentElement.style.scrollPaddingBottom = n === 0 ? '' : '72px'; }
    q(form, '[data-qf]').forEach((f) => f.classList.toggle('is-answered', answers[f.getAttribute('data-qf')] !== null));
    return n;
  }
  let previewEl = null;
  function updateInProgress() {
    const n = setProgress();
    // After question 1 the pool hovers dimly over the one plan it decided.
    if (answers.q1 !== null) { const id = PLAN_BY_Q1[answers.q1]; stageCards.forEach((c) => c.classList.toggle('is-possible', c.getAttribute('data-plan') === id)); poolTo(id, true); }
    else { stageCards.forEach((c) => c.classList.remove('is-possible')); if (pool) pool.classList.add('pool--off'); }
    // After question 2 the demo till line previews dim under the prompt.
    if (answers.q2 !== null && n < 3) {
      if (!previewEl) { previewEl = document.createElement('p'); previewEl.className = 'result-preview'; previewEl.style.cssText = 'margin:14px 0 0;color:var(--text2);opacity:.6;font-size:var(--small)'; prompt.after(previewEl); }
      previewEl.textContent = TILL[answers.q2];
    } else if (previewEl) { previewEl.remove(); previewEl = null; }
  }

  let currentPlan = null, opened = false, resultTl = null;
  function computeResult() {
    const id = PLAN_BY_Q1[answers.q1];
    const key = Q3KEY[answers.q3];
    const p = PLANS[id];
    const changed = currentPlan !== id;
    currentPlan = id;
    if (previewEl) { previewEl.remove(); previewEl = null; }
    prompt.hidden = true; bodyEl.hidden = false; planWrap.hidden = false;
    if (hint) hint.hidden = false;
    // The pool walks and rests; the card lights and the previous card darkens.
    stageCards.forEach((c) => { c.classList.remove('is-possible'); c.classList.toggle('plan--lit', c.getAttribute('data-plan') === id); });
    poolTo(id, false);
    // The Last Light.
    const txt = line.querySelector('.answer-txt');
    const m = p.quizLine.match(/^(.*?)(\d+%)$/);
    txt.innerHTML = m ? `${esc(m[1])}<span class="ans-fig">${esc(m[2])}</span>` : esc(p.quizLine);
    txt._cpSplit = null;
    line.setAttribute('aria-label', p.quizLine);
    till.textContent = TILL[answers.q2];
    reasons.innerHTML = REASONS[id][key].map((r) => `<li>${esc(r)}</li>`).join('');
    lower.hidden = !(id === 'free' && key === 'forget');
    planCard.innerHTML = planCardHtml(id);
    const otherIds = ['free', 'pass', 'family'].filter((x) => x !== id);
    others.innerHTML = otherIds.map((x) => `<a href="/cart?add=${x}" data-add-plan="${x}">Or ${esc(PLANS[x].name)}</a>`).join('');
    if (live) live.textContent = `Your plan: ${p.name}.`;
    if (hasGsap && !RM) {
      if (!opened && bg) { const r = region.getBoundingClientRect(), sr = resultSec.getBoundingClientRect(); const ox = ((r.left + r.width / 2 - sr.left) / sr.width * 100).toFixed(1), oy = ((r.top + r.height / 2 - sr.top) / sr.height * 100).toFixed(1); gsap.fromTo(bg, { clipPath: `circle(12% at ${ox}% ${oy}%)` }, { clipPath: `circle(140% at ${ox}% ${oy}%)`, duration: D.slow, ease: 'walk' }); }
      if (resultTl) { resultTl.kill(); gsap.set([till.previousElementSibling, till, reasons.previousElementSibling, reasons, lower, planWrap], { clearProps: 'all' }); }
      const tl = gsap.timeline();
      resultTl = tl;
      tl.add(CP.lastLight(line) || gsap.to(line, { autoAlpha: 1 }), 0);
      tl.fromTo([till.previousElementSibling, till, reasons.previousElementSibling, reasons], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: D.base }, 0.4);
      if (!lower.hidden) tl.fromTo(lower, { autoAlpha: 0 }, { autoAlpha: 1, duration: D.base }, 0.6);
      tl.fromTo(planWrap, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: D.base, clearProps: 'all' }, 0.7);
    } else { gsap && gsap.set(line, { autoAlpha: 1 }); }
    opened = true;
    if (lastInputWasKeyboard) line.focus({ preventScroll: true });
    if (changed) region.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: lastInputWasKeyboard ? 'center' : 'nearest' });
  }

  form.addEventListener('change', (e) => {
    const input = e.target.closest('input[type=radio]'); if (!input) return;
    answers[input.getAttribute('data-q')] = parseInt(input.value, 10);
    q(form, '.qf-err').forEach((el) => { el.hidden = true; el.textContent = ''; });
    q(form, '[data-qf]').forEach((f) => f.classList.remove('field--err'));
    const n = setProgress();
    if (n === 3) computeResult(); else updateInProgress();
  });
  form.addEventListener('submit', (e) => e.preventDefault());

  // Activating the dim result region before all three answers: the message under the first unanswered legend, focus to its first radio.
  function nudge() {
    if (['q1', 'q2', 'q3'].every((k) => answers[k] !== null)) return;
    const first = ['q1', 'q2', 'q3'].find((k) => answers[k] === null);
    const fs = form.querySelector(`[data-qf="${first}"]`);
    const err = fs.querySelector('.qf-err');
    err.textContent = MSG.quiz; err.hidden = false; fs.classList.add('field--err');
    const radio = fs.querySelector('input[type=radio]');
    radio.focus(); fs.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
  }
  region.addEventListener('click', () => { if (!prompt.hidden) nudge(); });
  region.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !prompt.hidden) { e.preventDefault(); nudge(); } });

  // ---------- entrances ----------
  E['deal-questions'] = (s, tl) => {
    q(s, '[data-qf]').forEach((f, i) => {
      const t = i * 0.12;
      tl.from(f, { y: 40, autoAlpha: 0, duration: D.base, ease: 'walk' }, t);
      tl.from(q(f, '.opt'), { y: 10, autoAlpha: 0, stagger: 0.04, duration: D.base }, t + 0.1);
    });
    tl.from(s.querySelector('.tool-rail'), { autoAlpha: 0, y: 16, duration: D.slow, ease: 'walk' }, 0.1);
  };
  E['marquee-start'] = (s, tl) => { tl.from(s, { autoAlpha: 0 }, 0); };

  // The marquee moves as it enters and pauses offscreen and under reduced motion.
  const mq = document.querySelector('[data-mq-track]');
  if (mq && hasGsap && !RM) {
    const w = mq.scrollWidth / 3;
    const tween = gsap.to(mq, { x: -w, duration: 40, ease: 'none', repeat: -1, paused: true });
    ScrollTrigger.create({ trigger: mq, start: 'top bottom', end: 'bottom top', onToggle: (self) => { if (self.isActive) tween.play(); else tween.pause(); } });
  }
  window.addEventListener('resize', () => { if (currentPlan) poolTo(currentPlan, false); else if (answers.q1 !== null) poolTo(PLAN_BY_Q1[answers.q1], true); });
  if (pool) pool.classList.add('pool--off');
})();
