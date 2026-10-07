import { page } from '../partials/layout.mjs';
import { closeBand, numeral, edgeDivider } from '../partials/components.mjs';
import { esc, picture, productShot, SHOTS, PHOTO_ALT, cardMark, icon, words, kitSvg } from '../lib/html.mjs';

function answer(text, cls = '') {
  const m = text.match(/^(.*?)(\d+%)$/);
  return `<p class="answer answer--till ${cls}" aria-label="${esc(text)}" data-last-light><span class="answer-txt" aria-hidden="true">${m ? `${esc(m[1])}<span class="ans-fig">${esc(m[2])}</span>` : esc(text)}</span></p>`;
}

function heroSec() {
  return `<section class="hero hero--hiw" data-in="mask-rise">
  <div class="scene scene--token" data-scene="token" aria-hidden="true" data-composed>
    <svg class="token-path" viewBox="0 0 1440 600" preserveAspectRatio="none" data-token-svg aria-hidden="true"><path class="tp-bank" d="M930 520 v-150 a55 55 0 0 1 110 0 v150" fill="none" stroke="#CDB3AE" stroke-width="1.75"/><path class="tp-path" d="M1040 468 C 1110 468, 1150 428, 1236 428" fill="none" stroke="#E9F1F8" stroke-width="1.5" stroke-opacity=".7" data-token-line/><rect class="tp-phone" x="1236" y="340" width="84" height="170" rx="14" fill="none" stroke="#CDB3AE" stroke-width="1.75"/><g class="tp-token" data-token-glyph transform="translate(1040,468)"><rect x="-14" y="-9" width="28" height="18" rx="4" fill="#E9F1F8"/><rect x="-5" y="3" width="8" height="2" fill="#2E0B0C"/></g></svg>
  </div>
  <div class="hero-in">
    <p class="eyebrow">How it works</p>
    <h1 class="h1">${words('How Cash Pass picks which card to use')}</h1>
    <p class="intro">Cash Pass looks at your transactions, your rules, rotating categories, caps and annual fees. Then it names one of your cards, with the reason, as you arrive at a store.</p>
    <div class="cta-row"><a class="tile" href="/cart?add=pass" data-add-plan="pass" data-hero-cta>Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span></div>
  </div>
</section>`;
}

function timeline() {
  const steps = [
    ['1', 'Connect, read only', 'You sign in on your bank\'s own page. Cash Pass gets a token that can read and can\'t touch.', 'token'],
    ['2', 'Your year sorts itself', 'Twelve months of transactions land sorted by merchant and by category. Nothing to enter.', 'ledger'],
    ['3', 'Rules are proposed', 'Where your history is clear, Cash Pass proposes a rule. You approve each one, or ignore it.', 'rule'],
    ['4', 'The answer at checkout', 'At the door, a notification names the card and the reason. One tap opens it in your wallet.', 'phone']
  ];
  return `<section class="timeline" aria-labelledby="tl-h" data-in="timeline-draw">
  <h2 class="h2 tl-h" id="tl-h">${words('Four steps from signup to your first answer')}</h2>
  <div class="tl-track" aria-hidden="true"><svg class="tl-line" viewBox="0 0 1000 2" preserveAspectRatio="none"><path d="M0 1 H1000" stroke="#E9F1F8" stroke-opacity=".6" stroke-width="1.5" data-tl-line/></svg></div>
  <ol class="tl-steps">${steps.map(([n, h, p, ic]) => `<li class="tl-step" data-tl-step data-screen="${ic}">
    <span class="tl-dot" aria-hidden="true">${cardMark('tl-mark')}</span>
    <span class="tl-num fig" aria-hidden="true">${n}</span>
    ${icon(ic, 'tl-ic')}
    <h3 class="h3">${esc(n)}. ${esc(h)}</h3>
    <p>${esc(p)}</p>
  </li>`).join('')}</ol>
</section>`;
}

function fourThings() {
  const items = [
    ['01', 'Your history', 'With your cards connected read only, your last twelve months of transactions arrive sorted by store and category, and new ones are sorted as they come in. From that, Cash Pass learns where you shop, the category each store codes under, and which card you\'ve been using. It can spot a cafe that codes as Dining inside a supermarket that codes as Grocery. Free skips this step: its three cards are entered by hand, and it decides from the published category terms alone.', 'ledger'],
    ['02', 'Your rules', 'A rule pairs a store, a chain or a category with a card. Write as many as you like on any plan. On Pass, Cash Pass reads your history and proposes rules where the pattern is clear, and each proposal sits on the Rules screen with Approve and Ignore until you decide. Nothing takes effect on its own. A rule wins over everything else, including a cap. Change or delete one whenever you like. On Pass Family, a rule one person writes applies to the whole house.', 'rule'],
    ['03', 'Rotating categories', 'A rotating card earns its 5 percent in categories the issuer changes every quarter, on up to $1,500 of spend a quarter, and only after you\'ve activated that quarter. Cash Pass tracks the calendar. Before a quarter opens it tells you, names the categories, and asks you to activate in your issuer\'s app and mark it done here. Until you do, it treats the card as earning its base rate and won\'t recommend it for the bonus. In the example year all four quarters were activated: $3,600 of spend across them at 5 percent, $180 earned. Example figures.', 'quarter'],
    ['04', 'Caps and fees', 'Two numbers your wallet never shows you. The first is where you stand against each cap: $4,140 of the $6,000 yearly cap on Grocery 6% in July, $900 of $1,500 for the quarter on Rotating 5%. Cash Pass moves those bars with every transaction, so when a cap is reached, as Grocery 6% reached its cap on Oct 14 in the example year, the answer at checkout changes the same day. The second is the fee. Each card\'s annual fee comes off what that card earned, card by card, so the Ledger\'s number is the real one: $1,069 earned, $320 in fees, $749 net. Example figures.', 'cap']
  ];
  return `<section class="four" aria-labelledby="four-h" data-in="numerals-fill">
  <div class="sec-head"><h2 class="h2" id="four-h">${words('The four things it checks')}</h2></div>
  <ol class="four-list">${items.map(([n, h, p, ic]) => `<li class="idx-item four-item" data-idx>
    ${numeral(n)}
    <div class="idx-body">${icon(ic, 'dec-ic')}<h3 class="h3"><span class="vh">${esc(n)} </span>${esc(h)}</h3><p>${esc(p)}</p></div>
  </li>`).join('')}</ol>
  <p class="four-weighed">A rule wins. Without a rule, the published rate at this merchant type, the state of its cap and whether the quarter is active decide together, with the fee already counted. When nothing matches, Flat 2%. The answer is one line, and the reason is the thing that decided it.</p>
</section>`;
}

function connection() {
  const chapters = [
    ['Your bank\'s page, not ours', 'You sign in where you always do. Cash Pass never sees the password and never asks for it.'],
    ['A token that reads', 'What comes back is a token. It reads four things about each transaction: the merchant, the amount, the date and the category. It has no way to move money, make a charge or change anything on your accounts, and the third party aggregator that carries it is granted the same read only scope.'],
    ['Disconnect from the same screen', 'Disconnect and the reading stops right away. It takes no more steps than connecting did.']
  ];
  return `<section class="conn" aria-labelledby="conn-h" data-in="rail-cross">
  <div class="sec-head"><h2 class="h2" id="conn-h">${words('How the read only connection works')}</h2></div>
  <div class="conn-grid">
    <div class="conn-chapters">${chapters.map(([h, p], i) => `<div class="conn-ch" data-conn-ch="${i}"><h3 class="h3">${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}
      <p class="conn-wallet">When the answer arrives, Open in wallet opens that card in Apple Wallet or Google Wallet, whichever your phone runs. Cash Pass doesn't replace your wallet. It tells it which card.</p>
    </div>
    <div class="conn-rail">
      <div class="conn-phone" data-conn-phone><div class="phone-slot">${productShot('s8-connect', { alt: SHOTS['s8-connect'], width: 420 })}<span class="glare" aria-hidden="true"></span></div>
        <div class="conn-state" data-conn-state aria-live="polite">${icon('token', 'conn-ic')}<span data-conn-state-text>Connected, read only</span></div>
      </div>
      <div class="conn-toggle">
        <button class="switch" type="button" role="switch" aria-checked="false" data-conn-switch><span class="switch-track" aria-hidden="true"><span class="switch-knob"></span></span><span class="switch-label">Disconnect any time</span></button>
      </div>
    </div>
  </div>
</section>`;
}

function cannot() {
  const items = ['Remind you before a quarter opens.', 'Tell you where its cap stands today.', 'Take its own fee off its own earnings.', 'Share a rule with the person you live with.'];
  return `<section class="diag" aria-labelledby="diag-h" data-in="slope-slide">
  <div class="diag-bg">${picture('photo-hiw-01', { alt: PHOTO_ALT['photo-hiw-01'], sizes: '100vw', cls: 'pic--cover' })}</div>
  <div class="diag-in">
    <h2 class="h2" id="diag-h">${words('What a card in your wallet cannot do')}</h2>
    <ul class="diag-list">${items.map((t) => `<li class="diag-item h3">${esc(t)}</li>`).join('')}</ul>
  </div>
</section>`;
}

function never() {
  const items = ['Move money. The token only reads.', 'Make a charge or change a setting on any account.', 'Hold your password. You sign in with your bank, not with us.', 'Name a card you don\'t hold. It picks from your wallet, never from a catalogue.', 'Carry an offer, an application or a referral link.', 'Mention a credit score. It doesn\'t know yours and doesn\'t want to.', 'Show the household anyone\'s transactions. The house sees totals.'];
  return `<section class="never" aria-labelledby="never-h" data-in="index-left">
  <div class="sec-head"><h2 class="h2" id="never-h">${words('What the app never does')}</h2></div>
  <ul class="never-list">${items.map((t) => `<li class="never-item" data-never>${cardMark('never-mark')}<span>${esc(t)}</span></li>`).join('')}</ul>
  <div class="pull" data-pull>
    ${edgeDivider()}
    <p class="pq pq--h2 pull-h">Your wallet holds every card. Cash Pass picks which one to use.</p>
    ${edgeDivider()}
  </div>
</section>`;
}

function saturday() {
  const stops = [
    ['8:40', 'Route 9 Fuel', 'Tap Everyday 4%', 'All gas stations, Everyday 4%. Your rule.'],
    ['9:15', 'Lantern Row Market', 'Tap Grocery 6%', '6% on groceries. $4,140 of the $6,000 yearly cap used.'],
    ['9:50', 'Lantern Row Cafe, inside the market', 'Tap Everyday 4%', 'Codes as Dining, not Grocery. 4% here.'],
    ['1:30', 'a pharmacy across town', 'Tap Flat 2%', 'No category matches. 2% on everything.'],
    ['8:10', 'the online marketplace, from the sofa', 'Tap Marketplace 5%', '5% here. The card that\'s for this one shop.']
  ];
  return `<section class="sat" aria-labelledby="sat-h" data-in="deck-alternate">
  <div class="sec-head"><h2 class="h2" id="sat-h">${words('An example day: five stores, five answers')}</h2><p class="intro">The same wallet, five stops, one day from the example year.</p></div>
  <div class="sat-deck">
    <div class="sat-glass" aria-hidden="true"><div class="glass-reflect"></div></div>
    <ol class="sat-cards">${stops.map(([t, shop, a, why], i) => `<li class="till" data-till style="--i:${i}">
      <p class="till-time"><span class="fig" data-time="${esc(t)}">${esc(t)}</span>, ${esc(shop)}</p>
      ${answer(a)}
      <p class="till-why">${esc(why)}</p>
      <span class="till-ic" aria-hidden="true">${icon('reader')}</span>
    </li>`).join('')}</ol>
  </div>
  <p class="sat-out">What sat out: Rotating 5% didn't come up. None of these shops is in this quarter's categories, and its bar reads $900 of $1,500 for the quarter. On Monday, Cash Pass proposes a rule from the week's history: Lantern Row Cafe, Everyday 4%, codes as Dining. Approve it once and the cafe is settled.</p>
  <p class="example">Example figures. Rewards are set and paid by your issuer.</p>
</section>`;
}

export function render() {
  const main = [heroSec(), timeline(), fourThings(), connection(), cannot(), never(), saturday(),
    closeBand({ body: 'Pass connects all your cards read only and does this for every purchase, for $59 a year.', secondary: ['Compare plans', '/plans'] })].join('\n');
  return page({
    route: '/how-it-works', title: 'How Cash Pass works',
    description: 'How Cash Pass picks which credit card to use. It checks Your history, your rules, rotating categories, caps and fees, and a read only connection that can\'t move money.',
    bodyClass: 'page-hiw', hover: 'token', main, script: 'hiw'
  });
}
