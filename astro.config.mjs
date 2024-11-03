import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwind from '@astrojs/tailwind';

import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  integrations: [
    solidJs(),
    tailwind({
      applyBaseStyles: true
    })
  ],
  output: 'hybrid',
  adapter: netlify()
});
