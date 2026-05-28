import { z } from 'zod'

import { mediaSchema } from './media'

export const seoSchema = z.object({
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  ogImage: z.union([z.number(), mediaSchema]).nullable().optional(),
  noIndex: z.boolean().nullable().optional(),
})

export type SeoInput = z.infer<typeof seoSchema>
