import type { GlobalAfterChangeHook } from 'payload'

import { invalidateBrandGlobalCache } from '@/lib/brand/brand-global-cache'

export const invalidateBrandCacheAfterChange: GlobalAfterChangeHook = () => {
  invalidateBrandGlobalCache()
}
