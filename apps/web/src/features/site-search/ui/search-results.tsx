'use client'

import type { AppLocale } from '@iva360/shared'
import { ScrollArea } from '@iva360/ui/components/scroll-area'

import { cn } from '@/shared/lib/utils'

import { filterMockSearchResults, siteSearchLabels } from '../lib/mock-search-results'

type SearchResultsProps = {
  locale: AppLocale
  query: string
  className?: string
}

export function SearchResults({ locale, query, className }: SearchResultsProps) {
  const labels = siteSearchLabels[locale]
  const results = filterMockSearchResults(locale, query)
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return (
      <p className={cn('px-1 py-6 text-sm text-muted-foreground', className)}>{labels.empty}</p>
    )
  }

  if (results.length === 0) {
    return (
      <p className={cn('px-1 py-6 text-sm text-muted-foreground', className)}>{labels.noResults}</p>
    )
  }

  return (
    <ScrollArea className={cn('h-full min-h-0', className)}>
      <ul className="divide-y divide-border/60 pr-3">
        {results.map((result) => (
          <li key={result.id}>
            <button
              type="button"
              className="flex w-full flex-col gap-1 px-1 py-3 text-left transition-colors hover:text-primary"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {result.category}
              </span>
              <span className="text-base font-medium text-foreground">{result.title}</span>
              <span className="text-sm text-muted-foreground">{result.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
