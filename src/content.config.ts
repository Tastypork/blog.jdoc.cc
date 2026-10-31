import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      excerpt: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image(),
      heroAlt: z.string(),
      /** CSS object-position for the hero crop, e.g. "50% 45%" */
      heroPosition: z.string().default("50% 50%"),
      /** Short label shown on the card and the post header */
      kicker: z.string().optional(),
      draft: z.boolean().default(false)
    })
});

export const collections = { posts };
