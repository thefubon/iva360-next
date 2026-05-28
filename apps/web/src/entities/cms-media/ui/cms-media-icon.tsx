import { cn } from '@/shared/lib/utils'

import {
  resolveCmsMediaIcon,
  type MediaLike,
  type ResolvedCmsMediaIcon,
} from '../lib/cms-media'

type CmsMediaIconViewProps = {
  resolved: ResolvedCmsMediaIcon
  className?: string
  imgClassName?: string
  width?: number
  height?: number
}

export function CmsMediaIconView({
  resolved,
  className,
  imgClassName,
  width,
  height,
}: CmsMediaIconViewProps) {
  if (resolved.kind === 'inline') {
    return (
      <span
        className={cn('inline-flex shrink-0 [&_svg]:size-full', className)}
        aria-hidden
        dangerouslySetInnerHTML={{ __html: resolved.markup }}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- CMS media URLs vary by storage backend
    <img
      src={resolved.url}
      alt=""
      width={width}
      height={height}
      className={cn('shrink-0 object-contain', imgClassName, className)}
    />
  )
}

type CmsMediaIconProps = {
  media: MediaLike
  cmsBaseUrl: string
  className?: string
  imgClassName?: string
  width?: number
  height?: number
}

export async function CmsMediaIcon({
  media,
  cmsBaseUrl,
  className,
  imgClassName,
  width,
  height,
}: CmsMediaIconProps) {
  const resolved = await resolveCmsMediaIcon(media, cmsBaseUrl)
  if (!resolved) {
    return null
  }

  return (
    <CmsMediaIconView
      resolved={resolved}
      className={className}
      imgClassName={imgClassName}
      width={width}
      height={height}
    />
  )
}
