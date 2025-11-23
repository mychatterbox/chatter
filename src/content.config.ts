import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  kind: z.enum(["article", "note"]),
  tags: z.array(z.string()).optional(),
});

// --- blog 컬렉션 (항상 로드됨)
const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdoc}",
    base: "./src/content/blog",
  }),
  schema,
});

// --- draft 컬렉션 (DEV에서만 로드 / PROD에서는 비어 있게)
const draft = defineCollection({
  loader: import.meta.env.DEV
    ? glob({
        pattern: "**/*.{md,mdoc}",
        base: "./src/content/draft",
      })
    : async () => [],   // ★ null 대신 "빈 배열"을 반환하면 오류 없음
  schema,
});

export const collections = { blog, draft };
