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
        const url = new URL(item.url);

        // 끝 슬래시 제거 후, 루트만 슬래시 유지
        const pathname = url.pathname.replace(/\/$/, "");
        let formattedUrl = `${url.origin}${pathname}`;
        if (pathname === "") formattedUrl = `${url.origin}/`;

        return {
          ...item,
          url: formattedUrl, // 문자열 그대로 반환 (URL 객체로 변환 금지)
        };
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