import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import FlexokiDark from "/src/styles/Flexoki-Dark-color-theme.json";
import FlexokiLight from "/src/styles/Flexoki-Light-color-theme.json";
import umami from "@yeskunall/astro-umami";

export default defineConfig({
  site: 'https://chatter.kr/',

  image: {
    responsiveStyles: true,
    layout: 'constrained',
  },

  trailingSlash: "never",

  build: {
    format: "preserve",
  },
  integrations: [
    tailwind(),
    sitemap({
      filter: (p) => !p.includes("/draft/"),
    }),
    umami({ id: "4811eb93-de23-464b-a636-82f4ab7af5b9" }),
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
  // wrap: true,
  scopedStyleStrategy: "where",
});
