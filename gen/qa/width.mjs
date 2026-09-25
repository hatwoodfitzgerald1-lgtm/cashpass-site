// Harlem's full width gate: for every section on every route at a given width, measure the span of the composed content
// (the leftmost and rightmost visible leaf) and the side gutters. usage: node gen/qa/width.mjs <width> <height> [routes...]
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const [w = '1440', h = '900', ...only] = process.argv.slice(2);
const ROUTES = only.length ? only : ['/', '/how-it-works', '/product', '/plans', '/quiz', '/blog', '/blog/four-quarters-four-chances-to-forget', '/blog/the-day-a-6-percent-card-became-a-1-percent-card', '/blog/the-honest-math-of-annual-fees', '/about', '/contact', '/cart', '/checkout', '/order-confirmed', '/terms-of-service', '/privacy-policy', '/nope'];
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: parseInt(w), height: parseInt(h) } });
await page.goto('http://127.0.0.1:8787/plans?qa=rm', { waitUntil: 'load' });
await page.evaluate(() => { localStorage.setItem('cashpass.cart', JSON.stringify({ plan: 'pass', addedAt: Date.now() })); localStorage.setItem('cashpass.order', JSON.stringify({ number: 'CP481207', plan: 'pass', amount: '$59.00', renewal: 'September 24, 2027', email: 'dana@example.com', firstName: 'Dana' })); });
let fails = 0;
for (const route of ROUTES) {
  // Reduced motion so every section sits in its final state for measurement.
  await page.goto(`http://127.0.0.1:8787${route}${route.includes('?') ? '&' : '?'}qa=rm`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  const res = await page.evaluate(() => {
    const vw = window.innerWidth;
    const out = [];
    const sections = Array.from(document.querySelectorAll('main > section, main > article > section, main > article > header, main > article > .post-grid, main > article > footer, main > div > section, footer.ftr, main > article.legal > .legal-grid, main > article.legal > header'));
    for (const s of sections) {
      if (s.hidden || getComputedStyle(s).display === 'none') continue;
      const r = s.getBoundingClientRect();
      if (r.height < 40) continue;
      let minL = Infinity, maxR = -Infinity, count = 0;
      const els = s.querySelectorAll('*');
      for (const el of els) {
        if (el.closest('[hidden]') || el.closest('.vh') || el.classList.contains('vh')) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) continue;
        const tag = el.tagName.toUpperCase();
        if (el.closest('svg') && tag !== 'SVG') continue;
        if (el.classList.contains('sprite') || el.closest('.sprite')) continue;
        // Text nodes sitting beside child elements (a sentence with a link in it) are measured as their own runs.
        if (el.children.length > 0 && tag !== 'SVG') {
          for (const n of el.childNodes) {
            if (n.nodeType !== 3 || !n.textContent.trim()) continue;
            const rg = document.createRange(); rg.selectNodeContents(n);
            for (const rb of rg.getClientRects()) { if (rb.width < 4 || rb.height < 4) continue; minL = Math.min(minL, Math.max(0, rb.left)); maxR = Math.max(maxR, Math.min(vw, rb.right)); count++; }
          }
        }
        const isLeaf = el.children.length === 0 && (el.textContent.trim().length > 0 || /^(IMG|SVG|CANVAS|VIDEO|INPUT|SELECT|TEXTAREA|BUTTON)$/.test(tag));
        const isMedia = /^(IMG|SVG|CANVAS|VIDEO|INPUT|SELECT|TEXTAREA|BUTTON)$/.test(tag) || el.classList.contains('plan') || el.classList.contains('tile');
        if (!isLeaf && !isMedia) continue;
        const b = el.getBoundingClientRect();
        if (b.width < 4 || b.height < 4) continue;
        // Background media that bleeds edge to edge counts as composed content, but decorative full bleed layers are excluded so the gate measures the composition itself.
        if (cs.position === 'absolute' && (tag === 'IMG' || tag === 'VIDEO' || tag === 'CANVAS') && b.width >= vw * 0.98 && !el.closest('[data-composed]')) continue;
        minL = Math.min(minL, Math.max(0, b.left)); maxR = Math.max(maxR, Math.min(vw, b.right)); count++;
      }
      if (!count) continue;
      const span = (maxR - minL) / vw * 100;
      out.push({ id: (s.id || s.className.toString().split(' ')[0]), span: +span.toFixed(1), left: +(minL / vw * 100).toFixed(1), right: +((vw - maxR) / vw * 100).toFixed(1), h: Math.round(r.height) });
    }
    return out;
  });
  const bad = res.filter((x) => x.span < 90 || x.left > 6 || x.right > 6);
  fails += bad.length;
  console.log(`${route} @${w}: ${res.length} sections, ${bad.length} under the gate${bad.length ? ' -> ' + bad.map((b) => `${b.id} span ${b.span}% (L ${b.left}% R ${b.right}%)`).join('; ') : ''}`);
}
console.log(fails ? `FAIL: ${fails} section(s) under the full width gate at ${w}` : `PASS: every section spans 90 percent or more at ${w}`);
await browser.close();
