export const LIVE_PREVIEW_COOKIE = 'payload-live-preview'
export const LIVE_PREVIEW_QUERY_PARAM = 'live-preview'

/** Origin админки Payload для postMessage в Live Preview (браузерный URL, не internal). */
export function getCmsLivePreviewServerUrl(): string {
  const fromEnv =
    process.env.PAYLOAD_SERVER_URL ??
    process.env.WEB_PUBLIC_URL ??
    process.env.CMS_PUBLIC_URL

  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }

  return 'http://localhost:3000'
}

export function isLivePreviewEnabled(cookieValue: string | undefined): boolean {
  return cookieValue === '1'
}
