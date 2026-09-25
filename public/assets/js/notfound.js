/* 404: five dark cards on glass with no light; the pool appears under the middle card when the tile is hovered or focused. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q } = CP;
  const E = CP.ENTRANCES;
  E['cards-dark'] = (s, tl) => {
    tl.from(q(s, '[data-fcard]'), { yPercent: 60, autoAlpha: 0, duration: D.slow, ease: 'walk', stagger: 0.1 }, 0);
    tl.from(q(s, '.nf-copy .h1, .nf-copy .intro, .nf-links'), { autoAlpha: 0, y: 10, stagger: 0.08 }, 0.4);
    tl.from(s.querySelector('.nf-copy .cta-row'), { y: 16, autoAlpha: 0 }, 0.7);
  };
  const sec = document.querySelector('.nf');
  const tile = document.querySelector('[data-nf-tile]');
  if (sec && tile) { ['mouseenter', 'focus'].forEach((ev) => tile.addEventListener(ev, () => sec.classList.add('is-lit'))); ['mouseleave', 'blur'].forEach((ev) => tile.addEventListener(ev, () => sec.classList.remove('is-lit'))); }
})();
