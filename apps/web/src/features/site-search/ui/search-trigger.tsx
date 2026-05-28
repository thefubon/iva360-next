'use client'

import { Search } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'
import { topbarLinkClassName } from '@/widgets/topbar/lib/constants'

import { siteSearchLabels } from '../lib/mock-search-results'
import { useSiteSearch } from './site-search-provider'

type SearchTriggerProps = {
  variant?: 'inline' | 'icon'
  className?: string
}

export function SearchTrigger({ variant = 'inline', className }: SearchTriggerProps) {
  const { locale, toggleSearch } = useSiteSearch()
  const labels = siteSearchLabels[locale]

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleSearch}
        className={cn(
          topbarLinkClassName,
          'inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:text-primary',
          className,
        )}
        aria-label={labels.trigger}
      >
        <Search size={20} className="size-5 shrink-0 text-current" aria-hidden />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleSearch}
      className={cn(topbarLinkClassName, className)}
      aria-label={labels.trigger}
    >
      <Search size={16} className="size-4 shrink-0 text-current" aria-hidden />
      <span>{labels.trigger}</span>
    </button>
  )
}
