// Assembles every route from the shared partials and the plans data into src/site/<route>/index.html,
// and emits the plan data script, the sitemap and robots.txt. Run: node gen/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { SITE, PUBLIC } from './lib/html.mjs';
import { PLANS } from './partials/components.mjs';
import { ORIGIN } from './partials/layout.mjs';

const ROUTES = [
  ['/', './pages/home.mjs'],
  ['/how-it-works', './pages/how-it-works.mjs'],
  ['/product', './pages/product.mjs'],
  ['/plans', './pages/plans.mjs'],
  ['/quiz', './pages/quiz.mjs'],
  ['/blog', './pages/blog.mjs'],
  ['/blog/four-quarters-four-chances-to-forget', './pages/post-rotating.mjs'],
  ['/blog/the-day-a-6-percent-card-became-a-1-percent-card', './pages/post-coding.mjs'],
  ['/blog/the-honest-math-of-annual-fees', './pages/post-fees.mjs'],
  ['/about', './pages/about.mjs'],
  ['/contact', './pages/contact.mjs'],
  ['/cart', './pages/cart.mjs'],
  ['/checkout', './pages/checkout.mjs'],
  ['/order-confirmed', './pages/order-confirmed.mjs'],
  ['/terms-of-service', './pages/terms.mjs'],
  ['/privacy-policy', './pages/privacy.mjs'],
  ['/404', './pages/notfound.mjs']
];

const SITEMAP = ['/', '/how-it-works', '/product', '/plans', '/quiz', '/blog', '/blog/four-quarters-four-chances-to-forget', '/blog/the-day-a-6-percent-card-became-a-1-percent-card', '/blog/the-honest-math-of-annual-fees', '/about', '/contact', '/terms-of-service', '/privacy-policy'];

const outRoot = path.join(SITE, 'src', 'site');
const only = process.argv[2];
if (!only) fs.rmSync(outRoot, { recursive: true, force: true });
let built = 0;
for (const [route, mod] of ROUTES) {
  if (only && route !== only) continue;
  const m = await import(mod);
  const html = m.render();
  if (/[–—]/.test(html)) {
    const i = html.search(/[–—]/);
    throw new Error(`dash found in ${route} near: ${html.slice(Math.max(0, i - 80), i + 40)}`);
  }
  const dir = path.join(outRoot, route === '/' ? '' : route.replace(/^\//, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  built++;
}

// One plan data source for the browser: the same JSON the cards were rendered from.
fs.writeFileSync(path.join(PUBLIC, 'assets', 'js', 'plans-data.js'), `window.CP_PLANS=${JSON.stringify(PLANS)};`);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP.map(r => `  <url><loc>${ORIGIN}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(PUBLIC, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
console.log(`built ${built} route(s) into src/site`);
