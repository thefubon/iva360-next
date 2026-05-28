import {
  CmsMediaIconView,
  decodeCmsTextEntities,
  resolveCmsMediaIcon,
  resolveMediaUrl,
} from '@/entities/cms-media'
import { cn } from '@/shared/lib/utils'
import { Button } from '@iva360/ui/components/button'
import Link from 'next/link'

import type {
  FeatureSectionBlockInput,
  HeroButtonVariant,
  MediaInput,
} from '@iva360/shared'

type FeatureSectionBlockProps = {
  block: FeatureSectionBlockInput
  cmsBaseUrl: string
}

function resolveButtonVariant(
  variant: HeroButtonVariant | null | undefined,
): 'default' | 'secondary' | 'outline' | 'white' | 'green' {
  switch (variant) {
    case 'secondary':
      return 'secondary'
    case 'outline':
      return 'outline'
    case 'white':
      return 'white'
    case 'green':
      return 'green'
    case 'primary':
    default:
      return 'default'
  }
}

function resolveImageAlt(
  image: MediaInput | number | null | undefined,
  title: string,
): string {
  if (image && typeof image === 'object') {
    const alt = image.alt?.trim()
    if (alt) {
      return alt
    }
  }

  return title
}

export async function FeatureSectionBlock({ block, cmsBaseUrl }: FeatureSectionBlockProps) {
  const image = block.imageSection?.image
  const imageUrl = resolveMediaUrl(image, cmsBaseUrl)
  const imageAlt = resolveImageAlt(image, block.title)
  const imageOnLeft = block.imageSection?.position === 'left'
  const imageRounded = block.imageSection?.roundedImage === true
  const resolvedIcon = block.icon ? await resolveCmsMediaIcon(block.icon, cmsBaseUrl) : null
  const description = block.description?.trim()
  const buttonLabel = block.buttonSection?.label?.trim()
  const buttonUrl = block.buttonSection?.url?.trim()
  const buttonVariant = resolveButtonVariant(block.buttonSection?.variant)
  const buttonOpenInNewTab = block.buttonSection?.openInNewTab === true
  const hasButton = Boolean(buttonLabel && buttonUrl)

  const contentColumn = (
    <div className="@container flex flex-col">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          {resolvedIcon ? (
            <CmsMediaIconView
              resolved={resolvedIcon}
              className="size-10 shrink-0 lg:size-16"
              imgClassName="size-10 object-contain lg:size-16"
              width={64}
              height={64}
            />
          ) : null}
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-fluid-h2 font-semibold tracking-tight text-foreground">
              {decodeCmsTextEntities(block.title)}
            </h2>
            {block.showBetaBadge ? (
              <span className="inline-flex items-center rounded-full bg-background px-2.5 py-0.5 text-xs font-medium lowercase text-muted-foreground">
                beta
              </span>
            ) : null}
          </div>
        </div>
        {description ? (
          <p className="text-fluid-body leading-relaxed whitespace-pre-line text-foreground">
            {decodeCmsTextEntities(description)}
          </p>
        ) : null}
      </div>
      {hasButton ? (
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
          <Button
            nativeButton={false}
            render={
              <Link
                href={buttonUrl!}
                {...(buttonOpenInNewTab
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : undefined)}
              />
            }
            className="w-full sm:w-auto"
            size="xl"
            variant={buttonVariant}
          >
            {buttonLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )

  const imageColumn = imageUrl ? (
    <div className={cn('overflow-hidden', imageRounded && 'rounded-md')}>
      {/* eslint-disable-next-line @next/next/no-img-element -- CMS media URLs are dynamic */}
      <img
        src={imageUrl}
        alt={imageAlt}
        className="h-auto w-full object-cover"
        width={typeof image === 'object' && image?.width ? Number(image.width) : undefined}
        height={typeof image === 'object' && image?.height ? Number(image.height) : undefined}
      />
    </div>
  ) : null

  return (
    <section>
      <div className="container py-3 lg:py-6">
        <div className="rounded-2xl bg-muted p-6 lg:p-12">
          {imageUrl ? (
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {imageOnLeft ? (
                <>
                  <div className="order-1 lg:order-1">{imageColumn}</div>
                  <div className="order-2 lg:order-2">{contentColumn}</div>
                </>
              ) : (
                <>
                  <div className="order-2 lg:order-1">{contentColumn}</div>
                  <div className="order-1 lg:order-2">{imageColumn}</div>
                </>
              )}
            </div>
          ) : (
            contentColumn
          )}
        </div>
      </div>
    </section>
  )
}
