/* Blog index: The Quarter Wheel (Three.js r128), the latest shelf, the masonry with Flip filtering. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q } = CP;
  const E = CP.ENTRANCES;
  const MOBILE = CP.MOBILE();

  E['shelf-right'] = (s, tl) => {
    tl.from(s.querySelector('.latest-label'), { autoAlpha: 0 }, 0);
    tl.from(s.querySelector('.latest-shelf'), { x: 120, autoAlpha: 0, duration: D.slow, ease: 'walk' }, 0.05);
    tl.from(q(s, '.pcard--shelf'), { y: 12, autoAlpha: 0, stagger: 0.06, duration: D.base }, 0.5);
  };
  E['masonry'] = (s, tl) => {
    tl.from(q(s, '.fchip'), { autoAlpha: 0, y: 6, stagger: 0.04 }, 0);
    const cards = q(s, '.pcard--grid');
    const order = [0, 2, 1];
    cards.forEach((c, i) => tl.from(c, { y: 24, autoAlpha: 0, duration: D.base }, 0.15 + (order.indexOf(i) >= 0 ? order.indexOf(i) : i) * 0.1));
  };

  // ---------- the filter chips reflow the masonry with Flip ----------
  const masonry = document.querySelector('[data-masonry]');
  const chips = q(document, '[data-filter]');
  function applyFilter(key, animate) {
    chips.forEach((c) => c.setAttribute('aria-pressed', c.getAttribute('data-filter') === key ? 'true' : 'false'));
    const cards = q(masonry, '[data-pcard]');
    const state = (animate && window.Flip && !RM) ? Flip.getState(cards) : null;
    cards.forEach((c) => c.classList.toggle('is-hidden', key !== 'all' && c.getAttribute('data-topic') !== key));
    if (state) Flip.from(state, { duration: D.base, ease: 'rest', absolute: true, onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: D.base }), onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: D.fast }) });
  }
  chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.getAttribute('data-filter'), true)));
  const topic = new URLSearchParams(location.search).get('topic');
  if (topic && ['quarters', 'caps', 'fees'].includes(topic)) applyFilter(topic, false);

  // ---------- The Quarter Wheel ----------
  const wheel = document.querySelector('[data-wheel]');
  const sceneEl = document.querySelector('[data-scene="wheel"]');
  const svgG = document.querySelector('[data-wheel-g]');
  const wqs = q(document, '[data-wq]');
  let step = 3, stepTarget = 3;
  function setStep(k) {
    step = ((k % 4) + 4) % 4;
    wqs.forEach((p) => p.classList.toggle('is-lit', +p.getAttribute('data-wq') === step));
    if (svgG) svgG.style.transform = `rotate(${-(step - 3) * 90}deg)`;
  }
  const noWebgl = !CP.webglOk() || RM || MOBILE || CP.TOUCH;
  if (wheel && noWebgl) wheel.classList.add('wheel--fallback');
  // The wheel turns a quarter with each scroll step down the index.
  if (hasGsap && window.ScrollTrigger && !RM) {
    let lastK = 0;
    ScrollTrigger.create({ trigger: document.querySelector('.latest'), start: 'top 80%', endTrigger: document.querySelector('.allposts'), end: 'bottom top', onUpdate: (self) => { const k = Math.min(3, Math.floor(self.progress * 4)); if (k !== lastK) { lastK = k; stepTarget = 3 + k; setStep(3 + k); } } });
  }
  setStep(3);

  CP.makeScene(sceneEl, (THREE, ctx) => {
    const { scene, camera } = ctx;
    camera.position.set(0, 2.2, 5.2); camera.lookAt(0, 0, 0);
    camera.fov = 4; camera.updateProjectionMatrix();
    scene.add(new THREE.AmbientLight(0xffe8d6, 0.08));
    const key = new THREE.PointLight(0xE9F1F8, 0.8, 12, 2); key.position.set(0, 3, 3); scene.add(key);
    const group = new THREE.Group(); scene.add(group);
    const segs = [];
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.RingGeometry(0.9, 1.5, 24, 1, i * Math.PI / 2 + 0.06, Math.PI / 2 - 0.12);
      const mat = new THREE.MeshStandardMaterial({ color: 0x3E1113, roughness: 0.6, metalness: 0.05, emissive: 0x000000, side: THREE.DoubleSide });
      const m = new THREE.Mesh(geo, mat); m.rotation.x = -Math.PI / 2; group.add(m); segs.push(m);
      // A raised lip so each quarter reads as a tile.
      const lipGeo = new THREE.RingGeometry(1.5, 1.53, 24, 1, i * Math.PI / 2 + 0.06, Math.PI / 2 - 0.12);
      const lip = new THREE.Mesh(lipGeo, new THREE.MeshStandardMaterial({ color: 0xCDB3AE, roughness: 0.6, side: THREE.DoubleSide })); lip.rotation.x = -Math.PI / 2; lip.position.y = 0.002; group.add(lip);
    }
    CP.loadEnv(THREE, ctx, 0.05);
    let rot = 0, targetRot = 0, fov = 4, entered = false;
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) entered = true; }, { threshold: 0.3 }); io.observe(ctx.container);
    return {
      update() {
        // The orthographic to perspective snap as it first enters: the field of view widens while the camera comes in.
        const targetFov = entered ? 34 : 4;
        fov += (targetFov - fov) * 0.06; camera.fov = fov; camera.updateProjectionMatrix();
        const dist = 1.9 / Math.tan((fov / 2) * Math.PI / 180) * 0.55 + 1.2;
        camera.position.set(0, dist * 0.55, dist); camera.lookAt(0, 0, 0);
        targetRot = -(step - 3) * Math.PI / 2;
        rot += (targetRot - rot) * 0.08; group.rotation.y = rot;
        segs.forEach((m, i) => { const lit = i === step; m.material.emissive.setHex(lit ? 0xE9F1F8 : 0x000000); m.material.emissiveIntensity = lit ? 0.9 : 0; m.material.color.setHex(lit ? 0xE9F1F8 : 0x3E1113); });
      }
    };
  }, { fov: 4, exposure: 1.05 }).then((ctx) => { if (!ctx && wheel) wheel.classList.add('wheel--fallback'); });

  // The shelf on mobile scrolls with snap; the cards' highlight bar hover is CSS.
})();
