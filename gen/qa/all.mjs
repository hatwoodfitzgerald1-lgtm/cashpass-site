// Screenshots every route at one width, stitched from viewport captures so pinned sections read as a visitor sees them.
// usage: node gen/qa/all.mjs <width> <height> <outdir> [routes...]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const [w = '1440', h = '900', outdir = '/home/claude/cashpass/work/shots/1440', ...only] = process.argv.slice(2);
const ROUTES = only.length ? only : ['/', '/how-it-works', '/product', '/plans', '/quiz', '/blog', '/blog/four-quarters-four-chances-to-forget', '/blog/the-day-a-6-percent-card-became-a-1-percent-card', '/blog/the-honest-math-of-annual-fees', '/about', '/contact', '/cart', '/checkout', '/order-confirmed', '/terms-of-service', '/privacy-policy', '/nope'];
fs.mkdirSync(outdir, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const mobile = parseInt(w) < 900;
const ctx = await browser.newContext({ viewport: { width: parseInt(w), height: parseInt(h) }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
const page = await ctx.newPage();
// A cart and an order so the store pages render their full states.
await page.goto('http://127.0.0.1:8787/plans', { waitUntil: 'load' });
await page.evaluate(() => { localStorage.setItem('cashpass.cart', JSON.stringify({ plan: 'pass', addedAt: Date.now(), justAdded: false })); localStorage.setItem('cashpass.order', JSON.stringify({ number: 'CP481207', plan: 'pass', amount: '$59.00', renewal: 'September 24, 2027', email: 'dana@example.com', firstName: 'Dana', placedAt: Date.now() })); });
const report = [];
for (const route of ROUTES) {
  const errors = [], bad = [];
  const onConsole = (m) => { if (m.type() === 'error') errors.push(m.text()); };
  const onErr = (e) => errors.push('pageerror ' + e.message);
  const onResp = (r) => { if (r.status() >= 400 && !/seq\/\d+\/f\d+|\/video\/|rest\/960/.test(r.url())) bad.push(`${r.status()} ${r.url().replace('http://127.0.0.1:8787', '')}`); };
  page.on('console', onConsole); page.on('pageerror', onErr); page.on('response', onResp);
  const resp = await page.goto('http://127.0.0.1:8787' + route, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = parseInt(h);
  const shots = [];
  let y = 0, i = 0;
  while (y < total && i < 40) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(y === 0 ? 400 : 650);
    if (y > 0) await page.evaluate(() => { const h = document.querySelector('.hdr'); if (h) h.style.visibility = 'hidden'; });
    let buf = null;
    try { buf = await page.screenshot({ fullPage: false, timeout: 120000 }); } catch (e) { errors.push('screenshot ' + e.message.split('\n')[0]); }
    if (buf) shots.push(buf);
    y += vh; i++;
  }
  // stitch with python later; save parts
  const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_');
  shots.forEach((b, k) => fs.writeFileSync(path.join(outdir, `${slug}.part${String(k).padStart(2, '0')}.png`), b));
  const info = await page.evaluate(() => ({ title: document.title, desc: (document.querySelector('meta[name=description]') || {}).content, sw: document.documentElement.scrollWidth, vw: window.innerWidth, h: document.documentElement.scrollHeight }));
  report.push({ route, status: resp.status(), ...info, parts: shots.length, errors: [...new Set(errors)].slice(0, 8), bad: [...new Set(bad)].slice(0, 12) });
  page.off('console', onConsole); page.off('pageerror', onErr); page.off('response', onResp);
}
fs.writeFileSync(path.join(outdir, 'report.json'), JSON.stringify(report, null, 1));
for (const r of report) console.log(`${r.status} ${r.route} | ${r.title} | h=${r.h} sw=${r.sw}/${r.vw} parts=${r.parts}${r.errors.length ? '\n   errors: ' + r.errors.join(' || ') : ''}${r.bad.length ? '\n   http: ' + r.bad.join(', ') : ''}`);
await browser.close();
