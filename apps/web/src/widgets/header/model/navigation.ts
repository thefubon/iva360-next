import type { HeaderNavItemInput, HeaderNavSubItemInput } from '@iva360/shared'

import type { ResolvedCmsMediaIcon } from '@/entities/cms-media'

export type HeaderNavSubItemWithIcon = HeaderNavSubItemInput & {
  resolvedIcon?: ResolvedCmsMediaIcon | null
}

export type HeaderNavItemWithIcons = Omit<HeaderNavItemInput, 'subItems'> & {
  resolvedIcon?: ResolvedCmsMediaIcon | null
  subItems?: HeaderNavSubItemWithIcon[] | null
}
