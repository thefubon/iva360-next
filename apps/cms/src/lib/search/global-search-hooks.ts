import type { GlobalAfterChangeHook, GlobalConfig } from 'payload'

import { getGlobalAdminLabel } from './search-field-labels'
import { syncGlobalSearchIndex } from './sync-global-search-index'

export function withGlobalSearchIndex(global: GlobalConfig): GlobalConfig {
  const label =
    typeof global.label === 'string'
      ? global.label
      : getGlobalAdminLabel(typeof global.slug === 'string' ? global.slug : '')

  const syncHook: GlobalAfterChangeHook = async ({ doc, req }) => {
    await syncGlobalSearchIndex({
      data: doc as Record<string, unknown>,
      globalLabel: label,
      globalSlug: global.slug,
      payload: req.payload,
      req,
    })
  }

  return {
    ...global,
    hooks: {
      ...global.hooks,
      afterChange: [...(global.hooks?.afterChange ?? []), syncHook],
    },
  }
}
