'use client'

import { useState } from 'react'

import type { AppLocale } from '@iva360/shared'

import type { HeaderNavItemWithIcons } from '../model/navigation'
import type { TopbarLinkWithIcon } from '@/widgets/topbar/model/topbar-link-with-icon'

import { ChevronDown } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'

import { HeaderDesktopActions } from './header-desktop-actions'
import { HeaderMobileTopbarActions } from './header-mobile-topbar-actions'
import {
  ExternalLink,
  getExternalHref,
  HeaderNavItemIcon,
  MegaMenuGrid,
  shouldShowHeaderNavItemIcon,
} from './header-nav-parts'

type HeaderShellProps = {
  homeHref: string
  logoUrl: string | null
  siteName: string
  navigation: HeaderNavItemWithIcons[]
  phones: TopbarLinkWithIcon[]
  rightLinks: TopbarLinkWithIcon[]
  locale: AppLocale
}

const navItemBaseClassName =
  'inline-flex items-center text-lg font-medium tracking-wide text-foreground transition-colors hover:text-primary'

function navItemClassName(item: HeaderNavItemWithIcons, hasTrailing: boolean) {
  const showDesktopIcon = shouldShowHeaderNavItemIcon(item, 'desktop')

  return cn(
    navItemBaseClassName,
    (showDesktopIcon || hasTrailing) && 'gap-1.5',
  )
}

export function HeaderShell({
  homeHref,
  logoUrl,
  siteName,
  navigation,
  phones,
  rightLinks,
  locale,
}: HeaderShellProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const activeSubItems =
    activeIndex !== null
      ? (navigation[activeIndex]?.subItems ?? [])
      : []

  return (
    <div className="relative" onMouseLeave={() => setActiveIndex(null)}>
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex shrink-0 items-center">
          <a href={homeHref} className="inline-flex items-center">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- CMS media URLs vary by storage backend
              <img src={logoUrl} alt={siteName} className="h-9 w-auto object-contain" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/iva360.svg" alt="IVA360" height={36} width={99} className="h-9 w-fit" />
            )}
          </a>
        </div>

        {navigation.length > 0 ? (
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <nav aria-label="Основная навигация">
              <ul className="flex items-center gap-6 xl:gap-8">
                {navigation.map((item, index) => {
                  const subItems = item.subItems ?? []
                  const hasSubItems = subItems.length > 0
                  const href = getExternalHref(item.url)
                  const isActive = activeIndex === index
                  const linkClassName = navItemClassName(item, hasSubItems)

                  const labelContent = (
                    <>
                      <HeaderNavItemIcon item={item} surface="desktop" />
                      {item.label}
                    </>
                  )

                  return (
                    <li
                      key={item.id ?? `${item.label}-${index}`}
                      onMouseEnter={() => {
                        if (hasSubItems) {
                          setActiveIndex(index)
                        }
                      }}
                    >
                      {hasSubItems ? (
                        <button
                          type="button"
                          className={cn(linkClassName, isActive && 'text-primary')}
                          aria-expanded={isActive}
                          aria-haspopup="true"
                          onFocus={() => setActiveIndex(index)}
                        >
                          {labelContent}
                          <ChevronDown
                            size={16}
                            strokeWidth={2.5}
                            className={cn(
                              'opacity-70 transition-transform',
                              isActive && 'rotate-180',
                            )}
                          />
                        </button>
                      ) : href ? (
                        <ExternalLink
                          href={href}
                          openInNewTab={item.openInNewTab}
                          className={linkClassName}
                        >
                          {labelContent}
                        </ExternalLink>
                      ) : (
                        <span className={linkClassName}>{labelContent}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        ) : null}

        <div className="flex shrink-0 items-center justify-end gap-2">
          <HeaderDesktopActions />
          <HeaderMobileTopbarActions
            phones={phones}
            rightLinks={rightLinks}
            locale={locale}
          />
        </div>
      </div>

      {activeSubItems.length > 0 ? (
        <div className="absolute inset-x-0 top-full z-50 border-t border-border bg-background shadow-lg shadow-secondary/10">
          <div className="container py-9">
            <MegaMenuGrid items={activeSubItems} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
