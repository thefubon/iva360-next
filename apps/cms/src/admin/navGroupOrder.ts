import type { NavGroupType } from '@payloadcms/ui/shared'

/** Группа коллекции search в `admin.group` (см. `prepareSidebarNavGroups`). */
export const SEARCH_NAV_GROUP_LABEL = 'Поиск'

/** Порядок групп в боковой навигации Payload admin (сверху вниз). */
export const ADMIN_NAV_GROUP_ORDER = [
  'Основные',
  'Контент',
  'Настройки',
  'Администрирование',
] as const

export function sortNavGroups(groups: NavGroupType[]): NavGroupType[] {
  const orderIndex = new Map(ADMIN_NAV_GROUP_ORDER.map((label, index) => [label, index]))

  return [...groups].sort((a, b) => {
    const aUngrouped = !a.label
    const bUngrouped = !b.label

    if (aUngrouped !== bUngrouped) {
      return aUngrouped ? -1 : 1
    }

    const aIndex = orderIndex.get(a.label as (typeof ADMIN_NAV_GROUP_ORDER)[number]) ?? ADMIN_NAV_GROUP_ORDER.length
    const bIndex = orderIndex.get(b.label as (typeof ADMIN_NAV_GROUP_ORDER)[number]) ?? ADMIN_NAV_GROUP_ORDER.length
    return aIndex - bIndex
  })
}

/**
 * Коллекция «Поиск» остаётся в `admin.group: 'Поиск'`, но в сайдбаре рендерится
 * одной ссылкой без `nav-group__toggle` (Payload `NavGroup` без label).
 */
export function prepareSidebarNavGroups(groups: NavGroupType[]): NavGroupType[] {
  const flattened = groups.map((group) => {
    if (group.label === SEARCH_NAV_GROUP_LABEL && group.entities.length === 1) {
      return { ...group, label: '' }
    }

    return group
  })

  return sortNavGroups(flattened)
}
