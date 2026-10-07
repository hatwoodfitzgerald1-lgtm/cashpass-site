import { page, smsBlock } from '../partials/layout.mjs';
import { planDeck, closeBand, testimonials, faqIndex, mailto, fiveCards, numeral } from '../partials/components.mjs';
import { esc, picture, productShot, SHOTS, PHOTO_ALT, video, cardMark, kitSvg, icon, figure, dataUri, fileSize, exists, words } from '../lib/html.mjs';

export const SHOPS = [
  { key: 'market', shop: 'Lantern Row Market', when: 'July', answer: 'Tap Grocery 6%', why: '6% on groceries. $4,140 of the $6,000 yearly cap used.', label: 'Example figures', chip: 'Market', card: 'grocery' },
  { key: 'fuel', shop: 'Route 9 Fuel', when: '', answer: 'Tap Everyday 4%', why: '4% at gas stations. You set a rule: use the Everyday 4% card for gas.', label: '', chip: 'Fuel', card: 'everyday' },
  { key: 'marketplace', shop: 'Online marketplace', when: '', answer: 'Tap Marketplace 5%', why: 'This card pays 5% at this marketplace and 1% everywhere else.', label: '', chip: 'Marketplace', card: 'marketplace' },
  { key: 'elsewhere', shop: 'Any other store', when: '', answer: 'Tap Flat 2%', why: 'No category matches, so your flat 2% card beats the 1% your other cards pay here.', label: '', chip: 'Elsewhere', card: 'flat' },
  { key: 'cafe', shop: 'Lantern Row Cafe', when: 'November 3', answer: 'Tap Everyday 4%', why: 'This cafe counts as Dining, where Everyday 4% pays 4%. Your Grocery 6% card hit its cap on Oct 14.', label: 'Example figures', chip: 'Cafe', card: 'everyday' }
];

const CARDS = [
  { id: 'grocery', name: 'Grocery 6%', ending: 'ending 4471' },
  { id: 'everyday', name: 'Everyday 4%', ending: 'ending 0286' },
  { id: 'rotating', name: 'Rotating 5%', ending: 'ending 9130' },
  { id: 'marketplace', name: 'Marketplace 5%', ending: 'ending 7758' },
  { id: 'flat', name: 'Flat 2%', ending: 'ending 3324' }
];

function answerLine(text, cls = '') {
  // The Last Light: the answer in Instrument Serif; the "4%" style figure is marked so it can arrive last in ice white.
  const m = text.match(/^(.*?)(\d+%)$/);
  const inner = m ? `${esc(m[1])}<span class="ans-fig">${esc(m[2])}</span>` : esc(text);
  return `<p class="answer ${cls}" aria-label="${esc(text)}" data-last-light><span class="answer-txt" aria-hidden="true">${inner}</span></p>`;
}

function stage() {
  const posterInline = fileSize('seq/poster.webp');
  const posterSrc = (posterInline > 0 && posterInline < 122880) ? dataUri('seq/poster.webp', 'image/webp') : '/assets/media/seq/poster.webp';
  const shopCards = SHOPS.map((s, i) => `<article class="shop" data-shop="${i}" id="shop-${i + 1}">
    <p class="shop-name">${esc(s.shop)}${s.when ? `<span class="shop-when">${esc(s.when)}</span>` : ''}</p>
    ${answerLine(s.answer, i === 4 ? 'answer--last' : '')}
    <p class="shop-why">${esc(s.why)}</p>
    <div class="shop-foot"><span class="chip" aria-hidden="true">Open in wallet</span>${s.label ? `<span class="example">${esc(s.label)}</span>` : ''}</div>
  </article>`).join('');
  const index = SHOPS.map((s, i) => `<li><button class="ch" type="button" data-chapter="${i}" aria-label="Chapter ${i + 1} of 5, ${esc(s.shop)}"${i === 0 ? ' aria-current="true"' : ''}>${cardMark('ch-mark')}<span class="ch-name">${esc(s.shop)}</span></button></li>`).join('');
  const pocketCards = CARDS.map(c => `<div class="ptile ptile--${c.id}" data-ptile="${c.id}"><span class="ptile-name">${figure(c.name)}</span><span class="ptile-end">${esc(c.ending)}</span></div>`).join('');
  const chips = SHOPS.map((s, i) => `<button class="pchip" type="button" data-pchip="${i}" aria-pressed="${i === 4 ? 'true' : 'false'}">${esc(s.chip)}</button>`).join('');
  return `<section class="stage" id="stage" data-stage aria-labelledby="stage-h">
  <div class="stage-pin" data-stage-pin>
    <div class="stage-media" aria-hidden="true" data-composed>
      <img class="stage-poster" src="${posterSrc}" width="1920" height="1080" alt="" fetchpriority="high" decoding="async" data-poster>
      <img class="stage-poster stage-poster--rm" src="/assets/media/seq/poster-reduced-motion.webp" width="1920" height="1080" alt="" loading="lazy" decoding="async" data-poster-rm>
      <canvas class="stage-canvas" data-canvas></canvas>
      <div class="stage-rest" data-rest-layer></div>
      <div class="stage-wash" data-wash></div>
    </div>
    <p class="vh">Five plain card tiles stand on black glass on a dark red leather counter. A phone propped in front of them is the only light, and its cool glow rests on the card to tap while a small sign names the shop.</p>
    <div class="copy" data-copy>
      <p class="eyebrow">For people who carry four or more rewards credit cards.</p>
      <h1 class="h1 h1--hero">An app that tells you which credit card to use for every purchase.</h1>
      <p class="subhead">When you arrive at a store, Cash Pass sends a notification naming which of your own rewards cards pays the most there, and why.</p>
      <div class="cta-row"><a class="tile" href="/cart?add=pass" data-add-plan="pass" data-hero-cta>Buy the Pass plan</a><span class="price-line">$59 a year. Cancel any time.</span><a class="tlink" href="/how-it-works">See how it works</a></div>
    </div>
    <div class="deck-col">
      <h2 class="stage-h" id="stage-h">Example: the card it picks at five stores</h2>
      <div class="loader" data-loader role="status" aria-live="polite">
        <p class="vh" data-loader-status>Loading. Skip available.</p>
        <ol class="index" data-index>${index}</ol>
        <p class="loader-word">Cash Pass</p>
      </div>
    </div>
    <button class="skip-load" type="button" data-skip-load>Skip</button>
    <div class="shops" data-shops>${shopCards}</div>
    <div class="pocket" data-pocket>
      <div class="pocket-stage">
        <div class="pocket-backdrop" data-pocket-backdrop></div>
        <div class="notif" data-notif>
          <p class="notif-shop" data-notif-shop>Lantern Row Cafe<span class="shop-when" data-notif-when>November 3</span></p>
          ${answerLine('Tap Everyday 4%', 'answer--pocket')}
          <p class="notif-why" data-notif-why>This cafe counts as Dining, where Everyday 4% pays 4%. Your Grocery 6% card hit its cap on Oct 14.</p>
          <span class="chip" aria-hidden="true">Open in wallet</span>
        </div>
        <div class="pocket-glass">
          <div class="pocket-tiles" data-pocket-tiles>${pocketCards}</div>
          <div class="pool pool--pocket" data-pocket-pool></div>
          <div class="glass-reflect"></div>
        </div>
      </div>
      <div class="pchips" role="group" aria-label="Choose a shop">${chips}</div>
      <p class="example">Example figures</p>
    </div>
  </div>
</section>`;
}

function decided() {
  const items = [
    ['01', 'Your history', 'On Pass, twelve months of your transactions, read only, sorted by store and category. You type nothing in.', 'ledger'],
    ['02', 'Your rules', 'Assign a card to a store, a chain or a category. Cash Pass suggests rules from your history, but none takes effect until you approve it. A rule always wins.', 'rule'],
    ['03', 'Rotating categories', 'Some cards pay 5% only in a quarter you\'ve activated. Cash Pass reminds you before each quarter opens and assumes the card isn\'t active until you mark it.', 'quarter'],
    ['04', 'Caps and fees', 'It tracks your spending against every annual and quarterly cap, and counts each card\'s annual fee against what it earns. A card that has hit its cap stops being the answer.', 'cap']
  ];
  return `<section class="decided" id="decided" aria-labelledby="decided-h" data-in="numerals">
  <div class="decided-head"><h2 class="h2" id="decided-h">What Cash Pass checks before it picks a card</h2></div>
  <div class="decided-grid">
    <figure class="decided-media" data-in-child="pool-open">${picture('photo-home-01', { alt: PHOTO_ALT['photo-home-01'], sizes: '(min-width: 1024px) 33vw, 100vw', cls: 'pic--3x2' })}</figure>
    <ol class="decided-list">${items.map(([n, h, p, ic]) => `<li class="dec-item" data-dec>
      ${numeral(n)}
      <div class="dec-body">${icon(ic, 'dec-ic')}<h3 class="h3"><span class="vh">${esc(n)} </span>${esc(h)}</h3><p>${esc(p)}</p></div>
    </li>`).join('')}</ol>
  </div>
  <p class="decided-link"><a class="tlink" href="/how-it-works">Read how Cash Pass picks a card</a></p>
</section>`;
}

function moment() {
  return `<section class="moment" id="moment" aria-labelledby="moment-h" data-in="pool-band">
  <div class="moment-media" aria-hidden="true">${video('hero-loop', { alt: 'A hand sets a phone face up on a cafe counter at night. The screen shows the Cash Pass notification.' })}</div>
  <div class="moment-in">
    <div class="moment-copy">
      <h2 class="h2" id="moment-h">What the answer looks like on your phone</h2>
      <p class="moment-body">Tap Everyday 4%, and under it the reason: this cafe codes as Dining, and the Grocery 6% card hit its cap on October 14.</p>
    </div>
    <figure class="moment-inset" data-inset>
      <div class="inset-phone">
        ${productShot('s7-till', { alt: SHOTS['s7-till'], cls: 'inset-shot', width: 600 })}
        <video class="inset-video" muted playsinline loop preload="none" width="1080" height="1350" poster="/assets/media/video/product-motion-poster.webp" aria-hidden="true" tabindex="-1" data-motion-video data-mobile-src="/assets/media/video/product-motion-mobile.mp4"><source src="/assets/media/video/product-motion.webm" type="video/webm"><source src="/assets/media/video/product-motion.mp4" type="video/mp4"></video>
      </div>
      <figcaption class="caption">The Checkout screen: the card to use and the reason. Example figures.</figcaption>
    </figure>
  </div>
</section>`;
}

const SCREENS = [
  ['s1-moment', 'The Moment. A notification with the card to use and why. Example figures.'],
  ['s2-rules', 'The Rules. Stores, chains and categories you\'ve assigned to a card.'],
  ['s3-ledger', 'The Ledger. What each card earned, minus its annual fee. Example figures.'],
  ['s4-cards', 'The Cards. Your cards, with progress toward each cap. Example figures.'],
  ['s5-quarter', 'The Quarter. Rotating categories and whether you\'ve activated them. Example figures.'],
  ['s6-household', 'The Household. Totals for up to five people, never their transactions. Example figures.'],
  ['s7-till', 'The Checkout. The card for the store you\'re in, and the reason.'],
  ['s8-connect', 'Connect a card. Read only, on your bank\'s own page.']
];

function shelf() {
  return `<section class="shelf-sec" id="screens" aria-labelledby="shelf-h" data-in="deal-right">
  <div class="shelf-head"><h2 class="h2" id="shelf-h">What the app's screens show</h2></div>
  <div class="shelf" role="region" aria-label="Eight app screens, scroll sideways" tabindex="0" data-shelf>
    <ul class="shelf-track">${SCREENS.map(([id, cap]) => `<li class="shelf-item" data-tilt>
      <div class="phone-slot">${productShot(id, { alt: SHOTS[id], width: 420 })}<span class="glare" aria-hidden="true"></span></div>
      <p class="caption">${esc(cap)}</p></li>`).join('')}</ul>
  </div>
  <p class="shelf-link"><a class="tlink" href="/product">See every screen</a></p>
</section>`;
}

function year() {
  const tiles = [
    ['$1,069', 'earned across five cards', 'ledger'],
    ['$320', 'in annual fees, on two of them', 'cap'],
    ['$749', 'net after fees', 'ledger'],
    ['$191', 'more than one flat 2% card would have earned ($558, no fee)', 'card']
  ];
  return `<section class="year" id="year" aria-labelledby="year-h" data-in="count-tiles">
  <div class="year-head"><h2 class="h2" id="year-h">One example year: what five cards earned after fees</h2><p class="intro">Five cards, two with annual fees, $27,900 of spending.</p></div>
  <div class="year-grid">
    ${tiles.map(([n, t, ic]) => `<div class="stat" data-tilt data-stat><span class="glare" aria-hidden="true"></span>${icon(ic, 'stat-ic')}<p class="stat-num" data-count="${esc(n)}">${figure(n)}</p><p class="stat-txt">${esc(t)}</p></div>`).join('')}
    <figure class="year-phone" data-year-phone><div class="glass-mini" aria-hidden="true"></div>${productShot('s3-ledger', { alt: SHOTS['s3-ledger'], width: 420 })}</figure>
  </div>
  <p class="year-small">The grocery card hit its $6,000 cap on Oct 14, and all four rotating quarters were activated.</p>
  <p class="example">Example figures. Rewards are set and paid by your issuer.</p>
</section>`;
}

function plansStrip() {
  return `<section class="plans-strip" id="plans" aria-labelledby="plans-h" data-in="glass-rise">
  <div class="plans-head"><h2 class="h2" id="plans-h">Three plans: Free, Pass and Pass Family</h2></div>
  ${planDeck({ idPrefix: 'home-plan', summary: true })}
  <p class="strip-link"><a class="tlink" href="/plans">Compare plans</a></p>
  ${testimonials({ cls: 'tstm--home' })}
</section>`;
}

function statement() {
  return `<section class="statement" id="statement" aria-labelledby="statement-h" data-in="word-fade">
  <div class="statement-bg" aria-hidden="true">${picture('atmos-01', { decorative: true, sizes: '100vw', cls: 'pic--cover' })}</div>
  <div class="statement-seal" aria-hidden="true" data-seal>${kitSvg('seal.svg', { cls: 'seal seal--160', size: [160, 160] })}</div>
  <div class="statement-in">
    <h2 class="h2 statement-h" id="statement-h">${words('Cash Pass is software. It issues no card, holds no balance and moves no money.')}</h2>
    <p class="statement-body">You pay with your own card, so purchase protection, warranties and chargeback rights stay with your issuer. Cash Pass only recommends cards you already hold. It has no card offers or referral links, and it never checks your credit score.</p>
  </div>
</section>`;
}

function readOnly() {
  return `<section class="spread" id="read-only" aria-labelledby="ro-h" data-in="spread-slide">
  <figure class="spread-media">${picture('photo-home-02', { alt: PHOTO_ALT['photo-home-02'], sizes: '(min-width: 1024px) 42vw, 100vw', cls: 'pic--4x5' })}</figure>
  <div class="spread-text">
    <h2 class="h2" id="ro-h">How Cash Pass connects to your cards</h2>
    <div class="pq-wrap">
      <div class="edge" aria-hidden="true">${kitSvg('divider-edge.svg', { cls: 'div-edge' })}</div>
      <blockquote class="pq"><p>You sign in on your bank's own page. Cash Pass receives a token, never your password.</p></blockquote>
      <div class="edge" aria-hidden="true">${kitSvg('divider-edge.svg', { cls: 'div-edge' })}</div>
    </div>
    <p class="spread-body">Pass and Pass Family connect read only through a third party aggregator, the kind budgeting apps use. It can read what you spent, where and when. It can't move money or change a setting. Free connects nothing.</p>
    <p><a class="tlink" href="/how-it-works">More on the connection</a></p>
  </div>
</section>`;
}

const FAQ = [
  ['Can I cancel, and how?', `Yes. Two taps in the app, or one email to ${mailto()}. Your plan runs to the end of the year you\'ve paid for.`],
  ['Does it work with Apple Wallet and Google Wallet?', 'Yes. Open in wallet brings up the recommended card in Apple Wallet or Google Wallet. You still pay with your own card.'],
  ['What does the Free plan actually do?', 'It gives the same answer at the store, with the reason, for up to three cards you enter by hand, plus unlimited rules. It connects to nothing and bills nothing. Reminders, cap tracking and the fee ledger need your history, so they come with Pass.'],
  ['How do I delete my data?', `Disconnect a card and its token is revoked. Delete your account from the app or by emailing ${mailto()} and your history goes with it.`],
  ['Will I earn more with Cash Pass?', 'We don\'t promise a figure. Rewards are set and paid by your issuer, and every dollar amount on this site is an example.']
];

function questions() {
  return `<section class="questions" id="questions" aria-labelledby="q-h" data-in="markers">
  <div class="q-head"><h2 class="h2" id="q-h">Questions people ask before they buy</h2></div>
  <div class="q-body">${faqIndex(FAQ, { idPrefix: 'home-faq' })}</div>
</section>`;
}

function smsSection() {
  return `<section class="sms-sec" id="sms" aria-label="Join Our SMS List" data-in="edge-draw">
  <div class="edge edge--sec" aria-hidden="true">${kitSvg('divider-edge.svg', { cls: 'div-edge' })}</div>
  <div class="sms-sec-in">${smsBlock({ id: 'sms-home', level: 2, lead: true, rimmed: true, cls: 'sms--home', leadIcon: icon('phone', 'sms-ic') })}</div>
</section>`;
}

export function render() {
  const posterInline = fileSize('seq/poster.webp');
  const preload = (posterInline > 0 && posterInline < 122880) ? [] : [{ href: '/assets/media/seq/poster.webp', as: 'image', type: 'image/webp', fetchpriority: 'high' }];
  const main = [stage(), decided(), moment(), shelf(), year(), plansStrip(), statement(), readOnly(), questions(), smsSection(),
    closeBand({ body: 'The Pass plan covers every card you hold for $59 a year. Cancel in two taps.', secondary: ['Compare plans', '/plans'] })].join('\n');
  return page({
    route: '/', title: 'Cash Pass',
    description: 'Cash Pass is an app that tells you which of your own credit cards to use for each purchase. Pass is $59 a year, cancel any time.',
    bodyClass: 'page-home', hover: 'light', main, script: 'home', preload
  });
}
