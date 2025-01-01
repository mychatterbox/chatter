// config.ts
import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders';

const published = defineCollection({
  // type: 'content',
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/published" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    kind: z.enum(['article', 'note']),
    list: z.boolean().optional(),
    
  })
  .transform((o) => {
    return { ...o, draft: !(o.title && o.description && o.pubDate) };
  }),

});

export const collections = { published };