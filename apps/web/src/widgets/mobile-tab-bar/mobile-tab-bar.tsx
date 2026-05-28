import type { AppLocale } from '@iva360/shared'

import { getCmsInternalUrl } from '@/shared/lib/cms-url'
import { fetchHeader } from '@/widgets/header/api/fetch-header'
import { enrichHeaderNavigationIcons } from '@/widgets/header/lib/enrich-header-navigation-icons'
import { getHeaderNavigation } from '@/widgets/header/lib/get-header-navigation'

import { MobileTabBarShell } from './ui/mobile-tab-bar-shell'

type MobileTabBarProps = {
  locale: AppLocale
}

export async function MobileTabBar({ locale }: MobileTabBarProps) {
  const header = await fetchHeader(locale)
  const cmsBaseUrl = getCmsInternalUrl()
  const navigation = await enrichHeaderNavigationIcons(
    getHeaderNavigation(header?.navigation),
    cmsBaseUrl,
  )

  return <MobileTabBarShell navigation={navigation} />
}
