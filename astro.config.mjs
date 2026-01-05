import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import FlexokiDark from "./src/styles/themes/Flexoki-Dark-color-theme.json";
import FlexokiLight from "./src/styles/themes/Flexoki-Light-color-theme.json";
import umami from "@yeskunall/astro-umami";

import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight
} from "@shikijs/transformers";
import { SITE_URL_WITH_SLASH } from "./src/config/site.ts";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Callouts } from "./src/utils/callouts.js";
import { transformerFileName } from "./src/utils/transformer-file-name.js";
import { addAnchorLinks } from "./src/utils/heading-anchor-links.js";

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
  // image: {
  //   responsiveStyles: true,
  //   layout: 'constrained',
  // },
  build: {
    format: "preserve",
  },
  
  integrations: [
    sitemap({
      serialize: (item) => {
        const url = new URL(item.url);
        if (url.pathname === '/') {
          return { ...item, url: SITE_URL_WITH_SLASH };
        }
        if (/^\/(tag|kind)\/[^/]+\/1\/?$/.test(url.pathname)) {
          return null;
        }
        if (url.pathname.endsWith('/')) {
          url.pathname = url.pathname.slice(0, -1);
          item.url = url.toString();
        }
        return item;
      },
    }),
    umami({ id: "4811eb93-de23-464b-a636-82f4ab7af5b9" }),
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
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerFileName(),
      ],
    },
      rehypePlugins: [addAnchorLinks],
      remarkPlugins: [Callouts],
  },
  
  scopedStyleStrategy: "where",
});