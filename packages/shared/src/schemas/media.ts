import { z } from 'zod'

export const mediaSchema = z.object({
  id: z.number(),
  /** May be absent when populated relations omit empty localized values. */
  alt: z.string().nullable().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  url: z.string().nullable().optional(),
  thumbnailURL: z.string().nullable().optional(),
  filename: z.string().nullable().optional(),
  mimeType: z.string().nullable().optional(),
  filesize: z.number().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  focalX: z.number().nullable().optional(),
  focalY: z.number().nullable().optional(),
})

export const mediaCreateSchema = z.object({
  alt: z.string().min(1, 'Alt-текст обязателен'),
})

export const mediaUploadResponseSchema = z.object({
  doc: mediaSchema,
  message: z.string().optional(),
})

export type MediaInput = z.infer<typeof mediaSchema>
export type MediaCreateInput = z.infer<typeof mediaCreateSchema>
