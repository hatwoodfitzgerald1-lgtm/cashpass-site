/* The app: The Ring of Screens (Three.js r128 turntable scrubbed by scroll), the collage, the callouts, the checkerboard and the compact plan strip. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q } = CP;
  const E = CP.ENTRANCES;
  const MOBILE = CP.MOBILE();

  // ---------- entrances ----------
  E['collage-split'] = (s, tl) => {
    const fam = s.querySelector('.collage-family');
    const img = fam && fam.querySelector('.family');
    if (img && !RM) {
      // Three clipped copies of the family shot slide apart from one stacked position.
      const wrap = document.createElement('div'); wrap.className = 'family-split'; wrap.setAttribute('aria-hidden', 'true');
      wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none';
      [['0 66% 0 0', -1], ['0 33% 0 33%', 0], ['0 0 0 66%', 1]].forEach(([clip, dir]) => {
        const c = img.cloneNode(); c.removeAttribute('alt'); c.removeAttribute('fetchpriority'); c.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;clip-path:inset(${clip});border-radius:20px`; c.dataset.dir = dir; wrap.appendChild(c);
      });
      fam.style.position = 'relative'; fam.appendChild(wrap);
      tl.set(img, { autoAlpha: 0 }, 0);
      tl.from(wrap.children, { x: (i) => [22, 0, -22][i] + '%', autoAlpha: 0, duration: D.slow, ease: 'walk', stagger: 0 }, 0);
      tl.set(img, { autoAlpha: 1 }, D.slow); tl.set(wrap, { autoAlpha: 0 }, D.slow);
    }
    tl.fromTo(s.querySelector('.collage-photo'), { autoAlpha: 0, y: 24 }, { autoAlpha: 0.6, y: 0, duration: D.slow }, 0);
    tl.from(s.querySelector('.caption'), { autoAlpha: 0 }, 0.6);
  };
  E['ring-swap'] = (s, tl) => { tl.from(q(s, '.sec-head > *'), { y: 16, autoAlpha: 0 }, 0); tl.from(s.querySelector('.ring-sticky, .ring-list'), { autoAlpha: 0, y: 12, duration: D.base }, 0.1); };
  E['leader-draw'] = (s, tl) => {
    tl.from(q(s, '.sec-head > *'), { y: 16, autoAlpha: 0 }, 0);
    tl.from(s.querySelector('.co-phone'), { autoAlpha: 0, y: 16, duration: D.base }, 0.1);
    const lines = q(s, '[data-co-line]');
    tl.add(() => CP.drawPath(lines, { duration: D.base, stagger: 0.08 }), 0.3);
    tl.from(q(s, '.co-label'), { autoAlpha: 0, y: 8, stagger: 0.08 }, 0.45);
  };
  E['checker'] = (s, tl) => {
    tl.from(q(s, '.sec-head > *'), { y: 16, autoAlpha: 0 }, 0);
    q(s, '[data-ck]').forEach((cell, i) => tl.from(cell, { x: i % 2 ? 60 : -60, autoAlpha: 0, duration: D.base, ease: 'walk' }, 0.1 + i * 0.06));
  };

  // ---------- callouts: hovering or focusing a label lights its region on the screen ----------
  q(document, '.co-label').forEach((l) => {
    const k = l.getAttribute('data-co');
    const region = document.querySelector(`[data-co-region="${k}"]`);
    const line = document.querySelector(`[data-co-line="${k}"]`);
    const on = () => { l.classList.add('is-lit'); region && region.classList.add('is-lit'); line && (line.style.strokeOpacity = 1); };
    const off = () => { l.classList.remove('is-lit'); region && region.classList.remove('is-lit'); line && (line.style.strokeOpacity = ''); };
    l.addEventListener('mouseenter', on); l.addEventListener('mouseleave', off); l.addEventListener('focus', on); l.addEventListener('blur', off);
  });

  // ---------- the pinned chapter: copy swaps with the ring, the count ticks ----------
  const ring = document.querySelector('[data-ring]');
  const chs = q(document, '[data-ring-ch]');
  const shots = q(document, '[data-ring-shot]');
  const count = document.querySelector('[data-ring-count]');
  const video = document.querySelector('[data-ring-video]');
  let active = 0, ringProgress = 0, ringTarget = 0;
  function setActive(i) {
    if (i === active) return;
    const prev = active; active = i;
    chs.forEach((c, k) => c.classList.toggle('is-active', k === i));
    shots.forEach((c, k) => c.classList.toggle('is-active', k === i));
    if (count) count.textContent = 'S' + (i + 1);
    if (hasGsap && !RM) { gsap.set(chs[prev], { clearProps: 'all' }); gsap.fromTo(chs[i], { y: 12 }, { y: 0, duration: D.base, ease: 'rest', clearProps: 'all' }); }
    if (video) { if (i === 6 && !RM && !CP.SAVE_DATA) { video.play().then(() => video.classList.add('is-on')).catch(() => {}); } else { video.pause(); video.classList.remove('is-on'); } }
  }
  if (ring && hasGsap && window.ScrollTrigger && !RM && !MOBILE) {
    ScrollTrigger.create({ trigger: ring.querySelector('[data-ring-track]'), start: 'top top', end: 'bottom bottom', onUpdate: (self) => { ringTarget = self.progress; const i = Math.min(7, Math.floor(self.progress * 8)); setActive(i); } });
  }
  const noWebgl = !CP.webglOk() || RM || MOBILE || CP.TOUCH;
  if (ring && noWebgl) ring.classList.add('ring--fallback');

  // ---------- The Ring of Screens ----------
  const sceneEl = document.querySelector('[data-scene="ring"]');
  let dragOffset = 0, dragging = false, dragX = 0, dragStartOffset = 0, keyOffset = 0;
  CP.makeScene(sceneEl, (THREE, ctx) => {
    const { scene, camera } = ctx;
    camera.position.set(0, 1.0, 9.4); camera.lookAt(0, 0.9, 0);
    scene.add(CP.leatherPlane(THREE, 40, 40)); scene.fog = new THREE.Fog(0x2E0B0C, 9, 24);
    const slab = CP.glassSlab(THREE, 14, 7); slab.position.y = 0.004; scene.add(slab);
    scene.add(new THREE.AmbientLight(0xffe8d6, 0.08));
    const key = new THREE.PointLight(0xE9F1F8, 0.7, 14, 2); key.position.set(2, 3.4, 2); scene.add(key);
    const group = new THREE.Group(); group.position.x = 2.0; scene.add(group);
    const ids = ['s1-moment', 's2-rules', 's3-ledger', 's4-cards', 's5-quarter', 's6-household', 's7-till', 's8-connect'];
    const R = 2.8, H = 2.0;
    const phones = ids.map((id, i) => {
      const m = CP.phonePlane(THREE, `/assets/media/product/${id}.webp`, H);
      const a = -i * (Math.PI * 2 / 8);
      m.position.set(Math.sin(a) * R, H / 2 + 0.02, Math.cos(a) * R);
      m.rotation.y = a;
      group.add(m);
      return m;
    });
    CP.loadEnv(THREE, ctx, 0.05);
    const glow = new THREE.PointLight(0xE9F1F8, 0.9, 4, 2); glow.position.set(2.2, 1.4, R + 0.9); scene.add(glow);
    let rot = 0;
    return {
      update() {
        ringProgress += (ringTarget - ringProgress) * 0.1;
        const targetRot = ringProgress * Math.PI * 2 + dragOffset + keyOffset;
        rot += (targetRot - rot) * 0.12;
        group.rotation.y = rot;
        // The screen at the front brightens; the others rest darker.
        phones.forEach((m, i) => {
          const a = -i * (Math.PI * 2 / 8) + rot;
          const front = Math.cos(a); // 1 when facing the camera
          const o = 0.3 + 0.7 * Math.max(0, front);
          m.material.opacity = o;
          m.material.color.setScalar(0.55 + 0.45 * Math.max(0, front));
        });
        // The DOM product motion overlay sizes itself to the front phone's projected height.
        if (video && video.classList.contains('is-on')) {
          const top = new THREE.Vector3(group.position.x, H, R).project(camera), bot = new THREE.Vector3(group.position.x, 0, R).project(camera);
          const cx = (top.x + 1) / 2 * ctx.width; video.style.left = cx + 'px';
          const hPx = Math.abs(top.y - bot.y) / 2 * ctx.height;
          video.style.height = hPx + 'px';
        }
      }
    };
  }, { fov: 30, exposure: 1.05 }).then((ctx) => {
    if (!ctx) { ring && ring.classList.add('ring--fallback'); return; }
    // The ring can be dragged, and stepped with the arrow keys.
    const el = ctx.renderer.domElement;
    el.style.cursor = 'grab'; el.setAttribute('tabindex', '0'); el.setAttribute('aria-label', 'Eight app screens on a turning ring. Use the arrow keys to turn it.');
    el.addEventListener('pointerdown', (e) => { dragging = true; dragX = e.clientX; dragStartOffset = dragOffset; el.style.cursor = 'grabbing'; });
    window.addEventListener('pointermove', (e) => { if (!dragging) return; dragOffset = dragStartOffset + (e.clientX - dragX) / 300; });
    window.addEventListener('pointerup', () => { dragging = false; el.style.cursor = 'grab'; });
    el.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); keyOffset -= Math.PI / 4; } if (e.key === 'ArrowLeft') { e.preventDefault(); keyOffset += Math.PI / 4; } });
  });

  CP.deckPool && CP.deckPool(document.querySelector('[data-deck]'));
})();
