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

  trailingSlash: "never",

  build: {
    format: "preserve",
  },
  integrations: [
    sitemap({
      filter: (p) => !p.includes("/draft/"),
      serialize: (item) => {
        // URL 객체로 파싱
        const url = new URL(item.url);
        
        // 경로가 루트(/)인 경우에만 trailing slash 추가
        if (url.pathname === '/' || url.pathname === '') {
          item.url = url.origin + '/';
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