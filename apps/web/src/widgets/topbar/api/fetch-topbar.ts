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

const cmsUrl = () => process.env.CMS_INTERNAL_URL ?? 'http://localhost:3333'

async function fetchGlobal<T>(
  slug: string,
  locale: AppLocale,
  schema: { parse: (value: unknown) => T },
): Promise<T | null> {
  const query = buildPayloadLocaleQuery({ locale })

  try {
    const response = await fetch(`${cmsUrl()}/api/globals/${slug}?${query}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return null
    }

    const json: unknown = await response.json()
    return schema.parse(json)
  } catch {
    return null
  }
}

export async function fetchTopbar(locale: AppLocale): Promise<TopbarInput | null> {
  return fetchGlobal('topbar', locale, topbarSchema)
}

export async function fetchHeader(locale: AppLocale): Promise<HeaderInput | null> {
  return fetchGlobal('header', locale, headerSchema)
}

export async function fetchFooter(locale: AppLocale): Promise<FooterInput | null> {
  return fetchGlobal('footer', locale, footerSchema)
}
