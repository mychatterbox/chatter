import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ request, site }) => {
  // HTTP 요청 차단 (Cloudflare Workers는 request.url에 전체 URL 포함)
  if (request.url.startsWith('http://')) {
    return new Response(null, {
      status: 301,
      headers: { 
        'Location': request.url.replace('http://', 'https://'),
        'Cache-Control': 'public, max-age=86400' // 24시간 캐시
      }
    });
  }

  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};