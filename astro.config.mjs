import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import FlexokiDark from "./src/styles/themes/Flexoki-Dark-color-theme.json";
import FlexokiLight from "./src/styles/themes/Flexoki-Light-color-theme.json";
import umami from "@yeskunall/astro-umami";
import { transformerFileName } from "./src/utils/fileName.js";
import { 
  transformerNotationDiff, 
  transformerNotationHighlight, 
  transformerNotationWordHighlight 
} from "@shikijs/transformers";
import { SITE_URL_WITH_SLASH } from "./src/config/site.ts";


export default defineConfig({
  site: SITE_URL_WITH_SLASH,

  image: {
    responsiveStyles: true,
    layout: 'constrained',
  },

  // trailingSlash: "always",

  build: {
    format: "preserve",
  },
  integrations: [sitemap({
  serialize: (item) => {
    const url = new URL(item.url);
    if (url.pathname !== '/' && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      item.url = url.toString();
    }
    return item;
  },
})
, umami({ id: "bf4c21de-cf9b-4ad4-8661-190c35f41b3f" }),],

  markdown: {
    shikiConfig: {
      themes: {
        light: FlexokiLight,
        dark: FlexokiDark,
      },
      defaultColor: false,
      transformers: [
        transformerFileName(),
      ],
    },
  },
  scopedStyleStrategy: "where",
});