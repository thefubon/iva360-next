import { looksLikeHtml, plainTextFromHtml } from '@/lib/tiptap/plain-text-from-html'
import {
  getFieldGroupLabel,
  isJunkSearchText,
  isSearchableLeafField,
} from './search-field-labels'

const LOCALE_CODES = ['ru', 'en'] as const

export type SearchableSnippet = {
  text: string
  locale?: string
  fieldPath: string
  kind?: 'value' | 'contextLabel'
}

function isLocaleMap(value: Record<string, unknown>): boolean {
  const keys = Object.keys(value)
  if (keys.length === 0) return false
  return keys.every((key) => LOCALE_CODES.includes(key as (typeof LOCALE_CODES)[number]))
}

function isMediaObject(value: Record<string, unknown>): boolean {
  return (
    typeof value.filename === 'string' ||
    typeof value.mimeType === 'string' ||
    typeof value.url === 'string'
  )
}

function pushSnippet(
  snippets: SearchableSnippet[],
  fieldPath: string,
  text: string,
  locale?: string,
): void {
  if (!isSearchableLeafField(fieldPath) || isJunkSearchText(text)) {
    return
  }

  snippets.push({ text, fieldPath, locale, kind: 'value' })
}

/**
 * Emits group/field admin labels (e.g. «Контакты») for paths present in the document,
 * so search finds sections even when inner fields are empty.
 */
export function extractContextLabelSnippets(
  value: unknown,
  fieldPath = '',
  snippets: SearchableSnippet[] = [],
  seenPaths = new Set<string>(),
): SearchableSnippet[] {
  if (value == null) {
    return snippets
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const nextPath = fieldPath ? `${fieldPath}.${index}` : String(index)
      extractContextLabelSnippets(item, nextPath, snippets, seenPaths)
    })
    return snippets
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>

    if (isMediaObject(obj)) {
      return snippets
    }

    if (isLocaleMap(obj)) {
      return snippets
    }

    for (const [key, child] of Object.entries(obj)) {
      if (key === 'id' || key.startsWith('_')) {
        continue
      }

      const nextPath = fieldPath ? `${fieldPath}.${key}` : key
      const groupLabel = getFieldGroupLabel(nextPath)

      if (groupLabel && !seenPaths.has(nextPath)) {
        seenPaths.add(nextPath)
        snippets.push({
          text: groupLabel,
          fieldPath: nextPath,
          kind: 'contextLabel',
        })
      }

      if (nextPath.includes('.subItems') && Array.isArray(child) && !seenPaths.has(`submenu:${nextPath}`)) {
        seenPaths.add(`submenu:${nextPath}`)
        snippets.push({
          text: 'Подменю',
          fieldPath: nextPath,
          kind: 'contextLabel',
        })
      }

      extractContextLabelSnippets(child, nextPath, snippets, seenPaths)
    }
  }

  return snippets
}

/**
 * Collects human-readable strings from a global document for admin search indexing.
 * Only indexes meaningful labels and text fields (nav items, link captions, etc.).
 */
export function extractSearchableText(
  value: unknown,
  fieldPath = '',
  snippets: SearchableSnippet[] = [],
): SearchableSnippet[] {
  if (value == null) {
    return snippets
  }

  if (typeof value === 'string') {
    const text = looksLikeHtml(value) ? plainTextFromHtml(value) : value.trim()
    pushSnippet(snippets, fieldPath, text)
    return snippets
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return snippets
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const nextPath = fieldPath ? `${fieldPath}.${index}` : String(index)
      extractSearchableText(item, nextPath, snippets)
    })
    return snippets
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>

    if (isMediaObject(obj)) {
      return snippets
    }

    if (isLocaleMap(obj)) {
      for (const locale of LOCALE_CODES) {
        const localized = obj[locale]
        if (typeof localized === 'string') {
          const text = looksLikeHtml(localized) ? plainTextFromHtml(localized) : localized.trim()
          pushSnippet(snippets, fieldPath, text, locale)
        }
      }
      return snippets
    }

    for (const [key, child] of Object.entries(obj)) {
      if (key === 'id' || key.startsWith('_')) {
        continue
      }
      const nextPath = fieldPath ? `${fieldPath}.${key}` : key
      extractSearchableText(child, nextPath, snippets)
    }
  }

  return snippets
}
