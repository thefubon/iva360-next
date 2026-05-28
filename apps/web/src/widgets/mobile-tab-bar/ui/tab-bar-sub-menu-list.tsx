import { CmsMediaIconView } from '@/entities/cms-media'

import type { HeaderNavSubItemWithIcon } from '@/widgets/header/model/navigation'
import { ExternalLink, getExternalHref } from '@/widgets/header/ui/header-nav-parts'

type TabBarSubMenuListProps = {
  items: HeaderNavSubItemWithIcon[]
  onNavigate?: () => void
}

export function TabBarSubMenuList({ items, onNavigate }: TabBarSubMenuListProps) {
  return (
    <ul className="flex flex-col">
      {items.map((item, index) => {
        const href = getExternalHref(item.url)
        const content = (
          <>
            {item.resolvedIcon ? (
              <CmsMediaIconView
                resolved={item.resolvedIcon}
                className="size-6 shrink-0"
                imgClassName="size-6"
                width={24}
                height={24}
              />
            ) : (
              <span aria-hidden className="size-6 shrink-0" />
            )}
            <span className="text-base font-medium text-foreground">{item.label}</span>
          </>
        )

        return (
          <li key={item.id ?? `${item.label}-${index}`} className="border-b border-border/60 last:border-0">
            {href ? (
              <ExternalLink
                href={href}
                openInNewTab={item.openInNewTab}
                className="flex items-center gap-3 px-1 py-3 transition-colors hover:text-primary"
                onClick={onNavigate}
              >
                {content}
              </ExternalLink>
            ) : (
              <div className="flex items-center gap-3 px-1 py-3">{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
