import { page, ADDRESS, PHONE, EMAIL } from '../partials/layout.mjs';
import { closeBand, hero } from '../partials/components.mjs';
import { esc, picture, PHOTO_ALT, icon } from '../lib/html.mjs';

const CONTOURS = `<svg class="terrain-svg" viewBox="0 0 1440 420" preserveAspectRatio="none" aria-hidden="true" data-contours>
${[0, 1, 2, 3, 4, 5, 6].map((i) => { const y = 40 + i * 56; return `<path d="M-20 ${y} C 200 ${y + 30 + i * 3}, 380 ${y - 50}, 620 ${y - 10 + i * 5} S 900 ${y + 50 - i * 6}, 1120 ${y - 20} S 1340 ${y + 30}, 1460 ${y}"/>`; }).join('')}
<path d="M480 0 V420" stroke-dasharray="4 8"/><path d="M0 230 H1440" stroke-dasharray="4 8"/>
</svg>`;

// The Reader Ring at rest: the drawn state of the Three.js scene for reduced motion, touch and machines without WebGL.
function readerStill() {
  return `<div class="scene scene--reader" data-scene="reader" aria-hidden="true" data-composed></div>
<div class="reader-still" data-reader-still aria-hidden="true">
  <svg class="reader-svg" viewBox="0 0 520 420" data-composed>
    <defs>
      <radialGradient id="rs-pool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#E9F1F8" stop-opacity=".34"/><stop offset=".45" stop-color="#E9F1F8" stop-opacity=".08"/><stop offset="1" stop-color="#E9F1F8" stop-opacity="0"/></radialGradient>
      <linearGradient id="rs-slab" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4E181A"/><stop offset="1" stop-color="#2E0B0C"/></linearGradient>
      <linearGradient id="rs-edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9F1F8" stop-opacity="0"/><stop offset=".5" stop-color="#E9F1F8" stop-opacity=".5"/><stop offset="1" stop-color="#E9F1F8" stop-opacity="0"/></linearGradient>
    </defs>
    <ellipse class="rs-pool" cx="300" cy="200" rx="230" ry="150" fill="url(#rs-pool)"/>
    <g transform="translate(300 210) skewX(-8)">
      <rect x="-190" y="-96" width="380" height="192" rx="26" fill="url(#rs-slab)"/>
      <rect x="-190" y="-96" width="380" height="192" rx="26" fill="none" stroke="#CDB3AE" stroke-opacity=".28"/>
      <rect x="-172" y="-80" width="344" height="1.5" fill="url(#rs-edge)"/>
      <circle class="rs-ring rs-ring--outer" cx="0" cy="8" r="62" fill="none" stroke="#E9F1F8" stroke-opacity=".9" stroke-width="5"/>
      <circle class="rs-ring rs-ring--inner" cx="0" cy="8" r="40" fill="none" stroke="#E9F1F8" stroke-opacity=".65" stroke-width="3"/>
      <circle cx="0" cy="8" r="9" fill="#E9F1F8" fill-opacity=".85"/>
      <rect x="-172" y="52" width="344" height="1.5" fill="url(#rs-edge)"/>
    </g>
  </svg>
</div>`;
}

function band() {
  return `<section class="band contact-band" aria-label="Contact details" data-in="settle-photo">
  <div class="band-bg">${picture('photo-contact-01', { alt: PHOTO_ALT['photo-contact-01'], sizes: '100vw', cls: 'pic--cover', lazy: false })}</div>
  <div class="band-in">
    <div class="band-copy contact-copy">
      <p class="contact-response">Email is answered within two business days, Monday to Friday, Mountain time. If you're writing to cancel, say so in the subject line and we'll confirm the same way.</p>
      <p class="caption">A counter with a reader and a coffee cup, morning.</p>
    </div>
    <div class="inset-card contact-card" data-contact-card>
      <p class="contact-name">Cash Pass</p>
      <address class="contact-address"><span>1125 17th Street, Suite 1275</span><span>Denver, CO 80202</span><a href="mailto:${EMAIL}">${EMAIL}</a><span>${esc(PHONE)}</span></address>
    </div>
  </div>
</section>`;
}

function mapBand() {
  return `<section class="terrain contact-terrain" aria-label="Downtown Denver" data-in="contours">
  ${CONTOURS}
  <div class="terrain-in"><p class="terrain-caption">Downtown Denver. 17th Street.</p></div>
</section>`;
}

function form() {
  return `<section class="write" aria-labelledby="write-h" data-in="contact-form">
  <div class="write-grid">
    <div class="write-side">
      <h2 class="h2" id="write-h">Write to us</h2>
    </div>
    <form class="write-form" id="contact-form" novalidate data-contact-form>
      <div class="err-summary" role="alert" tabindex="-1" hidden data-err-summary>
        <h3 class="err-title">There is a problem</h3>
        <p class="err-lead" data-err-lead>Fix the item below to continue.</p>
        <ul class="err-list" data-err-list></ul>
      </div>
      <div class="field" data-field><label class="label" for="c-name">Your name <span class="req">(required)</span></label><input class="input" id="c-name" name="name" type="text" autocomplete="name"><p class="field-err" id="c-name-err" hidden></p></div>
      <div class="field" data-field><label class="label" for="c-email">Email address <span class="req">(required)</span></label><input class="input" id="c-email" name="email" type="email" inputmode="email" autocomplete="email"><p class="field-err" id="c-email-err" hidden></p></div>
      <div class="field" data-field><label class="label" for="c-msg">Message <span class="req">(required)</span></label><p class="helper" id="c-msg-help">If it's about your account, tell us the plan you're on.</p><textarea class="textarea" id="c-msg" name="message" rows="6" aria-describedby="c-msg-help" data-desc="c-msg-help"></textarea><p class="field-err" id="c-msg-err" hidden></p></div>
      <div class="cta-row"><button class="tile" type="submit">Send message</button></div>
      <p class="write-status" role="status" aria-live="polite" data-contact-status></p>
    </form>
  </div>
</section>`;
}

export function render() {
  const main = [
    hero({ eyebrow: 'Contact', h1: 'Ask before you buy. Or after.', intro: 'One address, one inbox, one phone. Messages are answered in the order they arrive.', cls: 'hero--contact', extra: readerStill() }),
    band(), mapBand(), form(),
    closeBand({ body: 'Or skip the email. Pass is $59 a year, cancel any time, and the questions can come after.' })
  ].join('\n');
  return page({
    route: '/contact', title: 'Contact Cash Pass',
    description: 'Cash Pass, 1125 17th Street, Suite 1275, Denver, CO 80202. Email support@yourcashpass.com. Answered within two business days.',
    bodyClass: 'page-contact', hover: 'ring', main, script: 'contact', navCta: 'rimmed'
  });
}
