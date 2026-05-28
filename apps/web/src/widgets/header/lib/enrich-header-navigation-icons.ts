import type { HeaderNavItemInput } from '@iva360/shared'

import { resolveCmsMediaIcon } from '@/entities/cms-media'

import type { HeaderNavItemWithIcons } from '../model/navigation'

export type { HeaderNavItemWithIcons, HeaderNavSubItemWithIcon } from '../model/navigation'

export async function enrichHeaderNavigationIcons(
  items: HeaderNavItemInput[],
  cmsBaseUrl: string,
): Promise<HeaderNavItemWithIcons[]> {
  return Promise.all(
    items.map(async (item) => {
      const resolvedIcon = item.icon
        ? await resolveCmsMediaIcon(item.icon, cmsBaseUrl)
        : null

      const subItems = item.subItems
      if (!subItems?.length) {
        return { ...item, resolvedIcon }
      }

      const enrichedSubItems = await Promise.all(
        subItems.map(async (subItem) => ({
          ...subItem,
          resolvedIcon: subItem.icon
            ? await resolveCmsMediaIcon(subItem.icon, cmsBaseUrl)
            : null,
        })),
      )

      return { ...item, resolvedIcon, subItems: enrichedSubItems }
    }),
  )
}
