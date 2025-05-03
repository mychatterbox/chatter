import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import FlexokiDark from "/src/styles/Flexoki-Dark-color-theme.json";
import FlexokiLight from "/src/styles/Flexoki-Light-color-theme.json";
import critters from '@critters-rs/astro';

export default defineConfig({
  site: "https://chatter.kr/",

  // trailingSlash: "never",
  build: {
    format: "preserve",
  },
  integrations: [
    tailwind(),
    sitemap({
      filter: (p) => !p.includes("/draft/"),
    }),
    [critters()],
  ],

  markdown: {
    shikiConfig: {
      themes: {
        // light: 'vitesse-light',
        light: FlexokiLight,
        // dark: 'vitesse-dark',
        dark: FlexokiDark,
      },
      // defaultColor: false,
    },
  },
  wrap: true,
  scopedStyleStrategy: "where",
  output: "static",
});
