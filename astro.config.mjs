import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

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
     shikiConfig: { 
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      // defaultColor: false,
    },

},
  wrap: true,
  scopedStyleStrategy: "where",
  output: "static",
});