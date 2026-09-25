// Click through the quiz, the cart, the full checkout to the confirmation, the SMS block, the 404 and the QA hooks.
import fs from 'node:fs';
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const W = parseInt(process.argv[2] || '1440'), H = parseInt(process.argv[3] || '900');
const out = process.argv[4] || '/home/claude/cashpass/work/shots/flows';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, hasTouch: W < 900, isMobile: W < 900 });
const page = await ctx.newPage();
const log = [];
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const say = (s) => { log.push(s); console.log(s); };
const base = 'http://127.0.0.1:8787';
const shot = (name) => page.screenshot({ path: `${out}/${W}-${name}.png`, fullPage: false });

// ---------- the quiz ----------
await page.goto(base + '/quiz', { waitUntil: 'load' });
await page.waitForTimeout(800);
const combos = [[1, 0, 1, 'Pass', 'At Lantern Row Market: Tap Grocery 6%', 3], [0, 1, 2, 'Free', 'At Lantern Row Cafe: Tap Everyday 4%, it codes as Dining', 2], [2, 2, 0, 'Pass Family', 'At the marketplace: Tap Marketplace 5%', 3], [0, 3, 3, 'Free', 'Everywhere else: Tap Flat 2%', 2], [1, 0, 3, 'Pass', 'At Lantern Row Market: Tap Grocery 6%', 2]];
for (const [a, b, c, plan, till, nreasons] of combos) {
  await page.check(`#q1-${a}`); await page.check(`#q2-${b}`); await page.check(`#q3-${c}`);
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({
    line: document.querySelector('[data-result-line]').getAttribute('aria-label'), till: document.querySelector('[data-result-till]').textContent,
    reasons: document.querySelectorAll('[data-result-reasons] li').length, live: document.querySelector('[data-result-live]').textContent,
    cta: (document.querySelector('[data-result-card] [data-add-plan]') || {}).textContent, lower: !document.querySelector('[data-result-lower]').hidden,
    lit: (document.querySelector('[data-light-stage] .plan--lit') || {}).getAttribute && document.querySelector('[data-light-stage] .plan--lit').getAttribute('data-plan'),
    progress: document.querySelector('[data-progress]').textContent, hint: !document.querySelector('[data-hint]').hidden
  }));
  const ok = r.live === `Your plan: ${plan}.` && r.till === till && r.reasons === nreasons;
  say(`quiz ${a}${b}${c}: ${ok ? 'PASS' : 'FAIL'} live="${r.live}" till="${r.till}" reasons=${r.reasons} cta="${r.cta}" lower=${r.lower} lit=${r.lit} progress=${r.progress} hint=${r.hint} line="${r.line}"`);
}
await shot('quiz-result');
// The purchase button on the result lands in the cart with that plan.
await page.click('[data-result-card] [data-add-plan]');
await page.waitForURL('**/cart', { timeout: 8000 }); await page.waitForLoadState('load'); await page.waitForSelector('[data-slot-name]', { state: 'attached' });
await page.waitForTimeout(900);
let cartState = await page.evaluate(() => ({ plan: JSON.parse(localStorage.getItem('cashpass.cart') || 'null'), name: document.querySelector('[data-slot-name]').textContent, price: document.querySelector('[data-sum-total]').textContent, toast: (document.querySelector('.toast p') || {}).textContent, fullHidden: document.querySelector('[data-cart-full]').hidden }));
say(`cart after quiz: ${JSON.stringify(cartState)}`);
await shot('cart-pass');

// ---------- the cart persists across pages; a second plan replaces the first ----------
await page.goto(base + '/about', { waitUntil: 'load' }); await page.goto(base + '/blog', { waitUntil: 'load' });
const badge = await page.evaluate(() => document.querySelector('[data-cart-link]').getAttribute('aria-label'));
say(`cart badge after two pages: ${badge}`);
await page.goto(base + '/plans', { waitUntil: 'load' }); await page.waitForTimeout(600);
await page.click('#plan-family [data-add-plan]');
await page.waitForURL('**/cart'); await page.waitForLoadState('load'); await page.waitForTimeout(900);
cartState = await page.evaluate(() => ({ name: document.querySelector('[data-slot-name]').textContent, replace: document.querySelector('[data-cart-replace]').textContent, toast: (document.querySelector('.toast p') || {}).textContent }));
say(`cart after replace: ${JSON.stringify(cartState)}`);
await shot('cart-replace');
// Remove returns to the empty state; checkout with an empty cart redirects to plans.
await page.click('[data-remove]'); await page.waitForTimeout(900);
const emptyState = await page.evaluate(() => ({ emptyShown: !document.querySelector('[data-cart-empty]').hidden, toast: (document.querySelector('.toast p') || {}).textContent, cart: localStorage.getItem('cashpass.cart') }));
say(`cart after remove: ${JSON.stringify(emptyState)}`);
await shot('cart-empty');
await page.goto(base + '/checkout', { waitUntil: 'load' }); await page.waitForTimeout(500);
say(`empty checkout redirected to: ${page.url()}`);

// ---------- the full paid checkout ----------
await page.goto(base + '/plans', { waitUntil: 'load' }); await page.waitForTimeout(400);
await page.click('#plan-pass [data-add-plan]'); await page.waitForURL('**/cart'); await page.waitForLoadState('load'); await page.waitForTimeout(600);
await page.click('[data-summary] a[href="/checkout"]'); await page.waitForURL('**/checkout'); await page.waitForTimeout(900);
// Submit empty: the error summary lists every required field and focus lands on it.
await page.locator('[data-pay]').scrollIntoViewIfNeeded(); await page.waitForTimeout(900);
await page.click('[data-pay]'); await page.waitForTimeout(600);
const errs = await page.evaluate(() => ({ summary: !document.querySelector('[data-err-summary]').hidden, items: Array.from(document.querySelectorAll('[data-err-list] a')).map((a) => a.textContent), focused: document.activeElement.getAttribute('data-err-summary') !== null, lead: document.querySelector('[data-err-lead]').textContent }));
say(`checkout empty submit: summary=${errs.summary} focusOnSummary=${errs.focused} lead="${errs.lead}" items=${errs.items.length}: ${errs.items.join(' | ')}`);
await shot('checkout-errors');
// An invalid card fails the Luhn check with the copy's message; the entered values are preserved.
await page.fill('#first-name', 'Dana'); await page.fill('#last-name', 'Reyes'); await page.fill('#email', 'dana@example.com'); await page.fill('#phone', '303 555 0100');
await page.fill('#address1', '1125 17th Street'); await page.fill('#city', 'Denver'); await page.selectOption('#state', 'CO'); await page.fill('#zip', '80202');
await page.click('#cc-name'); const prefilled = await page.inputValue('#cc-name'); say(`name on card prefilled: "${prefilled}"`);
await page.fill('#cc-number', '4111111111111112'); await page.selectOption('#cc-exp-month', '12'); await page.selectOption('#cc-exp-year', '2030'); await page.fill('#cc-csc', '123');
await page.check('#ack');
await page.click('[data-pay]'); await page.waitForTimeout(600);
const luhn = await page.evaluate(() => ({ items: Array.from(document.querySelectorAll('[data-err-list] a')).map((a) => a.textContent), cc: document.querySelector('#cc-number').value, first: document.querySelector('#first-name').value, fieldErr: document.querySelector('#cc-number-err').textContent }));
say(`checkout luhn fail: ${JSON.stringify(luhn)}`);
await page.fill('#cc-number', '4111111111111111'); await page.waitForTimeout(200);
const grouped = await page.inputValue('#cc-number'); say(`card number grouped: "${grouped}"`);
const marks = await page.evaluate(() => (document.querAll = null, Array.from(document.querySelectorAll('[data-cc].is-on')).map((m) => m.getAttribute('data-cc'))));
say(`card type lit: ${marks.join(',')}`);
const disclosure = await page.evaluate(() => { const d = document.querySelector('[data-disclosure]'); const btn = document.querySelector('[data-pay]'); return { text: d.querySelector('.disc-text').textContent, lead: d.querySelector('.disc-lead').textContent, small: getComputedStyle(d.querySelector('.disc-small')).display !== 'none', directlyAbove: d.nextElementSibling === btn.parentElement, btn: btn.textContent }; });
say(`disclosure: ${JSON.stringify(disclosure)}`);
await page.click('[data-pay]');
await page.waitForURL('**/order-confirmed', { timeout: 10000 }); await page.waitForTimeout(1500);
const conf = await page.evaluate(() => ({ h1: document.querySelector('#confirm-h').getAttribute('aria-label'), number: document.querySelector('[data-cf-number]').textContent, amount: document.querySelector('[data-cf-amount]').textContent, renews: document.querySelector('[data-cf-renews]').textContent, email: document.querySelector('[data-cf-email]').textContent, getApp: document.querySelector('.activation a.tile').getAttribute('href'), cart: localStorage.getItem('cashpass.cart') }));
say(`confirmation: ${JSON.stringify(conf)}`);
await shot('confirmed');
await page.fill('#pw', 'short'); await page.click('#account-form button[type=submit]'); await page.waitForTimeout(400);
say(`password short: "${await page.evaluate(() => document.querySelector('#pw-err').textContent)}"`);
await page.fill('#pw', 'a much longer password'); await page.click('#account-form button[type=submit]'); await page.waitForTimeout(400);
say(`password ok: "${await page.evaluate(() => (document.querySelector('.account-status') || {}).textContent)}"`);

// ---------- the Free checkout ----------
await page.goto(base + '/plans', { waitUntil: 'load' }); await page.waitForTimeout(400);
await page.click('#plan-free [data-add-plan]'); await page.waitForURL('**/cart'); await page.waitForLoadState('load'); await page.waitForTimeout(500);
await page.goto(base + '/checkout', { waitUntil: 'load' }); await page.waitForTimeout(900);
const free = await page.evaluate(() => ({ billingHidden: document.querySelector('[data-co-sec="billing"]').hidden, cardFieldsHidden: document.querySelector('[data-co-sec="payment"] [data-paid-only]').hidden, freeLine: !document.querySelector('[data-free-only]').hidden, phoneReq: document.querySelector('[data-field-id="phone"] [data-req]').textContent, helper: document.querySelector('[data-field-id="phone"] [data-helper]').textContent, numbers: Array.from(document.querySelectorAll('[data-co-sec]:not([hidden]) [data-co-n]')).map((n) => n.textContent).join(''), btn: document.querySelector('[data-pay]').textContent, lead: document.querySelector('[data-disc-lead]').textContent, small: document.querySelector('.disc-small').hidden, renew: document.querySelector('[data-os-renew]').textContent, total: document.querySelector('[data-os-total]').textContent }));
say(`free checkout: ${JSON.stringify(free)}`);
await shot('checkout-free');
await page.fill('#first-name', 'Theo'); await page.fill('#last-name', 'Park'); await page.fill('#email', 'theo@example.com'); await page.check('#ack');
await page.click('[data-pay]'); await page.waitForURL('**/order-confirmed', { timeout: 10000 }); await page.waitForTimeout(1200);
say(`free confirmation: ${JSON.stringify(await page.evaluate(() => ({ h1: document.querySelector('#confirm-h').getAttribute('aria-label'), renews: document.querySelector('[data-cf-renews]').textContent, amount: document.querySelector('[data-cf-amount]').textContent })))}`);

// ---------- the SMS block ----------
await page.goto(base + '/', { waitUntil: 'load' }); await page.waitForTimeout(800);
await page.evaluate(() => document.querySelector('#sms-home-form').scrollIntoView()); await page.waitForTimeout(800);
const smsDefaults = await page.evaluate(() => ({ c1: document.querySelector('#sms-home-c1').checked, c2: document.querySelector('#sms-home-c2').checked, placeholder: document.querySelector('#sms-home-phone').placeholder, label: document.querySelector('label[for=sms-home-phone]').textContent, c2text: document.querySelector('label[for=sms-home-c2]').textContent, terms: document.querySelector('label[for=sms-home-c1] a').getAttribute('href'), privacy: document.querAll ? '' : document.querySelectorAll('label[for=sms-home-c1] a')[1].getAttribute('href') }));
say(`sms defaults: ${JSON.stringify(smsDefaults)}`);
await page.click('#sms-home-form button[type=submit]'); await page.waitForTimeout(500);
say(`sms empty submit errors: ${JSON.stringify(await page.evaluate(() => Array.from(document.querySelectorAll('#sms-home-form [data-err-list] a')).map((a) => a.textContent)))}`);
await page.fill('#sms-home-phone', '12345'); await page.check('#sms-home-c1'); await page.check('#sms-home-c2'); await page.click('#sms-home-form button[type=submit]'); await page.waitForTimeout(500);
say(`sms bad phone: ${JSON.stringify(await page.evaluate(() => Array.from(document.querySelectorAll('#sms-home-form [data-err-list] a')).map((a) => a.textContent)))}`);
await page.fill('#sms-home-phone', '(303) 555-0100'); await page.click('#sms-home-form button[type=submit]'); await page.waitForTimeout(600);
say(`sms success: "${await page.evaluate(() => (document.querySelector('#sms-home-form .sms-status--done') || {}).textContent)}"`);
await shot('sms-success');

// ---------- the 404 and the hooks ----------
const r404 = await page.goto(base + '/nope/nothing-here', { waitUntil: 'load' });
say(`404 status: ${r404.status()} title: ${await page.title()}`);
await page.goto(base + '/terms', { waitUntil: 'load' });
say(`/terms canonical: ${await page.evaluate(() => document.querySelector('link[rel=canonical]').href)} title: ${await page.title()}`);
const arcLogs = [];
page.on('console', (m) => { if (m.text().startsWith('qa:arc')) arcLogs.push(m.text()); });
await page.goto(base + '/?qa=arc', { waitUntil: 'load' }); await page.waitForTimeout(1500);
say(`qa:arc -> ${arcLogs.join(' ') || 'none'}`);
const rim = await page.evaluate(() => ({ heroOnScreen: document.querySelector('[data-hero-cta]').getBoundingClientRect().top < innerHeight, navUnrimmed: document.querySelector('[data-nav-tile]').classList.contains('tile--unrimmed') }));
say(`nav tile at top: ${JSON.stringify(rim)}`);
await page.evaluate(() => window.scrollTo(0, innerHeight * 3)); await page.waitForTimeout(1200);
say(`nav tile after scroll: ${JSON.stringify(await page.evaluate(() => ({ navUnrimmed: document.querySelector('[data-nav-tile]').classList.contains('tile--unrimmed'), thin: document.querySelector('.hdr').classList.contains('hdr--thin') })))}`);
await page.goto(base + '/?qa=rm', { waitUntil: 'load' }); await page.waitForTimeout(800);
say(`qa:rm -> rm class ${await page.evaluate(() => document.documentElement.classList.contains('rm'))}, canvas display ${await page.evaluate(() => getComputedStyle(document.querySelector('[data-canvas]')).display)}, rm poster ${await page.evaluate(() => getComputedStyle(document.querySelector('[data-poster-rm]')).display)}`);
await shot('home-rm');
if (errors.length) say('PAGE ERRORS: ' + [...new Set(errors)].join(' || '));
fs.writeFileSync(`${out}/flows-${W}.log`, log.join('\n'));
await browser.close();
