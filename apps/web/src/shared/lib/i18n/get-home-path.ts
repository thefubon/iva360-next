import type { AppLocale } from '@iva360/shared/i18n'

export function getHomePath(locale: AppLocale): string {
  return locale === 'en' ? '/en' : '/'
}
