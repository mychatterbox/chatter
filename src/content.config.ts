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
    ogImage: z.string().refine(val => val.startsWith('/assets/'), {
      message: "OG 이미지 경로는 '/assets/'로 시작해야 합니다"
    }),
  })
  .transform((o) => {
    return { ...o, draft: !(o.title && o.description && o.pubDate) };
  }),

});

export const collections = { blog };