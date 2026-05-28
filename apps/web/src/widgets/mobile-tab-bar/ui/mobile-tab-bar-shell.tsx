'use client'

import { useState } from 'react'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@iva360/ui/components/drawer'

import type { HeaderNavItemWithIcons } from '@/widgets/header/model/navigation'
import {
  ExternalLink,
  getExternalHref,
  HeaderNavItemIcon,
} from '@/widgets/header/ui/header-nav-parts'
import { cn } from '@/shared/lib/utils'

import { TabBarSubMenuList } from './tab-bar-sub-menu-list'

type MobileTabBarShellProps = {
  navigation: HeaderNavItemWithIcons[]
}

const tabButtonClassName =
  'flex h-full w-full flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium text-muted-foreground transition-colors hover:text-primary'

const tabLinkClassName =
  'flex h-full w-full flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium text-muted-foreground transition-colors hover:text-primary'

export function MobileTabBarShell({ navigation }: MobileTabBarShellProps) {
  const [drawerItem, setDrawerItem] = useState<HeaderNavItemWithIcons | null>(null)

  if (navigation.length === 0) {
    return null
  }

  const drawerSubItems =
    drawerItem?.subItems?.filter((subItem) => subItem.label.trim().length > 0) ?? []

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] lg:hidden"
        aria-label="Мобильная навигация"
      >
        <ul className="flex h-16">
          {navigation.map((item, index) => {
            const subItems = item.subItems?.filter((subItem) => subItem.label.trim().length > 0) ?? []
            const hasSubItems = subItems.length > 0
            const href = getExternalHref(item.url)
            const isDrawerOpen = drawerItem?.id === item.id

            if (hasSubItems) {
              return (
                <li key={item.id ?? `${item.label}-${index}`} className="min-w-0 flex-1">
                  <button
                    type="button"
                    className={cn(tabButtonClassName, isDrawerOpen && 'text-primary')}
                    aria-expanded={isDrawerOpen}
                    aria-haspopup="dialog"
                    onClick={() => setDrawerItem(item)}
                  >
                    <HeaderNavItemIcon item={item} surface="mobile" className="size-5" imgClassName="size-5" />
                    <span className="max-w-full truncate">{item.label}</span>
                  </button>
                </li>
              )
            }

            if (href) {
              return (
                <li key={item.id ?? `${item.label}-${index}`} className="min-w-0 flex-1">
                  <ExternalLink href={href} openInNewTab={item.openInNewTab} className={tabLinkClassName}>
                    <HeaderNavItemIcon item={item} surface="mobile" className="size-5" imgClassName="size-5" />
                    <span className="max-w-full truncate">{item.label}</span>
                  </ExternalLink>
                </li>
              )
            }

            return (
              <li key={item.id ?? `${item.label}-${index}`} className="min-w-0 flex-1">
                <span className={cn(tabButtonClassName, 'pointer-events-none')}>
                  <HeaderNavItemIcon item={item} surface="mobile" className="size-5" imgClassName="size-5" />
                  <span className="max-w-full truncate">{item.label}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </nav>

      <Drawer
        direction="bottom"
        open={drawerItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDrawerItem(null)
          }
        }}
      >
        <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
          <DrawerHeader className="border-b border-border/60 text-left">
            <DrawerTitle>{drawerItem?.label}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-2 pt-2">
            <TabBarSubMenuList
              items={drawerSubItems}
              onNavigate={() => setDrawerItem(null)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
