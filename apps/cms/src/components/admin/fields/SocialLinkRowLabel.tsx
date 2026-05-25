'use client'

import { useRowLabel } from '@payloadcms/ui'

type SocialLinkRowData = {
  platform?: 'vk' | 'telegram' | 'youtube' | 'other' | null
  url?: string | null
}

const platformLabels: Record<NonNullable<SocialLinkRowData['platform']>, string> = {
  vk: 'ВКонтакте',
  telegram: 'Telegram',
  youtube: 'YouTube',
  other: 'Другое',
}

function truncateUrl(url: string, maxLength = 40): string {
  if (url.length <= maxLength) {
    return url
  }

  return `${url.slice(0, maxLength - 1)}…`
}

export const SocialLinkRowLabel = () => {
  const { data, rowNumber } = useRowLabel<SocialLinkRowData>()

  const platform = data?.platform ? platformLabels[data.platform] : null
  const url = data?.url?.trim()

  if (platform && url) {
    return (
      <span>
        {platform} — {truncateUrl(url)}
      </span>
    )
  }

  if (platform) {
    return <span>{platform}</span>
  }

  if (url) {
    return <span>{truncateUrl(url)}</span>
  }

  if (typeof rowNumber === 'number') {
    return <span>Соцсеть {String(rowNumber + 1).padStart(2, '0')}</span>
  }

  return <span>Новая соцсеть</span>
}
