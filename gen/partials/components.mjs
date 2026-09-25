// Components drawn once and used everywhere: the plan card, the plan deck on glass, the Close, testimonials, the FAQ index.
import fs from 'node:fs';
import path from 'node:path';
import { esc, attr, cardMark, kitSvg, figure, SITE } from '../lib/html.mjs';

export const PLANS = JSON.parse(fs.readFileSync(path.join(SITE, 'src', 'data', 'plans.json'), 'utf8'));
export const plan = (id) => PLANS.plans[id];

// The one plan card component. Slot order locked: name, price, who line, unit line, inclusions, renewal line, CTA.
export function planCard(id, { compact = false, dark = false, headingLevel = 3, cls = '', showCta = true, lit = null, idPrefix = '' } = {}) {
  const p = plan(id);
  const isLit = lit === null ? p.recommended : lit;
  const H = `h${headingLevel}`;
  const tileCls = p.ctaStyle === 'filled' ? 'tile' : 'tile tile--ghost';
  const priceLine = id === 'pass' ? `<span class="price-line price-line--card">$59 a year. Cancel any time.</span>` : '';
  return `<article class="plan plan--${id}${isLit ? ' plan--lit' : ''}${compact ? ' plan--compact' : ''}${dark ? ' plan--dark' : ''} ${cls}" data-plan="${id}" ${idPrefix ? `id="${idPrefix}-${id}"` : ''}>
  <div class="plan-head">
    <${H} class="plan-name"><span class="plan-chip">${esc(p.name)}</span></${H}>
    ${p.tag ? `<span class="plan-tag">${esc(p.tag)}</span>` : ''}
  </div>
  <p class="plan-price"><span class="plan-num">${figure(p.priceNumeral)}</span>${p.priceSuffix ? ` <span class="plan-cadence">${esc(p.priceSuffix)}</span>` : ''}</p>
  <p class="plan-under">${esc(p.underPrice)}</p>
  ${p.cancelLine ? `<p class="plan-cancel">${esc(p.cancelLine)}</p>` : ''}
  <p class="plan-who">${esc(p.whoLine)}</p>
  <p class="plan-unit">${esc(p.unitLine)}</p>
  <ul class="plan-list">${p.inclusions.map(i => `<li>${cardMark('bullet')}<span>${esc(i)}</span></li>`).join('')}</ul>
  <p class="plan-renew">${esc(p.renewalLine)}</p>
  ${showCta ? `<div class="plan-cta"><a class="${tileCls} tile--full" href="/cart?add=${id}" data-add-plan="${id}">${esc(p.cta)}</a>${priceLine}</div>` : ''}
</article>`;
}

// Three plan cards standing on a CSS glass stage with the pool of light (the deck).
export function planDeck({ compact = false, cls = '', idPrefix = '', headingLevel = 3, pool = 'pass' } = {}) {
  const cards = PLANS.order.map(id => planCard(id, { compact, headingLevel, idPrefix })).join('');
  return `<div class="deck ${cls}" data-deck data-pool="${pool}">
  <div class="deck-glass" aria-hidden="true"><div class="pool" data-pool-el></div><div class="deck-reflect"></div></div>
  <div class="deck-cards">${cards}</div>
</div>`;
}

export function closeBand({ body, secondary = null, link = null, id = 'close' }) {
  return `<section class="close" aria-labelledby="${id}-h" data-in="close">
  <div class="close-in">
    <h2 class="close-h" id="${id}-h">Buy Pass</h2>
    <div class="close-body">
      <p class="close-p">${esc(body)}</p>
      ${link ? `<p class="close-link"><a class="tlink" href="${link[1]}">${esc(link[0])}</a></p>` : ''}
      <div class="cta-row"><a class="tile" href="/cart?add=pass" data-add-plan="pass" data-hero-cta>Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span>${secondary ? `<a class="tlink" href="${secondary[1]}">${esc(secondary[0])}</a>` : ''}</div>
    </div>
  </div>
  <div class="pool-divider" aria-hidden="true">${kitSvg('divider-pool.svg', { cls: 'div-pool' })}</div>
</section>`;
}

export const TESTIMONIALS = [
  ['P.N.', '"The cafe inside my supermarket codes as dining. Cash Pass said so at the counter. I\'d been tapping my grocery card there for two years and earning 1 percent on every coffee. It\'s 4 percent now."', 'Priya N., pharmacist, Aurora, CO'],
  ['M.T.', '"I\'d activated my rotating category twice in three years. The reminder came three days before Q3 opened. I did it in my issuer\'s app and marked it done. Two quarters in a row now, and the bar under the card says $900 of $1,500. I\'d never seen that number before."', 'Marcus T., site supervisor, Lakewood, CO'],
  ['E.R.', '"The ledger showed my $225 card had earned $240 over the year. It cleared its own fee by $15. I\'d been about to cancel it on a hunch. Now I know the number instead."', 'Elena R., dental hygienist, Colorado Springs, CO']
];

export function testimonials({ cls = '' } = {}) {
  return `<div class="tstm ${cls}" data-tstm>
  <ul class="tstm-grid">${TESTIMONIALS.map(([mono, quote, who]) => `<li class="tcard" data-tcard>
    <span class="mono" aria-hidden="true"><svg class="mono-arc" viewBox="0 0 56 56"><path d="M28 3 a25 25 0 0 1 25 25" fill="none" stroke="#CDB3AE" stroke-width="1.5" stroke-linecap="round"/></svg><span class="mono-txt">${esc(mono)}</span></span>
    <blockquote class="tquote"><p>${esc(quote)}</p></blockquote>
    <p class="twho">${esc(who)}</p></li>`).join('')}</ul>
  <p class="tstm-label">Each member's own figures, quoted with permission. They're examples of one wallet, not a promise about yours. Rewards are set and paid by your issuer.</p>
</div>`;
}

// The FAQ editorial index: details rows with the card motif as marker; the answer may carry mailto links.
export function faqIndex(items, { firstOpen = true, cls = '', idPrefix = 'faq' } = {}) {
  return `<div class="faq ${cls}" data-faq>${items.map(([q, a], i) => `<details class="faq-row" data-faq-row ${firstOpen && i === 0 ? 'open data-open-desktop' : ''} id="${idPrefix}-${i + 1}">
  <summary class="faq-q">${cardMark('faq-mark')}<h3 class="faq-h">${esc(q)}</h3></summary>
  <div class="faq-a"><p>${a}</p></div>
</details>`).join('')}</div>`;
}

export function mailto(text = 'support@yourcashpass.com') {
  return `<a href="mailto:support@yourcashpass.com">${esc(text)}</a>`;
}

// A page hero: eyebrow, H1, intro, optional Buy Pass with its price line.
export function hero({ eyebrow, h1, intro, cta = false, cls = '', extra = '', h1Cls = '' }) {
  return `<section class="hero ${cls}" data-in="mask-rise">
  <div class="hero-in">
    <p class="eyebrow">${esc(eyebrow)}</p>
    <h1 class="h1 ${h1Cls}">${esc(h1)}</h1>
    <p class="intro">${esc(intro)}</p>
    ${cta ? `<div class="cta-row"><a class="tile" href="/cart?add=pass" data-add-plan="pass" data-hero-cta>Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span></div>` : ''}
  </div>
  ${extra}
</section>`;
}

// Five card glyphs standing on a glass strip (large scale), none or one lit.
export function fiveCards({ lit = -1, cls = '' } = {}) {
  return `<div class="five ${cls}" aria-hidden="true" data-five><div class="five-cards">${[0, 1, 2, 3, 4].map(i => `<span class="fcard${i === lit ? ' fcard--lit' : ''}" data-fcard>${cardMark('fcard-mark')}</span>`).join('')}</div><div class="glass-reflect"></div>${lit >= 0 ? '<div class="pool pool--five" data-five-pool></div>' : '<div class="pool pool--five pool--off" data-five-pool></div>'}</div>`;
}

export function numeral(n) {
  return `<span class="numeral" aria-hidden="true" data-numeral="${n}">${n}</span>`;
}

export function edgeDivider(cls = '') {
  return `<div class="edge ${cls}" aria-hidden="true">${kitSvg('divider-edge.svg', { cls: 'div-edge' })}</div>`;
}

export function fiveDivider(cls = '') {
  return `<div class="five-div ${cls}" aria-hidden="true">${kitSvg('divider-five.svg', { cls: 'div-five' })}</div>`;
}
