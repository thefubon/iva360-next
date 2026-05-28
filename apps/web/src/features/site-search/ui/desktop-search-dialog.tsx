'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@iva360/ui/components/dialog'

import { cn } from '@/shared/lib/utils'

import { siteSearchLabels } from '../lib/mock-search-results'
import { useIsDesktop } from '../lib/use-is-desktop'
import { useSiteSearch } from './site-search-provider'
import { SearchField, SearchResultsSection } from './search-field'

export function DesktopSearchDialog() {
  const { locale, open, closeSearch, query } = useSiteSearch()
  const isDesktop = useIsDesktop()
  const dialogOpen = open && isDesktop
  const labels = siteSearchLabels[locale]
  const hasQuery = query.trim().length > 0

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeSearch()
        }
      }}
    >
      <DialogContent
        className={cn(
          'flex w-full min-w-[680px] max-w-[960px] flex-col gap-4',
          hasQuery && 'min-h-[560px] max-h-[min(640px,calc(100vh-6rem))]',
        )}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle>{labels.trigger}</DialogTitle>
        </DialogHeader>
        <SearchField autoFocus={dialogOpen} className="shrink-0" />
        <SearchResultsSection
          className={cn(hasQuery ? 'min-h-0 flex-1' : 'max-h-40')}
        />
      </DialogContent>
    </Dialog>
  )
}
