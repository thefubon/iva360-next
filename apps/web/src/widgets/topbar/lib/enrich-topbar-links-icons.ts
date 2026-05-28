import type { TopbarLinkInput } from '@iva360/shared'

import { resolveCmsMediaIcon } from '@/entities/cms-media'

import type { TopbarLinkWithIcon } from '../model/topbar-link-with-icon'

export async function enrichTopbarLinksIcons(
  links: TopbarLinkInput[],
  cmsBaseUrl: string,
): Promise<TopbarLinkWithIcon[]> {
  return Promise.all(
    links.map(async (link) => ({
      ...link,
      resolvedIcon:
        link.iconType === 'custom' && link.customIcon
          ? await resolveCmsMediaIcon(link.customIcon, cmsBaseUrl)
          : null,
    })),
  )
}
