import type { IconSvgElement } from '@hugeicons/react'

import * as Hugeicons from '@hugeicons/core-free-icons'

const iconsRegistry = Hugeicons as Record<string, IconSvgElement>

export function getHugeicon(name: string | null | undefined): IconSvgElement | undefined {
  if (!name) {
    return undefined
  }

  return iconsRegistry[name]
}
