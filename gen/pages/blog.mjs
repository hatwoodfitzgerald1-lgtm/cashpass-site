import { page } from '../partials/layout.mjs';
import { closeBand } from '../partials/components.mjs';
import { POSTS } from '../content/blog.mjs';
import { esc, picture, PHOTO_ALT, icon, cardMark } from '../lib/html.mjs';

const TOPIC_KEY = { Quarters: 'quarters', Caps: 'caps', Fees: 'fees' };

function card(p, cls = '') {
  return `<li class="pcard ${cls}" data-topic="${TOPIC_KEY[p.topic]}" data-pcard>
    <div class="pcard-top">${cardMark('pcard-mark')}${icon(p.emblem, 'pcard-ic')}</div>
    <h3 class="pcard-title"><a href="/blog/${p.slug}"><span class="hb">${esc(p.title)}</span></a></h3>
    <p class="pcard-dek">${esc(p.dek)}</p>
    <p class="pcard-meta"><span class="topic-chip topic-chip--static">${esc(p.topic)}</span><span class="post-read">${esc(p.read)}</span></p>
  </li>`;
}

function heroSec() {
  return `<section class="hero hero--blog" data-in="mask-rise">
  <div class="hero-in blog-hero">
    <div class="blog-hero-copy">
      <p class="eyebrow">Blog</p>
      <h1 class="h1">Things nobody tells you at the counter.</h1>
      <p class="dek intro">Short pieces on caps, quarters, fees and the way shops code. Each one takes a fact that lives in your issuer's terms and nowhere in your day, and puts it where you'd need it: in your hand, at the till.</p>
    </div>
    <div class="wheel" data-wheel>
      <div class="scene scene--wheel" data-scene="wheel" aria-hidden="true" data-composed></div>
      <div class="wheel-fallback" data-wheel-fallback aria-hidden="true">
        <svg class="wheel-svg" viewBox="0 0 200 200" data-wheel-svg><g class="wheel-g" data-wheel-g>${[0, 1, 2, 3].map((i) => { const a0 = i * 90 - 90 + 6, a1 = (i + 1) * 90 - 90 - 6; const r = 78, ri = 46; const p = (a, rr) => [100 + rr * Math.cos(a * Math.PI / 180), 100 + rr * Math.sin(a * Math.PI / 180)]; const [x0, y0] = p(a0, r), [x1, y1] = p(a1, r), [x2, y2] = p(a1, ri), [x3, y3] = p(a0, ri); return `<path data-wq="${i}" class="wq${i === 3 ? ' is-lit' : ''}" d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} A${ri} ${ri} 0 0 0 ${x3.toFixed(1)} ${y3.toFixed(1)} Z"/>`; }).join('')}</g></svg>
      </div>
      <ul class="wheel-cats" data-wheel-cats aria-hidden="true"><li>department stores</li><li>streaming</li><li>fitness clubs</li></ul>
      <p class="wheel-label" aria-hidden="true" data-wheel-label>Q4 opens Oct 1</p>
    </div>
  </div>
</section>`;
}

function latest() {
  return `<section class="latest" aria-labelledby="latest-h" data-in="shelf-right">
  <div class="latest-bg">${picture('photo-blog-01', { alt: PHOTO_ALT['photo-blog-01'], sizes: '100vw', cls: 'pic--cover' })}</div>
  <div class="latest-in">
    <h2 class="latest-label" id="latest-h">Latest</h2>
    <ul class="latest-shelf" data-shelf>${POSTS.map((p) => card(p, 'pcard--shelf')).join('')}</ul>
  </div>
</section>`;
}

function all() {
  return `<section class="allposts" aria-labelledby="all-h" data-in="masonry">
  <h2 class="vh" id="all-h">All posts</h2>
  <div class="chips" role="group" aria-label="Filter by topic" data-chips>${[['All', 'all'], ['Quarters', 'quarters'], ['Caps', 'caps'], ['Fees', 'fees']].map(([l, k], i) => `<button class="fchip" type="button" aria-pressed="${i === 0 ? 'true' : 'false'}" data-filter="${k}">${l}</button>`).join('')}</div>
  <ul class="masonry cards-auto" data-masonry>${POSTS.map((p) => card(p, 'pcard--grid')).join('')}</ul>
</section>`;
}

function closeBlog() {
  return `<section class="close" aria-labelledby="close-h" data-in="close">
  <div class="close-in">
    <h2 class="close-h" id="close-h">Buy Pass</h2>
    <div class="close-body">
      <p class="close-p">Every piece above ends at the same door, because the fix is the same each time: something that reads the terms so you don't have to. Pass does that reading all year.</p>
      <div class="cta-row"><a class="tile" href="/cart?add=pass" data-add-plan="pass" data-hero-cta>Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span></div>
    </div>
  </div>
  <div class="pool-divider" aria-hidden="true"></div>
</section>`;
}

export function render() {
  const main = [heroSec(), latest(), all(), closeBlog()].join('\n');
  return page({
    route: '/blog', title: 'Cash Pass Blog',
    description: 'Short pieces on caps, quarters, fees and the way shops code, written so you know the answer before you tap.',
    bodyClass: 'page-blog', hover: 'bar', main, script: 'blog', flip: true
  });
}
