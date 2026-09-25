import { page } from './layout.mjs';
import { esc, kitSvg, cardMark } from '../lib/html.mjs';

function linkify(text) {
  return esc(text).replace(/support@yourcashpass\.com/g, '<a href="mailto:support@yourcashpass.com">support@yourcashpass.com</a>');
}

export function renderLegal(doc, { route, canonical, description }) {
  const slug = (h) => h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const index = doc.sections.map((s) => `<li><a href="#${slug(s.h)}">${esc(s.h)}</a></li>`).join('');
  const body = doc.sections.map((s) => `<section class="legal-sec" id="${slug(s.h)}" data-legal-sec>
    <h2 class="h3 legal-h">${cardMark('legal-mark')}<span>${esc(s.h)}</span></h2>
    ${s.blocks.map((b) => {
      if (typeof b === 'string') return `<p>${linkify(b)}</p>`;
      if (b.lines) return `<p class="legal-lines">${b.lines.map((l) => linkify(l)).join('<br>')}</p>`;
      if (b.list) return `<ul class="legal-list">${b.list.map((l) => `<li>${linkify(l)}</li>`).join('')}</ul>`;
      if (b.privacyLink) return `<p class="legal-read">Read our <a href="/privacy-policy">Privacy Policy</a></p>`;
      return '';
    }).join('')}
  </section>`).join('');
  const main = `<article class="legal" data-legal>
  <header class="legal-head" data-in="legal-head">
    <div class="legal-title">
      <h1 class="h1">${esc(doc.title)}</h1>
      <p class="legal-entity">${esc(doc.entity)}</p>
    </div>
    <div class="coin-wrap" aria-hidden="true"><div class="coin" data-coin>${kitSvg('seal.svg', { cls: 'seal seal--coin', size: [160, 160] })}</div></div>
  </header>
  <div class="legal-grid">
    <nav class="legal-index split-rail" aria-label="Sections">
      <details class="legal-index-mobile" data-legal-index><summary class="legal-index-summary">Sections</summary><ol class="legal-index-list hg">${index}</ol></details>
    </nav>
    <div class="legal-doc" data-in="headings-left">
      <p class="legal-intro">${linkify(doc.intro)}</p>
      ${body}
    </div>
  </div>
</article>`;
  return page({ route, canonical, title: doc.title, description, bodyClass: 'page-legal', hover: 'dim', main, script: 'legal', navCta: 'rimmed' });
}
