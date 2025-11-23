import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  kind: z.enum(["article", "note"]),
  tags: z.array(z.string()).optional(),
});

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdoc}",
    base: "./src/content/blog",
  }),
  schema,
});

const draft = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdoc}",
    base: "./src/content/draft",
  }),
  schema,
});

export const collections = { blog, draft };
