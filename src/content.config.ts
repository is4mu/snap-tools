import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['estimate', 'delivery', 'organize', 'comms', 'calc']),
    pillar: z.boolean().default(false),
    relatedGuides: z.array(z.string()).default([]),
    relatedTools: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['estimate', 'delivery', 'organize', 'comms', 'calc']),
    toolSlug: z.string().optional(),
    toolCta: z.string().optional(),
  }),
});

export const collections = { guides, topics };
