import { page } from '../partials/layout.mjs';
import { planDeck, hero } from '../partials/components.mjs';
import { esc, picture, productShot, SHOTS, PHOTO_ALT, video, icon, kitSvg } from '../lib/html.mjs';

const SCREENS = [
  ['s1-moment', 'S1. The Moment', 'You\'re at the door of Lantern Row Market in July. The notification is already there: Tap Grocery 6%, in the serif the app saves for the answer. Under it, the reason: 6% on groceries, $4,140 of the $6,000 yearly cap used. Then the runner up, quiet: Rotating 5%, quarterly cap met. Then Flat 2%. Then the one button, Open in wallet. You never opened the app. It opened for you. Example figures.'],
  ['s2-rules', 'S2. The Rules', 'Set once, changed whenever. Lantern Row Market, Grocery 6%. All gas stations, Everyday 4%. Restaurants, Everyday 4%. Online marketplace, Marketplace 5%. Everything else, Flat 2%. One row waits in the light: suggested from your history, Lantern Row Cafe, Everyday 4%, because it codes as Dining. Approve or Ignore. A toggle at the top decides whether Cash Pass suggests at all. Rules win over everything else.'],
  ['s3-ledger', 'S3. The Ledger', 'The year\'s real number sits at the top in the serif: $749 net after fees. Under it, card by card. Grocery 6% earned $371 against a $95 fee, cap reached Oct 14. Everyday 4% earned $240 against $225, and cleared its fee by $15. Rotating 5% earned $180, four quarters of four activated. Marketplace 5%, $90. Flat 2%, $188. The bottom block does the honest comparison: $1,069 earned, $320 in fees, $749 net. One flat 2% card on everything: $558. Ahead by $191. Example figures. Rewards are paid by your issuer.'],
  ['s4-cards', 'S4. The Cards', 'Your five cards as plain tiles: nickname, rate, ending digits, the fee. A thin bar on any card with a cap: $4,140 of $6,000 on Grocery 6%, $900 of $1,500 this quarter on Rotating 5%. Only one tile is lit, the one recommended where you\'re standing. Add a card, top right. Read only. Cash Pass cannot move money. Example figures.'],
  ['s5-quarter', 'S5. The Quarter', 'Q4 opens Oct 1. The Rotating 5% tile, the three categories this quarter (department stores, streaming, fitness clubs), and the record so far: Activated: Q1, Q2, Q3. The cap: $0 of $1,500 this quarter. Activate it in your issuer\'s app, then Mark activated here. Cash Pass reminds. Your issuer activates. Example figures.'],
  ['s6-household', 'S6. The Household', 'The Ledger with House selected. $1,506 net after fees, five people. You $749, Dana $312, Malik $208, Rosa $141, Theo $96. Earned $1,921, fees $415. Five shared rules, live in five pockets. The house sees totals, never transactions. Example figures.'],
  ['s7-till', 'S7. The Till', 'Lantern Row Cafe, November 3. Tap Everyday 4%. Codes as Dining, not Grocery. 4% here. Beneath, quietly: Grocery 6% capped since Oct 14. Same shell as July, a different card, and both reasons on the screen so you never have to take its word for it.'],
  ['s8-connect', 'S8. Connect a card', 'The screen you meet once, on a paid plan. One heading, Read only, by design. One button, Connect read only. The paragraph between them says what the token can and can\'t do, and the same screen is where you disconnect. Free never shows it; there\'s no connection to make.']
];

function collage() {
  return `<div class="collage" data-in="collage-split">
  <figure class="collage-photo">${picture('photo-app-01', { alt: PHOTO_ALT['photo-app-01'], sizes: '40vw', cls: 'pic--3x2' })}</figure>
  <figure class="collage-family">
    <img class="family" src="/assets/media/product/family.webp" srcset="/assets/media/product/family.webp 1x, /assets/media/product/family@2x.webp 2x" width="2560" height="1440" alt="${esc(SHOTS.family)}" decoding="async" fetchpriority="high">
    <figcaption class="caption">The Moment, the Ledger and the Rules on three phones. One shell, one set of cards, one example year. Example figures.</figcaption>
  </figure>
</div>`;
}

function ring() {
  return `<section class="ring" aria-labelledby="ring-h" data-in="ring-swap" data-ring>
  <div class="sec-head"><h2 class="h2" id="ring-h">Eight screens, in the order you meet them</h2></div>
  <div class="ring-track" data-ring-track>
    <div class="ring-sticky" data-ring-sticky>
      <div class="scene scene--ring" data-scene="ring" aria-hidden="true" data-composed></div>
      <div class="ring-fallback" data-ring-fallback aria-hidden="true">${SCREENS.map(([id], i) => `<div class="ring-shot${i === 0 ? ' is-active' : ''}" data-ring-shot="${i}">${productShot(id, { alt: '', width: 420, lazy: i > 0 })}</div>`).join('')}
        <video class="ring-video" muted playsinline loop preload="none" width="1080" height="1350" poster="/assets/media/video/product-motion-poster.webp" aria-hidden="true" tabindex="-1" data-ring-video data-mobile-src="/assets/media/video/product-motion-mobile.mp4"><source src="/assets/media/video/product-motion.webm" type="video/webm"><source src="/assets/media/video/product-motion.mp4" type="video/mp4"></video>
      </div>
      <div class="ring-copy">
        <p class="ring-count" aria-hidden="true"><span class="fig" data-ring-count>S1</span></p>
        ${SCREENS.map(([id, h, p], i) => `<div class="ring-ch${i === 0 ? ' is-active' : ''}" data-ring-ch="${i}"><h3 class="h3">${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}
      </div>
    </div>
    <ol class="ring-steps" aria-hidden="true">${SCREENS.map((s, i) => `<li class="ring-step" data-ring-step="${i}"></li>`).join('')}</ol>
  </div>
  <ol class="ring-list" data-ring-list>${SCREENS.map(([id, h, p]) => `<li class="ring-item"><div class="phone-slot">${productShot(id, { alt: SHOTS[id], width: 420 })}<span class="glare" aria-hidden="true"></span></div><div><h3 class="h3">${esc(h)}</h3><p>${esc(p)}</p></div></li>`).join('')}</ol>
</section>`;
}

function callouts() {
  const labels = [
    ['answer', 'the answer line', 'The only serif in the app. It always means: this card.', 'left', 27],
    ['why', 'the why line', 'One line, never two. The rate, then the cap or the category that decided it.', 'left', 39],
    ['runner', 'the runner up', 'Quiet, for the day you\'d rather use a different card and want to know what it costs you.', 'right', 55],
    ['wallet', 'Open in wallet', 'One tap to the right card in your phone\'s wallet. You still tap your own card.', 'right', 78]
  ];
  return `<section class="callouts" aria-labelledby="co-h" data-in="leader-draw">
  <div class="sec-head"><h2 class="h2" id="co-h">The answer, taken apart</h2></div>
  <div class="cal-grid">
    <ul class="co-side co-side--left">${labels.filter((l) => l[3] === 'left').map(([k, t, p, side, y]) => `<li class="co-label" data-co="${k}" tabindex="0" style="--y:${y}%"><span class="co-t">${icon(k === 'wallet' ? 'wallet-link' : 'light', 'co-ic')}${esc(t)}</span><p>${esc(p)}</p></li>`).join('')}</ul>
    <div class="co-phone">
      <div class="phone-slot">${productShot('s1-moment', { alt: SHOTS['s1-moment'], width: 520 })}
        ${labels.map(([k, t, p, side, y]) => `<span class="co-region" data-co-region="${k}" style="--y:${y}%" aria-hidden="true"></span>`).join('')}
      </div>
      <svg class="co-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${labels.map(([k, t, p, side, y]) => `<path data-co-line="${k}" d="${side === 'left' ? `M0 ${y} H 30` : `M100 ${y} H 70`}" stroke="#E9F1F8" stroke-opacity=".7" stroke-width=".4" fill="none"/>`).join('')}</svg>
    </div>
    <ul class="co-side co-side--right">${labels.filter((l) => l[3] === 'right').map(([k, t, p, side, y]) => `<li class="co-label" data-co="${k}" tabindex="0" style="--y:${y}%"><span class="co-t">${icon(k === 'wallet' ? 'wallet-link' : 'light', 'co-ic')}${esc(t)}</span><p>${esc(p)}</p></li>`).join('')}</ul>
  </div>
</section>`;
}

function checker() {
  const rows = [
    ['s5-quarter', 'S5, The Quarter', 'The activation you\'d have missed. The reminder lands before the quarter opens, not after the statement.'],
    ['s4-cards', 'S4, The Cards', 'The cap you\'d have learned about in November. The bar moves all year.'],
    ['s3-ledger', 'S3, The Ledger', 'The fee you\'d never have netted off. Each card\'s fee comes off its own earnings, card by card.'],
    ['s6-household', 'S6, The Household', 'The rule you\'d have texted to four people. Written once, it\'s live in every pocket in the house.']
  ];
  return `<section class="checker" aria-labelledby="ck-h" data-in="checker">
  <div class="sec-head"><h2 class="h2" id="ck-h">What each screen spares you</h2></div>
  <div class="ck-grid">${rows.map(([id, name, t], i) => `<div class="ck-cell ck-cell--shot" data-ck data-tilt><div class="phone-slot">${productShot(id, { alt: SHOTS[id], width: 360 })}<span class="glare" aria-hidden="true"></span></div></div><div class="ck-cell ck-cell--text" data-ck><p class="ck-name">${esc(name)}</p><p class="ck-t h3">${esc(t)}</p></div>`).join('')}</div>
</section>`;
}

function strip() {
  return `<section class="plans-strip plans-strip--compact" aria-labelledby="strip-h" data-in="glass-rise">
  <div class="plans-head"><h2 class="h2" id="strip-h">Free fills three screens. Pass fills seven. Pass Family lights the eighth.</h2><p class="intro">Free fills the Moment, the Rules and the Cards with three cards by hand. Pass connects every card and fills everything but the Household. Pass Family lights that one too.</p></div>
  ${planDeck({ compact: true, idPrefix: 'app-plan' })}
</section>`;
}

function closeLoop() {
  return `<section class="close close--loop band" aria-labelledby="close-h" data-in="pool-band">
  <div class="band-bg moment-media" aria-hidden="true">${video('hero-loop', { alt: 'A twelve second loop: five plain cards on black glass lit by a propped phone, the phone turning so its light moves to another card, a card\'s edge catching the light in close up, and a hand setting a phone down on a cafe counter at night.' })}</div>
  <div class="band-in">
    <div class="inset-card band-inset close-inset" data-inset>
      <h2 class="h2" id="close-h">Buy Pass</h2>
      <p class="close-p">Every screen you just read fills with your own cards the day you connect them. Pass, $59 a year.</p>
      <div class="cta-row"><a class="tile" href="/cart?add=pass" data-add-plan="pass">Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span><a class="tlink" href="/plans">Compare plans</a></div>
    </div>
  </div>
</section>`;
}

export function render() {
  const main = [
    hero({ eyebrow: 'The app', h1: 'One answer on every screen. Everything else is settings.', intro: 'Four tabs along the bottom: Now, Rules, Cards, Ledger. Eight screens between them, each giving you one thing, in the order you\'d want it.', cta: true, cls: 'hero--app', extra: collage() }),
    ring(), callouts(), checker(), strip(), closeLoop()
  ].join('\n');
  return page({
    route: '/product', title: 'The Cash Pass app',
    description: 'Eight screens, one answer each. The Moment, the Rules, the Ledger, the Cards, the Quarter, the Household, the Till and Connect a card, on the phone you already carry.',
    bodyClass: 'page-app', hover: 'glow', main, script: 'product'
  });
}
