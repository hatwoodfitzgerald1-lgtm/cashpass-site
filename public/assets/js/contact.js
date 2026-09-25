/* Contact: The Reader Ring (Three.js r128 macro ring with a focus pull), the band, the terrain, the form. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap, q, MSG } = CP;
  const E = CP.ENTRANCES;

  E['settle-photo'] = (s, tl) => {
    tl.fromTo(s.querySelector('.band-bg'), { scale: 1.04 }, { scale: 1, duration: D.slow, ease: 'rest' }, 0);
    tl.from(q(s, '.contact-copy > *'), { autoAlpha: 0, y: 12, stagger: 0.08 }, 0.1);
    tl.from(s.querySelector('.contact-card'), { x: 80, autoAlpha: 0, duration: D.slow, ease: 'walk' }, 0.2);
  };
  E['contours'] = E['contours'] || ((s, tl) => { tl.add(() => CP.drawPath(q(s, '[data-contours] path'), { duration: D.slow, stagger: 0.04 }), 0); tl.from(s.querySelector('.terrain-caption'), { autoAlpha: 0 }, 0.5); });
  E['contact-form'] = (s, tl) => {
    tl.from(s.querySelector('.write-side'), { autoAlpha: 0, y: 12 }, 0);
    tl.from(q(s, '.field, .cta-row'), { y: 8, autoAlpha: 0, stagger: 0.06, duration: D.base }, 0.1);
  };

  // ---------- the form ----------
  const form = document.querySelector('[data-contact-form]');
  let ringLit = false;
  if (form) {
    q(form, '.input, .textarea').forEach((inp) => inp.addEventListener('input', () => { const f = inp.closest('.field'); f && f.classList.toggle('is-filled', !!inp.value.trim()); }));
    CP.formController(form, [
      { id: 'c-name', check: (v) => v.trim() ? null : MSG.contactName },
      { id: 'c-email', check: (v) => !v.trim() ? MSG.emailEmpty : (!CP.isEmail(v) ? MSG.emailFormat : null) },
      { id: 'c-msg', check: (v) => v.trim() ? null : MSG.message }
    ], {
      onValid: () => {
        const email = form.querySelector('#c-email').value.trim();
        const p = document.createElement('p'); p.className = 'write-status write-status--done'; p.setAttribute('role', 'status');
        p.textContent = `Received. We'll answer at ${email} within two business days.`;
        form.innerHTML = ''; form.appendChild(p);
        if (hasGsap && !RM) gsap.from(p, { autoAlpha: 0, y: 8 });
        CP.toast('Received. We\'ll answer within two business days.');
        ringLit = true;
      }
    });
  }

  // ---------- The Reader Ring ----------
  const sceneEl = document.querySelector('[data-scene="reader"]');
  let focusT = 0, focusTarget = 0;
  if (hasGsap && window.ScrollTrigger && !RM) {
    ScrollTrigger.create({ trigger: document.querySelector('.hero--contact'), start: 'top top', endTrigger: document.querySelector('.contact-band'), end: 'top 30%', onUpdate: (self) => { focusTarget = self.progress; } });
  }
  // Reduced motion, touch, under 900px or no WebGL: the drawn reader still stands in for the ring (CSS breathes it unless motion is reduced).
  const heroEl = document.querySelector('.hero--contact');
  if (sceneEl && heroEl && (CP.MOBILE() || CP.TOUCH || RM || !CP.webglOk())) heroEl.classList.add('no-gl');
  CP.makeScene(sceneEl, (THREE, ctx) => {
    const { scene, camera } = ctx;
    camera.position.set(0.2, 1.0, 3.6); camera.lookAt(0.55, 0.15, 0);
    scene.add(CP.leatherPlane(THREE, 30, 30)); scene.fog = new THREE.Fog(0x2E0B0C, 4, 12);
    scene.add(new THREE.AmbientLight(0xffe8d6, 0.06));
    // The reader: a dark rounded slab with a light ring set into its face.
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 1.1), new THREE.MeshStandardMaterial({ color: 0x3E1113, roughness: 0.6 })); body.position.set(2.1, 0.09, -0.2); scene.add(body);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xCDB3AE, emissive: 0xE9F1F8, emissiveIntensity: 0.6, roughness: 0.3 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.035, 16, 72), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.set(2.1, 0.19, -0.2); scene.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.02, 12, 64), ringMat.clone()); ring2.rotation.x = -Math.PI / 2; ring2.position.set(2.1, 0.19, -0.2); scene.add(ring2);
    const glow = new THREE.PointLight(0xE9F1F8, 1.4, 4, 2); glow.position.set(2.1, 0.7, -0.2); scene.add(glow);
    CP.loadEnv(THREE, ctx, 0.05);
    return {
      update(dt, el) {
        focusT += (focusTarget - focusT) * 0.08;
        // The ring breathes; the camera pulls focus toward the contact card by drifting and softening.
        const breathe = 0.6 + Math.sin(el * 1.2) * 0.25;
        const lit = ringLit ? 1.8 : breathe;
        ring.material.emissiveIntensity = lit; ring2.material.emissiveIntensity = lit * 0.8; glow.intensity = 0.35 + lit * 0.4;
        ring.scale.setScalar(1 + Math.sin(el * 1.2) * 0.02);
        camera.position.set(0.2 + focusT * 1.2, 1.0 + focusT * 0.8, 3.6 - focusT * 0.6);
        camera.lookAt(0.55 + focusT * 0.6, 0.15, 0);
        ctx.renderer.domElement.style.filter = `blur(${(focusT * 6).toFixed(1)}px)`;
        ctx.renderer.domElement.style.opacity = String(1 - focusT * 0.5);
      }
    };
  }, { fov: 30, exposure: 1.1 });
})();
