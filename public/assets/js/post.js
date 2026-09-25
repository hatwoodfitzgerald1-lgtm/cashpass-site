/* Blog posts: the opening emblem, the hero, the numbered subheads, the two pull quotes, the photograph, the end cap, and one scroll driven diagram per post. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q } = CP;
  const E = CP.ENTRANCES;
  const key = document.body.getAttribute('data-post-key');
  const part = (name) => document.querySelector(`[data-diagram] [data-part="${name}"]`);

  // ---------- entrances (never the same one twice within a post) ----------
  E['post-head'] = (s, tl) => {
    const emblem = s.querySelector('[data-emblem] .ic');
    if (emblem) {
      const paths = q(emblem, 'path, rect, circle');
      // The sprite's symbol is referenced by use, so the emblem draws by revealing through a clip and a stroke fade.
      tl.fromTo(emblem, { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0.4 }, { clipPath: 'inset(0 0% 0 0)', autoAlpha: 1, duration: D.slow, ease: 'walk' }, 0);
    }
    tl.from(s.querySelector('.post-meta'), { autoAlpha: 0, y: 8 }, 0.2);
    const title = s.querySelector('.post-title');
    if (key === 'coding' && title && !RM) {
      // The only typed on headline among the three posts.
      const text = title.textContent; title.setAttribute('aria-label', text);
      title.innerHTML = text.split('').map((c) => `<span class="tc" aria-hidden="true">${c === ' ' ? '&nbsp;' : c.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join('');
      tl.from(q(title, '.tc'), { autoAlpha: 0, duration: 0.02, stagger: 0.028, ease: 'none' }, 0.3);
    } else if (title && window.SplitText && !RM) {
      const sp = new SplitText(title, { type: 'lines', mask: 'lines' });
      tl.from(sp.lines, { yPercent: 100, autoAlpha: 0, stagger: 0.08, duration: D.base }, 0.3);
    }
    tl.from(s.querySelector('.post-dek'), { autoAlpha: 0, y: 12 }, '>-0.2');
  };
  E['post-hero'] = (s, tl) => {
    if (key === 'rotating') tl.fromTo(s, { clipPath: 'circle(12% at 50% 50%)' }, { clipPath: 'circle(140% at 50% 50%)', duration: D.slow, ease: 'walk' }, 0);
    else if (key === 'coding') tl.from(s, { y: 24, autoAlpha: 0, duration: D.slow, ease: 'walk' }, 0);
    else tl.fromTo(s, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: D.slow, ease: 'walk' }, 0);
  };
  E['endcap'] = (s, tl) => {
    const seal = s.querySelector('[data-seal] .kit');
    tl.add(() => CP.sealSettle(seal), 0);
    tl.from(q(s, '.endcap-line, .cta-row'), { autoAlpha: 0, y: 8, stagger: 0.1 }, 0.2);
  };

  // Body paragraphs fade in by block; subhead numerals count up as each subhead enters; the photograph and shot have their own arrivals.
  if (hasGsap && !RM && window.ScrollTrigger) {
    q(document, '.post-item--chunk').forEach((chunk) => {
      const blocks = q(chunk, '.post-p, .post-ledger, .post-h2');
      blocks.forEach((b) => {
        if (b.classList.contains('post-h2')) {
          gsap.set(b, { autoAlpha: 0 });
          ScrollTrigger.create({ trigger: b, start: 'top 85%', once: true, onEnter: () => { gsap.to(b, { autoAlpha: 1, duration: D.base }); const n = b.querySelector('.numeral'); CP.countUp(n, n.getAttribute('data-numeral')); n.classList.add('numeral--lit'); setTimeout(() => n.classList.remove('numeral--lit'), 800); } });
        } else if (b.classList.contains('post-ledger') && key === 'fees') {
          const rows = q(b, '[data-ledger-row]');
          gsap.set(rows, { autoAlpha: 0, x: -24 });
          ScrollTrigger.create({ trigger: b, start: 'top 80%', once: true, onEnter: () => { gsap.to(rows, { autoAlpha: 1, x: 0, duration: D.base, stagger: 0.1 }); rows.forEach((r, i) => setTimeout(() => { r.querySelectorAll('span').forEach((sp) => { /* figures count up */ }); }, i * 100)); } });
        } else {
          gsap.set(b, { autoAlpha: 0, y: key === 'coding' ? 12 : 0 });
          ScrollTrigger.create({ trigger: b, start: 'top 88%', once: true, onEnter: () => gsap.to(b, { autoAlpha: 1, y: 0, duration: D.base }) });
        }
      });
    });
    const photo = document.querySelector('[data-post-photo]');
    if (photo) {
      if (key === 'coding') { gsap.set(photo, { clipPath: 'circle(12% at 50% 50%)' }); ScrollTrigger.create({ trigger: photo, start: 'top 80%', once: true, onEnter: () => gsap.to(photo, { clipPath: 'circle(140% at 50% 50%)', duration: D.slow, ease: 'walk' }) }); }
      else { gsap.set(photo, { scale: 1.04, transformOrigin: '50% 50%' }); ScrollTrigger.create({ trigger: photo, start: 'top 80%', once: true, onEnter: () => gsap.to(photo, { scale: 1, duration: D.slow, ease: 'rest' }) }); }
    }
    q(document, '[data-post-pull]').forEach((pq) => {
      if (key === 'rotating') { gsap.set(pq, { x: -40, y: 12, autoAlpha: 0 }); ScrollTrigger.create({ trigger: pq, start: 'top 82%', once: true, onEnter: () => gsap.to(pq, { x: 0, y: 0, autoAlpha: 1, duration: D.slow, ease: 'walk' }) }); }
      else if (key === 'coding') { gsap.set(pq, { clipPath: 'inset(0 50% 0 50%)' }); ScrollTrigger.create({ trigger: pq, start: 'top 82%', once: true, onEnter: () => gsap.to(pq, { clipPath: 'inset(0 0% 0 0%)', duration: D.slow, ease: 'walk' }) }); }
      else { gsap.set(pq, { y: 12, autoAlpha: 0 }); ScrollTrigger.create({ trigger: pq, start: 'top 82%', once: true, onEnter: () => gsap.to(pq, { y: 0, autoAlpha: 1, duration: D.base }) }); }
    });
    const shot = document.querySelector('[data-post-shot] .shot');
    if (shot) { gsap.set(shot, { yPercent: 30, autoAlpha: 0 }); ScrollTrigger.create({ trigger: shot, start: 'top 85%', once: true, onEnter: () => gsap.to(shot, { yPercent: 0, autoAlpha: 1, duration: D.slow, ease: 'walk' }) }); }
    const diagram = document.querySelector('[data-diagram]');
    if (diagram) { gsap.set(diagram, { autoAlpha: 0, y: 16 }); ScrollTrigger.create({ trigger: diagram, start: 'top 85%', once: true, onEnter: () => gsap.to(diagram, { autoAlpha: 1, y: 0, duration: D.base }) }); }
  }

  // ---------- the diagrams ----------
  const subheads = q(document, '[data-subhead]');
  const sub = (n) => subheads.find((h) => +h.getAttribute('data-subhead') === n);
  function onSubhead(n, fn) {
    const h = sub(n); if (!h) { fn(true); return; }
    if (RM || !hasGsap || !window.ScrollTrigger) { fn(true); return; }
    ScrollTrigger.create({ trigger: h, start: 'top 70%', onEnter: () => fn(true), onLeaveBack: () => fn(false) });
  }
  function scrubBetween(a, b, fn) {
    const ha = sub(a), hb = sub(b);
    if (!ha || RM || !hasGsap) { fn(1); return; }
    ScrollTrigger.create({ trigger: ha, start: 'top 70%', endTrigger: hb || ha, end: hb ? 'top 70%' : 'bottom top', onUpdate: (self) => fn(self.progress) });
  }

  if (key === 'rotating') {
    const ring = part('ring');
    const segs = [1, 2, 3, 4].map((i) => part('seg-q' + i));
    const knob = part('knob');
    const toggle = part('toggle');
    const fill = document.querySelector('[data-capbar-fill]');
    const capText = document.querySelector('[data-capbar-text]');
    function light(k) {
      segs.forEach((g, i) => { if (!g) return; const lit = i === k; const path = g.querySelector('path'), text = g.querySelector('text'); if (path) { path.setAttribute('fill', lit ? '#E9F1F8' : 'none'); path.setAttribute('stroke', lit ? '#E9F1F8' : '#CDB3AE'); } if (text) text.setAttribute('fill', lit ? '#2E0B0C' : '#CDB3AE'); });
      // The ring turns a little with each step (the labels stay upright) while the current quarter fills.
      if (ring) { ring.style.transformOrigin = '320px 226px'; ring.style.transformBox = 'view-box'; ring.style.transition = RM ? 'none' : 'transform 1.1s cubic-bezier(.46,.03,.24,1)'; ring.style.transform = `perspective(900px) rotateY(${(k - 3) * 14}deg) rotateX(${8 - k * 2}deg)`; }
    }
    if (RM) { light(3); if (knob) knob.setAttribute('cx', '338'); if (fill) fill.style.width = '60%'; if (capText) capText.textContent = '$900 of $1,500 this quarter'; }
    else {
      light(0);
      if (knob) knob.setAttribute('cx', '302');
      if (toggle) toggle.querySelector('rect') && toggle.querySelector('rect').setAttribute('stroke', '#CDB3AE');
      [1, 2, 3, 4].forEach((n) => onSubhead(n, (on) => light(on ? Math.min(3, n - 1) : Math.max(0, n - 2))));
      onSubhead(4, (on) => { if (knob) { knob.style.transition = 'cx .42s cubic-bezier(.46,.03,.24,1)'; knob.setAttribute('cx', on ? '338' : '302'); } });
      scrubBetween(3, 4, (p) => { if (fill) fill.style.width = (p * 60).toFixed(1) + '%'; if (capText) capText.textContent = `$${Math.round(p * 900).toLocaleString('en-US')} of $1,500 this quarter`; });
    }
  }

  if (key === 'coding') {
    const pool = part('pool');
    const grocery = part('tile-grocery'), everyday = part('tile-everyday');
    const fill = document.querySelector('[data-capbar-fill]');
    const capText = document.querySelector('[data-capbar-text]');
    function setLight(t) {
      // t 0: the light on Grocery 6% under the supermarket; t 1: on Everyday 4% under the cafe.
      if (pool) pool.setAttribute('cx', String(190 + 340 * t));
      const gl = t < 0.5, el = !gl;
      if (grocery) { grocery.querySelector('rect').setAttribute('fill', gl ? '#E9F1F8' : '#5E1F22'); grocery.querySelectorAll('text').forEach((x) => x.setAttribute('fill', gl ? '#2E0B0C' : '#CDB3AE')); }
      if (everyday) { everyday.querySelector('rect').setAttribute('fill', el ? '#E9F1F8' : '#5E1F22'); everyday.querySelectorAll('text').forEach((x) => x.setAttribute('fill', el ? '#2E0B0C' : '#CDB3AE')); }
    }
    if (RM) { setLight(1); if (fill) fill.style.width = '100%'; if (capText) capText.textContent = '$6,000 of $6,000, cap reached Oct 14'; }
    else {
      setLight(0);
      scrubBetween(2, 4, (p) => setLight(p));
      scrubBetween(3, 4, (p) => { if (fill) fill.style.width = (69 + 31 * p).toFixed(1) + '%'; if (capText) capText.textContent = p >= 0.99 ? '$6,000 of $6,000, cap reached Oct 14' : `$${Math.round(4140 + 1860 * p).toLocaleString('en-US')} of $6,000`; });
    }
  }

  if (key === 'fees') {
    const fee1 = part('fee-1'), fee2 = part('fee-2'), net = part('net');
    const base = document.querySelector('[data-baseline]');
    const ledgerRows = q(document, '[data-ledger-row]');
    const off = (el, on) => { if (!el) return; el.style.transition = RM ? 'none' : 'transform 1.1s cubic-bezier(.46,.03,.24,1), opacity 1.1s'; el.style.transform = on ? 'translateY(-70px)' : 'none'; el.style.opacity = on ? 0 : 1; };
    if (RM) { off(fee1, true); off(fee2, true); if (base) base.classList.add('is-on'); }
    else {
      if (net) { net.style.opacity = 0; net.style.transition = 'opacity .42s cubic-bezier(.05,.7,.3,1)'; }
      // A fee block comes off as the reader passes that card's line.
      const watch = (row, el) => { if (!row) { off(el, true); return; } ScrollTrigger.create({ trigger: row, start: 'top 60%', onEnter: () => off(el, true), onLeaveBack: () => off(el, false) }); };
      watch(ledgerRows[0], fee1); watch(ledgerRows[1], fee2);
      onSubhead(4, (on) => { if (net) net.style.opacity = on ? 1 : 0; if (base) base.classList.toggle('is-on', on); });
    }
  }
})();
