'use client'

import type { TopbarLinkWithIcon } from '../model/topbar-link-with-icon'

import { CmsMediaIconView } from '@/entities/cms-media'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '@/shared/lib/utils'

import { topbarLinkClassName } from '../lib/constants'
import { getHugeicon } from '../lib/get-hugeicon'

type TopbarLinkViewProps = {
  link: TopbarLinkWithIcon
  className?: string
  onClick?: () => void
}

function TopbarLinkIcon({ link }: { link: TopbarLinkWithIcon }) {
  const iconType = link.iconType ?? 'hugeicons'

  if (iconType === 'none') {
    return null
  }

  if (iconType === 'custom') {
    if (!link.resolvedIcon) {
      return null
    }

    return (
      <CmsMediaIconView
        resolved={link.resolvedIcon}
        className="size-4"
        imgClassName="size-4"
        width={16}
        height={16}
      />
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

export function TopbarLinkView({ link, className, onClick }: TopbarLinkViewProps) {
  const href = link.url?.trim()
  const content = (
    <>
      <TopbarLinkIcon link={link} />
      <span>{link.number}</span>
    </>
  )
  const linkClassName = cn(topbarLinkClassName, className)

  if (!href) {
    return <span className={linkClassName}>{content}</span>
  }

  const external = link.openInNewTab === true

  return (
    <a
      href={href}
      className={linkClassName}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : undefined)}
    >
      {content}
    </a>
  )
}
