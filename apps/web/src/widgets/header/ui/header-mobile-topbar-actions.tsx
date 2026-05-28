'use client'

import type { AppLocale } from '@iva360/shared'

import { SearchTrigger } from '@/features/site-search'
import { LanguageSwitcher } from '@/features/locale-switch'
import { cn } from '@/shared/lib/utils'
import type { TopbarLinkWithIcon } from '@/widgets/topbar/model/topbar-link-with-icon'
import { topbarLinkClassName } from '@/widgets/topbar/lib/constants'

import { HeaderTopbarDrawer } from './header-topbar-drawer'

type HeaderMobileTopbarActionsProps = {
  phones: TopbarLinkWithIcon[]
  rightLinks: TopbarLinkWithIcon[]
  locale: AppLocale
}

const mobileIconButtonClassName =
  'inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:text-primary'

export function HeaderMobileTopbarActions({
  phones,
  rightLinks,
  locale,
}: HeaderMobileTopbarActionsProps) {
  return (
    <div className="flex items-center gap-4 lg:hidden">
      <SearchTrigger variant="icon" />
      <LanguageSwitcher
        locale={locale}
        menuAlign="end"
        triggerClassName={cn(
          topbarLinkClassName,
          mobileIconButtonClassName,
          'gap-1 px-2 text-sm font-medium',
        )}
      />
      <HeaderTopbarDrawer phones={phones} rightLinks={rightLinks} />
    </div>
  )
}
