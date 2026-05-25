type MediaLike = { url?: string | null } | number | null | undefined

export function resolveMediaUrl(media: MediaLike, cmsBaseUrl: string): string | null {
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
