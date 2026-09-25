// The bespoke blog post template: opening emblem, hero image, sticky scroll driven diagram, numbered subheads,
// two pull quotes between glass edge dividers, one photograph, the seal end cap and the Buy Pass end cap.
import { page } from './layout.mjs';
import { edgeDivider } from './components.mjs';
import { esc, picture, PHOTO_ALT, productShot, SHOTS, blogSvg, kitSvg, icon, cardMark } from '../lib/html.mjs';

const TOPIC_KEY = { Quarters: 'quarters', Caps: 'caps', Fees: 'fees' };

export function renderPost(post) {
  const items = [];
  let subhead = 0;
  let chunk = [];
  const flush = () => { if (chunk.length) { items.push({ kind: 'chunk', html: chunk.join('') }); chunk = []; } };
  post.body.forEach((b) => {
    if (typeof b === 'string') { chunk.push(`<p class="post-p" data-p>${esc(b)}</p>`); return; }
    if (b.ledger) {
      chunk.push(`<ul class="post-ledger" data-ledger>${b.ledger.map((l) => `<li data-ledger-row>${cardMark('bullet')}<span>${esc(l)}</span></li>`).join('')}</ul>`);
      return;
    }
    if (b.h2) {
      // Before a new subhead: place pull quotes, the photograph and the inline shot that belong after the previous subhead.
      (post.pulls || []).filter((p) => p.after === subhead && !p.placed).forEach((p) => {
        p.placed = true; flush();
        items.push({ kind: 'pull', html: `<blockquote class="post-pull" data-post-pull>${edgeDivider()}<p class="pq pq--h2 pull-h">${esc(p.text)}</p>${edgeDivider()}</blockquote>` });
      });
      if (post.photoAfterSubhead === subhead && !post.photoPlaced) {
        post.photoPlaced = true;
        chunk.push(`<figure class="post-photo" data-post-photo>${picture(post.photo, { alt: PHOTO_ALT[post.photo], sizes: '(min-width: 1024px) 66vw, 100vw', cls: 'pic--3x2' })}</figure>`);
      }
      if (post.inlineShot && post.inlineShot.after === subhead && !post.inlineShot.placed) {
        post.inlineShot.placed = true;
        chunk.push(`<figure class="post-shot" data-post-shot><div class="glass-mini" aria-hidden="true"></div>${productShot(post.inlineShot.id, { alt: SHOTS[post.inlineShot.id], width: 360 })}</figure>`);
      }
      subhead++;
      const n = String(subhead).padStart(2, '0');
      chunk.push(`<h2 class="post-h2" id="s-${subhead}" data-subhead="${subhead}"><span class="numeral numeral--post" aria-hidden="true" data-numeral="${n}">${n}</span><span class="post-h2-text">${esc(b.h2)}</span></h2>`);
    }
  });
  (post.pulls || []).filter((p) => !p.placed).forEach((p) => { flush(); items.push({ kind: 'pull', html: `<blockquote class="post-pull" data-post-pull>${edgeDivider()}<p class="pq pq--h2 pull-h">${esc(p.text)}</p>${edgeDivider()}</blockquote>` }); });
  if (post.inlineShot && !post.inlineShot.placed) chunk.push(`<figure class="post-shot" data-post-shot><div class="glass-mini" aria-hidden="true"></div>${productShot(post.inlineShot.id, { alt: SHOTS[post.inlineShot.id], width: 360 })}</figure>`);
  flush();
  const rows = items.length;
  const grid = `<div class="post-grid" style="--rows:${rows}">
    <aside class="post-rail" data-post-rail>
      <div class="post-diagram" data-diagram="${post.key}">${blogSvg(post.diagram, post.diagramAlt)}
        ${post.key === 'rotating' ? `<div class="capbar" data-capbar aria-hidden="true"><span class="capbar-label"><span data-capbar-text>$0 of $1,500 this quarter</span></span><span class="capbar-track"><span class="capbar-fill" data-capbar-fill></span></span></div>` : ''}
        ${post.key === 'coding' ? `<div class="capbar" data-capbar aria-hidden="true"><span class="capbar-label"><span data-capbar-text>$4,140 of $6,000</span></span><span class="capbar-track"><span class="capbar-fill" data-capbar-fill style="width:69%"></span></span></div>` : ''}
        ${post.key === 'fees' ? `<div class="capbar capbar--base" data-baseline aria-hidden="true"><span class="capbar-label">One flat 2% card on everything: $558</span></div>` : ''}
      </div>
    </aside>
    ${items.map((it, i) => `<div class="post-item post-item--${it.kind}" style="--r:${i + 1}">${it.html}</div>`).join('')}
  </div>`;
  const main = `<article class="post post--${post.key}" data-post="${post.key}">
  <header class="post-head" data-in="post-head">
    <div class="post-emblem" data-emblem aria-hidden="true">${icon(post.emblem, 'emblem-ic')}</div>
    <p class="post-meta"><a class="topic-chip" href="/blog?topic=${TOPIC_KEY[post.topic]}">${esc(post.topic)}</a><span class="post-read">${esc(post.read)}</span></p>
    <h1 class="h1 post-title">${esc(post.title)}</h1>
    <p class="dek post-dek">${esc(post.dek)}</p>
  </header>
  <figure class="post-hero" data-in="post-hero">${picture(post.hero, { alt: PHOTO_ALT[post.hero], sizes: '100vw', lazy: false, priority: true, cls: 'pic--16x9' })}</figure>
  ${grid}
  <footer class="endcap" data-in="endcap">
    <div class="endcap-seal" data-seal>${kitSvg('seal.svg', { cls: 'seal seal--56', size: [56, 56] })}</div>
    <p class="endcap-line">${esc(post.endLine)}</p>
    <div class="cta-row"><a class="tile" href="/cart?add=pass" data-add-plan="pass" data-hero-cta>Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span></div>
  </footer>
</article>`;
  return page({
    route: `/blog/${post.slug}`, title: `${post.title} | Cash Pass`, description: post.dek, ogType: 'article',
    bodyClass: 'page-post', hover: 'below', main, script: 'post', bodyAttrs: `data-post-key="${post.key}"`
  });
}
