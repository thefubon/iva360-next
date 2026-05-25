import type { AppLocale, TopbarLinkInput } from '@iva360/shared'

import { fetchTopbar } from '../api/fetch-topbar'
import { TopbarLink } from './topbar-link'
import { TopbarRightNav } from './topbar-right-nav'

function getTopbarLinks(
  items: TopbarLinkInput[] | null | undefined,
): TopbarLinkInput[] {
  if (!items?.length) {
    return []
  }

  return items.filter((item) => item.number.trim().length > 0)
}

type TopbarProps = {
  locale: AppLocale
}

export async function Topbar({ locale }: TopbarProps) {
  const topbar = await fetchTopbar(locale)
  const phones = getTopbarLinks(topbar?.phones)
  const rightLinks = getTopbarLinks(topbar?.rightLinks)
  const cmsBaseUrl = process.env.CMS_INTERNAL_URL ?? 'http://localhost:3333'

  return (
    <div className="hidden border-b border-border bg-background lg:block">
      <div className="container flex h-12 items-center justify-between text-sm text-foreground">
        <div className="flex min-w-0 items-center gap-4 xl:gap-6">
          {phones.length > 0
            ? phones.map((phone) => (
                <TopbarLink
                  key={phone.id ?? `${phone.number}-${phone.url ?? ''}`}
                  link={phone}
                  cmsBaseUrl={cmsBaseUrl}
                />
              ))
            : null}
        </div>
        <div className="flex shrink-0 items-center gap-4 xl:gap-6">
          <TopbarRightNav links={rightLinks} cmsBaseUrl={cmsBaseUrl} />
        </div>
      </div>
    </div>
  )
}
