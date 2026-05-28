import { z } from 'zod'

/** HTML string produced by the CMS TipTap admin field. */
export const tiptapHtmlSchema = z.string()

export type TiptapHtmlInput = z.infer<typeof tiptapHtmlSchema>
