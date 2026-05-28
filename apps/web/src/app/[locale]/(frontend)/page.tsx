import { isAppLocale, resolveLocaleParam } from '@iva360/shared/i18n'
import type { Metadata } from 'next'

import { fetchHomePage } from '@/shared/api/cms-globals'
import { buildHomePageMetadata } from '@/shared/lib/build-home-page-metadata'
import { HomePageContent } from '@/widgets/home-page'

type HomePageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = isAppLocale(localeParam) ? localeParam : resolveLocaleParam(localeParam)
  const homePage = await fetchHomePage(locale)

  return buildHomePageMetadata(homePage)
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params
  const locale = isAppLocale(localeParam) ? localeParam : resolveLocaleParam(localeParam)
  const homePage = await fetchHomePage(locale)

  return <HomePageContent homePage={homePage} />
}
