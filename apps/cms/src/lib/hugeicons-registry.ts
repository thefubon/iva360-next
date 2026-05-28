import type { IconSvgElement } from '@hugeicons/react'
import {
  BookOpen02Icon,
  Call02Icon,
  CustomerSupportIcon,
  AtIcon,
  Home01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import type { HugeiconsAllowlistName } from '@iva360/shared/schemas'

/** Static map of allowlisted CMS/topbar icons — keep in sync with `HUGEICONS_ALLOWLIST`. */
export const hugeiconsRegistry: Record<HugeiconsAllowlistName, IconSvgElement> = {
  Call02Icon,
  CustomerSupportIcon,
  BookOpen02Icon,
  AtIcon,
  Search01Icon,
  Home01Icon,
}
