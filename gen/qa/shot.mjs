// Playwright screenshots for the build's own checks. usage: node gen/qa/shot.mjs <path> <out.png> [width] [height] [full|view] [scrollY|selector] [rm]
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const [route, out, w = '1440', h = '900', mode = 'view', scrollTo = '0', rm = ''] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: parseInt(w), height: parseInt(h) }, deviceScaleFactor: 1, reducedMotion: rm === 'rm' ? 'reduce' : 'no-preference' });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message));
page.on('requestfailed', (r) => errors.push('[requestfailed] ' + r.url()));
const failed404 = [];
page.on('response', (r) => { if (r.status() >= 400) failed404.push(`${r.status()} ${r.url()}`); });
await page.goto('http://127.0.0.1:8787' + route, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900);
if (/^\d+$/.test(scrollTo)) { const y = parseInt(scrollTo); if (y) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(1200); } }
else if (scrollTo && scrollTo !== '0') { await page.evaluate((s) => { const el = document.querySelector(s); if (el) el.scrollIntoView(); }, scrollTo); await page.waitForTimeout(1200); }
if (mode === 'full') {
  // Walk the page so every scroll entrance fires, then shoot the full page.
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Math.round(parseInt(h) * 0.7)) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(140); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: out, fullPage: true });
} else {
  await page.screenshot({ path: out, fullPage: false });
}
const info = await page.evaluate(() => ({ title: document.title, h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth, vw: window.innerWidth }));
console.log(JSON.stringify(info));
if (errors.length) console.log('console:', [...new Set(errors)].slice(0, 30).join('\n'));
if (failed404.length) console.log('http errors:', [...new Set(failed404)].slice(0, 40).join('\n'));
await browser.close();
