import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const posts = await getCollection("blog", ({ id }) => !id.startsWith("draft/"));
  const site = context.site ?? "https://chatter.kr";

  return rss({
    title: "mychatterbox",
    description: "이런 것도 팁이 되나 싶은 정보들",
    site,
    items: posts.map((post) => {
      const cleanLink = `${site}/${post.id}`.replace(/\/$/, "");
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: cleanLink,
      };
    }),
    customData: `
      <language>ko-kr</language>
      <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
    `,
  });
};
