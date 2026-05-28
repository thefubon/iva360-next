'use client'

import { useEffect, useRef } from 'react'

import { Input } from '@iva360/ui/components/input'
import { cn } from '@/shared/lib/utils'
import { Search, X } from '@/shared/lib/icons'

import { siteSearchLabels } from '../lib/mock-search-results'
import { useSiteSearch } from './site-search-provider'
import { SearchResults } from './search-results'

type SearchFieldProps = {
  autoFocus?: boolean
  onClose?: () => void
  className?: string
}

export function SearchField({ autoFocus = false, onClose, className }: SearchFieldProps) {
  const { locale, query, setQuery } = useSiteSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const labels = siteSearchLabels[locale]

  useEffect(() => {
    if (!autoFocus) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [autoFocus])

  return (
    <Input
      ref={inputRef}
      type="text"
      inputMode="search"
      enterKeyHint="search"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder={labels.placeholder}
      aria-label={labels.placeholder}
      role="searchbox"
      variant="primary"
      size="lg"
      className={className}
      iconLeft={<Search size={16} className="size-4 shrink-0" aria-hidden />}
      iconRight={
        onClose ? <X size={16} className="size-4 shrink-0" aria-hidden /> : undefined
      }
      iconRightInteractive={Boolean(onClose)}
      iconRightAriaLabel={onClose ? labels.close : undefined}
      onIconRightClick={onClose}
    />
  )
}

export function SearchResultsSection({ className }: { className?: string }) {
  const { locale, query } = useSiteSearch()

  return (
    <div className={cn('min-h-0', className)}>
      <SearchResults locale={locale} query={query} className="h-full" />
    </div>
  )
}
