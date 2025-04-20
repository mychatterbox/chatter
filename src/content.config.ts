import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // type: 'content',
  loader: glob({ pattern: '**/[^_]*.{md,mdoc}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    kind: z.enum(['article', 'note']),
    list: z.boolean().optional(),
    ogImage: z.union([
      z.literal(""), // 빈 문자열 허용
      z.string().startsWith("/assets/"), // 공식 경로
      z.string().startsWith("/blog-images/") // 기존 경로 호환
    ]).optional().transform(val => val || "") // undefined → 빈 문자열
  })
  .transform((o) => {
    return { ...o, draft: !(o.title && o.description && o.pubDate) };
  }),

});

export const collections = { blog };