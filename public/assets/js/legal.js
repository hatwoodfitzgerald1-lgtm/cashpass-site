/* Terms and Privacy: the seal coin, the in page index, headings sliding in with their markers brightening, paragraphs fading by block. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q } = CP;
  const E = CP.ENTRANCES;
  E['legal-head'] = (s, tl) => {
    const h = s.querySelector('h1');
    if (h && window.SplitText && !RM) { const sp = new SplitText(h, { type: 'lines', mask: 'lines' }); tl.from(sp.lines, { yPercent: 100, autoAlpha: 0, duration: D.base }, 0); } else tl.from(h, { autoAlpha: 0 }, 0);
    tl.from(s.querySelector('.legal-entity'), { autoAlpha: 0, y: 8 }, 0.1);
    tl.fromTo(s.querySelector('.coin'), { autoAlpha: 0, rotationY: -60 }, { autoAlpha: 1, rotationY: 0, duration: D.slow, ease: 'walk' }, 0.1);
    tl.add(() => { const pool = s.querySelector('.coin [data-part="pool"]'); if (pool && hasGsap) gsap.fromTo(pool, { opacity: 0.4 }, { opacity: 1.6, duration: D.slow, ease: 'walk', yoyo: true, repeat: 1 }); }, 0.3);
  };
  E['headings-left'] = (s, tl) => {
    tl.from(s.querySelector('.legal-intro'), { autoAlpha: 0, y: 8 }, 0);
    // Headings and paragraphs enter as they scroll into view, each block on its own trigger.
    if (!hasGsap || RM) return;
    q(s, '[data-legal-sec]').forEach((sec) => {
      const h = sec.querySelector('.legal-h'); const blocks = q(sec, 'p, ul');
      gsap.set(h, { autoAlpha: 0, x: -20 }); gsap.set(blocks, { autoAlpha: 0 });
      ScrollTrigger.create({ trigger: sec, start: 'top 85%', once: true, onEnter: () => { gsap.to(h, { autoAlpha: 1, x: 0, duration: D.base, ease: 'walk' }); sec.classList.add('is-lit'); setTimeout(() => sec.classList.remove('is-lit'), 900); gsap.to(blocks, { autoAlpha: 1, duration: D.base, stagger: 0.08, delay: 0.1 }); } });
    });
  };
  // The index marks the section in view.
  const links = q(document, '.legal-index-list a');
  if (links.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { es.forEach((en) => { if (en.isIntersecting) links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id)); }); }, { rootMargin: '-30% 0px -60% 0px' });
    q(document, '[data-legal-sec]').forEach((sec) => io.observe(sec));
  }
  const idx = document.querySelector('[data-legal-index]');
  if (idx && !CP.MOBILE()) idx.open = true; else if (idx) idx.open = false;
})();
