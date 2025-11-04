import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import FlexokiDark from "./src/styles/Flexoki-Dark-color-theme.json";
import FlexokiLight from "./src/styles/Flexoki-Light-color-theme.json";
import umami from "@yeskunall/astro-umami";

export default defineConfig({
  site: "https://chatter.kr/",

  image: {
    responsiveStyles: true,
    layout: "constrained",
  },

  build: {
    format: "preserve",
  },

  integrations: [
    sitemap({
      filter: (p) => !p.includes("/draft/"),
      serialize: (item) => {
        const url = new URL(item.url);

        // ✅ 루트('/')는 항상 유지
        if (url.pathname === "") {
          url.pathname = "/";
        }

        // ✅ 나머지는 trailing slash 제거
        if (url.pathname !== "/" && url.pathname.endsWith("/")) {
          url.pathname = url.pathname.slice(0, -1);
        }

        item.url = url.toString();
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
