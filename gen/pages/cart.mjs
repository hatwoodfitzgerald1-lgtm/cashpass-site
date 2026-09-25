import { page } from '../partials/layout.mjs';
import { fiveCards } from '../partials/components.mjs';
import { esc, picture, productShot, SHOTS, cardMark, kitSvg } from '../lib/html.mjs';

export function render() {
  const main = `<section class="cart" aria-labelledby="cart-h" data-cart>
  <div class="cart-head" data-in="mask-rise">
    <h1 class="h1" id="cart-h">Your cart</h1>
    <p class="cart-notice intro" data-cart-notice>Your cart holds one plan at a time.</p>
    <p class="cart-replace" role="status" data-cart-replace hidden></p>
  </div>
  <div class="cart-full" data-cart-full hidden>
    <div class="cart-grid">
      <div class="slot" data-slot>
        <div class="slot-stage" data-slot-stage>
          <article class="plan plan--lit slot-card" data-slot-card data-tilt>
            <div class="plan-head"><h2 class="plan-name"><span class="plan-chip" data-slot-name>Pass</span></h2></div>
            <p class="plan-price"><span class="plan-num fig" data-slot-price>$59</span></p>
            <p class="plan-under" data-slot-renew>Renews at $59 a year</p>
            <p class="plan-unit" data-slot-unit>1 person, unlimited cards</p>
            <p class="plan-renew">Tax included</p>
            <p class="slot-qty">Quantity: 1</p>
            <div class="plan-cta"><button class="tile tile--ghost tile--full" type="button" data-remove>Remove</button></div>
          </article>
          <div class="slot-glass" aria-hidden="true"><div class="pool" data-slot-pool></div><div class="glass-reflect"></div></div>
        </div>
        <figure class="slot-ref">${productShot('s4-cards', { alt: SHOTS['s4-cards'], width: 300 })}<figcaption class="caption">The Cards. Your wallet, with a cap bar on every card that has one. Example figures.</figcaption></figure>
      </div>
      <aside class="summary" aria-labelledby="sum-h" data-summary>
        <h2 class="h3" id="sum-h">Summary</h2>
        <dl class="sum-rows">
          <div class="sum-row" data-sum-row><dt data-sum-plan>Pass</dt><dd class="fig" data-sum-price>$59.00</dd></div>
          <div class="sum-row" data-sum-row><dt>Tax included</dt><dd></dd></div>
          <div class="sum-row sum-row--total" data-sum-row><dt>Total</dt><dd class="fig" data-sum-total>$59.00</dd></div>
        </dl>
        <p class="sum-line">Prices in US dollars. Nothing ships; your plan is delivered by email.</p>
        <div class="cta-row cta-row--col"><a class="tile tile--full" href="/checkout" data-hero-cta>Go to checkout</a><a class="tlink" href="/plans">Compare plans</a></div>
      </aside>
    </div>
  </div>
  <div class="cart-empty" data-cart-empty hidden>
    <div class="empty-bg" aria-hidden="true">${picture('atmos-05', { decorative: true, sizes: '100vw', cls: 'pic--cover' })}</div>
    ${fiveCards({ lit: -1, cls: 'five--empty' })}
    <div class="empty-copy">
      <h2 class="h2">Nothing in your cart yet</h2>
      <p class="intro">The plans are one page away.</p>
      <p><a class="tlink" href="/plans">Compare plans</a></p>
      <div class="cta-row"><a class="tile" href="/cart?add=pass" data-add-plan="pass">Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span></div>
    </div>
  </div>
</section>`;
  return page({
    route: '/cart', title: 'Your cart', description: 'Your cart holds one plan at a time.',
    bodyClass: 'page-cart', hover: 'underline', main, script: 'cart', navCta: 'unrimmed'
  });
}
