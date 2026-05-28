import { z } from 'zod'

export const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Expected hex color (#RGB or #RRGGBB)')

export type HexColorInput = z.infer<typeof hexColorSchema>
