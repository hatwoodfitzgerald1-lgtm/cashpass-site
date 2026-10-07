import { page } from '../partials/layout.mjs';
import { planDeck, hero } from '../partials/components.mjs';
import { esc, picture, productShot, SHOTS, PHOTO_ALT, video, icon, kitSvg } from '../lib/html.mjs';

const SCREENS = [
  ['s1-moment', 'S1. The Moment', 'A notification as you walk into a store. It names the card to use, Tap Grocery 6%, and the reason: 6% on groceries, with $4,140 of the $6,000 yearly cap used. Below that, the next best card. One button, Open in wallet, brings the card up. Example figures.'],
  ['s2-rules', 'S2. The Rules', 'Your list of stores, chains and categories, each assigned to a card. Cash Pass suggests new rules from your history, such as a cafe that codes as Dining. Approve or ignore each one, or turn suggestions off. A rule always wins.'],
  ['s3-ledger', 'S3. The Ledger', 'What each card earned this year, minus its annual fee, with the total at the top: $749 net after fees. One card earned $240 against a $225 fee, so it cleared its fee by $15. At the bottom, a comparison with one flat 2% card, which would have earned $558. Example figures. Rewards are paid by your issuer.'],
  ['s4-cards', 'S4. The Cards', 'Your cards as plain tiles with a nickname, rate, last four digits and fee. Cards with a spending cap show a progress bar, like $4,140 of $6,000. The card recommended for where you are is lit. Example figures.'],
  ['s5-quarter', 'S5. The Quarter', 'Rotating 5% categories for the coming quarter, which quarters you\'ve activated, and how much of the cap is left. Activate in your issuer\'s app, then tap Mark activated here. Cash Pass reminds you; your issuer does the activating. Example figures.'],
  ['s6-household', 'S6. The Household', 'On Pass Family, the Ledger for the whole house: $1,506 net after fees across five people, with a line per person. Everyone shares one set of rules. The house sees totals, never transactions. Example figures.'],
  ['s7-till', 'S7. The Checkout', 'The answer at checkout when something has changed. At a cafe in November it says Tap Everyday 4%, because the cafe codes as Dining and the Grocery 6% card hit its cap on Oct 14. Both reasons are on screen, so you can check them.'],
  ['s8-connect', 'S8. Connect a card', 'Where paid plans connect your cards, read only. It explains what the connection can and can\'t do, and it\'s where you disconnect. Free never shows it, because Free connects nothing.']
];

function collage() {
  return `<div class="collage" data-in="collage-split">
  <figure class="collage-photo">${picture('photo-app-01', { alt: PHOTO_ALT['photo-app-01'], sizes: '40vw', cls: 'pic--3x2' })}</figure>
  <figure class="collage-family">
    <img class="family" src="/assets/media/product/family.webp" srcset="/assets/media/product/family.webp 1x, /assets/media/product/family@2x.webp 2x" width="2560" height="1440" alt="${esc(SHOTS.family)}" decoding="async" fetchpriority="high">
    <figcaption class="caption">The Moment, the Ledger and the Rules on three phones. Example figures.</figcaption>
  </figure>
</div>`;
}

function ring() {
  return `<section class="ring" aria-labelledby="ring-h" data-in="ring-swap" data-ring>
  <div class="sec-head"><h2 class="h2" id="ring-h">The eight screens</h2></div>
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
    ['answer', 'the answer line', 'The card to use, in large type.', 'left', 27],
    ['why', 'the why line', 'One line: the rate, then the cap or category that decided it.', 'left', 39],
    ['runner', 'the runner up', 'The next best card, so you know what switching would cost.', 'right', 55],
    ['wallet', 'Open in wallet', 'One tap to the right card in your phone\'s wallet. You still tap your own card.', 'right', 78]
  ];
  return `<section class="callouts" aria-labelledby="co-h" data-in="leader-draw">
  <div class="sec-head"><h2 class="h2" id="co-h">How to read an answer</h2></div>
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
    ['s5-quarter', 'S5, The Quarter', 'A missed activation. The reminder comes before the quarter opens.'],
    ['s4-cards', 'S4, The Cards', 'A cap you\'d only notice months later. The bar moves all year.'],
    ['s3-ledger', 'S3, The Ledger', 'Whether a card earns back its fee. Each fee comes off that card\'s earnings.'],
    ['s6-household', 'S6, The Household', 'Texting rules to everyone at home. Write a rule once and the whole house has it.']
  ];
  return `<section class="checker" aria-labelledby="ck-h" data-in="checker">
  <div class="sec-head"><h2 class="h2" id="ck-h">What each screen keeps you from missing</h2></div>
  <div class="ck-grid">${rows.map(([id, name, t], i) => `<div class="ck-cell ck-cell--shot" data-ck data-tilt><div class="phone-slot">${productShot(id, { alt: SHOTS[id], width: 360 })}<span class="glare" aria-hidden="true"></span></div></div><div class="ck-cell ck-cell--text" data-ck><p class="ck-name">${esc(name)}</p><p class="ck-t h3">${esc(t)}</p></div>`).join('')}</div>
</section>`;
}

function strip() {
  return `<section class="plans-strip plans-strip--compact" aria-labelledby="strip-h" data-in="glass-rise">
  <div class="plans-head"><h2 class="h2" id="strip-h">Which screens come with each plan</h2><p class="intro">Free gives you the Moment, the Rules and the Cards for three cards entered by hand. Pass adds every other screen except the Household, which comes with Pass Family.</p></div>
  ${planDeck({ compact: true, idPrefix: 'app-plan', summary: true })}
</section>`;
}

function closeLoop() {
  return `<section class="close close--loop band" aria-labelledby="close-h" data-in="pool-band">
  <div class="band-bg moment-media" aria-hidden="true">${video('hero-loop', { alt: 'A twelve second loop: five plain cards on black glass lit by a propped phone, the phone turning so its light moves to another card, a card\'s edge catching the light in close up, and a hand setting a phone down on a cafe counter at night.' })}</div>
  <div class="band-in">
    <div class="inset-card band-inset close-inset" data-inset>
      <h2 class="h2" id="close-h">Buy Pass</h2>
      <p class="close-p">Connect your cards and every screen fills with your own numbers. Pass is $59 a year.</p>
      <div class="cta-row"><a class="tile" href="/cart?add=pass" data-add-plan="pass">Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span><a class="tlink" href="/plans">Compare plans</a></div>
    </div>
  </div>
</section>`;
}

export function render() {
  const main = [
    hero({ eyebrow: 'The app', h1: 'The Cash Pass app, screen by screen', intro: 'The app has four tabs: Now, Rules, Cards and Ledger. Here\'s what each of its eight screens shows.', cta: true, cls: 'hero--app', extra: collage() }),
    ring(), callouts(), checker(), strip(), closeLoop()
  ].join('\n');
  return page({
    route: '/product', title: 'The Cash Pass app',
    description: 'The Cash Pass app, screen by screen. The Moment, the Rules, the Ledger, the Cards, the Quarter, the Household, the Checkout and Connect a card, on the phone you already carry.',
    bodyClass: 'page-app', hover: 'glow', main, script: 'product'
  });
}
