import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const posts = await getCollection("blog", ({ id }) => !id.startsWith("draft/"));
  
  const site = context.site;
  const siteUrl = site ? new URL(site).origin : "https://chatter.kr";
  
  // 현재 요청의 URL을 사용하여 실제 RSS 피드 위치 결정
  const rssPath = context.url.pathname;
  const rssUrl = new URL(rssPath, site || siteUrl).href;

  return rss({
    title: "mychatterbox",
    description: "이런 것도 팁이 되나 싶은 정보들",
    site: siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: new URL(post.id, siteUrl).href,
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