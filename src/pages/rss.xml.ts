import rss, { type RSSOptions } from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: RSSOptions) {
  const all = await getCollection("blog");
  const pub = all.filter((p) => !p.id.startsWith("draft/"));
  pub.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  // context.site가 string인지 URL 객체인지 확인
  const siteHref =
    typeof context.site === "string" && context.site.trim()
      ? context.site
      : context.site?.href;

  // context.site의 후행 슬래시 제거
  const siteUrl = siteHref?.endsWith("/")
    ? siteHref.slice(0, -1)
    : siteHref || "https://chatter.kr";

  return rss({
    title: "mychatterbox",
    description: "이런 것도 팁이 되나 싶은 정보들",
    site: siteUrl,
    items: pub.map(({ data: { title, pubDate, description }, id }) => ({
      title,
      pubDate,
      description,
      link: `${siteUrl}/${encodeURIComponent(id)}`,
    })),
  });
}
