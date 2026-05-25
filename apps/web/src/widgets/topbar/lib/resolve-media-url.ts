import type { TopbarLinkInput } from '@iva360/shared'

export function resolveMediaUrl(
  media: TopbarLinkInput['customIcon'],
  cmsBaseUrl: string,
): string | null {
  if (!media || typeof media === 'number') {
    return null
  }

  const url = media.url
  if (!url) {
    return null
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const base = cmsBaseUrl.replace(/\/$/, '')
  return `${base}${url.startsWith('/') ? url : `/${url}`}`
}
