const NBSP = '\u00A0'

const CMS_TEXT_ENTITY_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/&nbsp;/gi, NBSP],
  [/&#160;/g, NBSP],
  [/&#x0*a0;/gi, NBSP],
]

/** Decodes safe HTML entities from plain CMS text fields (e.g. `&nbsp;` → non-breaking space). */
export function decodeCmsTextEntities(text: string): string {
  return CMS_TEXT_ENTITY_REPLACEMENTS.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    text,
  )
}

/** Keeps hyphenated words (e.g. «онлайн-коммуникаций») on one line. */
export function preventWordHyphenBreaks(text: string): string {
  return text.replace(/(\p{L})-(\p{L})/gu, '$1\u2011$2')
}

export function formatCmsDisplayText(text: string): string {
  return preventWordHyphenBreaks(decodeCmsTextEntities(text))
}
