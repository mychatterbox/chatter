import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://chatter.kr',

  trailingSlash: "never", // URL 끝의 `/` 제거
  build: {
    format: 'preserve',
  },
  integrations: [
    tailwind(),
    sitemap({
      filter: (p) => !p.includes("/draft/"),
    }),
  ],

  markdown: {
     shikiConfig: { theme: 'css-variables' }
  },
  wrap: true,
  scopedStyleStrategy: "where",
  output: "static",
});