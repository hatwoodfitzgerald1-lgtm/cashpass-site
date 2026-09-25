import { page, smsBlock } from '../partials/layout.mjs';
import { planDeck, closeBand, testimonials, faqIndex, mailto, fiveCards, numeral } from '../partials/components.mjs';
import { esc, picture, productShot, SHOTS, PHOTO_ALT, video, cardMark, kitSvg, icon, figure, dataUri, fileSize, exists, words } from '../lib/html.mjs';

export const SHOPS = [
  { key: 'market', shop: 'Lantern Row Market', when: 'July', answer: 'Tap Grocery 6%', why: '6% on groceries. $4,140 of the $6,000 yearly cap used.', label: 'Example figures', chip: 'Market', card: 'grocery' },
  { key: 'fuel', shop: 'Route 9 Fuel', when: '', answer: 'Tap Everyday 4%', why: '4% at gas stations. Your rule says all gas stations, Everyday 4%, so it wins.', label: '', chip: 'Fuel', card: 'everyday' },
  { key: 'marketplace', shop: 'Online marketplace', when: '', answer: 'Tap Marketplace 5%', why: '5% here and 1% everywhere else. This is the one shop it\'s for.', label: '', chip: 'Marketplace', card: 'marketplace' },
  { key: 'elsewhere', shop: 'Somewhere else', when: '', answer: 'Tap Flat 2%', why: 'No category matches. 2% on everything beats 1% on the rest.', label: '', chip: 'Elsewhere', card: 'flat' },
  { key: 'cafe', shop: 'Lantern Row Cafe', when: 'November 3', answer: 'Tap Everyday 4%', why: 'Codes as Dining, not Grocery. 4% here. Grocery 6% capped since Oct 14.', label: 'Example figures', chip: 'Cafe', card: 'everyday' }
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
      <p class="eyebrow">For the wallet with four cards or more.</p>
      <h1 class="h1 h1--hero">Which card to tap. Told to you at the till, in one line.</h1>
      <p class="subhead">Everything in your wallet goes dark. One card stays lit. Cash Pass picked it from the cards you already carry, before you reached the counter.</p>
      <div class="cta-row"><a class="tile" href="/cart?add=pass" data-add-plan="pass" data-hero-cta>Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span><a class="tlink" href="/how-it-works">See how it works</a></div>
    </div>
    <div class="deck-col">
      <h2 class="stage-h" id="stage-h">Five shops. One light moves.</h2>
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
          <p class="notif-why" data-notif-why>Codes as Dining, not Grocery. 4% here. Grocery 6% capped since Oct 14.</p>
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
    ['01', 'Your history', 'Twelve months of your own transactions, read only and sorted by merchant and category. Cash Pass sees that groceries happen at Lantern Row Market and fuel at Route 9, and which card you reached for each time. You type nothing.', 'ledger'],
    ['02', 'Your rules', 'A card assigned to a shop, a chain or a category. Some you write, some Cash Pass proposes from your history, and each one waits for your approval before it takes effect. A rule wins over everything else.', 'rule'],
    ['03', 'Rotating categories', 'The 5 percent card pays 5 percent only in a quarter you\'ve activated. Cash Pass knows when each quarter opens, reminds you before it does, and treats the card as unactivated until you say otherwise.', 'quarter'],
    ['04', 'Caps and fees', 'Every annual and quarterly cap, with your spend to date against it. Every annual fee, taken off what that card earned. The cap you\'re near and the fee you\'re paying are already in the answer when it arrives.', 'cap']
  ];
  return `<section class="decided" id="decided" aria-labelledby="decided-h" data-in="numerals">
  <div class="decided-head"><h2 class="h2" id="decided-h">How it decided</h2><p class="intro">Four things, weighed on the way in.</p></div>
  <div class="decided-grid">
    <figure class="decided-media" data-in-child="pool-open">${picture('photo-home-01', { alt: PHOTO_ALT['photo-home-01'], sizes: '(min-width: 1024px) 33vw, 100vw', cls: 'pic--3x2' })}</figure>
    <ol class="decided-list">${items.map(([n, h, p, ic]) => `<li class="dec-item" data-dec>
      ${numeral(n)}
      <div class="dec-body">${icon(ic, 'dec-ic')}<h3 class="h3"><span class="vh">${esc(n)} </span>${esc(h)}</h3><p>${esc(p)}</p></div>
    </li>`).join('')}</ol>
  </div>
  <p class="decided-link"><a class="tlink" href="/how-it-works">The four things, in depth</a></p>
</section>`;
}

function moment() {
  return `<section class="moment" id="moment" aria-labelledby="moment-h" data-in="pool-band">
  <div class="moment-media" aria-hidden="true">${video('hero-loop', { alt: 'A hand sets a phone face up on a cafe counter at night. The screen shows the Cash Pass notification.' })}</div>
  <div class="moment-in">
    <div class="moment-copy">
      <h2 class="h2" id="moment-h">The moment, on your phone</h2>
      <p class="moment-body">Lantern Row Cafe, November 3. You set the phone down and the answer is already on it. Tap Everyday 4%. The reason underneath: it codes as Dining, not Grocery, and Grocery 6% has been capped since October 14. In July the same phone said Grocery 6% at the market this cafe sits inside, and it was right then too. Two things changed. Cash Pass watched both. You tapped.</p>
    </div>
    <figure class="moment-inset" data-inset>
      <div class="inset-phone">
        ${productShot('s7-till', { alt: SHOTS['s7-till'], cls: 'inset-shot', width: 600 })}
        <video class="inset-video" muted playsinline loop preload="none" width="1080" height="1350" poster="/assets/media/video/product-motion-poster.webp" aria-hidden="true" tabindex="-1" data-motion-video data-mobile-src="/assets/media/video/product-motion-mobile.mp4"><source src="/assets/media/video/product-motion.webm" type="video/webm"><source src="/assets/media/video/product-motion.mp4" type="video/mp4"></video>
      </div>
      <figcaption class="caption">S7, The Till. Lantern Row Cafe, Nov 3. Example figures.</figcaption>
    </figure>
  </div>
</section>`;
}

const SCREENS = [
  ['s1-moment', 'The Moment. A notification as you reach the door: the card, then the why. Example figures.'],
  ['s2-rules', 'The Rules. A shop, a chain or a category, assigned to a card. Yours beat the arithmetic.'],
  ['s3-ledger', 'The Ledger. Every card\'s fee taken off what it earned, and the real number at the bottom. Example figures.'],
  ['s4-cards', 'The Cards. Your wallet, with a cap bar on every card that has one. Example figures.'],
  ['s5-quarter', 'The Quarter. Q4 opens Oct 1. Activate it with your issuer, then mark it here. Example figures.'],
  ['s6-household', 'The Household. Five people, one rule set. The house sees totals, never transactions. Example figures.'],
  ['s7-till', 'The Till. The cafe codes as Dining, so the light moves to Everyday 4%.'],
  ['s8-connect', 'Connect a card. Read only, on your bank\'s own page.']
];

function shelf() {
  return `<section class="shelf-sec" id="screens" aria-labelledby="shelf-h" data-in="deal-right">
  <div class="shelf-head"><h2 class="h2" id="shelf-h">Eight screens, one answer each</h2><p class="intro">Flick through. Each screen gives you one thing, then gets out of the way.</p></div>
  <div class="shelf" role="region" aria-label="Eight app screens, scroll sideways" tabindex="0" data-shelf>
    <ul class="shelf-track">${SCREENS.map(([id, cap]) => `<li class="shelf-item" data-tilt>
      <div class="phone-slot">${productShot(id, { alt: SHOTS[id], width: 420 })}<span class="glare" aria-hidden="true"></span></div>
      <p class="caption">${esc(cap)}</p></li>`).join('')}</ul>
  </div>
  <p class="shelf-link"><a class="tlink" href="/product">Every screen, explained</a></p>
</section>`;
}

function year() {
  const tiles = [
    ['$1,069', 'earned across five cards', 'ledger'],
    ['$320', 'in annual fees, on two of them', 'cap'],
    ['$749', 'net after fees, the number the Ledger puts at the top', 'ledger'],
    ['$191', 'ahead of one flat 2% card on everything, which would have earned $558 with no fee', 'card']
  ];
  return `<section class="year" id="year" aria-labelledby="year-h" data-in="count-tiles">
  <div class="year-head"><h2 class="h2" id="year-h">What a year looks like, with the fees taken off</h2><p class="intro">One example year. Five cards, two annual fees, $27,900 routed through Cash Pass.</p></div>
  <div class="year-grid">
    ${tiles.map(([n, t, ic]) => `<div class="stat" data-tilt data-stat><span class="glare" aria-hidden="true"></span>${icon(ic, 'stat-ic')}<p class="stat-num" data-count="${esc(n)}">${figure(n)}</p><p class="stat-txt">${esc(t)}</p></div>`).join('')}
    <figure class="year-phone" data-year-phone><div class="glass-mini" aria-hidden="true"></div>${productShot('s3-ledger', { alt: SHOTS['s3-ledger'], width: 420 })}</figure>
  </div>
  <p class="year-small">The grocery card reached its $6,000 cap on Oct 14. All four rotating quarters were activated. Both facts are in the number.</p>
  <p class="example">Example figures. Rewards are set and paid by your issuer.</p>
</section>`;
}

function plansStrip() {
  return `<section class="plans-strip" id="plans" aria-labelledby="plans-h" data-in="glass-rise">
  <div class="plans-head"><h2 class="h2" id="plans-h">Three plans. Pass keeps the light on all year.</h2><p class="intro">Free is three cards by hand and the answer at the till. Pass is the remembering: every card connected read only, rules proposed, caps tracked, fees netted off. Pass Family is Pass for up to five people, one rule set, one bill.</p></div>
  ${planDeck({ idPrefix: 'home-plan' })}
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
    <p class="statement-body">You pay the merchant with your own card, at the real counter. Nothing sits in between, so nothing is lost: purchase protection, extended warranty, rental car cover and chargeback rights stay exactly where your issuer put them. Cash Pass never names a card you don't hold, carries no offers, no applications and no referral links, and doesn't know or mention your credit score. Choosing from your wallet is the whole job.</p>
  </div>
</section>`;
}

function readOnly() {
  return `<section class="spread" id="read-only" aria-labelledby="ro-h" data-in="spread-slide">
  <figure class="spread-media">${picture('photo-home-02', { alt: PHOTO_ALT['photo-home-02'], sizes: '(min-width: 1024px) 42vw, 100vw', cls: 'pic--4x5' })}<figcaption class="caption">A cafe counter at night. A phone set down under the reader's light.</figcaption></figure>
  <div class="spread-text">
    <h2 class="h2" id="ro-h">Read only, by design</h2>
    <div class="pq-wrap">
      <div class="edge" aria-hidden="true">${kitSvg('divider-edge.svg', { cls: 'div-edge' })}</div>
      <blockquote class="pq"><p>You sign in on your bank's own page. Cash Pass receives a token, never your password.</p></blockquote>
      <div class="edge" aria-hidden="true">${kitSvg('divider-edge.svg', { cls: 'div-edge' })}</div>
    </div>
    <p class="spread-body">Paid plans connect your cards read only. That's a description of the token, not a policy: it can read what you spent, where and when, and it has no way to move money, make a charge or change a setting. The password never passes through us, because you type it on your bank's page and nowhere else. Disconnect from the same screen you connected on. Free connects nothing at all.</p>
    <p><a class="tlink" href="/how-it-works">How the connection works</a></p>
  </div>
</section>`;
}

const FAQ = [
  ['Can I cancel, and how?', `Yes. Two taps in the app, or one email to ${mailto()}. Cancelling stops the next renewal, and your plan keeps running to the end of the year you've paid for. It takes no more steps than buying did.`],
  ['What is the aggregator, and what does it see?', 'A third party service that connects apps to banks read only, the way budgeting apps connect. You sign in on your bank\'s own page. The aggregator hands Cash Pass a token that can read transactions and do nothing else. It never has your password, and neither do we.'],
  ['Does it work with Apple Wallet and Google Wallet?', 'Yes. Open in wallet opens the recommended card in Apple Wallet or Google Wallet, whichever your phone uses. You tap your own card, as you always have. Cash Pass only chose it.'],
  ['What happens to my purchase protection, warranty and chargeback rights?', 'Nothing changes. The merchant is paid by your card, not by Cash Pass, so every protection your issuer attached to that card is still attached. We\'re not in the transaction. We only said which card.'],
  ['What does the Free plan actually do?', 'It gives the answer at the till for up to three cards you type in by hand, with unlimited rules and one tap to your wallet. It connects to nothing and bills nothing. What it doesn\'t do is remember for you: the quarterly reminders, the cap bars and the fee ledger need your history, and history needs the connection, which is Pass.'],
  ['How does Pass Family work between people?', 'Up to five people, each with their own login and their own cards. A rule written once applies at every till in the house. The Ledger\'s House view shows one total with the fees taken off and a line per person. Transactions stay with whoever holds the card; the house sees totals, never what anyone bought.'],
  ['How do I delete my data?', `Disconnect a card from the Connect screen and its token is revoked; Cash Pass stops reading that account. Delete your account from the app or by emailing ${mailto()} and your history goes with it. The Privacy Policy sets out what is kept and for how long.`],
  ['Why don\'t you suggest new cards?', 'Because the apps that do are paid by the card, not by you, and their answer is always another card. Cash Pass carries no offers, no applications and no referral links, and never mentions a credit score. The plan is the only thing we sell, so the answer can afford to stay inside your wallet.'],
  ['What if a shop codes differently from what I expect?', 'Write a rule. Lantern Row Cafe codes as Dining, so Cash Pass proposes Everyday 4% there; approve it and the cafe is settled. If you disagree with any answer, assign the card yourself. Your rule wins, every time.'],
  ['Will I earn more with Cash Pass?', 'We don\'t promise a figure. Rewards are set and paid by your issuer, and every dollar amount on this site comes from one example year, labelled as such. What Cash Pass does is narrower: it reads your cards\' published terms, your caps and your rules, and names the card those point to.']
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
    closeBand({ body: 'Pass, $59 a year. Every card connected read only, every quarter remembered, every fee taken off. Cancel in two taps, whenever you like.', secondary: ['Compare plans', '/plans'] })].join('\n');
  return page({
    route: '/', title: 'Cash Pass',
    description: 'Which of your own cards to tap, told to you at the till in one line. A card picker for the phone you already carry. Pass is $59 a year, cancel any time.',
    bodyClass: 'page-home', hover: 'light', main, script: 'home', preload
  });
}
