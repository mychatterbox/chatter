import { defineConfig } from "astro/config";
import markdoc from "@astrojs/markdoc";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://chatter.kr',

  trailingSlash: "never", // URL 끝의 `/` 제거
  build: {
    format: 'preserve', // build.format을 'file'로 설정
  },
  integrations: [
    tailwind(),
    markdoc(),
    sitemap({
      filter: (p) => !p.includes("/draft/"),
    }),
  ],

  markdown: {
     shikiConfig: { theme: 'css-variables' }
  },
  wrap: true,
  scopedStyleStrategy: "where",
  output: "static",
});