import { z } from 'zod'

import {
  HUGEICONS_FREE_ICON_NAMES,
  isHugeiconsFreeIconName,
  type HugeiconsFreeIconName,
} from './hugeicons-free-icons'

export { HUGEICONS_FREE_ICON_NAMES, isHugeiconsFreeIconName, type HugeiconsFreeIconName }

export const hugeiconsFreeIconNameSchema = z.string().refine(isHugeiconsFreeIconName, {
  message: 'Неизвестное имя иконки Hugeicons',
})
