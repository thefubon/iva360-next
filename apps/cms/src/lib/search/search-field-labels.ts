const GLOBAL_LABELS: Record<string, string> = {
  header: 'Шапка',
  homePage: 'Главная',
  footer: 'Подвал',
  brand: 'Бренд',
}

/** Field/group paths whose admin labels are indexed even when values are empty. */
export const FIELD_GROUP_LABELS: Record<string, string> = {
  blocks: 'Блоки страницы',
  headlineSection: 'Заголовок',
  subscriptionsSection: 'Бейджи',
  buttonsSection: 'Кнопки',
  imageSection: 'Изображение',
  buttons: 'Кнопки',
  badges: 'Бейджи',
  logos: 'Логотипы',
  icons: 'Иконки',
  backgrounds: 'Фоны',
  colors: 'Цвета',
  contact: 'Контакты',
  copyright: 'Копирайт',
  links: 'Ссылки',
  navigation: 'Навигация',
  phones: 'Ссылки слева',
  rightLinks: 'Ссылки справа',
  siteName: 'Название сайта',
  socialLinks: 'Соцсети',
}

/** Leaf field names whose string values are indexed for admin search. */
export const SEARCHABLE_LEAF_FIELDS = new Set([
  'address',
  'copyright',
  'label',
  'description',
  'email',
  'headline',
  'label',
  'name',
  'metaDescription',
  'metaTitle',
  'number',
  'phone',
  'siteName',
  'title',
])

const INTERNAL_SELECT_VALUES = new Set([
  'custom',
  'hugeicons',
  'none',
  'other',
  'telegram',
  'vk',
  'youtube',
])

export function getLeafFieldName(fieldPath: string): string {
  const segments = fieldPath.split('.')
  for (let index = segments.length - 1; index >= 0; index -= 1) {
    const segment = segments[index]
    if (segment && !/^\d+$/.test(segment)) {
      return segment
    }
  }

  return fieldPath
}

export function isSearchableLeafField(fieldPath: string): boolean {
  return SEARCHABLE_LEAF_FIELDS.has(getLeafFieldName(fieldPath))
}

export function isJunkSearchText(text: string): boolean {
  const normalized = text.trim()

  if (normalized.length < 2) {
    return true
  }

  if (/^(tel:|mailto:|https?:\/\/|\/)/i.test(normalized)) {
    return true
  }

  if (/^[A-Z][a-zA-Z0-9]+Icon$/.test(normalized)) {
    return true
  }

  if (INTERNAL_SELECT_VALUES.has(normalized.toLowerCase())) {
    return true
  }

  return false
}

export function getGlobalAdminLabel(globalSlug: string): string {
  return GLOBAL_LABELS[globalSlug] ?? globalSlug
}

export function getFieldGroupLabel(fieldPath: string): string | null {
  return FIELD_GROUP_LABELS[fieldPath] ?? null
}

export function getFieldContextLabel(fieldPath: string): string | null {
  if (fieldPath.includes('.subItems.')) {
    return 'Подменю'
  }

  for (const [prefix, label] of Object.entries(FIELD_GROUP_LABELS)) {
    if (fieldPath === prefix || fieldPath.startsWith(`${prefix}.`)) {
      return label
    }
  }

  return null
}

export function buildContextOnlySearchTitle(
  contextLabel: string,
  globalLabel: string,
): string {
  return `${contextLabel} — ${globalLabel}`
}

export function buildGlobalSearchTitle(
  text: string,
  globalLabel: string,
  fieldPath: string,
): string {
  const context = getFieldContextLabel(fieldPath)

  if (context) {
    return `${text} — ${context} — ${globalLabel}`
  }

  return `${text} — ${globalLabel}`
}
