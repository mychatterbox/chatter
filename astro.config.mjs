import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import markdoc from "@astrojs/markdoc";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://chatter.kr',

  trailingSlash: "never", // URL 끝의 `/` 제거
  build: {
    format: 'directory', // build.format을 'file'로 설정
  },
  integrations: [
    svelte(),
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