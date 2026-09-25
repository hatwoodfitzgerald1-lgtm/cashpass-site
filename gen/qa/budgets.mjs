// Budgets: LCP and CLS through PerformanceObserver, frames per second through a 5 second scrub of the Home stage, initial JS weight, pin length.
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import zlib from 'node:zlib';
import fs from 'node:fs';
const [w = '1440', h = '900', ...routes] = process.argv.slice(2);
const ROUTES = routes.length ? routes : ['/', '/plans', '/quiz', '/checkout', '/blog/four-quarters-four-chances-to-forget'];
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:8787/plans', { waitUntil: 'load' });
await page.evaluate(() => { localStorage.setItem('cashpass.cart', JSON.stringify({ plan: 'pass', addedAt: Date.now() })); });
for (const route of ROUTES) {
  const js = [];
  const onReq = (r) => { const u = r.url(); if (/\.js(\?|$)/.test(u)) js.push(u.replace('http://127.0.0.1:8787', '')); };
  page.on('request', onReq);
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}
  });
  const t0 = Date.now();
  await page.goto('http://127.0.0.1:8787' + route + '?qa=arc', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(4), dcl: Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd), load: Math.round(performance.getEntriesByType('navigation')[0].loadEventEnd) }));
  // Initial JS weight: every script requested before load, gzipped from disk.
  const initial = [...new Set(js)].filter((u) => !/three|RGBELoader|seq-worker/.test(u));
  let gz = 0; for (const u of initial) { try { gz += zlib.gzipSync(fs.readFileSync('/home/claude/cashpass/site/public' + u)).length; } catch (e) {} }
  let fps = null, arc = null;
  if (route === '/') {
    // Scrub the stage over 5 seconds and count frames.
    fps = await page.evaluate(async () => {
      const end = 1.5 * innerHeight; let frames = 0; const t0 = performance.now();
      await new Promise((res) => { const tick = () => { const t = performance.now() - t0; frames++; scrollTo(0, Math.min(end, end * (t / 5000))); if (t < 5000) requestAnimationFrame(tick); else res(); }; requestAnimationFrame(tick); });
      return +(frames / 5).toFixed(1);
    });
    arc = await page.evaluate(() => window.__qaArc || null);
  }
  console.log(JSON.stringify({ route, ...m, initialJsGz: gz, scripts: initial.length, fps, arc }));
  page.off('request', onReq);
}
await browser.close();
