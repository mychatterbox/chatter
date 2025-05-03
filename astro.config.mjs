import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import FlexokiDark from "/src/styles/Flexoki-Dark-color-theme.json";
import FlexokiLight from "/src/styles/Flexoki-Light-color-theme.json";

export default defineConfig({
  site: "https://chatter.kr/",

  // trailingSlash: "never",
  build: {
    format: "preserve",
    inlineStylesheets: 'never',
  },
  integrations: [
    tailwind(),
    sitemap({
      filter: (p) => !p.includes("/draft/"),
    }),
    purgecss({
      fontFace: true,
      keyframes: false,
      safelist: {
        greedy: [
          /*astro*/
        ]
      },
      blocklist: ['usedClass', /^nav-/],
      content: [
        process.cwd() + '/src/**/*.{astro,vue}' // Watching astro and vue sources (read SSR docs below)
      ],
      extractors: [
        {
          // Example using a tailwindcss compatible class extractor
          extractor: (content) =>
            content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
          extensions: ['astro', 'html']
        }
      ]
    }),
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
