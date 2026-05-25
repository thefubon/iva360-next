import { z } from 'zod'

import {
  HUGEICONS_ALLOWLIST,
  isHugeiconsAllowlistName,
  type HugeiconsAllowlistName,
} from './hugeicons-allowlist'

export { HUGEICONS_ALLOWLIST, isHugeiconsAllowlistName, type HugeiconsAllowlistName }

/** @deprecated Use `HUGEICONS_ALLOWLIST` */
export const HUGEICONS_FREE_ICON_NAMES = HUGEICONS_ALLOWLIST

/** @deprecated Use `isHugeiconsAllowlistName` */
export const isHugeiconsFreeIconName = isHugeiconsAllowlistName

/** @deprecated Use `HugeiconsAllowlistName` */
export type HugeiconsFreeIconName = HugeiconsAllowlistName

export const hugeiconsAllowlistNameSchema = z.enum(HUGEICONS_ALLOWLIST, {
  errorMap: () => ({ message: 'Неизвестное имя иконки Hugeicons' }),
})

/**
 * Accepts any non-empty icon name from CMS storage.
 * Used when parsing Payload globals so legacy names outside the allowlist still render.
 */
export const hugeiconsStoredNameSchema = z.string().min(1, {
  message: 'Имя иконки Hugeicons не может быть пустым',
})

/** @deprecated Use `hugeiconsAllowlistNameSchema` */
export const hugeiconsFreeIconNameSchema = hugeiconsAllowlistNameSchema
