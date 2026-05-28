import type { Payload, PayloadRequest } from 'payload'

import {
  extractContextLabelSnippets,
  extractSearchableText,
} from './extract-searchable-text'
import {
  buildContextOnlySearchTitle,
  buildGlobalSearchTitle,
} from './search-field-labels'

const SEARCH_SLUG = 'search'
const GLOBAL_SEARCH_PRIORITY = 25

type SyncGlobalSearchIndexArgs = {
  globalSlug: string
  globalLabel: string
  data: Record<string, unknown>
  payload: Payload
  req?: PayloadRequest
}

/**
 * Rebuilds search index rows for one global (nav labels, link captions, etc.).
 */
export async function syncGlobalSearchIndex({
  globalSlug,
  globalLabel,
  data,
  payload,
  req,
}: SyncGlobalSearchIndexArgs): Promise<void> {
  const snippets = [
    ...extractSearchableText(data),
    ...extractContextLabelSnippets(data),
  ]
  const seen = new Set<string>()

  await payload.delete({
    collection: SEARCH_SLUG,
    depth: 0,
    overrideAccess: true,
    req,
    where: {
      globalSlug: {
        equals: globalSlug,
      },
    },
  })

  for (const snippet of snippets) {
    const dedupeKey = `${snippet.locale ?? 'default'}:${snippet.fieldPath}:${snippet.text}`
    if (seen.has(dedupeKey)) {
      continue
    }
    seen.add(dedupeKey)

    const title =
      snippet.kind === 'contextLabel'
        ? buildContextOnlySearchTitle(snippet.text, globalLabel)
        : buildGlobalSearchTitle(snippet.text, globalLabel, snippet.fieldPath)

    await payload.create({
      collection: SEARCH_SLUG,
      data: {
        globalSlug,
        globalFieldKey: `${globalSlug}:${snippet.fieldPath}:${snippet.locale ?? 'default'}:${snippet.kind ?? 'value'}`,
        priority: GLOBAL_SEARCH_PRIORITY,
        title,
      },
      depth: 0,
      locale: snippet.locale,
      overrideAccess: true,
      req,
    })
  }
}
