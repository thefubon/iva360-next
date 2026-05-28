import {
  buildPayloadLocaleQuery,
  brandSchema,
  footerSchema,
  headerSchema,
  homePageSchema,
  topbarSchema,
  type AppLocale,
  type BrandInput,
  type FooterInput,
  type HeaderInput,
  type HomePageInput,
  type TopbarInput,
} from '@iva360/shared'
import { cookies } from 'next/headers'

import { getCmsInternalUrl } from '@/shared/lib/cms-url'
import { isLivePreviewEnabled, LIVE_PREVIEW_COOKIE } from '@/shared/lib/cms-live-preview'

type SafeParseSchema<T> = {
  safeParse: (value: unknown) => { success: true; data: T } | { success: false; error: unknown }
}

async function fetchCmsGlobal<T>(
  slug: string,
  locale: AppLocale,
  schema: SafeParseSchema<T>,
  options?: { depth?: number },
): Promise<T | null> {
  const cookieStore = await cookies()
  const isLivePreview = isLivePreviewEnabled(cookieStore.get(LIVE_PREVIEW_COOKIE)?.value)
  const query = buildPayloadLocaleQuery({ locale, depth: options?.depth })
  const draftQuery = isLivePreview ? '&draft=true' : ''

  try {
    const response = await fetch(
      `${getCmsInternalUrl()}/api/globals/${slug}?${query}${draftQuery}`,
      {
        next: isLivePreview ? { revalidate: 0 } : { revalidate: 60 },
      },
    )

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
  return fetchCmsGlobal('header', locale, headerSchema, { depth: 2 })
}

export async function fetchTopbar(locale: AppLocale): Promise<TopbarInput | null> {
  const header = await fetchHeader(locale)
  if (!header) {
    return null
  }

  const parsed = topbarSchema.safeParse({
    id: header.id,
    phones: header.phones,
    rightLinks: header.rightLinks,
    updatedAt: header.updatedAt,
    createdAt: header.createdAt,
  })

  if (!parsed.success) {
    console.warn('[fetchTopbar] header topbar slice: validation failed', parsed.error)
    return null
  }

  return parsed.data
}

export async function fetchFooter(locale: AppLocale): Promise<FooterInput | null> {
  return fetchCmsGlobal('footer', locale, footerSchema)
}

export async function fetchHomePage(locale: AppLocale): Promise<HomePageInput | null> {
  return fetchCmsGlobal('homePage', locale, homePageSchema, { depth: 2 })
}

export async function fetchBrand(): Promise<BrandInput | null> {
  return fetchCmsGlobal('brand', 'ru', brandSchema, { depth: 2 })
}
