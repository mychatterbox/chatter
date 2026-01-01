import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { SITE_URL_WITH_SLASH } from "../config/site";

export const GET: APIRoute = async (context) => {
  const posts = await getCollection("blog", ({ id }) => !id.startsWith("draft/"));

  const siteUrl = SITE_URL_WITH_SLASH;

  // 현재 요청의 URL을 사용하여 실제 RSS 피드 위치 결정
  const rssPath = context.url.pathname;
  const rssUrl = new URL(rssPath, siteUrl).href;

  return rss({
    title: "mychatterbox",
    description: "자잘한 팁과 정보",
    site: siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: new URL(post.id, siteUrl).href.replace(/\.html$/, ''),
    })),
    customData: `
      <language>ko-kr</language>
      <atom:link href="${rssUrl}" rel="self" type="application/rss+xml" />
    `,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom"
    }
  });
};