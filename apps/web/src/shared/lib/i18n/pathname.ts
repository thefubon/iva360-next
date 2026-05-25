import type { AppLocale } from '@iva360/shared/i18n'

export function getLocalizedPathname(pathname: string, targetLocale: AppLocale): string {
  const segments = pathname.split('/').filter(Boolean)

  if (segments[0] === 'en') {
    const pathWithoutLocale = segments.slice(1)

    if (targetLocale === 'en') {
      return pathname
    }

    return pathWithoutLocale.length === 0 ? '/' : `/${pathWithoutLocale.join('/')}`
  }

  if (targetLocale === 'ru') {
    return pathname
  }

  const path = segments.length === 0 ? '' : `/${segments.join('/')}`

  return `/en${path}`
}
