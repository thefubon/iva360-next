import { z } from 'zod'

import { hugeiconsFreeIconNameSchema } from './hugeicons'
import { mediaSchema } from './media'

/** Рекомендуемые иконки для ссылок топбара — показываются первыми в пикере. */
export const TOPBAR_PHONE_HUGEICONS = [
  { value: 'CallIcon', label: 'CallIcon' },
  { value: 'Call02Icon', label: 'Call02Icon' },
  { value: 'CallIncoming01Icon', label: 'CallIncoming01Icon' },
  { value: 'CallRinging01Icon', label: 'CallRinging01Icon' },
  { value: 'TelephoneIcon', label: 'TelephoneIcon' },
  { value: 'SmartPhone01Icon', label: 'SmartPhone01Icon' },
  { value: 'SmartPhone02Icon', label: 'SmartPhone02Icon' },
  { value: 'ContactBookIcon', label: 'ContactBookIcon' },
  { value: 'AiPhone01Icon', label: 'AiPhone01Icon' },
  { value: 'PhoneOff01Icon', label: 'PhoneOff01Icon' },
] as const

export const TOPBAR_PHONE_HUGEICONS_DEFAULTS = TOPBAR_PHONE_HUGEICONS.map(
  (option) => option.value,
)

export const topbarPhoneIconTypeSchema = z.enum(['none', 'hugeicons', 'custom'])

export const topbarPhoneHugeiconsNameSchema = hugeiconsFreeIconNameSchema

export const topbarLinkSchema = z.object({
  id: z.string().optional(),
  number: z.string().min(1),
  url: z.string().nullable().optional(),
  openInNewTab: z.boolean().nullable().optional(),
  iconType: topbarPhoneIconTypeSchema.nullable().optional(),
  hugeiconsName: topbarPhoneHugeiconsNameSchema.nullable().optional(),
  customIcon: z.union([z.number(), mediaSchema]).nullable().optional(),
})

/** @deprecated Use topbarLinkSchema */
export const topbarPhoneSchema = topbarLinkSchema

/** Поля вкладки «Слева» */
export const topbarLeftSchema = z.object({
  phones: z.array(topbarLinkSchema).nullable().optional(),
})

/** Поля вкладки «Справа» */
export const topbarRightSchema = z.object({
  rightLinks: z.array(topbarLinkSchema).nullable().optional(),
})

export const topbarSchema = z
  .object({
    id: z.number(),
    updatedAt: z.string(),
    createdAt: z.string(),
    globalType: z.literal('topbar').optional(),
  })
  .merge(topbarLeftSchema)
  .merge(topbarRightSchema)

export type TopbarPhoneIconType = z.infer<typeof topbarPhoneIconTypeSchema>
export type TopbarPhoneHugeiconsName = z.infer<typeof topbarPhoneHugeiconsNameSchema>
export type TopbarLinkInput = z.infer<typeof topbarLinkSchema>
/** @deprecated Use TopbarLinkInput */
export type TopbarPhoneInput = TopbarLinkInput
export type TopbarLeftInput = z.infer<typeof topbarLeftSchema>
export type TopbarRightInput = z.infer<typeof topbarRightSchema>
export type TopbarInput = z.infer<typeof topbarSchema>
