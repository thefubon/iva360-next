const ALLOWED_TAGS = new Set(['b', 'br', 'p', 'span', 'strong'])

const SCRIPT_TAG_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
const EVENT_HANDLER_ATTR_RE = /\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi
const TAG_RE = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
const STYLE_ATTR_RE = /\bstyle\s*=\s*("([^"]*)"|'([^']*)')/i
const COLOR_STYLE_RE = /^color\s*:\s*([^;]+)\s*;?\s*$/i
const SAFE_COLOR_RE =
  /^(#[0-9a-f]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\))$/i

function sanitizeSpanOpeningTag(match: string): string {
  const styleMatch = match.match(STYLE_ATTR_RE)
  if (!styleMatch) {
    return ''
  }

  const styleValue = (styleMatch[2] ?? styleMatch[3] ?? '').trim()
  const colorMatch = styleValue.match(COLOR_STYLE_RE)
  if (!colorMatch) {
    return ''
  }

  const color = colorMatch[1].trim()
  if (!SAFE_COLOR_RE.test(color)) {
    return ''
  }

  return `<span style="color: ${color.toLowerCase()}">`
}

/** Minimal HTML sanitizer for CMS TipTap output (allows b, br, p, span color, strong, nbsp). */
export function sanitizeCmsHtml(html: string): string {
  const withoutScripts = html.replace(SCRIPT_TAG_RE, '')
  const withoutHandlers = withoutScripts.replace(EVENT_HANDLER_ATTR_RE, '')

  return withoutHandlers.replace(TAG_RE, (match, tagName: string) => {
    const normalizedTag = tagName.toLowerCase()

    if (!ALLOWED_TAGS.has(normalizedTag)) {
      return ''
    }

    if (match.startsWith('</')) {
      return `</${normalizedTag}>`
    }

    if (normalizedTag === 'br') {
      return '<br>'
    }

    if (normalizedTag === 'span') {
      return sanitizeSpanOpeningTag(match)
    }

    return `<${normalizedTag}>`
  })
}

/** True when sanitized HTML has no visible text content. */
export function isEmptyCmsHtml(html: string): boolean {
  const text = sanitizeCmsHtml(html)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|&#160;|&#x0*a0;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .trim()

  return text.length === 0
}
