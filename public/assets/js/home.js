/* Cash Pass Home: The Light Walks (the scrubbed sequence), the five shops index loader, the shop deck, the pocket stage and the Home sections. */
(function () {
  'use strict';
  const CP = window.CP; if (!CP) return;
  const { RM, D, hasGsap } = CP;
  const MOBILE = CP.MOBILE();
  const TOUCH = CP.TOUCH;
  const stage = document.querySelector('[data-stage]');
  if (!stage) return;
  const pin = stage.querySelector('[data-stage-pin]');
  const canvas = stage.querySelector('[data-canvas]');
  const poster = stage.querySelector('[data-poster]');
  const wash = stage.querySelector('[data-wash]');
  const restLayer = stage.querySelector('[data-rest-layer]');
  const copy = stage.querySelector('[data-copy]');
  const shops = Array.from(stage.querySelectorAll('.shop'));
  const chapterBtns = Array.from(stage.querySelectorAll('[data-chapter]'));
  const loader = stage.querySelector('[data-loader]');
  const loaderStatus = stage.querySelector('[data-loader-status]');
  const skipBtn = stage.querySelector('[data-skip-load]');
  const QA_ARC = document.documentElement.classList.contains('qa-arc');

  const FRAMES = 120;
  const REST_FRAMES = [24, 48, 72, 96, 116];
  const SNAPS = [0.17, 0.37, 0.57, 0.77, 0.97];
  const CHAPTER_P = [0, 0.2, 0.4, 0.6, 0.8];
  const SHOP_CARD = ['grocery', 'everyday', 'marketplace', 'flat', 'everyday'];

  // ---------- the wash lifts at 0.6s no matter what ----------
  setTimeout(() => wash && wash.classList.add('is-lifted'), RM ? 200 : 420);

  // ---------- the loader: five stages tied to real load, 4s cap, Skip ----------
  const stagesDone = new Set();
  let resolved = false;
  function markStage(n) {
    if (resolved && n < 5) return;
    stagesDone.add(n);
    const btn = chapterBtns[n - 1];
    if (btn) btn.classList.add('is-loaded');
    if (stagesDone.size >= 5) resolveLoader();
  }
  function resolveLoader() {
    if (resolved) return;
    resolved = true;
    stage.classList.add('stage--ready');
    if (loaderStatus) loaderStatus.textContent = 'Loaded.';
    chapterBtns.forEach((b) => b.classList.add('is-loaded'));
    if (hasGsap && !RM && loader) gsap.from(loader, { y: 24, duration: D.slow, ease: 'walk' });
    setCurrentChapter(0);
    document.dispatchEvent(new CustomEvent('cp:loader-done'));
  }
  if (skipBtn) skipBtn.addEventListener('click', resolveLoader);
  setTimeout(resolveLoader, RM ? 400 : 4000);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => markStage(1)); else markStage(1);
  if (poster) {
    const p = poster.decode ? poster.decode().catch(() => {}) : Promise.resolve();
    p.then(() => markStage(2));
    poster.addEventListener('error', () => markStage(2), { once: true });
    if (poster.complete) markStage(2);
  } else markStage(2);
  // Stage four is the loop's poster (the loop itself streams only when its band scrolls into view).
  const loop = document.querySelector('.moment-media video');
  if (loop && !MOBILE && !RM && loop.getAttribute('poster')) { const pi = new Image(); pi.onload = () => markStage(4); pi.onerror = () => markStage(4); pi.src = loop.getAttribute('poster'); setTimeout(() => markStage(4), 2500); }
  else markStage(4);

  // ---------- chapter index ----------
  let currentChapter = -1;
  function setCurrentChapter(c) {
    if (c === currentChapter) return;
    currentChapter = c;
    chapterBtns.forEach((b, i) => { if (i === c) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  }

  // ---------- desktop: the scrubbed sequence ----------
  const desktopSeq = !RM && !MOBILE && !TOUCH && hasGsap && window.ScrollTrigger;
  let st = null;
  let target = 0, cur = 0, lastMove = performance.now();
  let drifting = false, driftDir = 1, driftFrame = 0, lastDrift = 0, stageVisible = true;
  const bitmaps = new Array(FRAMES + 1);
  let loadedCount = 0;
  let ctx = null, set = 1440, worker = null, lowPower = false, live = false;
  const restImgs = {};

  function chooseSet() {
    const vw = window.innerWidth, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    if (vw >= 2200) return 2560;
    return vw * dpr > 1600 ? 1920 : 1440;
  }
  function sizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
  }
  function nearestLoaded(f) {
    if (bitmaps[f]) return f;
    for (let d = 1; d < FRAMES; d++) { if (bitmaps[f - d]) return f - d; if (bitmaps[f + d]) return f + d; }
    return 0;
  }
  let drawnFrame = -1;
  function draw(f) {
    if (!ctx) return;
    const n = nearestLoaded(f);
    if (!n) return;
    if (n === drawnFrame) return;
    const bmp = bitmaps[n];
    const cw = canvas.width, ch = canvas.height;
    const s = Math.max(cw / bmp.width, ch / bmp.height);
    const w = bmp.width * s, h = bmp.height * s;
    ctx.drawImage(bmp, (cw - w) / 2, (ch - h) / 2, w, h);
    drawnFrame = n;
    if (!live) { live = true; stage.classList.add('stage--live'); }
  }
  function frameFor(p) { return Math.min(FRAMES, Math.max(1, Math.round(p * 119) + 1)); }
  function chapterFor(p) { return Math.min(4, Math.max(0, Math.floor(p / 0.2))); }

  function onBitmap(m) {
    if (m.error || !m.bitmap) { markRestArrived(m.frame); return; }
    bitmaps[m.frame] = m.bitmap;
    loadedCount++;
    markRestArrived(m.frame);
    if (m.frame <= 24 && [...Array(24).keys()].every((i) => bitmaps[i + 1])) markStage(5);
    if (Math.abs(frameFor(cur) - m.frame) <= 1 || drawnFrame < 0) draw(frameFor(cur));
  }
  const restArrived = new Set();
  function markRestArrived(f) { if (REST_FRAMES.includes(f)) { restArrived.add(f); if (restArrived.size >= 5) markStage(3); } }

  function startLoading() {
    set = chooseSet();
    const base = `/assets/media/seq/${set}/`;
    const order = [...REST_FRAMES];
    for (let f = 1; f <= FRAMES; f++) if (!order.includes(f)) order.push(f);
    if (window.Worker && window.createImageBitmap) {
      try {
        worker = new Worker('/assets/js/seq-worker.js');
        worker.onmessage = (e) => onBitmap(e.data);
        worker.onerror = () => { worker = null; mainThreadLoad(base, order); };
        worker.postMessage({ type: 'init', base, order });
        return;
      } catch (e) { worker = null; }
    }
    mainThreadLoad(base, order);
  }
  function mainThreadLoad(base, order) {
    let i = 0, active = 0;
    const step = () => {
      while (active < Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 4) - 1)) && i < order.length) {
        const f = order[i++]; active++;
        const img = new Image(); img.decoding = 'async';
        img.onload = () => { active--; onBitmap({ frame: f, bitmap: img }); step(); };
        img.onerror = () => { active--; onBitmap({ frame: f, error: true }); step(); };
        img.src = base + 'f' + String(f).padStart(3, '0') + '.webp';
      }
    };
    step();
  }
  function prioritize(f) { if (worker) worker.postMessage({ type: 'priority', frame: f }); }

  // Low power: the poster plus the five rest frames crossfading at the snap points.
  function enableLowPower() {
    if (lowPower) return;
    lowPower = true;
    if (canvas) canvas.style.display = 'none';
    stage.classList.remove('stage--live');
    REST_FRAMES.forEach((f, i) => {
      const img = document.createElement('img');
      img.src = `/assets/media/seq/rest/960/r${i + 1}.webp`; img.alt = ''; img.decoding = 'async';
      img.width = 960; img.height = 540;
      restLayer.appendChild(img); restImgs[i] = img;
    });
    markStage(3); markStage(5);
    if (worker) { worker.terminate(); worker = null; }
  }
  function showRest(c) {
    Object.keys(restImgs).forEach((k) => restImgs[k].classList.toggle('is-on', +k === c));
  }

  // The shop deck choreography, scrubbed with the stage.
  function buildDeck() {
    const tl = gsap.timeline({ paused: true });
    // Card 1 sits at 76 percent of the viewport in the first view, then moves up to the stack base as the copy zone fades; each later card lands 24px lower than the card beneath.
    const vh = window.innerHeight;
    const first = 0.24 * vh;
    shops.forEach((card, i) => {
      const restY = 24 * i;
      if (i === 0) { gsap.set(card, { autoAlpha: 1, y: first }); tl.to(card, { y: 0, duration: 0.14, ease: 'walk' }, 0.05); return; }
      gsap.set(card, { autoAlpha: 0, y: 0.6 * vh });
      const p = CHAPTER_P[i];
      tl.to(card, { autoAlpha: 1, y: restY, duration: 0.09, ease: 'walk' }, p);
      tl.to(shops[i - 1], { autoAlpha: 0.6, duration: 0.06 }, p + 0.03);
    });
    if (copy) tl.to(copy, { autoAlpha: 0, y: -30, duration: 0.14, ease: 'rest' }, 0.05);
    // The collapse into How it decided.
    tl.to(shops, { scale: 0.92, y: '+=40', autoAlpha: 0, transformOrigin: '50% 100%', duration: 0.03, ease: 'walk' }, 0.97);
    tl.to(stage.querySelector('.deck-col'), { autoAlpha: 0, duration: 0.03 }, 0.97);
    tl.set({}, {}, 1);
    return tl;
  }

  const answers = shops.map((s) => s.querySelector('[data-last-light]'));
  const litDone = new Set();
  function chapterEntered(c, forward) {
    setCurrentChapter(c);
    if (lowPower) showRest(c);
    const a = answers[c];
    if (!a) return;
    if (forward && !litDone.has(c)) {
      litDone.add(c);
      CP.lastLight(a, { stagger: c === 4 ? 0.028 : 0.014 });
    } else if (!forward) {
      litDone.delete(c);
      const chars = a.querySelectorAll('.ll-char');
      if (chars.length) gsap.set(chars, { autoAlpha: 1, y: 0 });
    }
  }

  function initDesktop() {
    if (canvas) { ctx = canvas.getContext('2d', { alpha: false }); sizeCanvas(); }
    if (navigator.deviceMemory && navigator.deviceMemory <= 4) enableLowPower();
    else startLoading();
    setTimeout(() => { if (!lowPower && restArrived.size < 5) enableLowPower(); }, 3000);

    const deck = buildDeck();
    let lastChapter = 0;
    st = ScrollTrigger.create({
      trigger: stage, pin: pin, start: 'top top', end: '+=150%', scrub: 0.8, anticipatePin: 1,
      snap: { snapTo: (v) => {
        if (v >= 0.83 && v < 0.995) return 0.97;
        let best = v;
        for (const s of SNAPS.slice(0, 4)) if (Math.abs(v - s) < 0.05) best = s;
        return best;
      }, duration: { min: 0.25, max: 0.7 }, delay: 0.12, ease: 'walk' },
      onUpdate: (self) => { target = self.progress; lastMove = performance.now(); }
    });
    if (QA_ARC) { window.__qaArc = { start: st.start, end: st.end, innerHeight: window.innerHeight, viewportHeights: +((st.end - st.start) / window.innerHeight).toFixed(3) }; console.log('qa:arc', JSON.stringify(window.__qaArc)); }
    // Idle drift: the room breathes between the chapter's rest frames at 8 frames a second; nothing is drawn while the stage is offscreen.
    gsap.ticker.add(() => {
      if (!stageVisible && Math.abs(target - cur) < 0.0005) return;
      const before = cur;
      cur += (target - cur) * 0.1;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      const moving = Math.abs(cur - before) > 0.00005;
      deck.progress(cur);
      const c = chapterFor(cur);
      if (c !== lastChapter) { chapterEntered(c, c > lastChapter); lastChapter = c; }
      const now = performance.now();
      if (moving) { drifting = false; const f = frameFor(cur); if (!lowPower) { draw(f); if (now - lastMove < 200) prioritize(f); } else showRest(c); return; }
      if (lowPower) return;
      if (!drifting && now - lastMove > 300) { drifting = true; driftFrame = Math.max(c * 24 + 17, Math.min(c * 24 + 24, frameFor(cur))); driftDir = 1; lastDrift = now; }
      if (drifting && now - lastDrift >= 125) {
        lastDrift = now;
        const lo = c * 24 + 17, hi = Math.min(FRAMES, c * 24 + 24);
        driftFrame += driftDir; if (driftFrame > hi) { driftFrame = hi - 1; driftDir = -1; } if (driftFrame < lo) { driftFrame = lo + 1; driftDir = 1; }
        draw(Math.min(FRAMES, Math.max(1, driftFrame)));
      }
    });
    chapterEntered(0, true);
    // Pause when the stage is offscreen or the tab is hidden.
    const io = new IntersectionObserver((es) => es.forEach((en) => { stageVisible = en.isIntersecting; if (en.isIntersecting) gsap.ticker.wake(); }), { threshold: 0 });
    io.observe(stage);
    document.addEventListener('visibilitychange', () => { if (document.hidden) gsap.ticker.sleep(); else gsap.ticker.wake(); });
    window.addEventListener('resize', () => { sizeCanvas(); drawnFrame = -1; draw(frameFor(cur)); });
    // Chapter buttons scroll the stage to their snap point.
    chapterBtns.forEach((b, i) => b.addEventListener('click', () => { const y = st.start + SNAPS[i] * (st.end - st.start); CP.scrollToY(y); }));
    window.addEventListener('pagehide', () => { if (worker) worker.terminate(); for (let i = 0; i < bitmaps.length; i++) if (bitmaps[i] && bitmaps[i].close) bitmaps[i].close(); });
  }

  // ---------- reduced motion and mobile: the cards read as plain sections ----------
  function initStatic() {
    markStage(3); markStage(5);
    setCurrentChapter(0);
    answers.forEach((a) => { if (a) a.style.opacity = 1; });
    chapterBtns.forEach((b, i) => b.addEventListener('click', () => { const t = shops[i]; if (t) t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' }); }));
    if (!RM && !MOBILE && hasGsap) {
      // Coarse pointer desktop (a tablet at 1024 and up): the poster stands and the cards stack as a list.
    }
  }

  // ---------- the pocket stage (under 900px) ----------
  const SHOP_DATA = [
    { shop: 'Lantern Row Market', when: 'July', answer: 'Tap Grocery 6%', why: '6% on groceries. $4,140 of the $6,000 yearly cap used.' },
    { shop: 'Route 9 Fuel', when: '', answer: 'Tap Everyday 4%', why: '4% at gas stations. Your rule says all gas stations, Everyday 4%, so it wins.' },
    { shop: 'Online marketplace', when: '', answer: 'Tap Marketplace 5%', why: '5% here and 1% everywhere else. This is the one shop it\'s for.' },
    { shop: 'Somewhere else', when: '', answer: 'Tap Flat 2%', why: 'No category matches. 2% on everything beats 1% on the rest.' },
    { shop: 'Lantern Row Cafe', when: 'November 3', answer: 'Tap Everyday 4%', why: 'Codes as Dining, not Grocery. 4% here. Grocery 6% capped since Oct 14.' }
  ];
  const TILE_INDEX = { grocery: 0, everyday: 1, rotating: 2, marketplace: 3, flat: 4 };
  function initPocket() {
    const pocket = stage.querySelector('[data-pocket]');
    if (!pocket) return;
    const tiles = Array.from(pocket.querySelectorAll('[data-ptile]'));
    const pool = pocket.querySelector('[data-pocket-pool]');
    const chips = Array.from(pocket.querySelectorAll('[data-pchip]'));
    const backdrop = pocket.querySelector('[data-pocket-backdrop]');
    const notifShop = pocket.querySelector('[data-notif-shop]');
    const notifWhy = pocket.querySelector('[data-notif-why]');
    const answer = pocket.querySelector('[data-last-light]');
    let current = 4;
    function poolLeft(i) { return (4 + (i + 0.5) * 92 / 5) + '%'; }
    function setShop(i, animate) {
      current = i;
      const card = SHOP_CARD[i];
      const ti = TILE_INDEX[card];
      tiles.forEach((t, k) => t.classList.toggle('is-lit', k === ti));
      if (pool) pool.style.left = poolLeft(ti);
      chips.forEach((c, k) => c.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
      const d = SHOP_DATA[i];
      if (notifShop) notifShop.innerHTML = `${d.shop}${d.when ? `<span class="shop-when">${d.when}</span>` : ''}`;
      if (notifWhy) notifWhy.textContent = d.why;
      if (answer) {
        const txt = answer.querySelector('.answer-txt');
        const m = d.answer.match(/^(.*?)(\d+%)$/);
        txt.innerHTML = m ? `${m[1]}<span class="ans-fig">${m[2]}</span>` : d.answer;
        txt._cpSplit = null;
        answer.setAttribute('aria-label', d.answer);
        if (animate && !RM) CP.lastLight(answer, { stagger: 0.02 });
      }
      if (backdrop) backdrop.style.backgroundImage = `url(/assets/media/seq/rest/960/r${i + 1}.webp)`;
    }
    chips.forEach((c) => c.addEventListener('click', () => setShop(+c.getAttribute('data-pchip'), true)));
    // Swipe steps through the shops in order.
    let x0 = null;
    const glass = pocket.querySelector('.pocket-glass');
    glass.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    glass.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 40) setShop((current + (dx < 0 ? 1 : 4)) % 5, true); });
    if (!RM && hasGsap) {
      gsap.from(tiles, { yPercent: 80, autoAlpha: 0, duration: D.base, ease: 'rest', stagger: 0.08, delay: 0.3 });
      if (pool) { pool.style.left = poolLeft(0); setTimeout(() => setShop(4, true), 900); }
      setShop(4, false);
    } else setShop(4, false);
  }

  if (desktopSeq) initDesktop(); else initStatic();
  if (MOBILE) initPocket();

  // The copy zone rises out of line masks from first paint.
  if (copy && hasGsap && !RM) {
    const items = Array.from(copy.children);
    gsap.from(items, { y: 18, autoAlpha: 0, duration: 0.32, ease: 'rest', stagger: 0.04 });
  }

  // ---------- the shelf: drag, wheel and arrow keys with snap ----------
  const shelf = document.querySelector('[data-shelf]');
  if (shelf) {
    shelf.setAttribute('data-lenis-prevent', '');
    let down = false, sx = 0, sl = 0;
    shelf.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') return; down = true; sx = e.clientX; sl = shelf.scrollLeft; shelf.classList.add('is-dragging'); });
    window.addEventListener('pointermove', (e) => { if (!down) return; shelf.scrollLeft = sl - (e.clientX - sx); });
    window.addEventListener('pointerup', () => { if (!down) return; down = false; shelf.classList.remove('is-dragging'); });
    shelf.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = shelf.scrollWidth - shelf.clientWidth;
      const canGo = (e.deltaY > 0 && shelf.scrollLeft < max - 1) || (e.deltaY < 0 && shelf.scrollLeft > 1);
      if (!canGo) return;
      e.preventDefault(); shelf.scrollLeft += e.deltaY;
    }, { passive: false });
    shelf.addEventListener('keydown', (e) => {
      const item = shelf.querySelector('.shelf-item');
      const step = item ? item.getBoundingClientRect().width + 24 : 300;
      if (e.key === 'ArrowRight') { e.preventDefault(); shelf.scrollBy({ left: step, behavior: RM ? 'auto' : 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); shelf.scrollBy({ left: -step, behavior: RM ? 'auto' : 'smooth' }); }
    });
  }

  // ---------- the plan deck: hovering a plan walks the pool to it and back to Pass ----------
  CP.deckPool && CP.deckPool(document.querySelector('[data-deck]'));
})();
