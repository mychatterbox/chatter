import rss, { type RSSOptions } from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: RSSOptions) {
  const all = await getCollection("blog");
  const pub = all.filter((p) => !p.id.startsWith("draft/"));
  pub.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
  return rss({
    title: "mychatterbox",
    description: "이런 것도 팁이 되나 싶은 정보들",
    site: context.site,
    items: pub.map(({ data: { title, pubDate, description }, id }) => ({
      title,
      pubDate,
      description,
      link: `/${id}`,
    })),
  });
}
