import { z } from 'zod'

import { hexColorSchema } from './color'
import { mediaSchema } from './media'

export const brandLogoSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  image: z.union([z.number(), mediaSchema]),
})

export const brandIconSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  image: z.union([z.number(), mediaSchema]),
})

export const brandBackgroundSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  color: hexColorSchema,
})

export const brandColorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  value: hexColorSchema,
})

export const brandSchema = z.object({
  id: z.number(),
  logos: z.array(brandLogoSchema).nullable().optional(),
  icons: z.array(brandIconSchema).nullable().optional(),
  backgrounds: z.array(brandBackgroundSchema).nullable().optional(),
  colors: z.array(brandColorSchema).nullable().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  globalType: z.literal('brand').optional(),
})

export type BrandLogoInput = z.infer<typeof brandLogoSchema>
export type BrandIconInput = z.infer<typeof brandIconSchema>
export type BrandBackgroundInput = z.infer<typeof brandBackgroundSchema>
export type BrandColorInput = z.infer<typeof brandColorSchema>
export type BrandInput = z.infer<typeof brandSchema>
