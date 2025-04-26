import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const posts = await getCollection("blog", ({ id }) => !id.startsWith("draft/"));
  
  const site = context.site;
  const siteUrl = site ? new URL(site).origin : "https://chatter.kr";

  return rss({
    title: "mychatterbox",
    description: "이런 것도 팁이 되나 싶은 정보들",
    site: siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: new URL(post.id, siteUrl).href, // id를 직접 사용
    })),
    customData: `<language>ko-kr</language>`,
  });
};

