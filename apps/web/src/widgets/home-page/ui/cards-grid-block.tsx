import {
  CmsMediaIconView,
  decodeCmsTextEntities,
  resolveCmsMediaIcon,
  resolveMediaUrl,
} from '@/entities/cms-media'
import { cn } from '@/shared/lib/utils'
import { Button } from '@iva360/ui/components/button'
import Link from 'next/link'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'

import type {
  CardsGridBlockInput,
  CardsGridCardInput,
  CardsGridColumns,
  CardsGridContentAlign,
  CardsGridContentPosition,
  CardsGridGridSpan,
  CardsGridImageAlign,
  CardsGridLinkMode,
  CardsGridMediaType,
  HeroButtonVariant,
  MediaInput,
} from '@iva360/shared'

import {
  isStackLayoutMode,
  resolveCardPaddingClasses,
  resolveCardsGridLayoutMode,
  resolveContentColumnClasses,
  resolveContentPositionClasses,
  resolveImagePosition,
  resolveImageWrapperClasses,
  resolveSideContentColumnClasses,
  resolveSideImageColumnClasses,
  resolveSideImageLayoutOrders,
  resolveSideLayoutContainerClasses,
  resolveStackLayoutContainerClasses,
} from '../lib/cards-grid-layout'

type CardsGridBlockProps = {
  block: CardsGridBlockInput
  brand: BrandInput | null
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

function resolveMediaType(card: CardsGridCardInput): CardsGridMediaType {
  if (
    card.img?.mediaType === 'none' ||
    card.img?.mediaType === 'icon' ||
    card.img?.mediaType === 'image'
  ) {
    return card.img.mediaType
  }

  return 'none'
}

function resolveImageAlign(card: CardsGridCardInput): CardsGridImageAlign {
  const align = card.img?.imageAlign
  if (align === 'top' || align === 'bottom' || align === 'stretch') {
    return align
  }

  return 'top'
}

function resolveImageClasses(imageAlign: CardsGridImageAlign): string {
  return cn(
    'w-full object-cover',
    imageAlign === 'stretch' ? 'h-full' : 'h-auto',
    imageAlign === 'top' && 'object-top',
    imageAlign === 'bottom' && 'object-bottom',
  )
}

function resolveGridColumnClasses(columns: CardsGridColumns | null | undefined): string {
  // Mobile (< md): 1 column. Tablet (md–lg-1): always 2 columns. Desktop (lg+): CMS columns.
  const desktopColumns = (() => {
    switch (columns) {
      case '1':
        return 'lg:grid-cols-1'
      case '4':
        return 'lg:grid-cols-2 xl:grid-cols-4'
      case '3':
        return 'lg:grid-cols-3'
      case '2':
      default:
        return 'lg:grid-cols-2'
    }
  })()

  return cn('grid-cols-1', 'md:max-lg:grid-cols-2', desktopColumns)
}

function sanitizeHexColor(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) {
    return trimmed
  }

  return null
}

function resolveBrandBackgroundHex(
  brandBackgroundId: string | null | undefined,
  brand: BrandInput | null,
): string | null {
  const id = brandBackgroundId?.trim()
  if (!id) {
    return null
  }

  const preset = brand?.backgrounds?.find((item) => item.id === id)
  return sanitizeHexColor(preset?.color)
}

function resolveCardBackgroundStyle(
  card: CardsGridCardInput,
  brand: BrandInput | null,
): CSSProperties | undefined {
  const mode = card.backgroundMode ?? (card.backgroundColor ? 'custom' : 'default')

  switch (mode) {
    case 'brand': {
      const color = resolveBrandBackgroundHex(card.brandBackgroundId, brand)
      return color ? { backgroundColor: color } : undefined
    }
    case 'custom': {
      const color = sanitizeHexColor(card.backgroundColor)
      return color ? { backgroundColor: color } : undefined
    }
    case 'default':
    default:
      return undefined
  }
}

function resolveCardGridSpanClasses(
  gridSpan: CardsGridGridSpan | null | undefined,
  columns: CardsGridColumns | null | undefined,
): string {
  const span = gridSpan ?? '1'
  if (span === '1') {
    return ''
  }

  // Mobile & tablet: gridSpan ignored (1 col mobile, 1/2 tablet). Desktop (lg+): CMS gridSpan.
  switch (columns) {
    case '1':
      return 'lg:col-span-full'
    case '4':
      if (span === '2') {
        return 'lg:col-span-2 xl:col-span-2'
      }
      return 'lg:col-span-full xl:col-span-full'
    case '3':
      if (span === '2') {
        return 'lg:col-span-2'
      }
      return 'lg:col-span-full'
    case '2':
    default:
      if (span === '2') {
        return 'lg:col-span-2'
      }
      return 'lg:col-span-full'
  }
}

function resolveLinkMode(linkMode: CardsGridLinkMode | null | undefined): CardsGridLinkMode {
  if (linkMode === 'card' || linkMode === 'button') {
    return linkMode
  }

  return 'none'
}

function resolveContentAlign(card: CardsGridCardInput): CardsGridContentAlign {
  const align = card.content?.align
  if (align === 'left' || align === 'center') {
    return align
  }

  return 'left'
}

function resolveContentPosition(card: CardsGridCardInput): CardsGridContentPosition {
  const position = card.content?.position
  if (position === 'top' || position === 'center') {
    return position
  }

  return 'top'
}

function resolveContentAlignClasses(contentAlign: CardsGridContentAlign): string {
  switch (contentAlign) {
    case 'center':
      return 'text-center items-center'
    case 'left':
    default:
      return 'text-left items-start'
  }
}

function resolveCardLinkProps(
  url: string,
  openInNewTab: boolean,
  ariaLabel: string,
): Pick<ComponentProps<typeof Link>, 'href' | 'target' | 'rel' | 'aria-label'> {
  return {
    href: url,
    'aria-label': ariaLabel,
    ...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : undefined),
  }
}

type CardsGridCardSurfaceProps = {
  card: CardsGridCardInput
  brand: BrandInput | null
  className?: string
  isCardLink: boolean
  cardLinkUrl?: string
  cardLinkOpenInNewTab: boolean
  cardLinkAriaLabel: string
  children: ReactNode
}

function CardsGridCardSurface({
  card,
  brand,
  className,
  isCardLink,
  cardLinkUrl,
  cardLinkOpenInNewTab,
  cardLinkAriaLabel,
  children,
}: CardsGridCardSurfaceProps) {
  const cardBackgroundStyle = resolveCardBackgroundStyle(card, brand)
  const surfaceClassName = cn(
    'h-full rounded-2xl',
    !cardBackgroundStyle && 'bg-muted',
    isCardLink &&
      'block transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    className,
  )

  if (isCardLink && cardLinkUrl) {
    return (
      <Link
        {...resolveCardLinkProps(cardLinkUrl, cardLinkOpenInNewTab, cardLinkAriaLabel)}
        className={surfaceClassName}
        style={cardBackgroundStyle}
      >
        {children}
      </Link>
    )
  }

  return (
    <div className={surfaceClassName} style={cardBackgroundStyle}>
      {children}
    </div>
  )
}

type CardsGridCardProps = {
  card: CardsGridCardInput
  brand: BrandInput | null
  cmsBaseUrl: string
  className?: string
  resolvedImgMedia: Awaited<ReturnType<typeof resolveCmsMediaIcon>>
}

function CardsGridCard({
  card,
  brand,
  cmsBaseUrl,
  className,
  resolvedImgMedia,
}: CardsGridCardProps) {
  const mediaType = resolveMediaType(card)
  const imagePosition = resolveImagePosition(card)
  const layoutMode = resolveCardsGridLayoutMode(imagePosition)
  const stackLayout = isStackLayoutMode(layoutMode)
  const imageAlign = resolveImageAlign(card)
  const image = card.img?.image
  const imageUrl = resolveMediaUrl(image, cmsBaseUrl)
  const imageAlt = resolveImageAlt(image, card.title)
  const imageRounded = card.img?.rounded === true
  const description = card.description?.trim()
  const buttonLabel = card.btn?.label?.trim()
  const buttonUrl = card.btn?.url?.trim()
  const buttonVariant = resolveButtonVariant(card.btn?.variant)
  const buttonOpenInNewTab = card.btn?.openInNewTab === true
  const linkMode = resolveLinkMode(card.btn?.linkMode)
  const isCardLink = linkMode === 'card' && Boolean(buttonUrl)
  const hasButton = linkMode === 'button' && Boolean(buttonLabel && buttonUrl)
  const cardLinkAriaLabel = decodeCmsTextEntities(card.title)
  const contentAlign = resolveContentAlign(card)
  const contentPosition = resolveContentPosition(card)
  const contentAlignClasses = resolveContentAlignClasses(contentAlign)
  const contentPositionClasses = resolveContentPositionClasses(contentPosition)
  const contentColumnClasses = resolveContentColumnClasses(contentPosition, layoutMode)

  const iconAboveTitle = mediaType === 'icon' ? resolvedImgMedia : null
  const hasImage = mediaType === 'image' && Boolean(imageUrl)
  const sideLayoutOrders =
    layoutMode === 'side-left' || layoutMode === 'side-right'
      ? resolveSideImageLayoutOrders(layoutMode === 'side-left' ? 'left' : 'right')
      : null

  const titleBlock = (
    <h3 className="w-full min-w-0 text-fluid-h3 font-semibold tracking-tight text-foreground">
      {decodeCmsTextEntities(card.title)}
    </h3>
  )

  const contentBlock = (
    <div
      className={cn(
        '@container flex w-full min-w-0 flex-col gap-5 self-stretch',
        contentAlignClasses,
      )}
    >
      {iconAboveTitle ? (
        <CmsMediaIconView
          resolved={iconAboveTitle}
          className="size-10 shrink-0 lg:size-16"
          imgClassName="size-10 object-contain lg:size-16"
          width={64}
          height={64}
        />
      ) : null}
      {titleBlock}
      {description ? (
        <p className="w-full min-w-0 text-fluid-body leading-relaxed whitespace-pre-line text-foreground">
          {decodeCmsTextEntities(description)}
        </p>
      ) : null}
    </div>
  )

  const buttonBlock = hasButton ? (
    <div
      className={cn(
        'mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap',
        contentAlignClasses,
      )}
    >
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
  ) : null

  const imageBlock =
    mediaType === 'image' && imageUrl ? (
      <div
        className={resolveImageWrapperClasses(imageAlign, imageRounded, layoutMode)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS media URLs are dynamic */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className={resolveImageClasses(imageAlign)}
          width={typeof image === 'object' && image?.width ? Number(image.width) : undefined}
          height={typeof image === 'object' && image?.height ? Number(image.height) : undefined}
        />
      </div>
    ) : null

  const contentColumn = (
    <div className={cn(contentColumnClasses, contentAlignClasses)}>
      {contentBlock}
      {buttonBlock}
    </div>
  )

  if (hasImage) {
    return (
      <CardsGridCardSurface
        card={card}
        brand={brand}
        className={cn(
          'flex flex-col',
          resolveCardPaddingClasses(card.padding, layoutMode),
          className,
        )}
        isCardLink={isCardLink}
        cardLinkUrl={buttonUrl}
        cardLinkOpenInNewTab={buttonOpenInNewTab}
        cardLinkAriaLabel={cardLinkAriaLabel}
      >
        {stackLayout ? (
          <div className={resolveStackLayoutContainerClasses()}>
            {layoutMode === 'stack-top' ? imageBlock : null}
            {contentColumn}
            {layoutMode === 'stack-bottom' ? imageBlock : null}
          </div>
        ) : (
          <div className={resolveSideLayoutContainerClasses(imageAlign)}>
            <div
              className={cn(
                sideLayoutOrders!.imageOrder,
                resolveSideImageColumnClasses(imageAlign),
              )}
            >
              {imageBlock}
            </div>
            <div
              className={cn(
                sideLayoutOrders!.contentOrder,
                resolveSideContentColumnClasses(),
              )}
            >
              {contentColumn}
            </div>
          </div>
        )}
      </CardsGridCardSurface>
    )
  }

  return (
    <CardsGridCardSurface
      card={card}
      brand={brand}
      className={cn(
        'flex flex-col',
        contentPositionClasses,
        resolveCardPaddingClasses(card.padding, layoutMode),
        className,
      )}
      isCardLink={isCardLink}
      cardLinkUrl={buttonUrl}
      cardLinkOpenInNewTab={buttonOpenInNewTab}
      cardLinkAriaLabel={cardLinkAriaLabel}
    >
      <div className={cn('flex flex-1 flex-col', contentPositionClasses, contentAlignClasses)}>
        {contentBlock}
        {buttonBlock}
      </div>
    </CardsGridCardSurface>
  )
}

export async function CardsGridBlock({ block, brand, cmsBaseUrl }: CardsGridBlockProps) {
  const items = block.items ?? []
  if (items.length === 0) {
    return null
  }

  const resolvedImgMedia = await Promise.all(
    items.map((card) =>
      card.img?.image ? resolveCmsMediaIcon(card.img.image, cmsBaseUrl) : null,
    ),
  )

  return (
    <section>
      <div className="container py-3 lg:py-6">
        <div className={cn('grid gap-6 lg:gap-8', resolveGridColumnClasses(block.columns))}>
          {items.map((card, index) => (
            <CardsGridCard
              key={card.id ?? `${card.title}-${index}`}
              card={card}
              cmsBaseUrl={cmsBaseUrl}
              className={resolveCardGridSpanClasses(card.gridSpan, block.columns)}
              resolvedImgMedia={resolvedImgMedia[index]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
