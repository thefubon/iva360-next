import { z } from 'zod'

import { linkSchema } from './link'
import { mediaSchema } from './media'

export const headerSchema = z.object({
  id: z.number(),
  logo: z.union([z.number(), mediaSchema]).nullable().optional(),
  siteName: z.string().nullable().optional(),
  navigation: z.array(linkSchema).nullable().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  globalType: z.literal('header').optional(),
})

export type HeaderInput = z.infer<typeof headerSchema>
