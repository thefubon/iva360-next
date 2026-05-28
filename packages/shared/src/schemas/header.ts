import { z } from 'zod'

import { mediaSchema } from './media'
import { topbarLeftSchema, topbarRightSchema } from './topbar'

export const headerNavSubItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  url: z.string().min(1),
  openInNewTab: z.boolean().nullable().optional(),
  description: z.string().nullable().optional(),
  icon: z.union([z.number(), mediaSchema]).nullable().optional(),
})

export const headerNavItemSchema = z.object({
  id: z.string().optional(),
  icon: z.union([z.number(), mediaSchema]).nullable().optional(),
  mobileMenuOnly: z.boolean().nullable().optional(),
  label: z.string().min(1),
  url: z.string().nullable().optional(),
  openInNewTab: z.boolean().nullable().optional(),
  subItems: z.array(headerNavSubItemSchema).nullable().optional(),
})

export const headerSchema = z
  .object({
    id: z.number(),
    logo: z.union([z.number(), mediaSchema]).nullable().optional(),
    siteName: z.string().nullable().optional(),
    navigation: z.array(headerNavItemSchema).nullable().optional(),
    updatedAt: z.string(),
    createdAt: z.string(),
    globalType: z.literal('header').optional(),
  })
  .merge(topbarLeftSchema)
  .merge(topbarRightSchema)

export type HeaderNavSubItemInput = z.infer<typeof headerNavSubItemSchema>
export type HeaderNavItemInput = z.infer<typeof headerNavItemSchema>
export type HeaderInput = z.infer<typeof headerSchema>
