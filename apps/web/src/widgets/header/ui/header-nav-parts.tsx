import type { ReactNode } from 'react'

import { CmsMediaIconView, decodeCmsTextEntities } from '@/entities/cms-media'

import type {
  HeaderNavItemWithIcons,
  HeaderNavSubItemWithIcon,
} from '../model/navigation'

export function shouldShowHeaderNavItemIcon(
  item: Pick<HeaderNavItemWithIcons, 'resolvedIcon' | 'mobileMenuOnly'>,
  surface: 'desktop' | 'mobile',
): boolean {
  if (!item.resolvedIcon) {
    return false
  }

  if (item.mobileMenuOnly) {
    return surface === 'mobile'
  }

  return true
}

type HeaderNavItemIconProps = {
  item: HeaderNavItemWithIcons
  surface: 'desktop' | 'mobile'
  className?: string
  imgClassName?: string
  width?: number
  height?: number
}

export function HeaderNavItemIcon({
  item,
  surface,
  className = 'size-5',
  imgClassName = 'size-5',
  width = 20,
  height = 20,
}: HeaderNavItemIconProps) {
  if (!shouldShowHeaderNavItemIcon(item, surface) || !item.resolvedIcon) {
    return null
  }

  return (
    <CmsMediaIconView
      resolved={item.resolvedIcon}
      className={className}
      imgClassName={imgClassName}
      width={width}
      height={height}
    />
  )
}

type ExternalLinkProps = {
  href: string
  openInNewTab?: boolean | null
  className?: string
  children: ReactNode
  onClick?: () => void
}

export function ExternalLink({
  href,
  openInNewTab,
  className,
  children,
  onClick,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : undefined)}
    >
      {children}
    </a>
  )
}

export function getExternalHref(url: string | null | undefined): string | null {
  const href = url?.trim()
  return href ? href : null
}

type MegaMenuGridProps = {
  items: HeaderNavSubItemWithIcon[]
}

export function MegaMenuGrid({ items }: MegaMenuGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => {
        const href = getExternalHref(item.url)
        const content = (
          <>
            {item.resolvedIcon ? (
              <CmsMediaIconView
                resolved={item.resolvedIcon}
                className="size-10"
                imgClassName="size-10"
                width={40}
                height={40}
              />
            ) : null}
            <span className="space-y-1">
              <span className="block text-xl font-semibold text-foreground transition-colors group-hover:text-primary">{item.label}</span>
              {item.description?.trim() ? (
                <span className="block text-sm leading-snug text-muted-foreground">
                  {decodeCmsTextEntities(item.description)}
                </span>
              ) : null}
            </span>
          </>
        )

        return (
          <li key={item.id ?? `${item.label}-${index}`}>
            {href ? (
              <ExternalLink
                href={href}
                openInNewTab={item.openInNewTab}
                className="group flex items-start gap-3"
              >
                {content}
              </ExternalLink>
            ) : (
              <div className="flex items-start gap-3">{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
