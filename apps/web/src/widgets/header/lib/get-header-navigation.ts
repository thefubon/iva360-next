import type { HeaderNavItemInput, HeaderNavSubItemInput } from '@iva360/shared'

function filterHeaderNavSubItems(
  subItems: HeaderNavSubItemInput[] | null | undefined,
): HeaderNavSubItemInput[] {
  if (!subItems?.length) {
    return []
  }

  return subItems.filter((subItem) => subItem.label.trim().length > 0)
}

export function getHeaderNavigation(
  items: HeaderNavItemInput[] | null | undefined,
): HeaderNavItemInput[] {
  if (!items?.length) {
    return []
  }

  return items
    .filter((item) => item.label.trim().length > 0)
    .map((item) => ({
      ...item,
      subItems: filterHeaderNavSubItems(item.subItems),
    }))
}
