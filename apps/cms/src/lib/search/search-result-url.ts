import { getGlobalAdminLabel } from './search-field-labels'

export type SearchResultDocLike = {
  globalSlug?: string | null
  globalFieldKey?: string | null
  doc?: {
    relationTo?: string
    value?: number | string | { id?: number | string } | null
  } | null
}

/** Admin path (without admin route prefix) for a search index row. */
export function getSearchResultAdminPath(doc: SearchResultDocLike): `/${string}` | null {
  const globalSlug = typeof doc.globalSlug === 'string' ? doc.globalSlug.trim() : ''

  if (globalSlug) {
    return `/globals/${globalSlug}` as `/${string}`
  }

  const relationTo = doc.doc?.relationTo
  const rawValue = doc.doc?.value

  if (!relationTo || rawValue == null) {
    return null
  }

  const id =
    typeof rawValue === 'object' && rawValue !== null && 'id' in rawValue
      ? rawValue.id
      : rawValue

  if (id == null || id === '') {
    return null
  }

  return `/collections/${relationTo}/${id}` as `/${string}`
}

export function getSearchResultDestinationLabel(doc: SearchResultDocLike): string {
  const globalSlug = typeof doc.globalSlug === 'string' ? doc.globalSlug.trim() : ''

  if (globalSlug) {
    return getGlobalAdminLabel(globalSlug)
  }

  if (doc.doc?.relationTo === 'users') {
    return 'Пользователь'
  }

  if (doc.doc?.relationTo) {
    return doc.doc.relationTo
  }

  return 'настройку'
}
