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
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

function pagefind() {
  return {
    name: "pagefind",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const targetDir = fileURLToPath(dir);
        const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
        console.log(`\n[pagefind] Running pagefind on ${targetDir}`);

        await new Promise((resolve, reject) => {
          const p = spawn(cmd, ["pagefind", "--site", targetDir], {
            stdio: "inherit",
            shell: true,
          });
          p.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Pagefind failed with code ${code}`));
          });
          p.on('error', (err) => reject(err));
        });
      },
    },
  };
}

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
  integrations: [
    sitemap({
      serialize: (item) => {
        const url = new URL(item.url);
        if (url.pathname === '/') {
          // Root URL should have trailing slash
          return { ...item, url: SITE_URL_WITH_SLASH };
        }
        if (url.pathname.endsWith('/')) {
          url.pathname = url.pathname.slice(0, -1);
          item.url = url.toString();
        }
        return item;
      },
    }),
    umami({ id: "bf4c21de-cf9b-4ad4-8661-190c35f41b3f" }),
    pagefind()
  ],

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