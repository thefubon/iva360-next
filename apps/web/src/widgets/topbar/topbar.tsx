import type { AppLocale } from '@iva360/shared'

import { getCmsInternalUrl } from '@/shared/lib/cms-url'

import { fetchTopbar } from './api/fetch-topbar'
import { enrichTopbarLinksIcons } from './lib/enrich-topbar-links-icons'
import { getTopbarLinks } from './lib/get-topbar-links'
import { TopbarLink } from './ui/topbar-link'
import { TopbarRightNav } from './ui/topbar-right-nav'

type TopbarProps = {
  locale: AppLocale
}

export async function Topbar({ locale }: TopbarProps) {
  const topbar = await fetchTopbar(locale)
  const cmsBaseUrl = getCmsInternalUrl()
  const phones = await enrichTopbarLinksIcons(getTopbarLinks(topbar?.phones), cmsBaseUrl)
  const rightLinks = await enrichTopbarLinksIcons(getTopbarLinks(topbar?.rightLinks), cmsBaseUrl)

  return (
    <div className="hidden border-b border-border bg-background lg:block">
      <div className="container flex h-12 items-center justify-between text-sm text-foreground">
        <div className="flex min-w-0 items-center gap-4 xl:gap-6">
          {phones.length > 0
            ? phones.map((phone) => (
                <TopbarLink
                  key={phone.id ?? `${phone.number}-${phone.url ?? ''}`}
                  link={phone}
                />
              ))
            : null}
        </div>
        <TopbarRightNav links={rightLinks} locale={locale} />
      </div>
    </div>
  )
}
