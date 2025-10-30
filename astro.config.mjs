import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import FlexokiDark from "./src/styles/Flexoki-Dark-color-theme.json";
import FlexokiLight from "./src/styles/Flexoki-Light-color-theme.json";
import umami from "@yeskunall/astro-umami";
import { imageService } from "@unpic/astro/service";

export default defineConfig({
  site: 'https://chatter.kr/',

  image: {
    responsiveStyles: true,
    layout: 'constrained',
    service: imageService({
      placeholder: "blurhash",
      // layout: "constrained",
      priority: true,
    }
    ),
  },

  trailingSlash: "never",

  build: {
    format: "preserve",
  },
  integrations: [
    sitemap({
      filter: (p) => !p.includes("/draft/"),
    }),
    umami({ id: "4811eb93-de23-464b-a636-82f4ab7af5b9" }),
  ],

  markdown: {
    shikiConfig: {
      themes: {
        light: FlexokiLight,
        dark: FlexokiDark,
      },
    },
  },
  
  scopedStyleStrategy: "where",
});