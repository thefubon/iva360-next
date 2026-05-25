export const locales = ['ru', 'en'] as const

export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'ru'

export const fallbackLocale: AppLocale = 'ru'

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value)
}

export function resolveLocaleParam(locale: string): AppLocale {
  return isAppLocale(locale) ? locale : defaultLocale
}

export function buildPayloadLocaleQuery(options: {
  locale: AppLocale
  depth?: number
  fallbackLocale?: AppLocale
}): string {
  const params = new URLSearchParams({
    locale: options.locale,
    'fallback-locale': options.fallbackLocale ?? fallbackLocale,
    depth: String(options.depth ?? 1),
  })

  return params.toString()
}
