import { z } from 'zod'

import { linkSchema } from './link'

export const socialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.enum(['vk', 'telegram', 'youtube', 'other']),
  url: z.string().min(1),
})

export const footerContactSchema = z.object({
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
})

export const footerSchema = z.object({
  id: z.number(),
  copyright: z.string().nullable().optional(),
  links: z.array(linkSchema).nullable().optional(),
  socialLinks: z.array(socialLinkSchema).nullable().optional(),
  contact: footerContactSchema.nullable().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  globalType: z.literal('footer').optional(),
})

export type FooterInput = z.infer<typeof footerSchema>
export type SocialLinkInput = z.infer<typeof socialLinkSchema>
