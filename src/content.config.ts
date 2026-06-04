import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  updatedDate: z.date().optional(),
  kind: z.enum(["article", "note"]),
  tags: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  youtube: z.boolean().optional(),
});

const blog = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdoc}", "!blog-images/**"],
    base: "./src/content/blog",
  }),
  schema,
});

const draft = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdoc}", "!blog-images/**"],
    base: "./src/content/draft",
  }),
  schema,
});

export const collections = { blog, draft };