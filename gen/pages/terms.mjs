import { TERMS } from '../content/legal.mjs';
import { renderLegal } from '../partials/legal.mjs';
export function render() { return renderLegal(TERMS, { route: '/terms-of-service', canonical: '/terms-of-service', description: 'The Cash Pass Terms of Service, including the SMS program terms.' }); }
