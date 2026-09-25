// The shared page shell: head, header (the usher's strip), footer (the wallet at rest), the SMS block, toasts.
import fs from 'node:fs';
import path from 'node:path';
import { esc, attr, kitSvg, cardMark, readMedia, PUBLIC, publicExists, scopeSvg, iconSprite } from '../lib/html.mjs';

export const ORIGIN = 'https://yourcashpass.com';
export const ADDRESS = '1125 17th Street, Suite 1275, Denver, CO 80202';
export const PHONE = '[INSERT PHONE HERE]';
export const EMAIL = 'support@yourcashpass.com';

export const NAV = [
  ['How it works', '/how-it-works'],
  ['The app', '/product'],
  ['Plans', '/plans'],
  ['Find your plan', '/quiz'],
  ['Blog', '/blog'],
  ['About', '/about']
];

function readPublic(rel) {
  try { return fs.readFileSync(path.join(PUBLIC, rel), 'utf8'); } catch (e) { return ''; }
}

export function brandLockup(cls = '') {
  // The reversed lockup from the kit when it exists; the lockup drawn from the kit geometry and the wordmark face otherwise.
  const svg = readMedia('kit/logo-reversed.svg');
  if (svg) {
    const scoped = scopeSvg(svg.replace(/<\?xml[^>]*>/, ''), 'lk' + (cls || 'x').replace(/[^a-z]/g, ''));
    return `<span class="lockup ${cls}">${scoped.replace(/\s(role|aria-label)="[^"]*"/g, '').replace('<svg', '<svg class="lockup-svg" aria-hidden="true" focusable="false"')}</span>`;
  }
  return `<span class="lockup lockup-drawn ${cls}"><svg class="lockup-mark" viewBox="0 0 64 56" width="28" height="24" aria-hidden="true" focusable="false"><defs><radialGradient id="lkp-${cls || 'g'}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#E9F1F8" stop-opacity=".35"/><stop offset="1" stop-color="#E9F1F8" stop-opacity="0"/></radialGradient></defs><ellipse cx="32" cy="40" rx="28" ry="7" fill="url(#lkp-${cls || 'g'})"/><rect x="12" y="14" width="40" height="25" rx="3" fill="#E9F1F8"/><rect x="17" y="33" width="9" height="2" fill="#2E0B0C"/><rect x="12" y="41" width="40" height="10" rx="3" fill="#E9F1F8" opacity=".14"/></svg><span class="lockup-word">Cash Pass</span></span>`;
}

export function head({ title, description, path: route, ogType = 'website', canonical, extraCss = '', preload = [], noindex = false }) {
  const canon = canonical || route;
  const fontsCss = readPublic('assets/fonts/fonts.css');
  const critical = readPublic('assets/css/critical.css');
  const siteTitle = title;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(siteTitle)}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${ORIGIN}${canon}">
<meta property="og:site_name" content="Cash Pass">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${ORIGIN}${canon}">
<meta property="og:image" content="${ORIGIN}/assets/media/og-share.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Cash Pass: which card to tap, told to you at the till, in one line. A phone's cool light on black glass over dark red leather.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(description)}">
<meta name="twitter:image" content="${ORIGIN}/assets/media/og-share.png">
<meta name="theme-color" content="#2E0B0C">
<meta name="color-scheme" content="dark">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/familjen-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
${preload.map(p => `<link rel="preload" href="${attr(p.href)}" as="${attr(p.as)}"${p.type ? ` type="${attr(p.type)}"` : ''}${p.fetchpriority ? ` fetchpriority="${p.fetchpriority}"` : ''}>`).join('\n')}
<script>(function(){var h=document.documentElement;h.className+=' js';var q=location.search;var rm=/[?&]qa=rm(&|$)/.test(q)||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);if(rm)h.className+=' rm';var coarse=window.matchMedia&&matchMedia('(pointer: coarse)').matches;if(coarse||innerWidth<900)h.className+=' touch';if(/[?&]qa=arc(&|$)/.test(q))h.className+=' qa-arc';try{var c=JSON.parse(localStorage.getItem('cashpass.cart'));if(c&&c.plan)h.className+=' has-cart';}catch(e){}})();</script>
<style>${fontsCss}</style>
<style>${critical}</style>
<link rel="stylesheet" href="/assets/css/site.css">
${extraCss ? `<style>${extraCss}</style>` : ''}
</head>`;
}

export function header({ route, navCta = 'auto' }) {
  const links = NAV.map(([label, href]) => {
    const current = route === href || (href !== '/' && route.startsWith(href + '/'));
    return `<li><a href="${href}"${current ? ' aria-current="page"' : ''}>${esc(label)}</a></li>`;
  }).join('');
  return `<a class="skip" href="#content">Skip to content</a>
<header class="hdr" data-nav-cta="${navCta}">
  <div class="hdr-in">
    <a class="brand" href="/" aria-label="Cash Pass, home">${brandLockup('hdr-lockup')}</a>
    <nav class="hdr-nav" aria-label="Primary"><ul class="hg">${links}</ul></nav>
    <div class="hdr-right">
      <a class="cart-link" href="/cart" aria-label="Cart, empty" data-cart-link>${cardMark('cart-mark')}<span class="cart-count" data-cart-count hidden></span></a>
      <a class="tile tile--nav tile--unrimmed" href="/cart?add=pass" data-add-plan="pass" data-nav-tile>Buy Pass</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-open>Menu</button>
    </div>
  </div>
  <div class="menu" id="mobile-menu" hidden data-menu>
    <div class="menu-in">
      <div class="menu-top"><span class="menu-word">Cash Pass</span><button class="menu-close" type="button" data-menu-close>Close</button></div>
      <ul class="menu-links">${links}</ul>
      <div class="menu-cta"><a class="tile" href="/cart?add=pass" data-add-plan="pass">Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span></div>
    </div>
  </div>
</header>`;
}

export function smsBlock({ id = 'sms', level = 3, lead = true, rimmed = false, cls = '', leadIcon = '' }) {
  const H = `h${level}`, HE = `h${Math.min(6, level + 1)}`;
  return `<section class="sms ${cls}" aria-labelledby="${id}-heading" data-sms>
${lead ? `<p class="sms-lead">${leadIcon}<span>${'Texts from Cash Pass: the reminder before each rotating quarter opens, renewal notices, receipts and plan news.'}</span></p>` : ''}
<form class="sms-form" id="${id}-form" novalidate data-sms-form>
  <${H} class="sms-heading" id="${id}-heading">Join Our SMS List</${H}>
  <div class="err-summary" role="alert" tabindex="-1" hidden data-err-summary>
    <${HE} class="err-title">There is a problem</${HE}>
    <p class="err-lead" data-err-lead>Fix the item below to continue.</p>
    <ul class="err-list" data-err-list></ul>
  </div>
  <div class="field" data-field>
    <label class="label" for="${id}-phone">Your Phone Number</label>
    <input class="input" id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Your Phone Number" data-validate="sms-phone">
    <p class="field-err" id="${id}-phone-err" hidden></p>
  </div>
  <div class="field field--check" data-field>
    <input class="check" id="${id}-c1" name="consent_terms" type="checkbox" data-validate="sms-c1">
    <label class="check-label" for="${id}-c1">I agree to the <a href="/terms-of-service">Terms</a> &amp; <a href="/privacy-policy">Privacy Policy</a></label>
    <p class="field-err" id="${id}-c1-err" hidden></p>
  </div>
  <div class="field field--check" data-field>
    <input class="check" id="${id}-c2" name="consent_sms" type="checkbox" data-validate="sms-c2">
    <label class="check-label" for="${id}-c2">I agree to receive SMS marketing notifications from Cash Pass. Reply HELP for help or call/email [INSERT PHONE HERE] / support@yourcashpass.com STOP to cancel. Msg &amp; data rates may apply. Msg frequency varies. Information gathered in the SMS campaign will not be shared with third parties or affiliates for marketing purposes. Read our <a href="/terms-of-service">Terms</a> and <a href="/privacy-policy">Privacy Policy</a>.</label>
    <p class="field-err" id="${id}-c2-err" hidden></p>
  </div>
  <div class="sms-actions"><button class="tile ${rimmed ? '' : 'tile--unrimmed'}" type="submit">Submit</button></div>
  <p class="sms-status" role="status" aria-live="polite" data-sms-status></p>
</form>
</section>`;
}

export function footer({ route, unrimmed = false }) {
  const marks = [0, 1, 2, 3, 4].map(i => `<span class="fcard${i === 3 ? ' fcard--lit' : ''}" data-fcard>${cardMark('fcard-mark')}</span>`).join('');
  return `<footer class="ftr" data-footer>
  <div class="ftr-in">
    <div class="ftr-row1">
      <div class="ftr-brand">
        <a class="brand brand--ftr" href="/" aria-label="Cash Pass, home">${brandLockup('ftr-lockup')}</a>
        <p class="ftr-sentence">A card picker for the phone you already carry, naming which of your own cards to tap and why, in one line.</p>
      </div>
      <div class="ftr-cta"><a class="tile ${unrimmed ? 'tile--unrimmed' : ''}" href="/cart?add=pass" data-add-plan="pass">Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span></div>
    </div>
    <div class="ftr-row2">
      <nav class="ftr-group" aria-labelledby="ftr-g1"><h2 class="ftr-h" id="ftr-g1">Cash Pass</h2><ul class="hg"><li><a href="/how-it-works">How it works</a></li><li><a href="/product">The app</a></li><li><a href="/plans">Plans</a></li><li><a href="/quiz">Find your plan</a></li></ul></nav>
      <nav class="ftr-group" aria-labelledby="ftr-g2"><h2 class="ftr-h" id="ftr-g2">Read</h2><ul class="hg"><li><a href="/blog">Blog</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul></nav>
      <nav class="ftr-group" aria-labelledby="ftr-g3"><h2 class="ftr-h" id="ftr-g3">Legal</h2><ul class="hg"><li><a href="/privacy-policy">Privacy Policy</a></li><li><a href="/terms-of-service">Terms of Service</a></li></ul></nav>
      <div class="ftr-group ftr-contact"><h2 class="ftr-h">Contact</h2><address class="ftr-address"><span class="ftr-line">${esc(ADDRESS)}</span><span class="ftr-line">${esc(PHONE)}</span><a class="ftr-line" href="mailto:${EMAIL}">${EMAIL}</a></address></div>
    </div>
    <div class="ftr-row3">${smsBlock({ id: 'sms-footer', level: 2, lead: true, rimmed: false, cls: 'sms--footer' })}</div>
    <div class="ftr-row4">
      <p class="ftr-closing">One card stays lit.</p>
      <div class="glass-strip" aria-hidden="true"><div class="fcards">${marks}</div><div class="glass-reflect"></div></div>
    </div>
    <div class="ftr-row5">
      <p class="ftr-small">Rewards are set and paid by your card issuer. Figures on this site are examples.</p>
      <p class="ftr-copy">© 2026 Cash Pass</p>
      <div class="ftr-seal" data-seal>${kitSvg('seal.svg', { cls: 'seal seal--56', size: [56, 56] })}</div>
    </div>
  </div>
</footer>
<div class="toasts" aria-live="polite" data-toasts></div>`;
}

export function scripts({ page = null, flip = false, extra = [] }) {
  const list = [
    '/assets/vendor/gsap/gsap.min.js',
    '/assets/vendor/gsap/ScrollTrigger.min.js',
    '/assets/vendor/gsap/SplitText.min.js',
    ...(flip ? ['/assets/vendor/gsap/Flip.min.js'] : []),
    '/assets/vendor/lenis/lenis.min.js',
    '/assets/js/plans-data.js',
    '/assets/js/site.js',
    ...(page ? [`/assets/js/${page}.js`] : []),
    ...extra
  ];
  return list.map(s => `<script src="${s}" defer></script>`).join('\n');
}

export function page({ route, title, description, ogType, canonical, bodyClass = '', hover = 'light', navCta = 'auto', footerUnrimmed = false, main, script = null, flip = false, extraScripts = [], extraCss = '', preload = [], bodyAttrs = '' }) {
  return `${head({ title, description, path: route, ogType, canonical, extraCss, preload })}
<body class="${bodyClass}" data-route="${attr(route)}" data-hover="${hover}" ${bodyAttrs}>
${iconSprite()}
<div class="grain" aria-hidden="true"></div>
${header({ route, navCta })}
<main id="content" class="main" tabindex="-1">
${main}
</main>
${footer({ route, unrimmed: footerUnrimmed })}
${scripts({ page: script, flip, extra: extraScripts })}
</body>
</html>`;
}
