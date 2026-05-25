import { z } from 'zod'

export const linkSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  url: z.string().min(1),
})

export type LinkInput = z.infer<typeof linkSchema>
