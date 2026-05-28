'use client'

import type { ReactNode } from 'react'

import { MobileSearchDrawer } from './mobile-search-drawer'
import { DesktopSearchDialog } from './desktop-search-dialog'

type SiteSearchRootProps = {
  children: ReactNode
}

export function SiteSearchRoot({ children }: SiteSearchRootProps) {
  return (
    <>
      {children}
      <DesktopSearchDialog />
      <MobileSearchDrawer />
    </>
  )
}
