export const locales = ['ru', 'en'] as const

export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'ru'

/** Default app / Payload content locale. */
export const fallbackLocale: AppLocale = 'ru'

/** Other locale used in API `fallback-locale` when a field is empty in the requested locale. */
export function resolvePayloadFallbackLocale(locale: AppLocale): AppLocale {
  return locale === 'ru' ? 'en' : 'ru'
}

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
    'fallback-locale': options.fallbackLocale ?? resolvePayloadFallbackLocale(options.locale),
    depth: String(options.depth ?? 1),
  })

  return params.toString()
}
