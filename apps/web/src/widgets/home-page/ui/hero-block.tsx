import { decodeCmsTextEntities, formatCmsDisplayText, resolveMediaUrl } from '@/entities/cms-media'
import { Button } from '@iva360/ui/components/button'
import Link from 'next/link'

import type {
  HeroBlockInput,
  HeroButtonVariant,
  HeroSubscriptionBadgeInput,
  MediaInput,
} from '@iva360/shared'

type HeroBlockProps = {
  block: HeroBlockInput
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
  headline: string,
): string {
  if (image && typeof image === 'object') {
    const alt = image.alt?.trim()
    if (alt) {
      return alt
    }
  }

  return headline
}

function sanitizeHexColor(value: string | null | undefined, fallback: string): string {
  if (!value) {
    return fallback
  }

  const trimmed = value.trim()
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) {
    return trimmed
  }

  return fallback
}

function HeroSubscriptionBadge({
  badge,
  cmsBaseUrl,
}: {
  badge: HeroSubscriptionBadgeInput & { label: string; url: string }
  cmsBaseUrl: string
}) {
  const backgroundColor = sanitizeHexColor(badge.backgroundColor, '#FFFFFF')
  const textColor = sanitizeHexColor(badge.textColor, '#000000')
  const imageUrl = resolveMediaUrl(badge.image, cmsBaseUrl)
  const label = decodeCmsTextEntities(badge.label)

  return (
    <Link
      href={badge.url}
      className="inline-flex h-9 items-center gap-2.5 rounded-full px-3 text-sm font-semibold leading-none transition-opacity hover:opacity-90"
      style={{
        backgroundColor,
        color: textColor,
      }}
      {...(badge.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : undefined)}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- CMS media URLs are dynamic
        <img
          src={imageUrl}
          alt=""
          className="size-6 shrink-0 object-contain"
          width={24}
          height={24}
        />
      ) : null}
      <span>{label}</span>
    </Link>
  )
}

export function HeroBlock({ block, cmsBaseUrl }: HeroBlockProps) {
  const { headlineSection } = block
  const image = block.imageSection?.image
  const imageUrl = resolveMediaUrl(image, cmsBaseUrl)
  const imageAlt = resolveImageAlt(image, headlineSection.headline)
  const badges = (block.subscriptionsSection?.badges ?? [])
    .map((badge) => ({
      ...badge,
      label: badge.label?.trim(),
      url: badge.url?.trim(),
    }))
    .filter(
      (badge): badge is typeof badge & { label: string; url: string } =>
        Boolean(badge.label && badge.url),
    )
  const buttons = (block.buttonsSection?.buttons ?? [])
    .map((button) => ({
      label: button.label?.trim(),
      url: button.url?.trim(),
      variant: resolveButtonVariant(button.variant),
      openInNewTab: button.openInNewTab === true,
    }))
    .filter((button): button is typeof button & { label: string; url: string } =>
      Boolean(button.label && button.url),
    )
    .slice(0, 2)

  return (
    <section className="bg-background">
      <div className="container py-6 lg:py-16">
        <div
          className={
            imageUrl
              ? 'grid items-center gap-8 lg:grid-cols-2 lg:gap-12'
              : 'flex flex-col gap-4'
          }
        >
          <div className="order-2 flex w-full flex-col items-start gap-6 sm:gap-8 lg:order-1">
            <h1 className="text-fluid-h1 max-w-full font-bold tracking-[0.015em] text-foreground">
              {formatCmsDisplayText(headlineSection.headline)}
            </h1>
            {badges.length > 0 ? (
              <div className="flex w-full flex-wrap gap-2.5 pt-1">
                {badges.map((badge, index) => (
                  <HeroSubscriptionBadge
                    key={badge.id ?? `${badge.url}-${index}`}
                    badge={badge}
                    cmsBaseUrl={cmsBaseUrl}
                  />
                ))}
              </div>
            ) : null}
            {buttons.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {buttons.map((button, index) => (
                  <Button
                    key={`${button.url}-${index}`}
                    nativeButton={false}
                    render={
                      <Link
                        href={button.url}
                        {...(button.openInNewTab
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : undefined)}
                      />
                    }
                    size="2xl"
                    variant={button.variant}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
          {imageUrl ? (
            <div className="relative order-1 overflow-hidden rounded-2xl lg:order-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- CMS media URLs are dynamic */}
              <img
                src={imageUrl}
                alt={imageAlt}
                className="h-auto w-full object-cover"
                width={
                  typeof image === 'object' && image?.width
                    ? Number(image.width)
                    : undefined
                }
                height={
                  typeof image === 'object' && image?.height
                    ? Number(image.height)
                    : undefined
                }
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
