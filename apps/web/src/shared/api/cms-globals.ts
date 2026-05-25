import {
  buildPayloadLocaleQuery,
  footerSchema,
  headerSchema,
  topbarSchema,
  type AppLocale,
  type FooterInput,
  type HeaderInput,
  type TopbarInput,
} from '@iva360/shared'

import { getCmsInternalUrl } from '@/shared/lib/cms-url'

type SafeParseSchema<T> = {
  safeParse: (value: unknown) => { success: true; data: T } | { success: false; error: unknown }
}

async function fetchCmsGlobal<T>(
  slug: string,
  locale: AppLocale,
  schema: SafeParseSchema<T>,
): Promise<T | null> {
  const query = buildPayloadLocaleQuery({ locale })

  try {
    const response = await fetch(`${getCmsInternalUrl()}/api/globals/${slug}?${query}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      console.warn(`[fetchCmsGlobal] ${slug}: CMS responded with ${response.status}`)
      return null
    }

    const json: unknown = await response.json()
    const parsed = schema.safeParse(json)

    if (!parsed.success) {
      console.warn(`[fetchCmsGlobal] ${slug}: validation failed`, parsed.error)
      return null
    }

    return parsed.data
  } catch (error) {
    console.warn(`[fetchCmsGlobal] ${slug}: fetch failed`, error)
    return null
  }
}

export async function fetchHeader(locale: AppLocale): Promise<HeaderInput | null> {
  return fetchCmsGlobal('header', locale, headerSchema)
}

export async function fetchTopbar(locale: AppLocale): Promise<TopbarInput | null> {
  return fetchCmsGlobal('topbar', locale, topbarSchema)
}

export async function fetchFooter(locale: AppLocale): Promise<FooterInput | null> {
  return fetchCmsGlobal('footer', locale, footerSchema)
}
