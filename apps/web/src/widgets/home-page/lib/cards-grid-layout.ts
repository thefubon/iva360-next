import type {
  CardsGridCardInput,
  CardsGridCardPaddingInput,
  CardsGridContentPosition,
  CardsGridImageAlign,
  CardsGridImagePosition,
} from '@iva360/shared'

export type CardsGridLayoutMode = 'stack-top' | 'stack-bottom' | 'side-left' | 'side-right'

export function resolveImagePosition(card: CardsGridCardInput): CardsGridImagePosition {
  const position = card.img?.position
  if (position === 'left' || position === 'right' || position === 'top' || position === 'bottom') {
    return position
  }

  const legacyPos = card.img as { pos?: CardsGridImagePosition } | null | undefined
  if (
    legacyPos?.pos === 'left' ||
    legacyPos?.pos === 'right' ||
    legacyPos?.pos === 'top' ||
    legacyPos?.pos === 'bottom'
  ) {
    return legacyPos.pos
  }

  return 'bottom'
}

export function resolveCardsGridLayoutMode(
  imagePosition: CardsGridImagePosition,
): CardsGridLayoutMode {
  switch (imagePosition) {
    case 'top':
      return 'stack-top'
    case 'bottom':
      return 'stack-bottom'
    case 'left':
      return 'side-left'
    case 'right':
      return 'side-right'
  }
}

export function isStackLayoutMode(mode: CardsGridLayoutMode): boolean {
  return mode === 'stack-top' || mode === 'stack-bottom'
}

/** CMS + DB default is enabled; only an explicit `false` turns a side off. */
export function isCardPaddingSideEnabled(
  padding: CardsGridCardPaddingInput | null | undefined,
  side: 'paddingLeft' | 'paddingTop' | 'paddingRight' | 'paddingBottom',
): boolean {
  if (padding == null) {
    return true
  }

  return padding[side] !== false
}

const EXPLICIT_CARD_PADDING_TOP = 'pt-6 lg:pt-12'
const IMPLICIT_CARD_PADDING_TOP = 'max-lg:pt-6'
const EXPLICIT_CARD_PADDING_RIGHT = 'pr-6 lg:pr-12'
const IMPLICIT_CARD_PADDING_RIGHT = 'max-lg:pr-6'

/**
 * Top padding: CMS toggle at all breakpoints; below lg, layout default when content
 * sits above the image (side-right stacks; stack-bottom always stacks).
 */
export function resolveCardPaddingTopClasses(
  padding: CardsGridCardPaddingInput | null | undefined,
  layoutMode?: CardsGridLayoutMode,
): string {
  if (isCardPaddingSideEnabled(padding, 'paddingTop')) {
    return EXPLICIT_CARD_PADDING_TOP
  }

  if (
    !isCardPaddingSideEnabled(padding, 'paddingLeft') ||
    padding?.paddingTop !== false
  ) {
    return ''
  }

  if (layoutMode === 'stack-bottom' || layoutMode === 'side-right') {
    return IMPLICIT_CARD_PADDING_TOP
  }

  return ''
}

/**
 * Right padding: CMS toggle at all breakpoints; below lg, layout default when content
 * sits beside/below the image with left-only padding.
 */
export function resolveCardPaddingRightClasses(
  padding: CardsGridCardPaddingInput | null | undefined,
  layoutMode?: CardsGridLayoutMode,
): string {
  if (isCardPaddingSideEnabled(padding, 'paddingRight')) {
    return EXPLICIT_CARD_PADDING_RIGHT
  }

  if (
    !isCardPaddingSideEnabled(padding, 'paddingLeft') ||
    padding?.paddingRight !== false
  ) {
    return ''
  }

  if (layoutMode === 'stack-bottom' || layoutMode === 'side-right') {
    return IMPLICIT_CARD_PADDING_RIGHT
  }

  return ''
}

export function resolveCardPaddingClasses(
  padding: CardsGridCardPaddingInput | null | undefined,
  layoutMode?: CardsGridLayoutMode,
): string {
  return [
    isCardPaddingSideEnabled(padding, 'paddingLeft') ? 'pl-6 lg:pl-12' : '',
    resolveCardPaddingTopClasses(padding, layoutMode),
    resolveCardPaddingRightClasses(padding, layoutMode),
    isCardPaddingSideEnabled(padding, 'paddingBottom') ? 'pb-6 lg:pb-12' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function resolveStackLayoutContainerClasses(): string {
  return 'flex min-h-0 flex-1 flex-col'
}

/**
 * Side layout: below lg stacks (flex column); at lg+ two-column grid.
 * Content–image spacing when image is below content uses padding on the image wrapper.
 */
export function resolveSideLayoutContainerClasses(_imageAlign: CardsGridImageAlign): string {
  // Stretch grid rows on desktop so the content column can grow and use justify-center.
  // Image vertical alignment stays on the image column via lg:self-start/end.
  return 'flex min-h-0 flex-1 max-lg:flex-col max-lg:items-start lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-10'
}

export function resolveImageWrapperClasses(
  imageAlign: CardsGridImageAlign,
  imageRounded: boolean,
  layoutMode: CardsGridLayoutMode,
): string {
  const sideBySideDesktop = !isStackLayoutMode(layoutMode)
  const classes = ['shrink-0 overflow-hidden']

  if (imageRounded) {
    classes.push('rounded-md')
  }

  if (layoutMode === 'stack-top') {
    classes.push('pb-8')
  }

  if (layoutMode === 'stack-bottom') {
    classes.push('pt-8')
  }

  if (layoutMode === 'side-left') {
    classes.push('max-lg:pb-8', 'lg:pb-0')
  }

  if (layoutMode === 'side-right') {
    classes.push('max-lg:pt-8', 'lg:pt-0')
  }

  if (sideBySideDesktop && imageAlign === 'stretch') {
    classes.push('lg:h-full')
  }

  return classes.join(' ')
}

/**
 * Side layout content slot: on desktop (lg+) must be a full-height flex column so
 * inner `flex-1` + `justify-center` can vertically center content beside the image.
 * Also declares full width to avoid flex percentage collapse when the parent uses
 * `items-start` (cross-axis shrink-to-fit vs percentage width).
 */
export function resolveSideContentColumnClasses(): string {
  return 'w-full min-w-0 self-stretch lg:flex lg:h-full lg:min-h-0 lg:flex-col'
}

/** Desktop only — tablet/mobile stacked layouts keep content at the top. */
export function resolveContentPositionClasses(
  contentPosition: CardsGridContentPosition,
): string {
  if (contentPosition === 'center') {
    return 'max-lg:justify-start lg:justify-center'
  }

  return 'justify-start'
}

export function resolveContentColumnClasses(
  contentPosition: CardsGridContentPosition,
  layoutMode: CardsGridLayoutMode,
): string {
  const positionClasses = resolveContentPositionClasses(contentPosition)

  if (isStackLayoutMode(layoutMode)) {
    return ['flex w-full min-w-0 min-h-0 flex-1 flex-col gap-5', positionClasses]
      .filter(Boolean)
      .join(' ')
  }

  return [
    'flex w-full min-w-0 flex-col gap-5',
    'max-lg:flex-none lg:min-h-0 lg:flex-1',
    positionClasses,
  ]
    .filter(Boolean)
    .join(' ')
}

export function resolveSideImageColumnClasses(imageAlign: CardsGridImageAlign): string {
  const classes = ['w-full', 'min-w-0', 'self-stretch', 'shrink-0']

  if (imageAlign === 'stretch') {
    classes.push('lg:self-stretch', 'lg:h-full')
  } else if (imageAlign === 'top') {
    classes.push('lg:self-start')
  } else {
    classes.push('lg:self-end')
  }

  return classes.join(' ')
}

/** Side layout (left/right): below lg stacks left→top, right→bottom; at lg+ two columns. */
export function resolveSideImageLayoutOrders(imagePosition: 'left' | 'right'): {
  contentOrder: string
  imageOrder: string
} {
  switch (imagePosition) {
    case 'left':
      return {
        imageOrder: 'max-lg:order-1 lg:order-1',
        contentOrder: 'max-lg:order-2 lg:order-2',
      }
    case 'right':
    default:
      return {
        imageOrder: 'max-lg:order-2 lg:order-2',
        contentOrder: 'max-lg:order-1 lg:order-1',
      }
  }
}
