const BLOCK_BREAK_RE = /<\/(?:p|div|h[1-6]|li|blockquote)>/gi
const BR_RE = /<br\s*\/?>/gi
const TAG_RE = /<[^>]+>/g

const HTML_ENTITY_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/&nbsp;/gi, '\u00A0'],
  [/&#160;/g, '\u00A0'],
  [/&#x0*a0;/gi, '\u00A0'],
  [/&#x0*A0;/gi, '\u00A0'],
  [/&amp;/g, '&'],
  [/&lt;/g, '<'],
  [/&gt;/g, '>'],
  [/&quot;/g, '"'],
  [/&#39;/g, "'"],
]

/** Converts TipTap HTML into plain text for admin search indexing. */
export function plainTextFromHtml(html: string): string {
  const withBreaks = html
    .replace(BR_RE, '\n')
    .replace(BLOCK_BREAK_RE, '\n')
    .replace(TAG_RE, '')

  return HTML_ENTITY_REPLACEMENTS.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    withBreaks,
  )
    .replace(/\u00A0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}
