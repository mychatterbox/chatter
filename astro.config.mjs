import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import markdoc from "@astrojs/markdoc";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel/static";

// https://astro.build/config
export default defineConfig({
  site: "https://chatter.kr",
  trailingSlash: "never",
  integrations: [
    svelte(),
    tailwind(),
    markdoc(),
    sitemap({
      filter: (p) => !p.includes("/draft/"),
    }),
  ],
  output: "static",
  markdown: {
 
    shikiConfig: { theme: 'css-variables' }
  },
  wrap: true,
  scopedStyleStrategy: "where",
  
});
