import type { TopbarLinkInput } from '@iva360/shared'
import { HugeiconsIcon } from '@hugeicons/react'

import { cn } from '@/shared/lib/utils'

import { getHugeicon } from '../lib/get-hugeicon'
import { resolveMediaUrl } from '../lib/resolve-media-url'

const linkClassName =
  'inline-flex items-center gap-1.5 transition-colors hover:text-primary'

type TopbarLinkProps = {
  link: TopbarLinkInput
  cmsBaseUrl: string
}

function TopbarLinkIcon({
  link,
  cmsBaseUrl,
}: {
  link: TopbarLinkInput
  cmsBaseUrl: string
}) {
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

  const icon = getHugeicon(link.hugeiconsName ?? 'CallIcon')
  if (!icon) {
    return null
  }

  return (
    <HugeiconsIcon
      icon={icon}
      size={16}
      className="size-4 shrink-0 text-current"
      aria-hidden
    />
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
    return <span className={linkClassName}>{content}</span>
  }

  const external = link.openInNewTab === true

  return (
    <a
      href={href}
      className={cn(linkClassName)}
      {...(external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : undefined)}
    >
      {content}
    </a>
  )
}
