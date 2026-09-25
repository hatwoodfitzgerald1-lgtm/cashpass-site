/* Cash Pass sequence decoder: fetches frames and decodes them off the main thread with createImageBitmap. */
let base = '';
let pending = [];
let active = 0;
// Concurrent decodes: one fewer than the machine's cores (1 to 4), so a two core machine keeps a core for the page's own thread and its compositor.
const MAX = Math.max(1, Math.min(4, (self.navigator && self.navigator.hardwareConcurrency || 4) - 1));
const done = new Set();
let started = false;

function next() {
  while (active < MAX && pending.length) {
    const f = pending.shift();
    if (done.has(f)) continue;
    active++;
    fetch(base + 'f' + String(f).padStart(3, '0') + '.webp', { cache: 'force-cache' })
      .then((r) => { if (!r.ok) throw new Error('http ' + r.status); return r.blob(); })
      .then((b) => createImageBitmap(b))
      .then((bmp) => { done.add(f); self.postMessage({ frame: f, bitmap: bmp }, [bmp]); })
      .catch((e) => { self.postMessage({ frame: f, error: String(e && e.message || e) }); })
      .finally(() => { active--; next(); });
  }
}

self.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'init') {
    base = m.base;
    pending = m.order.slice();
    started = true;
    next();
  } else if (m.type === 'priority' && started) {
    // Reorder what is still pending so the frames nearest the current scroll position arrive first.
    const c = m.frame;
    pending.sort((a, b) => Math.abs(a - c) - Math.abs(b - c));
  }
};
