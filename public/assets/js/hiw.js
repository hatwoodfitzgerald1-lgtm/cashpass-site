/* How it works: The Token (Three.js r128), the timeline that draws, the numeral index, the S8 rail with its demo switch, the diagonal band, the never does list and One Saturday in July. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q } = CP;
  const E = CP.ENTRANCES;

  // Token pass: words of headings and links are wrapped so the glint can travel through the hovered word.
  document.querySelectorAll('.main h3, .main .tlink').forEach((el) => {
    if (el.querySelector('.w') || el.closest('.plan')) return;
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(' ').map((w) => `<span class="w">${w.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join(' ');
  });

  // ---------- entrances ----------
  E['timeline-draw'] = (s, tl) => {
    tl.from(s.querySelector('.tl-h'), { y: 16, autoAlpha: 0 }, 0);
    const line = s.querySelector('[data-tl-line]');
    if (line) tl.add(() => CP.drawPath([line], { duration: D.slow }), 0.1);
    q(s, '[data-tl-step]').forEach((st, i) => {
      const t = 0.25 + i * 0.22;
      tl.add(() => st.classList.add('is-lit'), t);
      tl.from(q(st, 'h3, p, .tl-ic, .tl-num'), { y: 10, autoAlpha: 0, stagger: 0.05, duration: D.base }, t);
    });
  };
  E['numerals-fill'] = (s, tl) => {
    tl.from(q(s, '.sec-head > *'), { y: 16, autoAlpha: 0 }, 0);
    q(s, '[data-idx]').forEach((it, i) => {
      const n = it.querySelector('.numeral');
      const t = 0.1 + i * 0.16;
      tl.from(n, { autoAlpha: 0, duration: D.base }, t);
      tl.add(() => CP.countUp(n, n.getAttribute('data-numeral')), t);
      tl.from(it.querySelector('.idx-body'), { autoAlpha: 0, y: 12 }, t + 0.08);
    });
    tl.from(s.querySelector('.four-weighed'), { autoAlpha: 0, y: 8 }, '>-0.1');
    // Each numeral fills ice white while the reader passes it.
    if (window.ScrollTrigger) q(s, '[data-idx]').forEach((it) => ScrollTrigger.create({ trigger: it, start: 'top 60%', end: 'bottom 40%', onToggle: (self) => it.classList.toggle('is-active', self.isActive) }));
  };
  E['rail-cross'] = (s, tl) => {
    tl.from(q(s, '.sec-head > *'), { y: 16, autoAlpha: 0 }, 0);
    tl.from(s.querySelector('.conn-rail'), { autoAlpha: 0, y: 16, duration: D.slow, ease: 'walk' }, 0.1);
    tl.from(q(s, '[data-conn-ch]')[0], { autoAlpha: 0, y: 12 }, 0.2);
    tl.from(q(s, '[data-conn-ch]').slice(1), { autoAlpha: 0.35, y: 0 }, 0.2);
    tl.from(s.querySelector('.conn-wallet'), { autoAlpha: 0 }, 0.4);
  };
  E['slope-slide'] = (s, tl) => {
    const bg = s.querySelector('.diag-bg');
    if (bg) tl.fromTo(bg, { scale: 1.04 }, { scale: 1, duration: D.slow, ease: 'rest' }, 0);
    tl.from(s.querySelector('.diag-in .h2'), { y: 16, autoAlpha: 0 }, 0.1);
    tl.from(q(s, '.diag-item'), { x: -60, y: 20, autoAlpha: 0, duration: D.base, ease: 'walk', stagger: 0.08 }, 0.2);
  };
  E['index-left'] = (s, tl) => {
    tl.from(q(s, '.sec-head > *'), { y: 16, autoAlpha: 0 }, 0);
    q(s, '[data-never]').forEach((it, i) => {
      const t = 0.1 + i * 0.06;
      tl.from(it, { x: -24, autoAlpha: 0, duration: D.base }, t);
      tl.add(() => { it.classList.add('is-lit'); setTimeout(() => it.classList.remove('is-lit'), 600); }, t + 0.1);
    });
    const pull = s.querySelector('[data-pull]');
    if (pull) tl.fromTo(pull, { scale: 0.96, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: D.slow, ease: 'walk' }, '>-0.2');
  };
  E['deck-alternate'] = (s, tl) => {
    tl.from(q(s, '.sec-head > *'), { y: 16, autoAlpha: 0 }, 0);
    tl.from(s.querySelector('.sat-glass'), { autoAlpha: 0 }, 0);
    q(s, '[data-till]').forEach((card, i) => {
      const t = 0.1 + i * 0.14;
      tl.from(card, { x: i % 2 ? 80 : -80, autoAlpha: 0, duration: D.base, ease: 'walk' }, t);
      const time = card.querySelector('[data-time]');
      if (time) tl.add(() => { const target = time.getAttribute('data-time'); const [h, m] = target.split(':'); const o = { v: 0 }; gsap.to(o, { v: parseInt(h + m, 10), duration: D.base, ease: 'rest', onUpdate: () => { const v = Math.round(o.v); time.textContent = `${Math.floor(v / 100)}:${String(v % 100).padStart(2, '0')}`; }, onComplete: () => { time.textContent = target; } }); }, t);
      tl.add(() => CP.lastLight(card.querySelector('[data-last-light]'), { stagger: 0.012 }), t + 0.1);
    });
    tl.from(q(s, '.sat-out, .sat > .example'), { autoAlpha: 0, stagger: 0.06 }, '>-0.2');
  };

  // ---------- the milestone hover previews its screen ----------
  const SCREEN = { token: 's8-connect', ledger: 's3-ledger', rule: 's2-rules', phone: 's1-moment' };
  document.querySelectorAll('[data-tl-step]').forEach((st) => {
    const id = SCREEN[st.getAttribute('data-screen')]; if (!id) return;
    const prev = document.createElement('img');
    prev.className = 'tl-preview'; prev.alt = ''; prev.setAttribute('aria-hidden', 'true'); prev.loading = 'lazy'; prev.decoding = 'async';
    prev.src = `/assets/media/product/${id}.webp`; prev.width = 120; prev.height = 232;
    prev.style.cssText = 'position:absolute;right:0;bottom:calc(100% + 8px);width:120px;height:auto;opacity:0;transform:translateY(8px);transition:opacity .18s cubic-bezier(.05,.7,.3,1),transform .18s cubic-bezier(.05,.7,.3,1);pointer-events:none;filter:drop-shadow(0 12px 24px rgba(0,0,0,.5))';
    st.appendChild(prev);
    const on = () => { prev.style.opacity = 1; prev.style.transform = 'none'; };
    const off = () => { prev.style.opacity = 0; prev.style.transform = 'translateY(8px)'; };
    st.addEventListener('mouseenter', on); st.addEventListener('mouseleave', off);
  });

  // ---------- the connection rail: chapters cross fade, S8 tilts, the switch demonstrates the state ----------
  const chapters = q(document, '[data-conn-ch]');
  const phone = document.querySelector('[data-conn-phone]');
  if (chapters.length && hasGsap && !RM && window.ScrollTrigger && !CP.MOBILE()) {
    chapters.forEach((ch, i) => {
      ScrollTrigger.create({ trigger: ch, start: 'top 60%', end: 'bottom 40%', onToggle: (self) => {
        if (!self.isActive) return;
        chapters.forEach((c, k) => gsap.to(c, { autoAlpha: k === i ? 1 : 0.35, duration: D.base }));
        if (phone) gsap.to(phone, { rotationY: -4 * (i + 1), transformPerspective: 1200, duration: D.base, ease: 'rest' });
      } });
    });
  }
  const sw = document.querySelector('[data-conn-switch]');
  if (sw) {
    const stateText = document.querySelector('[data-conn-state-text]');
    sw.addEventListener('click', () => {
      const on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      if (phone) phone.classList.toggle('is-off', on);
      if (stateText) stateText.textContent = on ? 'Disconnected' : 'Connected, read only';
    });
  }

  // ---------- The Token: a glass token travelling a drawn path from the bank's doorway to the phone ----------
  const sceneEl = document.querySelector('[data-scene="token"]');
  const svg = document.querySelector('[data-token-svg]');
  const hero = document.querySelector('.hero--hiw');
  const timeline = document.querySelector('.timeline');
  let progress = 0, target = 0;
  if (hasGsap && window.ScrollTrigger && !RM) {
    ScrollTrigger.create({ trigger: hero, start: 'top top', endTrigger: timeline, end: 'bottom 60%', onUpdate: (self) => { target = self.progress; } });
  } else if (RM) { progress = target = 1; }

  // The SVG fallback: the path draws and the token glyph travels it (mobile and coarse pointers, and until WebGL is ready).
  if (svg) {
    const line = svg.querySelector('[data-token-line]');
    const glyph = svg.querySelector('[data-token-glyph]');
    const len = line.getTotalLength();
    line.style.strokeDasharray = len;
    const tick = () => {
      progress += (target - progress) * 0.1;
      const p = Math.min(1, Math.max(0, progress));
      line.style.strokeDashoffset = len * (1 - p);
      const pt = line.getPointAtLength(len * p);
      glyph.setAttribute('transform', `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)}) rotate(${(p * 20 - 10).toFixed(1)})`);
    };
    if (hasGsap && !RM) gsap.ticker.add(tick); else tick();
  }

  CP.makeScene(sceneEl, (THREE, ctx) => {
    const { scene, camera } = ctx;
    camera.position.set(0, 1.3, 7.2); camera.lookAt(0, 0.5, 0);
    scene.add(CP.leatherPlane(THREE, 40, 40)); scene.fog = new THREE.Fog(0x2E0B0C, 8, 22);
    const slab = CP.glassSlab(THREE, 12, 5); slab.position.y = 0.005; scene.add(slab);
    const ambient = new THREE.AmbientLight(0xffe8d6, 0.06); scene.add(ambient);
    const key = new THREE.PointLight(0xE9F1F8, 0.9, 8, 2); key.position.set(-3.6, 1.6, 1.2); scene.add(key);
    // The bank's doorway: two posts and a lintel in surface 1, quiet.
    const dark = new THREE.MeshStandardMaterial({ color: 0x2a0a0b, roughness: 0.9 });
    const post = new THREE.BoxGeometry(0.14, 1.8, 0.14);
    const p1 = new THREE.Mesh(post, dark); p1.position.set(-4.4, 0.9, -0.4); scene.add(p1);
    const p2 = new THREE.Mesh(post, dark); p2.position.set(-3.7, 0.9, -0.4); scene.add(p2);
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 0.16), dark); lintel.position.set(-4.05, 1.85, -0.4); scene.add(lintel);
    // The path the token travels, drawn as it goes.
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-4.05, 0.7, -0.3), new THREE.Vector3(-1.6, 0.35, 0.5), new THREE.Vector3(0.2, 0.9, 0.1), new THREE.Vector3(1.8, 0.5, 0.5), new THREE.Vector3(3.1, 0.95, 0.05)]);
    const tube = new THREE.TubeGeometry(curve, 160, 0.012, 6, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xE9F1F8, emissive: 0xE9F1F8, emissiveIntensity: 0.9, roughness: 0.4 });
    const path = new THREE.Mesh(tube, tubeMat); scene.add(path);
    const totalIndex = tube.index.count;
    tube.setDrawRange(0, 0);
    // The token: a small glass tile with a notch.
    const tokenGeo = new THREE.BoxGeometry(0.42, 0.28, 0.06);
    const tokenMat = new THREE.MeshPhysicalMaterial({ color: 0xE9F1F8, transmission: 0.92, roughness: 0.08, ior: 1.5, transparent: true, opacity: 1, envMapIntensity: 0.6, emissive: 0xC6D6E3, emissiveIntensity: 0.25 });
    const token = new THREE.Mesh(tokenGeo, tokenMat); scene.add(token);
    const glow = new THREE.PointLight(0xE9F1F8, 1.6, 3.5, 2); scene.add(glow);
    // The phone at the right: the S8 device shot standing upright.
    const phoneMesh = CP.phonePlane(THREE, '/assets/media/product/s8-connect.webp', 2.0);
    phoneMesh.position.set(3.3, 1.02, 0); phoneMesh.rotation.y = -0.35; phoneMesh.material.opacity = 0.35; scene.add(phoneMesh);
    CP.loadEnv(THREE, ctx, 0.05);
    let cur = RM ? 1 : 0;
    return {
      update() {
        cur += (target - cur) * 0.1;
        // A pause at "receives a token, never your password": the token holds between 0.5 and 0.62 of the scroll.
        let p = cur < 0.5 ? cur / 0.5 * 0.55 : cur < 0.62 ? 0.55 : 0.55 + (cur - 0.62) / 0.38 * 0.45;
        p = Math.min(1, Math.max(0, p));
        tube.setDrawRange(0, Math.floor(totalIndex * p));
        const pos = curve.getPointAt(p);
        token.position.copy(pos); token.position.y += 0.02 + Math.sin(performance.now() / 600) * 0.01;
        token.rotation.y = p * Math.PI * 2 * 0.5; token.rotation.z = Math.sin(p * 6) * 0.1;
        glow.position.copy(pos); glow.position.y += 0.2;
        phoneMesh.material.opacity = 0.35 + 0.65 * Math.max(0, (p - 0.75) / 0.25);
        key.intensity = 0.9 - p * 0.5;
      }
    };
  }, { fov: 32, exposure: 1.1 });
})();
