import { z } from 'zod'

import { HUGEICONS_ALLOWLIST } from './hugeicons-allowlist'
import { hugeiconsStoredNameSchema } from './hugeicons'
import { mediaSchema } from './media'

/** Иконки топбара для CMS-пикера (phones + rightLinks). */
export const TOPBAR_HUGEICONS = HUGEICONS_ALLOWLIST.map((value) => ({
  value,
  label: value,
})) as ReadonlyArray<{
  value: (typeof HUGEICONS_ALLOWLIST)[number]
  label: string
}>

export const TOPBAR_HUGEICONS_DEFAULTS = TOPBAR_HUGEICONS.map((option) => option.value)

/** @deprecated Use `TOPBAR_HUGEICONS` */
export const TOPBAR_PHONE_HUGEICONS = TOPBAR_HUGEICONS

/** @deprecated Use `TOPBAR_HUGEICONS_DEFAULTS` */
export const TOPBAR_PHONE_HUGEICONS_DEFAULTS = TOPBAR_HUGEICONS_DEFAULTS

/** @deprecated Use `TOPBAR_HUGEICONS` */
export const TOPBAR_RIGHT_HUGEICONS = TOPBAR_HUGEICONS

/** @deprecated Use `TOPBAR_HUGEICONS_DEFAULTS` */
export const TOPBAR_RIGHT_HUGEICONS_DEFAULTS = TOPBAR_HUGEICONS_DEFAULTS

export const topbarPhoneIconTypeSchema = z.enum(['none', 'hugeicons', 'custom'])

/** Stored CMS values may use any icon name; allowlist applies only to the CMS picker. */
export const topbarPhoneHugeiconsNameSchema = hugeiconsStoredNameSchema

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
