// Shared HTML helpers for the Cash Pass generator. Every media reference resolves to the paths in
// /home/claude/cashpass/work/MEDIA_PATH_CONTRACT.md (served under /assets/media/). Kit SVGs are inlined when the
// file exists at generation time so they can be animated; otherwise the contract path is referenced directly.
import fs from 'node:fs';
import path from 'node:path';

export const SITE = path.resolve(new URL('..', import.meta.url).pathname, '..');
export const PUBLIC = path.join(SITE, 'public');
export const MEDIA = path.join(PUBLIC, 'assets', 'media');

export function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
export const attr = esc;

export function exists(rel) {
  return fs.existsSync(path.join(MEDIA, rel));
}
export function publicExists(rel) {
  return fs.existsSync(path.join(PUBLIC, rel));
}
export function readMedia(rel) {
  try { return fs.readFileSync(path.join(MEDIA, rel), 'utf8'); } catch (e) { return null; }
}
export function dataUri(rel, mime) {
  try {
    const buf = fs.readFileSync(path.join(MEDIA, rel));
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch (e) { return null; }
}
export function fileSize(rel) {
  try { return fs.statSync(path.join(MEDIA, rel)).size; } catch (e) { return -1; }
}

// Slot table: aspect and contract folder for every laddered still.
const ASPECT = {
  'photo-home-01': [3, 2], 'photo-home-02': [4, 5], 'photo-app-01': [3, 2], 'photo-plans-01': [16, 9],
  'photo-hiw-01': [3, 2], 'photo-quiz-01': [16, 9], 'photo-about-01': [16, 9], 'photo-blog-01': [3, 2],
  'photo-post-rotating': [3, 2], 'photo-post-fees': [3, 2], 'photo-post-coding': [3, 2], 'photo-contact-01': [16, 9],
  'atmos-01': [16, 9], 'atmos-02': [16, 9], 'atmos-03': [16, 9], 'atmos-04': [16, 9], 'atmos-05': [16, 9],
  'hero-post-rotating': [16, 9], 'hero-post-fees': [16, 9], 'hero-post-coding': [16, 9]
};
const FOLDER = (id) => id.startsWith('photo-') ? 'photo' : id.startsWith('atmos-') ? 'atmos' : 'blog';
const LADDER = [640, 1280, 1920, 2560];

export function dims(id, w = 1920) {
  const [a, b] = ASPECT[id] || [16, 9];
  return { w, h: Math.round(w * b / a) };
}

// A laddered photograph: WebP srcset with the 1920 JPEG fallback, explicit width and height, lazy below the fold.
export function picture(id, { alt = '', sizes = '100vw', lazy = true, cls = '', imgCls = '', priority = false, decorative = false } = {}) {
  const folder = FOLDER(id);
  const { w, h } = dims(id);
  const srcset = LADDER.map(x => `/assets/media/${folder}/${id}-${x}.webp ${x}w`).join(', ');
  const loading = lazy ? ' loading="lazy"' : (priority ? ' fetchpriority="high"' : '');
  const altAttr = decorative ? ' alt="" aria-hidden="true"' : ` alt="${attr(alt)}"`;
  return `<picture class="pic ${cls}"><source type="image/webp" srcset="${srcset}" sizes="${attr(sizes)}"><img class="${imgCls}" src="/assets/media/${folder}/${id}.jpg" width="${w}" height="${h}"${altAttr}${loading} decoding="async"></picture>`;
}

// A product shot (HTML built screen on the HTML iPhone frame), 15:29 canvas, 1x and 2x.
export function productShot(id, { alt, lazy = true, cls = '', width = 750 } = {}) {
  const h = Math.round(width * 29 / 15);
  return `<img class="shot ${cls}" src="/assets/media/product/${id}.webp" srcset="/assets/media/product/${id}.webp 1x, /assets/media/product/${id}@2x.webp 2x" width="${width}" height="${h}" alt="${attr(alt)}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
}

export const SHOTS = {
  's1-moment': 'A phone showing the Cash Pass Moment screen: Tap Grocery 6%, with the reason that 6% applies to groceries and $4,140 of the $6,000 yearly cap is used, a quieter runner up row, and an Open in wallet button.',
  's2-rules': 'A phone showing the Cash Pass Rules screen: a list of shops and categories each assigned to a card, with one suggested rule for Lantern Row Cafe waiting for approval.',
  's3-ledger': 'A phone showing the Cash Pass Ledger: $749 net after fees for the year, each card\'s earnings with its annual fee taken off, and a comparison against one flat 2% card.',
  's4-cards': 'A phone showing the Cash Pass Cards screen: five plain card tiles with nicknames, rates, last four digits, cap bars and fees, the Grocery 6% tile lit as the recommended one.',
  's5-quarter': 'A phone showing the Cash Pass Quarter screen: Q4 opens Oct 1, the Rotating 5% card, this quarter\'s categories, three quarters already activated, and a Mark activated button.',
  's6-household': 'A phone showing the Cash Pass Household view: $1,506 net after fees across five people, a line per person, and a note that the house sees totals, never transactions.',
  's7-till': 'A phone showing the Cash Pass Till screen at Lantern Row Cafe: Tap Everyday 4%, because the cafe codes as Dining and the Grocery 6% cap was reached on Oct 14.',
  's8-connect': 'A phone showing the Cash Pass Connect a card screen: Read only, by design, an explanation that Cash Pass receives a token and never a password, and a Connect read only button.',
  'family': 'Three phones standing on black glass under one cool light, showing the Cash Pass Moment, Ledger and Rules screens.'
};

export const PHOTO_ALT = {
  'photo-home-01': 'Five plain cards lie face down on dark red leather; one is turned face up and catches a cool light.',
  'photo-home-02': 'A hand rests on a dark cafe counter beside a phone whose screen throws a cool light, with a card reader out of focus behind.',
  'photo-app-01': 'Three phones stand on black glass with their screens dark, a cool light catching their edges.',
  'photo-plans-01': 'Three blank cards stand on black glass; the middle one is lit by a cool light and the other two sit in shadow.',
  'photo-hiw-01': 'A phone lies face down on a cafe table beside a small folded receipt, with a card reader out of focus behind.',
  'photo-quiz-01': 'A single blank card stands in a pool of cool light on black glass, everything around it dark.',
  'photo-about-01': 'Downtown Denver\'s towers at dusk seen from street level on 17th Street.',
  'photo-blog-01': 'A phone lies on a car\'s passenger seat at night with the cool light of a fuel station canopy across it.',
  'photo-post-rotating': 'A blank card on black glass is cut in half by a hard edge of cool light, one side lit and the other in shadow.',
  'photo-post-fees': 'A lit card stands on black glass, its reflection cut short by a matte strip laid across the glass.',
  'photo-post-coding': 'A night street with a supermarket\'s glass doors glowing at left and a cafe window glowing a few steps on, reflected in wet pavement.',
  'photo-contact-01': 'A card reader and a white coffee cup on a cafe counter in soft morning light.',
  'atmos-01': 'A phone lies face up on black glass, its cool glow spilling onto dark red leather.',
  'atmos-02': 'The edge of a black glass slab catches a thin line of cool light in close up.',
  'atmos-03': 'Dark red leather grain in close up under a cool raking light.',
  'atmos-04': 'A card reader\'s light ring glows softly out of focus on a dark field.',
  'atmos-05': 'Five unlit cards stand in near darkness on black glass.',
  'hero-post-rotating': 'Four blank cards in a two by two grid on dark leather, a phone\'s cool glow lighting one of them most.',
  'hero-post-fees': 'A lit card stands on black glass while a second card lies flat in shadow in front of it.',
  'hero-post-coding': 'Along a dark cafe counter, a card reader\'s light ring glows out of focus and a supermarket lane glows through the window behind.'
};

// Video element: muted, playsinline, loop, preload metadata, poster, the mobile encode swapped in by the site script.
export function video(id, { alt, w = 1920, h = 1080, cls = '' } = {}) {
  return `<video class="vid ${cls}" muted playsinline loop preload="none" width="${w}" height="${h}" poster="/assets/media/video/${id}-poster.webp" aria-hidden="true" tabindex="-1" data-mobile-src="/assets/media/video/${id}-mobile.mp4">
<source src="/assets/media/video/${id}.webm" type="video/webm"><source src="/assets/media/video/${id}.mp4" type="video/mp4"></video><p class="vh">${esc(alt)}</p>`;
}

// The card glyph from the kit motif (viewBox 0 0 64 56: a 40 by 25 rounded rectangle at 12,14 with a 9 by 2 digits bar at 17,33).
export function cardMark(cls = '') {
  return `<svg class="mark ${cls}" viewBox="12 14 40 25" width="12" height="8" aria-hidden="true" focusable="false"><rect class="mark-card" x="12.9" y="14.9" width="38.2" height="23.2" rx="3"/><rect class="mark-bar" x="17" y="33" width="9" height="2" rx="1"/></svg>`;
}

// Inline a kit SVG when it exists, otherwise reference the contract path as an image. Ids are scoped per instance
// (gradients, masks and parts) and each part keeps its original id in data-part so scripts can find it.
let SCOPE = 0;
export function scopeSvg(svg, prefix) {
  const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  let out = svg;
  for (const id of ids) {
    const nid = `${id}-${prefix}`;
    out = out.split(`id="${id}"`).join(`id="${nid}" data-part="${id}"`);
    out = out.split(`url(#${id})`).join(`url(#${nid})`);
    out = out.split(`href="#${id}"`).join(`href="#${nid}"`);
  }
  return out;
}
export function kitSvg(file, { cls = '', alt = '', decorative = true, size = null } = {}) {
  const src = readMedia(`kit/${file}`);
  const wh = size ? ` width="${size[0]}" height="${size[1]}"` : '';
  if (src) {
    let svg = src.replace(/<\?xml[^>]*>/, '').replace(/<!DOCTYPE[^>]*>/, '').trim();
    svg = scopeSvg(svg, 'k' + (++SCOPE));
    svg = svg.replace(/\s(role|aria-label|aria-hidden|focusable)="[^"]*"/g, '');
    svg = svg.replace('<svg', `<svg class="kit ${cls}"${decorative ? ' aria-hidden="true" focusable="false"' : ` role="img" aria-label="${attr(alt)}"`}${wh}`);
    return svg;
  }
  return `<img class="kit kit-img ${cls}" src="/assets/media/kit/${file}"${wh} alt="${decorative ? '' : attr(alt)}"${decorative ? ' aria-hidden="true"' : ''} decoding="async">`;
}

// A blog diagram: inlined with its parts addressable by data-part, or referenced by path with its alt.
export function blogSvg(file, alt, cls = '') {
  const src = readMedia(`blog/${file}`);
  if (src) {
    let svg = src.replace(/<\?xml[^>]*>/, '').trim();
    svg = scopeSvg(svg, 'b' + (++SCOPE));
    svg = svg.replace(/\s(role|aria-label)="[^"]*"/g, '');
    svg = svg.replace('<svg', `<svg class="diagram ${cls}" role="img" aria-label="${attr(alt)}"`);
    return svg;
  }
  return `<img class="diagram diagram-img ${cls}" src="/assets/media/blog/${file}" width="720" height="480" alt="${attr(alt)}" loading="lazy" decoding="async">`;
}

// The icon sprite, inlined once per page; the sprite's page wide colour rule is dropped so it only styles the icons.
export function iconSprite() {
  const src = readMedia('kit/icons.svg');
  if (!src) return '';
  return src.replace(/<\?xml[^>]*>/, '').replace('svg{color:#CDB3AE}', '').replace('.is-lit{color:#E9F1F8}', '.ic.is-lit{color:#E9F1F8}').replace('<svg', '<svg class="sprite"');
}

let ICON_IDS = null;
function iconIds() {
  if (ICON_IDS) return ICON_IDS;
  ICON_IDS = {};
  const j = readMedia('kit/icons.json');
  if (j) {
    try {
      const parsed = JSON.parse(j);
      const list = Array.isArray(parsed) ? parsed : (parsed.icons || parsed.ids || []);
      for (const it of list) {
        const id = typeof it === 'string' ? it : it.id;
        const name = typeof it === 'string' ? it : (it.name || it.id);
        if (!id) continue;
        ICON_IDS[String(name).toLowerCase().replace(/^icon-/, '').replace(/[\s_]+/g, '-')] = id;
      }
    } catch (e) { /* ignore a malformed list */ }
  }
  return ICON_IDS;
}
// A kit icon by name (card, phone, reader, rule, quarter, cap, ledger, token, household, wallet-link, tick, cart, light).
export function icon(name, cls = '') {
  const ids = iconIds();
  const id = ids[name] || ids[name.replace('-', '')] || name;
  const local = exists('kit/icons.svg');
  return `<svg class="ic ${cls}" width="20" height="20" aria-hidden="true" focusable="false"><use href="${local ? '' : '/assets/media/kit/icons.svg'}#${attr(id)}"></use></svg>`;
}

export function words(text) {
  // Word wrapped copy for the hover treatments that act on words; the original text stays in aria-label.
  return `<span class="ww" aria-label="${attr(text)}">${text.split(' ').map(w => `<span class="w">${esc(w)}</span>`).join(' ')}</span>`;
}

// The "$" and "%" treatment: 85 percent size, raised 8 percent, tabular figures.
export function figure(text) {
  return `<span class="fig">${esc(text).replace(/(\$|%)/g, '<span class="sym">$1</span>')}</span>`;
}
