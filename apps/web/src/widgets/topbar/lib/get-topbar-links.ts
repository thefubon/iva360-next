import type { TopbarLinkInput } from '@iva360/shared'

export function getTopbarLinks(items: TopbarLinkInput[] | null | undefined): TopbarLinkInput[] {
  if (!items?.length) {
    return []
  }

  return items.filter((item) => item.number.trim().length > 0)
}
