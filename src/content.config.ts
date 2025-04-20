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
    ogImage: z.string()
      .optional()
      .transform((val) => val || "") // null/undefined를 빈 문자열로 변환
      .refine(
        (val) => val === "" || val.startsWith('/assets/'), 
        {
          message: "ogImage는 반드시 빈 문자열(\"\")이거나 '/assets/'로 시작해야 합니다"
        }
      ),
  })
  .transform((o) => {
    return { ...o, draft: !(o.title && o.description && o.pubDate) };
  }),

});

export const collections = { blog };