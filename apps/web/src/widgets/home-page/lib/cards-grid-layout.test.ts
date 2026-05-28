import { describe, expect, it } from 'vitest'

import type { CardsGridCardInput } from '@iva360/shared'

import {
  isCardPaddingSideEnabled,
  isStackLayoutMode,
  resolveCardPaddingClasses,
  resolveCardPaddingRightClasses,
  resolveCardPaddingTopClasses,
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
} from './cards-grid-layout'

describe('cards-grid-layout', () => {
  it('resolves position from img.position', () => {
    const card = { title: 'Test', img: { position: 'bottom' } } satisfies CardsGridCardInput
    expect(resolveImagePosition(card)).toBe('bottom')
  })

  it('falls back to legacy img.pos', () => {
    const card = {
      title: 'Test',
      img: { pos: 'top' },
    } as CardsGridCardInput
    expect(resolveImagePosition(card)).toBe('top')
  })

  it('defaults to bottom when position is missing', () => {
    const card = { title: 'Test', img: { mediaType: 'image' } } satisfies CardsGridCardInput
    expect(resolveImagePosition(card)).toBe('bottom')
  })

  it('maps all position values to layout modes', () => {
    expect(resolveCardsGridLayoutMode('top')).toBe('stack-top')
    expect(resolveCardsGridLayoutMode('bottom')).toBe('stack-bottom')
    expect(resolveCardsGridLayoutMode('left')).toBe('side-left')
    expect(resolveCardsGridLayoutMode('right')).toBe('side-right')
  })

  it('uses stack layout only for top and bottom', () => {
    expect(isStackLayoutMode('stack-top')).toBe(true)
    expect(isStackLayoutMode('stack-bottom')).toBe(true)
    expect(isStackLayoutMode('side-left')).toBe(false)
    expect(isStackLayoutMode('side-right')).toBe(false)
  })

  it('keeps bottom stack layout independent of breakpoints (no order classes)', () => {
    const mode = resolveCardsGridLayoutMode('bottom')
    expect(isStackLayoutMode(mode)).toBe(true)
    expect(resolveSideImageLayoutOrders('right').imageOrder).toContain('max-lg:order-2')
  })

  it('stacks image below content on tablet for side-right layout', () => {
    const orders = resolveSideImageLayoutOrders('right')
    expect(orders.imageOrder).toBe('max-lg:order-2 lg:order-2')
    expect(orders.contentOrder).toBe('max-lg:order-1 lg:order-1')
  })

  it('preserves column order for side-left layout on desktop', () => {
    const orders = resolveSideImageLayoutOrders('left')
    expect(orders.imageOrder).toBe('max-lg:order-1 lg:order-1')
    expect(orders.contentOrder).toBe('max-lg:order-2 lg:order-2')
  })

  it('uses padding above image when image is below content (stack-bottom)', () => {
    expect(resolveImageWrapperClasses('top', false, 'stack-bottom')).toContain('pt-8')
    expect(resolveImageWrapperClasses('top', false, 'stack-bottom')).not.toContain('pb-8')
    expect(resolveImageWrapperClasses('top', false, 'stack-bottom')).not.toContain('mt-8')
    expect(resolveImageWrapperClasses('top', false, 'stack-bottom')).not.toContain('mb-8')
  })

  it('uses padding below image when image is above content (stack-top)', () => {
    expect(resolveImageWrapperClasses('top', false, 'stack-top')).toContain('pb-8')
    expect(resolveImageWrapperClasses('top', false, 'stack-top')).not.toContain('pt-8')
  })

  it('uses max-lg padding above image for side-right stacked layout', () => {
    expect(resolveImageWrapperClasses('top', false, 'side-right')).toContain('max-lg:pt-8')
    expect(resolveImageWrapperClasses('top', false, 'side-right')).toContain('lg:pt-0')
    expect(resolveImageWrapperClasses('top', false, 'side-right')).not.toContain('mb-8')
  })

  it('uses max-lg padding below image for side-left stacked layout', () => {
    expect(resolveImageWrapperClasses('top', false, 'side-left')).toContain('max-lg:pb-8')
    expect(resolveImageWrapperClasses('top', false, 'side-left')).toContain('lg:pb-0')
  })

  it('stack layout container does not rely on gap for content-image spacing', () => {
    expect(resolveStackLayoutContainerClasses()).not.toContain('gap-')
  })

  it('side layout container stacks with flex below lg', () => {
    expect(resolveSideLayoutContainerClasses('top')).toContain('max-lg:flex-col')
    expect(resolveSideLayoutContainerClasses('top')).toContain('lg:grid')
  })

  it('stretches side layout grid rows on desktop so content can vertically center', () => {
    expect(resolveSideLayoutContainerClasses('top')).toContain('lg:items-stretch')
    expect(resolveSideLayoutContainerClasses('top')).not.toContain('items-center')
    expect(resolveSideLayoutContainerClasses('bottom')).toContain('lg:items-stretch')
    expect(resolveSideLayoutContainerClasses('stretch')).toContain('lg:items-stretch')
  })

  it('stack layout container grows within a flex card surface', () => {
    expect(resolveStackLayoutContainerClasses()).toContain('flex-1')
    expect(resolveStackLayoutContainerClasses()).toContain('min-h-0')
  })

  it('side content column is a full-height flex column on desktop', () => {
    expect(resolveSideContentColumnClasses()).toContain('w-full')
    expect(resolveSideContentColumnClasses()).toContain('min-w-0')
    expect(resolveSideContentColumnClasses()).toContain('self-stretch')
    expect(resolveSideContentColumnClasses()).toContain('lg:flex')
    expect(resolveSideContentColumnClasses()).toContain('lg:h-full')
    expect(resolveSideContentColumnClasses()).toContain('lg:flex-col')
  })

  it('centers content vertically on desktop only when position is center', () => {
    expect(resolveContentPositionClasses('center')).toBe('max-lg:justify-start lg:justify-center')
    expect(resolveContentPositionClasses('top')).toBe('justify-start')
  })

  it('side layout content column grows on desktop for vertical positioning', () => {
    expect(resolveContentColumnClasses('center', 'side-left')).toContain('lg:flex-1')
    expect(resolveContentColumnClasses('center', 'side-left')).toContain('lg:justify-center')
    expect(resolveContentColumnClasses('center', 'side-left')).toContain('max-lg:flex-none')
    expect(resolveContentColumnClasses('center', 'side-left')).toContain('max-lg:justify-start')
  })

  it('stack layout content column always grows within the card', () => {
    expect(resolveContentColumnClasses('center', 'stack-top')).toContain('flex-1')
    expect(resolveContentColumnClasses('center', 'stack-top')).toContain('lg:justify-center')
    expect(resolveContentColumnClasses('top', 'stack-bottom')).toContain('justify-start')
  })

  it('side image column declares full width below lg and lg alignment overrides', () => {
    expect(resolveSideImageColumnClasses('top')).toContain('w-full')
    expect(resolveSideImageColumnClasses('top')).toContain('min-w-0')
    expect(resolveSideImageColumnClasses('top')).toContain('self-stretch')
    expect(resolveSideImageColumnClasses('top')).toContain('lg:self-start')
    expect(resolveSideImageColumnClasses('stretch')).toContain('lg:h-full')
  })

  it('treats null padding sides as enabled to match CMS defaults', () => {
    expect(isCardPaddingSideEnabled(null, 'paddingTop')).toBe(true)
    expect(isCardPaddingSideEnabled({ paddingLeft: true }, 'paddingTop')).toBe(true)
    expect(isCardPaddingSideEnabled({ paddingTop: false }, 'paddingTop')).toBe(false)
  })

  it('applies pt-6 lg:pt-12 when paddingTop is enabled', () => {
    expect(resolveCardPaddingTopClasses(null, 'side-right')).toBe('pt-6 lg:pt-12')
    expect(resolveCardPaddingTopClasses({ paddingTop: true }, 'side-right')).toBe(
      'pt-6 lg:pt-12',
    )
  })

  it('adds top padding below lg for side-right cards with left-only padding', () => {
    const padding = {
      paddingLeft: true,
      paddingTop: false,
      paddingRight: false,
      paddingBottom: false,
    }

    expect(resolveCardPaddingTopClasses(padding, 'side-right')).toBe('max-lg:pt-6')
    expect(resolveCardPaddingClasses(padding, 'side-right')).toBe(
      'pl-6 lg:pl-12 max-lg:pt-6 max-lg:pr-6',
    )
  })

  it('applies pr-6 lg:pr-12 when paddingRight is enabled', () => {
    expect(resolveCardPaddingRightClasses(null, 'side-right')).toBe('pr-6 lg:pr-12')
    expect(resolveCardPaddingRightClasses({ paddingRight: true }, 'side-right')).toBe(
      'pr-6 lg:pr-12',
    )
  })

  it('adds right padding below lg for side-right cards with left-only padding', () => {
    const padding = {
      paddingLeft: true,
      paddingTop: false,
      paddingRight: false,
      paddingBottom: false,
    }

    expect(resolveCardPaddingRightClasses(padding, 'side-right')).toBe('max-lg:pr-6')
  })

  it('adds right padding below lg for stack-bottom cards with left-only padding', () => {
    const padding = {
      paddingLeft: true,
      paddingTop: false,
      paddingRight: false,
      paddingBottom: false,
    }

    expect(resolveCardPaddingRightClasses(padding, 'stack-bottom')).toBe('max-lg:pr-6')
    expect(resolveCardPaddingClasses(padding, 'stack-bottom')).toBe(
      'pl-6 lg:pl-12 max-lg:pt-6 max-lg:pr-6',
    )
  })

  it('adds top padding below lg for stack-bottom cards with left-only padding', () => {
    const padding = {
      paddingLeft: true,
      paddingTop: false,
      paddingRight: false,
      paddingBottom: false,
    }

    expect(resolveCardPaddingTopClasses(padding, 'stack-bottom')).toBe('max-lg:pt-6')
  })

  it('applies all explicit padding sides on desktop when every toggle is enabled', () => {
    const padding = {
      paddingLeft: true,
      paddingTop: true,
      paddingRight: true,
      paddingBottom: true,
    }

    expect(resolveCardPaddingClasses(padding, 'side-right')).toBe(
      'pl-6 lg:pl-12 pt-6 lg:pt-12 pr-6 lg:pr-12 pb-6 lg:pb-12',
    )
  })

  it('does not add implicit top or right padding on desktop for left-only side-right cards', () => {
    const padding = {
      paddingLeft: true,
      paddingTop: false,
      paddingRight: false,
      paddingBottom: false,
    }

    expect(resolveCardPaddingClasses(padding, 'side-right')).not.toContain('lg:pt-12')
    expect(resolveCardPaddingClasses(padding, 'side-right')).not.toContain('lg:pr-12')
  })
})
