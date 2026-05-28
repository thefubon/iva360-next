import type { LivePreviewConfig } from 'payload'

import { getWebPublicUrl } from './webPublicUrl'

export const LIVE_PREVIEW_QUERY = 'live-preview=1'

/** Версии с черновиками и автосохранением — для глобальных настроек с Live Preview. */
export const globalVersionsConfig = {
  drafts: {
    autosave: {
      interval: 375,
    },
  },
  max: 50,
} as const

/** История изменений без черновиков — для коллекций вроде users/media. */
export const collectionAuditVersionsConfig = {
  maxPerDoc: 50,
} as const

export const livePreviewBreakpoints: NonNullable<LivePreviewConfig['breakpoints']> = [
  { name: 'mobile', label: 'Мобильный', width: 375, height: 667 },
  { name: 'tablet', label: 'Планшет', width: 768, height: 1024 },
  { name: 'desktop', label: 'Десктоп', width: 1280, height: 800 },
]

export function buildGlobalLivePreviewUrl(locale?: string | null | undefined): string {
  const base = getWebPublicUrl()
  const path = locale === 'en' ? '/en' : '/'

  return `${base}${path}?${LIVE_PREVIEW_QUERY}`
}

export function createGlobalLivePreviewConfig(): LivePreviewConfig {
  return {
    url: ({ locale }) => buildGlobalLivePreviewUrl(String(locale ?? 'ru')),
    breakpoints: livePreviewBreakpoints,
  }
}
