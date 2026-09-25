import { page } from '../partials/layout.mjs';
import { fiveCards } from '../partials/components.mjs';
import { picture } from '../lib/html.mjs';

export function render() {
  const main = `<section class="nf band" aria-labelledby="nf-h" data-in="cards-dark">
  <div class="band-bg" aria-hidden="true">${picture('atmos-04', { decorative: true, sizes: '100vw', cls: 'pic--cover', lazy: false })}</div>
  <div class="nf-in">
    ${fiveCards({ lit: -1, cls: 'five--nf' })}
    <div class="nf-copy">
      <h1 class="h1" id="nf-h">No card fits here.</h1>
      <p class="intro">The light went looking and found nothing at this address. The plans are this way.</p>
      <div class="cta-row"><a class="tile" href="/cart?add=pass" data-add-plan="pass" data-hero-cta data-nf-tile>Buy Pass</a><span class="price-line">$59 a year. Cancel any time.</span></div>
      <ul class="nf-links hg"><li><a class="tlink" href="/">Home</a></li><li><a class="tlink" href="/plans">Plans</a></li><li><a class="tlink" href="/how-it-works">How it works</a></li></ul>
    </div>
  </div>
</section>`;
  return page({ route: '/404', canonical: '/404', title: 'No card fits here', description: 'No card fits here. The plans are this way.', bodyClass: 'page-nf', hover: 'dim', main, script: 'notfound' });
}
