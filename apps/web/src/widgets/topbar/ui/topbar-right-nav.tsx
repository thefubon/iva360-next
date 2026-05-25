import type { TopbarLinkInput } from '@iva360/shared'

import { TopbarLink } from './topbar-link'

type TopbarRightNavProps = {
  links: TopbarLinkInput[]
  cmsBaseUrl: string
}

export function TopbarRightNav({ links, cmsBaseUrl }: TopbarRightNavProps) {
  if (links.length === 0) {
    return null
  }

  return (
    <>
      {links.map((link) => (
        <TopbarLink
          key={link.id ?? `${link.number}-${link.url ?? ''}`}
          link={link}
          cmsBaseUrl={cmsBaseUrl}
        />
      ))}
    </>
  )
}
