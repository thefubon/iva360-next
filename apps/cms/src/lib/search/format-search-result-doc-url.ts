import { formatAdminURL } from 'payload/shared'
import type { PayloadRequest } from 'payload'

import { getSearchResultAdminPath, type SearchResultDocLike } from './search-result-url'

export function formatSearchResultDocURL({
  defaultURL,
  doc,
  req,
}: {
  defaultURL: string
  doc: Record<string, unknown>
  req: PayloadRequest
}): string | null {
  const targetPath = getSearchResultAdminPath(doc as SearchResultDocLike)

  if (!targetPath) {
    return defaultURL
  }

  return formatAdminURL({
    adminRoute: req.payload.config.routes.admin,
    path: targetPath,
    serverURL: req.payload.config.serverURL,
  })
}
