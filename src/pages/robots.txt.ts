import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  // site 설정이 없을 경우 fallback
  const base = site ?? "https://chatter.kr";
  const sitemapIndex = new URL("sitemap-index.xml", base).href;

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapIndex}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    },
  });
};
