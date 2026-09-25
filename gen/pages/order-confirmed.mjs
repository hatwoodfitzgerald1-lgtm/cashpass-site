import { page } from '../partials/layout.mjs';
import { esc, picture, kitSvg, icon, cardMark } from '../lib/html.mjs';

export function render() {
  const main = `<section class="confirm" aria-labelledby="confirm-h" data-confirm>
  <div class="confirm-grid">
    <div class="confirm-stage" data-confirm-stage>
      <h1 class="answer answer--confirm" id="confirm-h" data-last-light aria-label="Pass is yours."><span class="answer-txt" aria-hidden="true" data-confirm-headline>Pass is yours.</span></h1>
      <p class="confirm-order intro" data-confirm-line hidden>Order <span class="fig" data-confirm-number></span>. Thank you.</p>
      <div class="confirm-glass">
        <article class="plan plan--lit confirm-card" data-confirm-card data-tilt>
          <div class="plan-head"><h2 class="plan-name"><span class="plan-chip" data-cf-name>Pass</span></h2></div>
          <p class="plan-price"><span class="plan-num fig" data-cf-price>$59.00</span></p>
          <p class="plan-under" data-cf-renew>Renews at $59 a year</p>
          <p class="plan-unit" data-cf-unit>1 person, unlimited cards</p>
        </article>
        <div class="confirm-seal" data-seal>${kitSvg('seal.svg', { cls: 'seal seal--160', size: [160, 160] })}</div>
        <div class="slot-glass" aria-hidden="true"><div class="pool" data-confirm-pool></div><div class="glass-reflect"></div></div>
      </div>
    </div>
    <div class="confirm-details" data-in="rows-right" data-cf-details hidden>
      <h2 class="h3">Order details</h2>
      <dl class="detail-rows">
        <div class="detail-row" data-detail><dt>Order number</dt><dd class="fig" data-cf-number></dd></div>
        <div class="detail-row" data-detail><dt>Plan</dt><dd data-cf-plan>Pass</dd></div>
        <div class="detail-row" data-detail><dt>Amount paid</dt><dd class="fig" data-cf-amount>$59.00</dd></div>
        <div class="detail-row" data-detail><dt>Renews</dt><dd data-cf-renews></dd></div>
      </dl>
    </div>
  </div>
</section>
<section class="activation band" aria-label="Activation" data-in="type-line">
  <div class="band-bg" aria-hidden="true">${picture('atmos-02', { decorative: true, sizes: '100vw', cls: 'pic--cover' })}</div>
  <div class="band-in">
    <div class="activation-in">
      <div class="activation-seal" data-seal>${kitSvg('seal.svg', { cls: 'seal seal--56', size: [56, 56] })}</div>
      <p class="pq pq--h2 activation-line" data-activation-line hidden>Your activation link is on its way to <span data-cf-email></span>. Open it on your phone, install Cash Pass, and your plan is waiting under that email.</p>
      <p class="activation-receipt">Your receipt is in the same inbox.</p>
      <div class="cta-row"><a class="tile tile--unrimmed" href="/how-it-works">Get the app</a></div>
    </div>
  </div>
</section>
<section class="account" aria-labelledby="acct-h" data-in="fade-last" data-account>
  <div class="account-grid">
    <form class="account-form" id="account-form" novalidate data-account-form>
      <h2 class="h2" id="acct-h">Set a password. Optional.</h2>
      <p class="intro">Your order is complete without it. A password lets you sign in later without the activation link.</p>
      <div class="field" data-field>
        <label class="label" for="pw">Password <span class="req">(optional)</span></label>
        <p class="helper" id="pw-help">At least 12 characters.</p>
        <div class="pw-wrap"><input class="input" id="pw" name="password" type="password" autocomplete="new-password" aria-describedby="pw-help" data-desc="pw-help"><button class="help-btn pw-toggle" type="button" aria-pressed="false" aria-label="Show password" data-pw-toggle>${icon('light')}</button></div>
        <p class="field-err" id="pw-err" hidden></p>
      </div>
      <div class="cta-row"><button class="tile tile--ghost" type="submit">Create account</button><button class="tlink tlink--btn" type="button" data-skip-account>Skip for now</button></div>
      <p class="account-status" role="status" aria-live="polite" data-account-status></p>
    </form>
    <p class="help-line">Questions about your order? <a href="mailto:support@yourcashpass.com">support@yourcashpass.com</a>. Cancel any time from the app in two taps.</p>
  </div>
</section>`;
  return page({
    route: '/order-confirmed', title: 'Order confirmed',
    description: 'Order confirmed. Your receipt is in the same inbox. Cancel any time from the app in two taps.',
    bodyClass: 'page-confirm', hover: 'light', main, script: 'confirm', navCta: 'rimmed'
  });
}
