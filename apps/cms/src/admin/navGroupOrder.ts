import type { NavGroupType } from '@payloadcms/ui/shared'

/** Порядок групп в боковой навигации Payload admin (сверху вниз). */
export const ADMIN_NAV_GROUP_ORDER = [
  'Глобальные настройки',
  'Контент',
  'Администрирование',
] as const

export function sortNavGroups(groups: NavGroupType[]): NavGroupType[] {
  const orderIndex = new Map(ADMIN_NAV_GROUP_ORDER.map((label, index) => [label, index]))

  return [...groups].sort((a, b) => {
    const aIndex = orderIndex.get(a.label as (typeof ADMIN_NAV_GROUP_ORDER)[number]) ?? ADMIN_NAV_GROUP_ORDER.length
    const bIndex = orderIndex.get(b.label as (typeof ADMIN_NAV_GROUP_ORDER)[number]) ?? ADMIN_NAV_GROUP_ORDER.length
    return aIndex - bIndex
  })
}
