'use client'

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@iva360/ui/components/drawer'

import { useIsDesktop } from '../lib/use-is-desktop'
import { useVisualViewportSize } from '../lib/use-visual-viewport-size'
import { siteSearchLabels } from '../lib/mock-search-results'
import { useSiteSearch } from './site-search-provider'
import { SearchField, SearchResultsSection } from './search-field'

export function MobileSearchDrawer() {
  const { locale, open, closeSearch } = useSiteSearch()
  const isDesktop = useIsDesktop()
  const mobileOpen = open && !isDesktop
  const labels = siteSearchLabels[locale]
  const viewport = useVisualViewportSize(mobileOpen)

  return (
    <Drawer
      direction="bottom"
      open={mobileOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeSearch()
        }
      }}
    >
      <DrawerContent
        className="z-[60] mt-0 flex flex-col rounded-none border-0 pb-0 lg:hidden data-[vaul-drawer-direction=bottom]:max-h-none"
        style={
          mobileOpen && viewport.height > 0
            ? {
                height: viewport.height,
                maxHeight: viewport.height,
                top: viewport.offsetTop,
                bottom: 'auto',
              }
            : undefined
        }
      >
        <DrawerTitle className="sr-only">{labels.trigger}</DrawerTitle>
        <div className="shrink-0 border-b border-border bg-background px-4 pt-2 pb-4">
          <SearchField autoFocus={mobileOpen} onClose={closeSearch} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <SearchResultsSection className="min-h-0 flex-1" />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
