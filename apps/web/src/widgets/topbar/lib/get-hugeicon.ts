import type { IconSvgElement } from '@hugeicons/react'
import {
  BookOpen02Icon,
  Call02Icon,
  CustomerSupportIcon,
  AtIcon,
  Home01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { isHugeiconsAllowlistName } from '@iva360/shared/schemas'

/** Static map of allowlisted topbar icons — keep in sync with `HUGEICONS_ALLOWLIST`. */
const iconsRegistry = {
  Call02Icon,
  CustomerSupportIcon,
  BookOpen02Icon,
  AtIcon,
  Search01Icon,
  Home01Icon,
} satisfies Record<string, IconSvgElement>

export function getHugeicon(name: string | null | undefined): IconSvgElement | undefined {
  if (!name || !isHugeiconsAllowlistName(name)) {
    return undefined
  }

  return iconsRegistry[name]
}
