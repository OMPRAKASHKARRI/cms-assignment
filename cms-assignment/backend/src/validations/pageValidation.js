const { z } = require('zod');

const blockSchema = z.object({
  type: z.enum([
    'hero', 'header', 'paragraph', 'richtext', 'list',
    'table', 'equation', 'image', 'quote', 'code', 'cta',
  ]),
  data: z.record(z.any()),
  order: z.number().int().nonnegative(),
  metadata: z
    .object({ anchorId: z.string().nullable().optional(), className: z.string().nullable().optional() })
    .optional(),
});

const createPageSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
    status: z.enum(['draft', 'published']).optional(),
    blocks: z.array(blockSchema).optional().default([]),
    seo: z
      .object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogImage: z.string().optional(),
      })
      .optional(),
  }),
});

const updatePageSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    status: z.enum(['draft', 'published']).optional(),
    blocks: z.array(blockSchema).optional(),
    seo: z
      .object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogImage: z.string().optional(),
      })
      .optional(),
  }),
  params: z.object({ id: z.string().min(1) }),
});

module.exports = { createPageSchema, updatePageSchema };
