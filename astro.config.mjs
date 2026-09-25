import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Cash Pass, yourcashpass.com. Server output with the Cloudflare based adapter Webflow Cloud builds from.
// Every page is served by src/pages/[...slug].astro from the generated HTML under src/site/<route>/index.html,
// so no static directory page exists to trigger the trailing slash redirect loop. Static files live under public/assets.
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: 'https://yourcashpass.com',
  trailingSlash: 'ignore',
  build: { assets: 'astro-assets' },
  vite: { build: { assetsInlineLimit: 0 } }
});
