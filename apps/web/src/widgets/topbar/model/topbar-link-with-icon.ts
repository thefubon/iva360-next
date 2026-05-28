import type { TopbarLinkInput } from '@iva360/shared'

import type { ResolvedCmsMediaIcon } from '@/entities/cms-media'

export type TopbarLinkWithIcon = TopbarLinkInput & {
  resolvedIcon?: ResolvedCmsMediaIcon | null
}
