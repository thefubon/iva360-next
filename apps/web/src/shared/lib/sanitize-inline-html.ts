const ALLOWED_TAGS = new Set(['p', 'strong', 'br'])

/** Strip disallowed tags/attributes; keep p, strong, br and text (incl. nbsp). */
export function sanitizeInlineHtml(html: string): string {
  const withoutScripts = html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')

  return withoutScripts.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, rawTag: string) => {
    const tag = rawTag.toLowerCase()

    if (!ALLOWED_TAGS.has(tag)) {
      return ''
    }

    if (match.startsWith('</')) {
      return `</${tag}>`
    }

    if (tag === 'br') {
      return '<br>'
    }

    return `<${tag}>`
  })
}

/** True when sanitized HTML has no visible text content. */
export function isEmptyInlineHtml(html: string): boolean {
  const text = sanitizeInlineHtml(html)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|&#160;|&#x0*a0;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .trim()

  return text.length === 0
}
