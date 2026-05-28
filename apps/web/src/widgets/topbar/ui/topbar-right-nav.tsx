'use client'

import type { AppLocale } from '@iva360/shared'

import { SearchTrigger } from '@/features/site-search'
import { LanguageSwitcher } from '@/features/locale-switch'
import { cn } from '@/shared/lib/utils'

import { topbarLinkClassName } from '../lib/constants'
import type { TopbarLinkWithIcon } from '../model/topbar-link-with-icon'
import { TopbarLinkView } from './topbar-link-view'

type TopbarRightNavProps = {
  links: TopbarLinkWithIcon[]
  locale?: AppLocale
  variant?: 'inline' | 'list'
  className?: string
  linkClassName?: string
  onNavigate?: () => void
}

export function TopbarRightNav({
  links,
  locale,
  variant = 'inline',
  className,
  linkClassName,
  onNavigate,
}: TopbarRightNavProps) {
  if (variant === 'list') {
    return (
      <ul className={cn('flex flex-col', className)}>
        {links.map((link) => (
          <li key={link.id ?? `${link.number}-${link.url ?? ''}`}>
            <TopbarLinkView
              link={link}
              className={linkClassName}
              onClick={onNavigate}
            />
          </li>
        ))}
      </ul>
    )
  }

  const resolvedLocale = locale ?? 'ru'

  return (
    <div className={cn('flex shrink-0 items-center gap-4 xl:gap-6', className)}>
      <SearchTrigger />
      {links.map((link) => (
        <TopbarLinkView key={link.id ?? `${link.number}-${link.url ?? ''}`} link={link} />
      ))}
      <LanguageSwitcher
        locale={resolvedLocale}
        menuAlign="end"
        triggerClassName={cn(topbarLinkClassName, 'group outline-none', linkClassName)}
      />
    </div>
  )
}
