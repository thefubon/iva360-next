import type { HomePageInput } from '@iva360/shared'
import type { Metadata } from 'next'

import { resolveMediaUrl } from '@/entities/cms-media'
import { getCmsInternalUrl } from '@/shared/lib/cms-url'

const DEFAULT_TITLE = 'IVA360'
const DEFAULT_DESCRIPTION = 'Digital Platform for the Future'

export function buildHomePageMetadata(homePage: HomePageInput | null): Metadata {
  const metaTitle = homePage?.metaTitle?.trim()
  const pageTitle = homePage?.title?.trim()
  const heroHeadline = homePage?.blocks
    ?.find((block) => block.blockType === 'hero')
    ?.headlineSection?.headline?.trim()

  const title = metaTitle || pageTitle || heroHeadline || DEFAULT_TITLE
  const description = homePage?.metaDescription?.trim() || DEFAULT_DESCRIPTION
  const ogImageUrl = resolveMediaUrl(homePage?.ogImage, getCmsInternalUrl())

  return {
    title,
    description,
    ...(homePage?.noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
  }
}
