'use client'

import { useState } from 'react'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@iva360/ui/components/drawer'

import type { TopbarLinkWithIcon } from '@/widgets/topbar/model/topbar-link-with-icon'
import { TopbarRightNav } from '@/widgets/topbar/ui/topbar-right-nav'
import { TopbarLinkView } from '@/widgets/topbar/ui/topbar-link-view'
import { Menu } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'

type HeaderTopbarDrawerProps = {
  phones: TopbarLinkWithIcon[]
  rightLinks: TopbarLinkWithIcon[]
}

const listItemLinkClassName =
  'inline-flex w-full items-center gap-2 py-3 text-base text-foreground transition-colors hover:text-primary'

export function HeaderTopbarDrawer({
  phones,
  rightLinks,
}: HeaderTopbarDrawerProps) {
  const [open, setOpen] = useState(false)

  function closeDrawer() {
    setOpen(false)
  }

  return (
    <Drawer direction="top" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:text-primary lg:hidden"
          aria-label="Открыть контакты и меню"
        >
          <Menu size={24} aria-hidden />
        </button>
      </DrawerTrigger>
      <DrawerContent className="top-16 mt-0 max-h-[calc(100dvh-4rem)] rounded-none border-b">
        <DrawerHeader className="border-b border-border/60 text-left">
          <DrawerTitle>Контакты и сервисы</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <nav className="container py-2 text-sm" aria-label="Контакты и сервисы">
            {phones.length > 0 ? (
              <ul className="flex flex-col border-b border-border/60">
                {phones.map((phone) => (
                  <li key={phone.id ?? `${phone.number}-${phone.url ?? ''}`}>
                    <TopbarLinkView
                      link={phone}
                      className={listItemLinkClassName}
                      onClick={closeDrawer}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
            <TopbarRightNav
              links={rightLinks}
              variant="list"
              linkClassName={listItemLinkClassName}
              onNavigate={closeDrawer}
              className={cn(phones.length > 0 && 'pt-1')}
            />
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
