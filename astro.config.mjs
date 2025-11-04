import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import FlexokiDark from "./src/styles/Flexoki-Dark-color-theme.json";
import FlexokiLight from "./src/styles/Flexoki-Light-color-theme.json";
import umami from "@yeskunall/astro-umami";

export default defineConfig({
  site: "https://chatter.kr",
  trailingSlash: "never", // ✅ 모든 경로에서 슬래시 제거
  build: {
    format: "file",
  },

  integrations: [
sitemap({
  filter: (p) => !p.includes("/draft/"),
  serialize: (item) => {
    const url = new URL(item.url);

    // ✅ 루트 경로 보정
    if (url.pathname === "" || url.pathname === "/index.html") {
      url.pathname = "/";
    }

    // ✅ /로 끝나는 경로는 슬래시 제거
    else if (url.pathname !== "/" && url.pathname.endsWith("/")) {
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
