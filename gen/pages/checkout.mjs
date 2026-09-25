import { page } from '../partials/layout.mjs';
import { esc, picture, icon, cardMark } from '../lib/html.mjs';

const STATES = ['AL Alabama', 'AK Alaska', 'AZ Arizona', 'AR Arkansas', 'CA California', 'CO Colorado', 'CT Connecticut', 'DE Delaware', 'DC District of Columbia', 'FL Florida', 'GA Georgia', 'HI Hawaii', 'ID Idaho', 'IL Illinois', 'IN Indiana', 'IA Iowa', 'KS Kansas', 'KY Kentucky', 'LA Louisiana', 'ME Maine', 'MD Maryland', 'MA Massachusetts', 'MI Michigan', 'MN Minnesota', 'MS Mississippi', 'MO Missouri', 'MT Montana', 'NE Nebraska', 'NV Nevada', 'NH New Hampshire', 'NJ New Jersey', 'NM New Mexico', 'NY New York', 'NC North Carolina', 'ND North Dakota', 'OH Ohio', 'OK Oklahoma', 'OR Oregon', 'PA Pennsylvania', 'RI Rhode Island', 'SC South Carolina', 'SD South Dakota', 'TN Tennessee', 'TX Texas', 'UT Utah', 'VT Vermont', 'VA Virginia', 'WA Washington', 'WV West Virginia', 'WI Wisconsin', 'WY Wyoming'];
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Ireland', 'New Zealand', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Japan', 'Singapore', 'Mexico'];

function field({ id, label, req = 'required', type = 'text', auto, inputmode, helper, extra = '', wrapCls = '' }) {
  const desc = helper ? ` aria-describedby="${id}-help" data-desc="${id}-help"` : '';
  return `<div class="field ${wrapCls}" data-field data-field-id="${id}">
  <label class="label" for="${id}">${esc(label)} <span class="req" data-req>(${req})</span></label>
  ${helper ? `<p class="helper" id="${id}-help" data-helper>${esc(helper)}</p>` : ''}
  <input class="input" id="${id}" name="${id}" type="${type}"${auto ? ` autocomplete="${auto}"` : ''}${inputmode ? ` inputmode="${inputmode}"` : ''}${desc}${extra}>
  <p class="field-err" id="${id}-err" hidden></p>
</div>`;
}
function select({ id, label, auto, options, placeholder = 'Select', selected = '' }) {
  return `<div class="field" data-field data-field-id="${id}">
  <label class="label" for="${id}">${esc(label)} <span class="req">(required)</span></label>
  <select class="select" id="${id}" name="${id}" autocomplete="${auto}"><option value="">${esc(placeholder)}</option>${options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}"${v === selected ? ' selected' : ''}>${esc(l)}</option>`; }).join('')}</select>
  <p class="field-err" id="${id}-err" hidden></p>
</div>`;
}

const year = 2026;
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const YEARS = Array.from({ length: 16 }, (_, i) => String(year + i));

const MARKS = `<ul class="cc-marks" aria-label="Cards accepted: Visa, Mastercard, American Express, Discover" data-cc-marks>
  <li class="cc-mark" data-cc="visa" title="Visa"><svg viewBox="0 0 48 30" aria-hidden="true"><rect x=".75" y=".75" width="46.5" height="28.5" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="24" y="19.5" text-anchor="middle" font-family="'Familjen Grotesk',sans-serif" font-weight="700" font-style="italic" font-size="12" fill="currentColor" letter-spacing=".5">VISA</text></svg><span class="vh">Visa</span></li>
  <li class="cc-mark" data-cc="mastercard" title="Mastercard"><svg viewBox="0 0 48 30" aria-hidden="true"><rect x=".75" y=".75" width="46.5" height="28.5" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="15" r="7.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="29" cy="15" r="7.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span class="vh">Mastercard</span></li>
  <li class="cc-mark" data-cc="amex" title="American Express"><svg viewBox="0 0 48 30" aria-hidden="true"><rect x=".75" y=".75" width="46.5" height="28.5" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="24" y="13" text-anchor="middle" font-family="'Familjen Grotesk',sans-serif" font-weight="700" font-size="7" fill="currentColor" letter-spacing=".4">AMERICAN</text><text x="24" y="22" text-anchor="middle" font-family="'Familjen Grotesk',sans-serif" font-weight="700" font-size="7" fill="currentColor" letter-spacing=".4">EXPRESS</text></svg><span class="vh">American Express</span></li>
  <li class="cc-mark" data-cc="discover" title="Discover"><svg viewBox="0 0 48 30" aria-hidden="true"><rect x=".75" y=".75" width="46.5" height="28.5" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="21" y="19" text-anchor="middle" font-family="'Familjen Grotesk',sans-serif" font-weight="700" font-size="8" fill="currentColor" letter-spacing=".3">DISCOVER</text><circle cx="40" cy="15" r="3" fill="currentColor"/></svg><span class="vh">Discover</span></li>
</ul>`;

export function render() {
  const main = `<section class="checkout" aria-labelledby="co-h" data-checkout>
  <div class="co-head" data-in="mask-rise">
    <h1 class="h1" id="co-h">Checkout</h1>
    <p class="intro co-guest">Guest checkout. No account and no sign in. A password is optional and comes after your order.</p>
  </div>
  <div class="co-grid">
    <form class="co-form" id="checkout-form" novalidate data-co-form data-plan="">
      <div class="err-summary" role="alert" tabindex="-1" hidden data-err-summary>
        <h2 class="err-title">There is a problem</h2>
        <p class="err-lead" data-err-lead>Fix the items below to continue.</p>
        <ul class="err-list" data-err-list></ul>
      </div>

      <fieldset class="co-sec" data-co-sec="contact">
        <legend class="co-legend"><span class="co-num fig" aria-hidden="true" data-co-num>1</span><h2 class="h3 co-title"><span data-co-n>1</span>. Contact</h2></legend>
        ${field({ id: 'first-name', label: 'First name', auto: 'given-name' })}
        ${field({ id: 'last-name', label: 'Last name', auto: 'family-name' })}
        ${field({ id: 'email', label: 'Email address', type: 'email', auto: 'email', inputmode: 'email', helper: 'Your activation link and receipt go here.' })}
        ${field({ id: 'phone', label: 'Phone', req: 'required on Pass and Pass Family', type: 'tel', auto: 'tel', inputmode: 'tel', helper: 'For your receipt and renewal notices.', wrapCls: 'field--phone' })}
      </fieldset>

      <fieldset class="co-sec" data-co-sec="billing" data-paid-only>
        <legend class="co-legend"><span class="co-num fig" aria-hidden="true" data-co-num>2</span><h2 class="h3 co-title"><span data-co-n>2</span>. Billing address</h2></legend>
        ${field({ id: 'address1', label: 'Address line 1', auto: 'billing address-line1' })}
        ${field({ id: 'address2', label: 'Address line 2', req: 'optional', auto: 'billing address-line2' })}
        <div class="row-3">
          ${field({ id: 'city', label: 'City', auto: 'billing address-level2' })}
          ${select({ id: 'state', label: 'State', auto: 'billing address-level1', options: STATES.map((s) => [s.slice(0, 2), s.slice(3)]), placeholder: 'Select your state' })}
          ${field({ id: 'zip', label: 'ZIP code', auto: 'billing postal-code', inputmode: 'numeric' })}
        </div>
        ${select({ id: 'country', label: 'Country', auto: 'billing country-name', options: COUNTRIES, placeholder: 'Select your country', selected: 'United States' })}
      </fieldset>

      <fieldset class="co-sec" data-co-sec="payment">
        <legend class="co-legend"><span class="co-num fig" aria-hidden="true" data-co-num>3</span><h2 class="h3 co-title"><span data-co-n>3</span>. Payment</h2></legend>
        <div data-paid-only>
          <div class="cc-row"><p class="label cc-row-label">Cards accepted</p>${MARKS}</div>
          ${field({ id: 'cc-name', label: 'Name on card', auto: 'cc-name' })}
          ${field({ id: 'cc-number', label: 'Card number', auto: 'cc-number', inputmode: 'numeric', helper: 'Digits only. Spaces are added for you.', extra: ' maxlength="23"' })}
          <div class="row-exp">
            ${select({ id: 'cc-exp-month', label: 'Expiry month', auto: 'cc-exp-month', options: MONTHS, placeholder: 'Month' })}
            ${select({ id: 'cc-exp-year', label: 'Expiry year', auto: 'cc-exp-year', options: YEARS, placeholder: 'Year' })}
            <div class="field" data-field data-field-id="cc-csc">
              <label class="label" for="cc-csc">Security code <span class="req">(required)</span></label>
              <div class="csc-wrap"><input class="input" id="cc-csc" name="cc-csc" type="password" inputmode="numeric" autocomplete="cc-csc" maxlength="4" aria-describedby="cc-csc-help" data-desc="cc-csc-help"><button class="help-btn" type="button" aria-expanded="false" aria-controls="cc-csc-help" data-csc-help aria-label="What is the security code"><span aria-hidden="true">?</span></button></div>
              <p class="helper csc-help" id="cc-csc-help" hidden>The 3 digits on the back of your card, or 4 on the front of some cards.</p>
              <p class="field-err" id="cc-csc-err" hidden></p>
            </div>
          </div>
        </div>
        <p class="co-free-line" data-free-only hidden>Nothing to pay. The Free plan costs $0 and never bills, so there are no card fields.</p>
      </fieldset>

      <fieldset class="co-sec" data-co-sec="ack">
        <legend class="co-legend"><span class="co-num fig" aria-hidden="true" data-co-num>4</span><h2 class="h3 co-title"><span data-co-n>4</span>. Acknowledgment</h2></legend>
        <div class="field field--check" data-field data-field-id="ack">
          <input class="check" id="ack" name="ack" type="checkbox">
          <label class="check-label ack-label" for="ack">I am 18 or older and I agree to the <a href="/terms-of-service">Terms of Service</a> and <a href="/privacy-policy">Privacy Policy</a>.</label>
          <p class="field-err" id="ack-err" hidden></p>
        </div>
      </fieldset>

      <fieldset class="co-sec co-sec--summary" data-co-sec="summary">
        <legend class="co-legend"><span class="co-num fig" aria-hidden="true" data-co-num>5</span><h2 class="h3 co-title"><span data-co-n>5</span>. Order summary</h2></legend>
        <dl class="sum-rows">
          <div class="sum-row"><dt>Plan</dt><dd data-os-plan>Pass</dd></div>
          <div class="sum-row"><dt>Price</dt><dd class="fig" data-os-price>$59.00</dd></div>
          <div class="sum-row"><dt data-os-renew-label>Renews</dt><dd data-os-renew>Renews at $59 a year</dd></div>
          <div class="sum-row"><dt>Tax included</dt><dd></dd></div>
          <div class="sum-row sum-row--total"><dt>Total</dt><dd class="fig" data-os-total>$59.00</dd></div>
        </dl>
        <div class="disclosure" data-disclosure>
          <p class="disc-lead" data-disc-lead>Before you pay, one plain fact.</p>
          <p class="disc-text">Cash Pass is software. It issues no card, holds no balance and moves no money. You pay merchants with your own cards, and every protection on those cards stays with the issuer.</p>
          <p class="disc-small" data-paid-only>Card connection on this plan is read only, through a third party aggregator, using a token rather than your password. Cash Pass can read your transactions. It cannot move money, make a charge or change anything on your accounts.</p>
        </div>
        <div class="co-pay"><button class="tile tile--full tile--pay" type="submit" data-pay>Pay $59.00 now</button></div>
        <p class="co-note">This is a preview. No card is charged from this page.</p>
        <p class="co-back"><a class="tlink" href="/cart">Back to cart</a></p>
      </fieldset>
    </form>

    <aside class="co-summary" aria-labelledby="your-order-h" data-co-summary>
      <div class="co-summary-bg" aria-hidden="true">${picture('atmos-03', { decorative: true, sizes: '33vw', cls: 'pic--cover' })}</div>
      <div class="co-summary-in">
        <button class="co-sum-toggle" type="button" aria-expanded="true" aria-controls="co-sum-body" data-sum-toggle><span>Your order</span><span class="fig" data-sum-total-mini>$59.00</span></button>
        <h2 class="h3" id="your-order-h">Your order</h2>
        <div class="co-sum-body" id="co-sum-body">
          <div class="receipt-card" data-receipt>
            <article class="plan plan--lit plan--compact receipt-plan" data-receipt-plan>
              <div class="plan-head"><h3 class="plan-name"><span class="plan-chip" data-rc-name>Pass</span></h3></div>
              <p class="plan-price"><span class="plan-num fig" data-rc-price>$59.00</span></p>
              <ul class="ticks" aria-hidden="true" data-ticks>${[1, 2, 3, 4, 5].map((n) => `<li class="tick" data-tick="${n}">${icon('tick')}</li>`).join('')}</ul>
            </article>
          </div>
          <dl class="sum-rows">
            <div class="sum-row"><dt>Plan</dt><dd data-cs-plan>Pass</dd></div>
            <div class="sum-row"><dt>Price</dt><dd class="fig" data-cs-price>$59.00</dd></div>
            <div class="sum-row"><dt>Renewal</dt><dd data-cs-renew>Renews at $59 a year</dd></div>
            <div class="sum-row"><dt>Tax</dt><dd>Tax included</dd></div>
            <div class="sum-row sum-row--total"><dt>Total</dt><dd class="fig" data-cs-total>$59.00</dd></div>
          </dl>
          <p class="co-change"><a class="tlink" href="/cart">Change plan</a></p>
        </div>
      </div>
    </aside>
  </div>
  <div class="co-bar" data-co-bar hidden><span class="fig" data-bar-total>$59.00</span><button class="tile tile--pay" type="button" data-bar-pay>Pay $59.00 now</button></div>
</section>`;
  return page({
    route: '/checkout', title: 'Checkout',
    description: 'Guest checkout. No account and no sign in. A password is optional and comes after your order.',
    bodyClass: 'page-checkout', hover: 'underline', main, script: 'checkout', navCta: 'unrimmed', footerUnrimmed: true
  });
}
