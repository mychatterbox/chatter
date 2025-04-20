import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders';
import { imageSchema } from 'components/imageSchema.ts';

const blog = defineCollection({
  // type: 'content',
  loader: glob({ pattern: '**/[^_]*.{md,mdoc}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    kind: z.enum(['article', 'note']),
    list: z.boolean().optional(),
    ogImage: imageSchema().or(z.literal("")).default("").transform(val => val || null),
    draft: z.boolean().optional().default(false)
  })
  .transform((o) => {
    return { ...o, draft: !(o.title && o.description && o.pubDate) };
  }),

});

export const collections = { blog };