import type { AppLocale } from '@iva360/shared'

import { resolveMediaUrl } from '@/entities/cms-media'
import { getCmsInternalUrl } from '@/shared/lib/cms-url'
import { getHomePath } from '@/shared/lib/i18n/get-home-path'
import { fetchTopbar } from '@/widgets/topbar/api/fetch-topbar'
import { enrichTopbarLinksIcons } from '@/widgets/topbar/lib/enrich-topbar-links-icons'
import { getTopbarLinks } from '@/widgets/topbar/lib/get-topbar-links'

import { fetchHeader } from './api/fetch-header'
import { enrichHeaderNavigationIcons } from './lib/enrich-header-navigation-icons'
import { getHeaderNavigation } from './lib/get-header-navigation'
import { HeaderShell } from './ui/header-shell'

type HeaderProps = {
  locale: AppLocale
}

export async function Header({ locale }: HeaderProps) {
  const cmsBaseUrl = getCmsInternalUrl()
  const [header, topbar] = await Promise.all([fetchHeader(locale), fetchTopbar(locale)])
  const logoUrl = resolveMediaUrl(header?.logo, cmsBaseUrl)
  const siteName = header?.siteName?.trim() || 'IVA360'
  const homeHref = getHomePath(locale)
  const navigation = await enrichHeaderNavigationIcons(
    getHeaderNavigation(header?.navigation),
    cmsBaseUrl,
  )
  const [phones, rightLinks] = await Promise.all([
    enrichTopbarLinksIcons(getTopbarLinks(topbar?.phones), cmsBaseUrl),
    enrichTopbarLinksIcons(getTopbarLinks(topbar?.rightLinks), cmsBaseUrl),
  ])

  return (
    <header className="sticky top-0 z-50 bg-background shadow-lg shadow-secondary/10">
      <HeaderShell
        homeHref={homeHref}
        logoUrl={logoUrl}
        siteName={siteName}
        navigation={navigation}
        phones={phones}
        rightLinks={rightLinks}
        locale={locale}
      />
    </header>
  )
}
