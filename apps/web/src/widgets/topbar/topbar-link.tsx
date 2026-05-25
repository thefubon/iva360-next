import type { TopbarLinkInput } from '@iva360/shared'
import { HugeiconsIcon } from '@hugeicons/react'

import { resolveMediaUrl } from '@/shared/lib/resolve-media-url'
import { cn } from '@/shared/lib/utils'

import { topbarLinkClassName } from './lib/constants'
import { getHugeicon } from './lib/get-hugeicon'

type TopbarLinkProps = {
  link: TopbarLinkInput
  cmsBaseUrl: string
}

function TopbarLinkIcon({ link, cmsBaseUrl }: { link: TopbarLinkInput; cmsBaseUrl: string }) {
  const iconType = link.iconType ?? 'hugeicons'

  if (iconType === 'none') {
    return null
  }

  if (iconType === 'custom') {
    const src = resolveMediaUrl(link.customIcon, cmsBaseUrl)
    if (!src) {
      return null
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element -- CMS media URLs vary by storage backend
      <img src={src} alt="" width={16} height={16} className="size-4 shrink-0 object-contain" />
    )
  }

  const icon = getHugeicon(link.hugeiconsName ?? 'Call02Icon')
  if (!icon) {
    return null
  }

  return (
    <HugeiconsIcon icon={icon} size={16} className="size-4 shrink-0 text-current" aria-hidden />
  )
}

export function TopbarLink({ link, cmsBaseUrl }: TopbarLinkProps) {
  const href = link.url?.trim()
  const content = (
    <>
      <TopbarLinkIcon link={link} cmsBaseUrl={cmsBaseUrl} />
      <span>{link.number}</span>
    </>
  )

  if (!href) {
    return <span className={topbarLinkClassName}>{content}</span>
  }

  const external = link.openInNewTab === true

  return (
    <a
      href={href}
      className={cn(topbarLinkClassName)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : undefined)}
    >
      {content}
    </a>
  )
}
