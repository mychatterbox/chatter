import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import FlexokiDark from "./src/styles/Flexoki-Dark-color-theme.json";
import FlexokiLight from "./src/styles/Flexoki-Light-color-theme.json";
import umami from "@yeskunall/astro-umami";

export default defineConfig({
  site: 'https://chatter.kr/',

  image: {
    responsiveStyles: true,
    layout: 'constrained',
  },

  trailingSlash: "always",

  build: {
    format: "preserve",
  },
  integrations: [
  sitemap({
    filter: (p) => !p.includes("/draft/"),
    serialize: (item) => {
      // URL의 pathname이 '/'가 아닌 경우에만 trailing slash 제거
      const url = new URL(item.url);
      if (url.pathname !== '/' && url.pathname.endsWith('/')) {
        url.pathname = url.pathname.slice(0, -1);
        item.url = url.toString();
      }
      return item;
    },
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