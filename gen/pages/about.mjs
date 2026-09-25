import { page, ADDRESS, PHONE, EMAIL } from '../partials/layout.mjs';
import { closeBand, numeral, fiveDivider } from '../partials/components.mjs';
import { esc, picture, PHOTO_ALT, productShot, SHOTS, kitSvg, icon, cardMark } from '../lib/html.mjs';

const CONTOURS = `<svg class="terrain-svg" viewBox="0 0 1440 520" preserveAspectRatio="none" aria-hidden="true" data-contours>
${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const y = 60 + i * 58; return `<path d="M-20 ${y} C 160 ${y - 40 - i * 4}, 300 ${y + 50}, 520 ${y + 10 - i * 6} S 820 ${y - 60 + i * 5}, 1040 ${y + 20} S 1300 ${y - 30}, 1460 ${y + 10}"/>`; }).join('')}
<path d="M700 0 V520" stroke-dasharray="4 8"/><path d="M0 300 H1440" stroke-dasharray="4 8"/>
</svg>`;

function manifesto() {
  return `<section class="manifesto" data-in="manifesto">
  <p class="eyebrow">About</p>
  <h1 class="h1 manifesto-h" data-manifesto>Your wallet carries every card. It has never once chosen.</h1>
</section>`;
}

const STORY = [
  'Cash Pass began at a supermarket checkout in Denver in 2026. Five cards on the phone, one of them earning 6 percent at that exact shop, and no memory of which. The default card came up. It earned 1 percent. The phone had known every card for years and had never once picked one.',
  'That\'s the gap this company exists to close. A phone\'s wallet is a good container. It holds every card, it\'s quicker than leather, and it will never, on its own, tell you which one to use. The apps that did offer an answer paid for themselves by recommending new cards, so their answer was another card. We wanted the opposite: a picker that works from the wallet you already have, paid by the person using it, once a year, and by nobody else.',
  'So we built a card picker for the phone you already carry. It reads the cards you own, the rules you write, the rotating categories you\'d otherwise forget to activate, and the caps and fees nobody tracks. At the till it hands your wallet one card with the reason in one line. The rest of the app is settings, and settings live behind the answer. That\'s the one belief here: the answer belongs at the counter, not in a spreadsheet, and it should be short enough to read while the reader beeps.'
];

function story() {
  const media = [
    `<div class="pockets" data-pockets>
      <div class="scene scene--pockets" data-scene="pockets" aria-hidden="true" data-composed></div>
      <img class="pockets-still" src="/assets/media/3d/pockets-still.webp" width="1316" height="840" alt="Five phones stand in a loose arc on dark leather, each showing the Cash Pass household ledger, with one cool pulse of light travelling between them." loading="lazy" decoding="async">
      <div class="pockets-fallback" data-pockets-fallback>${productShot('s6-household', { alt: SHOTS['s6-household'], width: 360 })}<ul class="pockets-names" aria-hidden="true">${['You', 'Dana', 'Malik', 'Rosa', 'Theo'].map((n) => `<li data-pocket-name>${n}</li>`).join('')}</ul></div>
      <p class="pockets-figure" data-pockets-figure aria-live="polite"></p>
    </div>`,
    `<div class="story-phone">${productShot('s6-household', { alt: SHOTS['s6-household'], width: 420 })}</div>`,
    `<div class="story-motif" aria-hidden="true">${kitSvg('motif.svg', { cls: 'motif motif--large' })}</div>`
  ];
  return `<section class="about-story" aria-label="The story" data-in="pool-spread">
  ${STORY.map((p, i) => `<div class="story-spread${i % 2 ? ' story-spread--flip' : ''}" data-spread>
    <div class="story-text"><h2 class="vh">Part ${i + 1}</h2><p class="story-p">${esc(p)}</p></div>
    <figure class="story-media" data-story-media>${media[i]}</figure>
  </div>`).join('')}
</section>`;
}

function never() {
  const items = [
    ['01', 'No card offers. Cash Pass never names a card you don\'t hold. There\'s no catalogue behind the answer and nothing to apply for.', 'card'],
    ['02', 'No referrals. Nobody pays us when you tap. The plan is the whole business.', 'rule'],
    ['03', 'No lending. Cash Pass issues no card, holds no balance and moves no money. It\'s software that reads, read only.', 'token'],
    ['04', 'No credit scores. It doesn\'t know yours, doesn\'t ask, and won\'t mention it.', 'ledger']
  ];
  return `<section class="about-never" aria-labelledby="never-h" data-in="fill-numerals">
  <div class="sec-head"><h2 class="h2" id="never-h">What Cash Pass will never do</h2></div>
  <ol class="never-grid">${items.map(([n, t, ic]) => `<li class="idx-item never-cell" data-idx>${numeral(n)}<div class="idx-body">${icon(ic, 'dec-ic')}<p>${esc(t)}</p></div></li>`).join('')}</ol>
  <p class="never-close">These aren't policies we'll revisit. They're the shape of the product. Take any one away and the answer at the till stops being yours.</p>
</section>`;
}

function who() {
  return `<section class="who" aria-labelledby="who-h" data-in="fade-five">
  ${fiveDivider('who-div')}
  <div class="split">
    <h2 class="h2 split-rail" id="who-h">Who's here</h2>
    <p class="who-p two-col-2560">We're small. A founder who stood at that checkout and tapped the wrong card. Two engineers, one on the read only connection and the rules engine, one on the app itself. A designer who built every screen in the app's own type, so the phone in the pictures on this site is the phone in your pocket. And a support lead who reads every message sent to <a href="mailto:${EMAIL}">${EMAIL}</a> and answers within two business days. The names can wait until there are more of us than the office holds. The product speaks in one voice, and it isn't any of ours.</p>
  </div>
</section>`;
}

function where() {
  return `<section class="terrain about-where" aria-labelledby="where-h" data-in="contours">
  <div class="terrain-photo">${picture('photo-about-01', { alt: PHOTO_ALT['photo-about-01'], sizes: '100vw', cls: 'pic--cover' })}</div>
  ${CONTOURS}
  <div class="terrain-in">
    <div class="terrain-card inset-card" data-terrain-card>
      <h2 class="h2" id="where-h">Where we are</h2>
      <p>Cash Pass is at ${esc(ADDRESS)}. Write to <a href="mailto:${EMAIL}">${EMAIL}</a> or call ${esc(PHONE)}. The checkout where this started is a few miles from the office. The cafe inside it codes as Dining.</p>
    </div>
  </div>
</section>`;
}

function pull() {
  return `<section class="about-pull" aria-label="Pull quote" data-in="seal-quote">
  <div class="about-pull-in">
    <div class="about-seal" data-seal>${kitSvg('seal.svg', { cls: 'seal seal--160', size: [160, 160] })}</div>
    <blockquote class="pq pq--h2 about-q" data-fit-quote><p>${['"A good container, and no opinion. That was the wallet.', 'We built the opinion."'].map((line) => `<span class="ql">${line.split(' ').map((w) => `<span class="w">${esc(w)}</span>`).join(' ')}</span>`).join(' ')}</p></blockquote>
  </div>
</section>`;
}

export function render() {
  const main = [manifesto(), story(), never(), who(), where(), pull(),
    closeBand({ body: 'We built the usher. The wallet is yours. Pass connects every card read only and does the remembering for $59 a year.', secondary: ['Compare plans', '/plans'] })].join('\n');
  return page({
    route: '/about', title: 'About Cash Pass',
    description: 'Cash Pass began at a Denver checkout in 2026. A card picker for the phone you already carry, paid by you once a year, with no card offers, no referrals, no lending and no credit scores.',
    bodyClass: 'page-about', hover: 'weight', main, script: 'about', navCta: 'rimmed'
  });
}
