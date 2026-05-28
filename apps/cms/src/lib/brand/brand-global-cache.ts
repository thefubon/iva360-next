let cachedBrand: unknown = null
let cacheTimestamp = 0

export const BRAND_CACHE_TTL_MS = 5_000

export function readBrandCache(): { brand: unknown; timestamp: number } {
  return { brand: cachedBrand, timestamp: cacheTimestamp }
}

export function writeBrandCache(brand: unknown): void {
  cachedBrand = brand
  cacheTimestamp = Date.now()
}

export function invalidateBrandGlobalCache(): void {
  cachedBrand = null
  cacheTimestamp = 0
}

export function isBrandCacheFresh(): boolean {
  if (!cachedBrand) {
    return false
  }

  return Date.now() - cacheTimestamp < BRAND_CACHE_TTL_MS
}
