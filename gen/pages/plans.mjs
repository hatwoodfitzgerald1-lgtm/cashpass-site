import { page } from '../partials/layout.mjs';
import { planDeck, PLANS, plan, testimonials, faqIndex, mailto, edgeDivider, closeBand } from '../partials/components.mjs';
import { esc, picture, productShot, SHOTS, PHOTO_ALT, cardMark, kitSvg } from '../lib/html.mjs';

function heroDeck() {
  return `<section class="hero hero--plans plans-deck-sec" aria-labelledby="plans-h1" data-in="glass-rise">
  <div class="hero-in plans-hero">
    <p class="eyebrow">Plans</p>
    <h1 class="h1" id="plans-h1">Three plans. One of them has the light on.</h1>
    <p class="intro">Every plan gives the answer at the till. The paid ones do the remembering: the connection, the caps, the quarters, the fees. The price you see is the whole price.</p>
  </div>
  <div class="third-card" data-third-card>${planDeck({ idPrefix: 'plan', headingLevel: 2 }).replace('data-add-plan="pass">Buy Pass', 'data-add-plan="pass" data-hero-cta>Buy Pass')}</div>
  <p class="grid-line">${esc(PLANS.lineUnderGrid)}</p>
</section>`;
}

function spec() {
  return `<section class="spec" aria-labelledby="spec-h" data-in="rows-left">
  <h2 class="vh" id="spec-h">The plans in full</h2>
  <div class="split">
    <aside class="split-rail spec-summary" aria-live="polite" data-spec-summary>
      <p class="spec-sum-label">Summary</p>
      <p class="spec-sum" data-spec-text>${esc(plan('pass').stickySummary)}</p>
      <p class="spec-sum-link"><a class="tlink" href="#plan-pass" data-spec-link>Pass</a></p>
    </aside>
    <div class="spec-body">${PLANS.order.map((id) => { const p = plan(id); return `<article class="spec-plan" data-spec-plan="${id}" id="spec-${id}">
      <div class="spec-lead"><h3 class="h3">${esc(p.name)}</h3><p>${esc(p.leadParagraph)}</p></div>
      <ul class="spec-list plan-list${id === 'pass' ? ' spec-list--lit' : ''}">${p.inclusions.map((i) => `<li data-spec-row>${cardMark('bullet')}<span>${esc(i)}</span></li>`).join('')}</ul>
    </article>`; }).join('')}</div>
  </div>
  <div class="pull" data-pull>
    ${edgeDivider()}
    <p class="pq pq--h2 pull-h" data-type-on>Pass is the one with the light on. The other two aren't wrong. They're for a different wallet.</p>
    ${edgeDivider()}
  </div>
</section>`;
}

const ROWS = [
  ['How do I cancel?', `Two taps in the app, with no call or chat in between, or one email to ${mailto()}. Cancelling stops the next renewal. Your plan runs to the end of the year you've paid for.`, 's1-moment'],
  ['Is $59 the whole price?', 'Yes. Prices are in US dollars and include any sales tax that applies. Pass renews at $59 a year and Pass Family at $99, at the price you see here, and a renewal notice reaches you before either one.', 's3-ledger'],
  ['What does the read only connection add over Free?', 'The last twelve months. Free knows the cards you typed in and the rules you wrote. Pass reads your transactions, sorted by merchant and category, and from those it proposes rules, tracks every cap to the dollar and fills the fee ledger. The token can read. It can\'t move money, make a charge or change anything.', 's8-connect'],
  ['Can two people share one Pass?', 'Pass is one person, one login. Pass Family is up to five, each with their own login and their own cards, one rule set and one bill. Nobody in the house sees anyone else\'s transactions, only the totals.', 's6-household']
];

function before() {
  return `<section class="before" aria-labelledby="before-h" data-in="edge-rows">
  <div class="before-band">${picture('photo-plans-01', { alt: PHOTO_ALT['photo-plans-01'], sizes: '100vw', cls: 'pic--cover' })}</div>
  <div class="before-head"><h2 class="h2" id="before-h">Before you choose</h2></div>
  <div class="before-grid">
    <div class="acc" data-acc>${ROWS.map(([q, a, shot], i) => `<details class="faq-row acc-row" data-acc-row data-shot="${shot}" ${i === 0 ? 'open' : ''} id="before-${i + 1}">
      <summary class="faq-q">${cardMark('faq-mark')}<h3 class="faq-h">${esc(q)}</h3></summary>
      <div class="faq-a"><p>${a}</p><div class="acc-inline">${productShot(shot, { alt: SHOTS[shot], width: 300 })}</div></div>
    </details>`).join('')}</div>
    <div class="acc-media" data-acc-media aria-hidden="true">${ROWS.map(([q, a, shot], i) => `<div class="acc-shot${i === 0 ? ' is-active' : ''}" data-acc-shot="${shot}">${productShot(shot, { alt: '', width: 420, lazy: i > 0 })}</div>`).join('')}</div>
  </div>
</section>`;
}

const FAQ3 = [
  ['I carry three cards and one of them rotates. Free or Pass?', 'Free gives you the answer at the till for all three. It can\'t remind you before the quarter opens; that reminder is a Pass feature. If you\'ve never missed a quarter, Free. If you have, Pass.'],
  ['Do I type my cards in on Pass?', 'No. They arrive with the connection, with the last four digits so you can tell them apart. You can still add one by hand, the way Free does.'],
  ['Which plan does the quiz recommend?', 'Whichever fits your answers. One to three cards lands on Free, four or more on Pass, a household on Pass Family. It never lands on a card you don\'t own.']
];

function three() {
  return `<section class="three" aria-labelledby="three-h" data-in="flip-cards">
  <div class="three-grid">
    <div class="three-faq"><h2 class="h2" id="three-h">Three more, quickly</h2>${faqIndex(FAQ3, { firstOpen: false, idPrefix: 'plans-faq' })}</div>
    <div class="three-t">${testimonials({ cls: 'tstm--plans' })}</div>
  </div>
</section>`;
}

export function render() {
  const main = [heroDeck(), spec(), before(), three(),
    closeBand({ body: 'Still deciding? Three questions will do it.', link: ['Find your plan', '/quiz'] })].join('\n');
  return page({
    route: '/plans', title: 'Cash Pass plans',
    description: 'Free, $0. Pass, $59 a year. Pass Family, $99 a year. Prices include any sales tax. Cancel in two taps, any time.',
    bodyClass: 'page-plans', hover: 'flip', main, script: 'plans'
  });
}
