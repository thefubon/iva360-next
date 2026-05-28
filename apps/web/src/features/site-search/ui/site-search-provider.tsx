'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { AppLocale } from '@iva360/shared'

type SiteSearchContextValue = {
  locale: AppLocale
  open: boolean
  query: string
  setQuery: (query: string) => void
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
}

const SiteSearchContext = createContext<SiteSearchContextValue | null>(null)

type SiteSearchProviderProps = {
  locale: AppLocale
  children: ReactNode
}

export function SiteSearchProvider({ locale, children }: SiteSearchProviderProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const closeSearch = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  const openSearch = useCallback(() => {
    setOpen(true)
  }, [])

  const toggleSearch = useCallback(() => {
    setOpen((current) => {
      if (current) {
        setQuery('')
      }
      return !current
    })
  }, [])

  const value = useMemo(
    () => ({
      locale,
      open,
      query,
      setQuery,
      openSearch,
      closeSearch,
      toggleSearch,
    }),
    [locale, open, query, openSearch, closeSearch, toggleSearch],
  )

  return <SiteSearchContext.Provider value={value}>{children}</SiteSearchContext.Provider>
}

export function useSiteSearch() {
  const context = useContext(SiteSearchContext)
  if (!context) {
    throw new Error('useSiteSearch must be used within SiteSearchProvider')
  }
  return context
}
