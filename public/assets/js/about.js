/* About: The Five Pockets (Three.js r128 half orbit, a cool pulse travelling the arc), the manifesto wall, the story spreads, the never do index, the terrain band, the seal. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q } = CP;
  const E = CP.ENTRANCES;
  const MOBILE = CP.MOBILE();

  E['manifesto'] = (s, tl) => {
    tl.from(s.querySelector('.eyebrow'), { autoAlpha: 0, y: 8 }, 0);
    const h = s.querySelector('[data-manifesto]');
    if (h && window.SplitText && !RM) {
      const sp = new SplitText(h, { type: 'lines', mask: 'lines' });
      sp.lines.forEach((l, i) => { tl.fromTo(l, { yPercent: 100, autoAlpha: 0, fontVariationSettings: '"wght" 400' }, { yPercent: 0, autoAlpha: 1, fontVariationSettings: '"wght" 700', duration: D.slow, ease: 'rest' }, 0.1 + i * 0.09); });
    } else tl.from(h, { autoAlpha: 0, y: 12 }, 0.1);
  };
  E['pool-spread'] = (s, tl) => {
    q(s, '[data-spread]').forEach((sp, i) => {
      const media = sp.querySelector('[data-story-media]');
      const side = i % 2 ? '70% 50%' : '30% 50%';
      tl.fromTo(media, { clipPath: `circle(10% at ${side})`, autoAlpha: 0.6 }, { clipPath: `circle(140% at ${side})`, autoAlpha: 1, duration: D.slow, ease: 'walk' }, i * 0.2);
      tl.from(sp.querySelector('.story-p'), { autoAlpha: 0, y: 12 }, i * 0.2 + 0.1);
    });
  };
  E['fill-numerals'] = (s, tl) => {
    tl.from(q(s, '.sec-head > *'), { y: 16, autoAlpha: 0 }, 0);
    q(s, '[data-idx]').forEach((it, i) => {
      const n = it.querySelector('.numeral'); const t = 0.1 + i * 0.12;
      tl.from(it, { autoAlpha: 0, y: 10 }, t);
      tl.add(() => { n.classList.add('numeral--lit'); }, t + 0.1);
      tl.from(it.querySelector('.idx-body'), { autoAlpha: 0, x: 8 }, t + 0.1);
    });
    tl.from(s.querySelector('.never-close'), { autoAlpha: 0 }, '>-0.1');
  };
  E['fade-five'] = (s, tl) => {
    const cards = q(s, '.who-div [data-part^="c"]');
    if (cards.length) tl.from(cards, { autoAlpha: 0, y: 6, stagger: 0.08, duration: D.base }, 0);
    tl.from(s.querySelector('.split'), { autoAlpha: 0, duration: D.base }, 0.3);
  };
  E['contours'] = (s, tl) => {
    const paths = q(s, '[data-contours] path');
    tl.add(() => CP.drawPath(paths, { duration: D.slow, stagger: 0.04 }), 0);
    tl.from(s.querySelector('.terrain-photo'), { autoAlpha: 0, duration: D.slow }, 0);
    tl.from(s.querySelector('.terrain-card, .terrain-caption'), { x: 60, autoAlpha: 0, duration: D.slow, ease: 'walk' }, 0.4);
  };
  E['seal-quote'] = (s, tl) => {
    tl.add(() => CP.sealSettle(s.querySelector('[data-seal] .kit')), 0);
    tl.from(q(s, '.about-q .w'), { autoAlpha: 0, y: 6, stagger: 0.05 }, 0.1);
  };

  // The closing quote runs the full measure: its long line is sized to the width the seal leaves it, at every viewport.
  const fq = document.querySelector('[data-fit-quote]');
  if (fq && window.matchMedia('(min-width:900px)').matches) {
    const fit = () => {
      if (!window.matchMedia('(min-width:900px)').matches) { fq.classList.remove('is-fit'); fq.style.fontSize = ''; return; }
      fq.classList.add('is-fit'); fq.style.fontSize = '100px';
      let widest = 0; q(fq, '.ql').forEach((l) => { widest = Math.max(widest, l.getBoundingClientRect().width); });
      const avail = fq.clientWidth;
      if (!widest || !avail) { fq.classList.remove('is-fit'); fq.style.fontSize = ''; return; }
      fq.style.fontSize = Math.max(28, Math.min(avail / widest * 100, 140)).toFixed(2) + 'px';
    };
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(fit, 120); });
  }

  // The terrain contours respond to the pointer with a slight parallax.
  const terrain = document.querySelector('.about-where');
  const contours = terrain && terrain.querySelector('[data-contours]');
  if (contours && hasGsap && !RM && !CP.TOUCH) {
    const tx = gsap.quickTo(contours, 'x', { duration: D.slow, ease: 'rest' }), ty = gsap.quickTo(contours, 'y', { duration: D.slow, ease: 'rest' });
    terrain.addEventListener('pointermove', (e) => { const r = terrain.getBoundingClientRect(); tx(((e.clientX - r.left) / r.width - 0.5) * -24); ty(((e.clientY - r.top) / r.height - 0.5) * -14); });
    terrain.addEventListener('pointerleave', () => { tx(0); ty(0); });
  }

  // ---------- The Five Pockets ----------
  const pockets = document.querySelector('[data-pockets]');
  const sceneEl = document.querySelector('[data-scene="pockets"]');
  const figure = document.querySelector('[data-pockets-figure]');
  const NAMES = ['You', 'Dana', 'Malik', 'Rosa', 'Theo'];
  const NET = ['$749', '$312', '$208', '$141', '$96'];
  const noWebgl = !CP.webglOk() || RM || MOBILE || CP.TOUCH;
  if (pockets && noWebgl) {
    pockets.classList.add('pockets--fallback');
    const names = q(pockets, '[data-pocket-name]');
    if (hasGsap && !RM) ScrollTrigger.create({ trigger: pockets, start: 'top 70%', once: true, onEnter: () => names.forEach((n, i) => setTimeout(() => n.classList.add('is-lit'), 300 * i)) });
    else names.forEach((n) => n.classList.add('is-lit'));
  }
  let orbit = 0, orbitTarget = 0;
  if (hasGsap && window.ScrollTrigger && !RM) {
    ScrollTrigger.create({ trigger: document.querySelector('.about-story'), start: 'top 70%', end: 'bottom 30%', onUpdate: (self) => { orbitTarget = self.progress; } });
  }
  CP.makeScene(sceneEl, (THREE, ctx) => {
    const { scene, camera } = ctx;
    scene.add(CP.leatherPlane(THREE, 40, 40)); scene.fog = new THREE.Fog(0x2E0B0C, 6, 16);
    scene.add(new THREE.AmbientLight(0xffe8d6, 0.08));
    const key = new THREE.PointLight(0xE9F1F8, 1.0, 12, 2); key.position.set(0, 3, 4); scene.add(key);
    const group = new THREE.Group(); scene.add(group);
    const H = 1.7, R = 2.6;
    const phones = NAMES.map((n, i) => {
      const a = (i - 2) * 0.42;
      const m = CP.phonePlane(THREE, '/assets/media/product/s6-household.webp', H);
      m.position.set(Math.sin(a) * R, H / 2 + 0.02, -Math.cos(a) * R + R * 0.6);
      m.rotation.y = -a; m.material.opacity = 0.45; m.userData.i = i;
      group.add(m); return m;
    });
    const pulse = new THREE.PointLight(0xE9F1F8, 2.2, 3, 2); scene.add(pulse);
    const pulseMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshBasicMaterial({ color: 0xE9F1F8 })); scene.add(pulseMesh);
    CP.loadEnv(THREE, ctx, 0.05);
    // Tapping a phone shows that person's example net figure.
    const ray = new THREE.Raycaster(), v = new THREE.Vector2();
    ctx.container.style.pointerEvents = 'auto';
    ctx.renderer.domElement.addEventListener('click', (e) => {
      const r = ctx.renderer.domElement.getBoundingClientRect();
      v.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(v, camera);
      const hit = ray.intersectObjects(phones)[0];
      if (hit && figure) { const i = hit.object.userData.i; figure.textContent = `${NAMES[i]}: ${NET[i]} net after fees. Example figures.`; }
    });
    let t = 0;
    return {
      update(dt) {
        orbit += (orbitTarget - orbit) * 0.08;
        const ang = -0.7 + orbit * 1.4;
        camera.position.set(Math.sin(ang) * 5.0, 1.6, Math.cos(ang) * 5.0 + 0.7); camera.lookAt(0, 0.85, 0.2);
        // One rule propagates from the first phone to the rest as a cool pulse travelling the arc.
        t = (((t + dt * 0.35) % 1) + 1) % 1;
        const k = t * 4; const i0 = Math.floor(k), f = k - i0;
        const a = phones[Math.min(4, i0)], b = phones[Math.min(4, i0 + 1)];
        pulseMesh.position.lerpVectors(a.position, b.position, f); pulseMesh.position.y = H + 0.25 + Math.sin(f * Math.PI) * 0.3;
        pulse.position.copy(pulseMesh.position);
        phones.forEach((m, i) => { const d = Math.abs(i - k); m.material.opacity = 0.45 + 0.55 * Math.max(0, 1 - d); });
      }
    };
  }, { fov: 34, exposure: 1.05, allowTouch: false }).then((ctx) => { if (!ctx && pockets) pockets.classList.add('pockets--fallback'); });
})();
