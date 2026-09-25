import { PRIVACY } from '../content/legal.mjs';
import { renderLegal } from '../partials/legal.mjs';
export function render() { return renderLegal(PRIVACY, { route: '/privacy-policy', canonical: '/privacy-policy', description: 'The Cash Pass Privacy Policy, including how mobile information is handled.' }); }
