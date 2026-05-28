import type { MediaInput } from '@iva360/shared'

import { resolveMediaUrl } from './resolve-media-url'

export type MediaLike = MediaInput | number | null | undefined

export type ResolvedCmsMediaIcon =
  | { kind: 'inline'; markup: string }
  | { kind: 'image'; url: string }

export function isSvgMedia(media: MediaLike): boolean {
  if (!media || typeof media === 'number') {
    return false
  }

  const mimeType = media.mimeType?.toLowerCase()
  if (mimeType === 'image/svg+xml') {
    return true
  }

  const filename = media.filename?.toLowerCase() ?? media.url?.toLowerCase() ?? ''
  return filename.endsWith('.svg')
}

/** Strips unsafe markup before inlining CMS SVG in the DOM. */
export function sanitizeInlineSvg(svg: string): string {
  let result = svg.trim()
  if (!/^<svg[\s>]/i.test(result)) {
    return ''
  }

  result = result.replace(/<script[\s\S]*?<\/script>/gi, '')
  result = result.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
  result = result.replace(/\s(on\w+)=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  result = result.replace(
    /\s(xlink:href|href)\s*=\s*("|')?\s*javascript:[^"']*\2?/gi,
    '',
  )

  return result
}

export async function fetchSvgMarkup(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } })
    if (!response.ok) {
      return null
    }

    const markup = sanitizeInlineSvg(await response.text())
    return markup || null
  } catch {
    return null
  }
}

export async function resolveCmsMediaIcon(
  media: MediaLike,
  cmsBaseUrl: string,
): Promise<ResolvedCmsMediaIcon | null> {
  const url = resolveMediaUrl(media, cmsBaseUrl)
  if (!url) {
    return null
  }

  if (isSvgMedia(media)) {
    const markup = await fetchSvgMarkup(url)
    if (markup) {
      return { kind: 'inline', markup }
    }
  }

  return { kind: 'image', url }
}
