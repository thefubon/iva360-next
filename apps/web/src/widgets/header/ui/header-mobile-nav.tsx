'use client'

import { useState } from 'react'

import type { HeaderNavItemWithIcons } from '../model/navigation'

import { Menu, X } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'

import {
  ExternalLink,
  getExternalHref,
  HeaderNavItemIcon,
  MegaMenuGrid,
} from './header-nav-parts'

type HeaderMobileNavProps = {
  navigation: HeaderNavItemWithIcons[]
}

const navLinkClassName =
  'inline-flex w-full items-center gap-2 py-2 text-base font-medium text-foreground transition-colors hover:text-primary'

export function HeaderMobileNav({ navigation }: HeaderMobileNavProps) {
  const [open, setOpen] = useState(false)

  if (navigation.length === 0) {
    return null
  }

  return (
    <div className="justify-self-end lg:hidden">
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:text-primary"
        aria-expanded={open}
        aria-controls="header-mobile-menu"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
      </button>

      {open ? (
        <div
          id="header-mobile-menu"
          className="absolute inset-x-0 top-full z-50 border-t border-border bg-background shadow-lg shadow-secondary/10"
        >
          <nav className="container py-4" aria-label="Мобильная навигация">
            <ul className="flex flex-col gap-1">
              {navigation.map((item, index) => {
                const subItems =
                  item.subItems?.filter((subItem) => subItem.label.trim().length > 0) ?? []
                const hasSubItems = subItems.length > 0
                const href = getExternalHref(item.url)

                return (
                  <li key={item.id ?? `${item.label}-${index}`} className="border-b border-border/60 last:border-0">
                    {hasSubItems ? (
                      <div className="py-2">
                        <span className={cn(navLinkClassName, 'pointer-events-none')}>
                          <HeaderNavItemIcon item={item} surface="mobile" />
                          {item.label}
                        </span>
                        <div className="pt-2 pl-2">
                          <MegaMenuGrid items={subItems} />
                        </div>
                      </div>
                    ) : href ? (
                      <ExternalLink
                        href={href}
                        openInNewTab={item.openInNewTab}
                        className={navLinkClassName}
                        onClick={() => setOpen(false)}
                      >
                        <HeaderNavItemIcon item={item} surface="mobile" />
                        {item.label}
                      </ExternalLink>
                    ) : (
                      <span className={navLinkClassName}>
                        <HeaderNavItemIcon item={item} surface="mobile" />
                        {item.label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  )
}
