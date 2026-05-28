import React from 'react'

import { isAppLocale, resolveLocaleParam } from '@iva360/shared/i18n'
import { LivePreviewRefresh } from '@/features/live-preview'
import { SiteSearchProvider, SiteSearchRoot } from '@/features/site-search'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import { MobileTabBar } from '@/widgets/mobile-tab-bar'
import { Topbar } from '@/widgets/topbar'

import { Providers } from '@/app/providers'
import { getCmsLivePreviewServerUrl } from '@/shared/lib/cms-live-preview'

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }]
}

export default async function FrontendLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { children, params } = props
  const { locale: localeParam } = await params
  const locale = isAppLocale(localeParam) ? localeParam : resolveLocaleParam(localeParam)

  return (
    <Providers>
      <SiteSearchProvider locale={locale}>
        <SiteSearchRoot>
          <LivePreviewRefresh serverURL={getCmsLivePreviewServerUrl()} />
          <Topbar locale={locale} />
          <Header locale={locale} />
          <main className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">{children}</main>
          <Footer locale={locale} />
          <MobileTabBar locale={locale} />
        </SiteSearchRoot>
      </SiteSearchProvider>
    </Providers>
  )
}
