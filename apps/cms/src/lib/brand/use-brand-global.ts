'use client'

import { useCallback, useEffect, useState } from 'react'

import type { BrandInput } from '@iva360/shared'

import {
  invalidateBrandGlobalCache,
  isBrandCacheFresh,
  readBrandCache,
  writeBrandCache,
} from '@/lib/brand/brand-global-cache'

type BrandGlobalState = {
  brand: BrandInput | null
  error: string | null
  isLoading: boolean
  refresh: () => void
}

export function useBrandGlobal(): BrandGlobalState {
  const cached = readBrandCache()
  const [brand, setBrand] = useState<BrandInput | null>(
    isBrandCacheFresh() ? (cached.brand as BrandInput) : null,
  )
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(!isBrandCacheFresh())

  const load = useCallback(async () => {
    if (isBrandCacheFresh()) {
      const { brand: cachedBrand } = readBrandCache()
      setBrand(cachedBrand as BrandInput)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/globals/brand?depth=2', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const json = (await response.json()) as BrandInput
      writeBrandCache(json)
      setBrand(json)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load brand')
      setBrand(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const refresh = useCallback(() => {
    invalidateBrandGlobalCache()
    void load()
  }, [load])

  return { brand, error, isLoading, refresh }
}

export { invalidateBrandGlobalCache } from '@/lib/brand/brand-global-cache'
