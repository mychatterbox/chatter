import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import FlexokiDark from "./src/styles/themes/Flexoki-Dark-color-theme.json";
import FlexokiLight from "./src/styles/themes/Flexoki-Light-color-theme.json";

import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight
} from "@shikijs/transformers";
import { SITE_URL_WITH_SLASH } from "./src/config/site.ts";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { Callouts } from "./src/utils/callouts.js";
import { transformerFileName } from "./src/utils/transformer-file-name.js";
import { addAnchorLinks } from "./src/utils/heading-anchor-links.js";

// Generate a map of slugs to lastmod dates for the sitemap
const contentDir = fileURLToPath(new URL('./src/content/blog', import.meta.url));
const routeToLastMod = new Map();

try {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  for (const file of files) {
    const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
    const slugMatch = content.match(/^slug:\s*([^\r\n]+)/m);
    const pubDateMatch = content.match(/^pubDate:\s*([^\r\n]+)/m);
    const updatedDateMatch = content.match(/^updatedDate:\s*([^\r\n]+)/m);

    if (slugMatch) {
      const slug = slugMatch[1].trim();
      let lastMod;
      if (updatedDateMatch) {
        lastMod = new Date(updatedDateMatch[1].trim());
      } else if (pubDateMatch) {
        lastMod = new Date(pubDateMatch[1].trim());
      }

      if (lastMod && !isNaN(lastMod.getTime())) {
        routeToLastMod.set(`/${slug}`, lastMod.toISOString().split('T')[0]);
      }
    }
  }
} catch (error) {
  console.error("Failed to generate lastmod map for sitemap:", error);
}

function pagefind() {
  return {
    name: "pagefind",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const targetDir = fileURLToPath(dir);

        // 1. 사이트맵의 T00:00:00.000Z 제거 (YYYY-MM-DD 형식으로 변경)
        try {
          const files = fs.readdirSync(targetDir).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));
          for (const file of files) {
            const filePath = path.join(targetDir, file);
            let content = fs.readFileSync(filePath, 'utf-8');
            if (content.includes('T00:00:00.000Z')) {
              fs.writeFileSync(filePath, content.replace(/T00:00:00\.000Z/g, ''));
              console.log(`[sitemap] Formatted lastmod dates to YYYY-MM-DD in ${file}`);
            }
          }
        } catch (err) {
          console.error("Failed to format sitemap lastmod:", err);
        }

        // 2. Pagefind 실행
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
  build: {
    format: "preserve",
    inlineStylesheets: 'always',
  },

  integrations: [
    sitemap({
      serialize: (item) => {
        const url = new URL(item.url);
        if (url.pathname === '/') {
          return { ...item, url: SITE_URL_WITH_SLASH };
        }
        if (/^\/\d+\/?$/.test(url.pathname)) {
          return null;
        }
        if (url.pathname.startsWith('/tag') || url.pathname.startsWith('/kind')) {
          return null;
        }
        if (url.pathname === '/ratings' || url.pathname === '/ratings/') {
          return null;
        }
        if (url.pathname.endsWith('/')) {
          url.pathname = url.pathname.slice(0, -1);
          item.url = url.toString();
        }

        const lastmod = routeToLastMod.get(url.pathname);
        if (lastmod) {
          item.lastmod = lastmod;
        }

        return item;
      },
    }),
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
    processor: unified({
      remarkPlugins: [Callouts],
      rehypePlugins: [addAnchorLinks],
    }),
  },

  scopedStyleStrategy: "where",
  vite: {
    resolve: {
      alias: {
        "@ziteh/yangchun-comment-shared": fileURLToPath(new URL("./src/lib/ycc/shared/index.ts", import.meta.url))
      }
    }
  }
});