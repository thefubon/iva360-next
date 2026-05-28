import { z } from 'zod'

import { mediaSchema } from './media'
import { seoSchema } from './seo'
import { hexColorSchema } from './color'

export { hexColorSchema } from './color'

export const heroHeadlineSectionSchema = z.object({
  headline: z.string().min(1),
})

export const heroButtonVariantSchema = z.enum(['primary', 'secondary', 'outline', 'white', 'green'])

export const heroButtonSchema = z.object({
  id: z.string().optional(),
  label: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  variant: heroButtonVariantSchema.nullable().optional(),
  openInNewTab: z.boolean().nullable().optional(),
})

/** @deprecated Use heroButtonVariantSchema */
export const heroCtaVariantSchema = heroButtonVariantSchema

/** @deprecated Use heroButtonSchema */
export const heroCtaSchema = heroButtonSchema

export const heroSubscriptionBadgeSchema = z.object({
  id: z.string().optional(),
  label: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  image: z.union([z.number(), mediaSchema]).nullable().optional(),
  backgroundColor: hexColorSchema.nullable().optional(),
  textColor: hexColorSchema.nullable().optional(),
  openInNewTab: z.boolean().nullable().optional(),
})

export const heroSubscriptionsSectionSchema = z.object({
  badges: z.array(heroSubscriptionBadgeSchema).nullable().optional(),
})

export const heroButtonsSectionSchema = z.object({
  buttons: z.array(heroButtonSchema).max(2).nullable().optional(),
})

export const heroImageSectionSchema = z.object({
  image: z.union([z.number(), mediaSchema]).nullable().optional(),
})

export const heroBlockSchema = z.object({
  id: z.string().optional(),
  blockType: z.literal('hero'),
  headlineSection: heroHeadlineSectionSchema,
  subscriptionsSection: heroSubscriptionsSectionSchema.nullable().optional(),
  buttonsSection: heroButtonsSectionSchema.nullable().optional(),
  imageSection: heroImageSectionSchema.nullable().optional(),
})

export const headingH2SpacingSchema = z.number().min(0).max(128).nullable().optional()

export const headingH2BlockSchema = z.object({
  id: z.string().optional(),
  blockType: z.literal('headingH2'),
  text: z.string().min(1),
  spacingTop: headingH2SpacingSchema,
  spacingBottom: headingH2SpacingSchema,
})

export const featureSectionImagePositionSchema = z.enum(['left', 'right'])

export const featureSectionButtonSchema = z.object({
  label: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  variant: heroButtonVariantSchema.nullable().optional(),
  openInNewTab: z.boolean().nullable().optional(),
})

export const featureSectionImageSectionSchema = z.object({
  image: z.union([z.number(), mediaSchema]).nullable().optional(),
  position: featureSectionImagePositionSchema.nullable().optional(),
  roundedImage: z.boolean().nullable().optional(),
})

export const featureSectionBlockSchema = z.object({
  id: z.string().optional(),
  blockType: z.literal('featureSection'),
  icon: z.union([z.number(), mediaSchema]).nullable().optional(),
  title: z.string().min(1),
  showBetaBadge: z.boolean().nullable().optional(),
  description: z.string().nullable().optional(),
  imageSection: featureSectionImageSectionSchema.nullable().optional(),
  buttonSection: featureSectionButtonSchema.nullable().optional(),
})

export const cardsGridColumnsSchema = z.enum(['1', '2', '3', '4'])

export const cardsGridMediaTypeSchema = z.enum(['none', 'icon', 'image'])

export const cardsGridGridSpanSchema = z.enum(['1', '2', 'full'])

export const cardsGridImagePositionSchema = z.enum(['left', 'right', 'top', 'bottom'])

export const cardsGridImageAlignSchema = z.enum(['top', 'bottom', 'stretch'])

export const cardsGridImageSectionSchema = z.object({
  mediaType: cardsGridMediaTypeSchema.nullable().optional(),
  position: cardsGridImagePositionSchema.nullable().optional(),
  imageAlign: cardsGridImageAlignSchema.nullable().optional(),
  image: z.union([z.number(), mediaSchema]).nullable().optional(),
  rounded: z.boolean().nullable().optional(),
})

export const cardsGridCardPaddingSchema = z.object({
  paddingLeft: z.boolean().nullable().optional(),
  paddingTop: z.boolean().nullable().optional(),
  paddingRight: z.boolean().nullable().optional(),
  paddingBottom: z.boolean().nullable().optional(),
})

export const cardsGridContentAlignSchema = z.enum(['left', 'center'])

export const cardsGridContentPositionSchema = z.enum(['top', 'center'])

export const cardsGridContentSchema = z.object({
  align: cardsGridContentAlignSchema.nullable().optional(),
  position: cardsGridContentPositionSchema.nullable().optional(),
})

export const cardsGridLinkModeSchema = z.enum(['none', 'button', 'card'])

export const cardsGridBackgroundModeSchema = z.enum(['default', 'brand', 'custom'])

export const cardsGridButtonSchema = z.object({
  label: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  variant: heroButtonVariantSchema.nullable().optional(),
  openInNewTab: z.boolean().nullable().optional(),
  linkMode: cardsGridLinkModeSchema.nullable().optional(),
})

export const cardsGridCardSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  backgroundMode: cardsGridBackgroundModeSchema.nullable().optional(),
  brandBackgroundId: z.string().nullable().optional(),
  backgroundColor: hexColorSchema.nullable().optional(),
  gridSpan: cardsGridGridSpanSchema.nullable().optional(),
  padding: cardsGridCardPaddingSchema.nullable().optional(),
  content: cardsGridContentSchema.nullable().optional(),
  img: cardsGridImageSectionSchema.nullable().optional(),
  btn: cardsGridButtonSchema.nullable().optional(),
})

export const cardsGridBlockSchema = z.object({
  id: z.string().optional(),
  blockType: z.literal('cardsGrid'),
  columns: cardsGridColumnsSchema.nullable().optional(),
  items: z.array(cardsGridCardSchema).min(1).nullable().optional(),
})

export const homePageBlockSchema = z.discriminatedUnion('blockType', [
  heroBlockSchema,
  headingH2BlockSchema,
  featureSectionBlockSchema,
  cardsGridBlockSchema,
])

export const homePageSchema = seoSchema.extend({
  id: z.number(),
  title: z.string().nullable().optional(),
  blocks: z.array(homePageBlockSchema).nullable().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  globalType: z.literal('homePage').optional(),
})

export type HeroHeadlineSectionInput = z.infer<typeof heroHeadlineSectionSchema>
export type HeroButtonVariant = z.infer<typeof heroButtonVariantSchema>
export type HeroButtonInput = z.infer<typeof heroButtonSchema>
/** @deprecated Use HeroButtonVariant */
export type HeroCtaVariant = HeroButtonVariant
/** @deprecated Use HeroButtonInput */
export type HeroCtaInput = HeroButtonInput
export type HeroSubscriptionBadgeInput = z.infer<typeof heroSubscriptionBadgeSchema>
export type HeroSubscriptionsSectionInput = z.infer<typeof heroSubscriptionsSectionSchema>
export type HeroBlockInput = z.infer<typeof heroBlockSchema>
export type HeadingH2BlockInput = z.infer<typeof headingH2BlockSchema>
export type FeatureSectionImagePosition = z.infer<typeof featureSectionImagePositionSchema>
export type FeatureSectionImageSectionInput = z.infer<typeof featureSectionImageSectionSchema>
export type FeatureSectionButtonInput = z.infer<typeof featureSectionButtonSchema>
export type FeatureSectionBlockInput = z.infer<typeof featureSectionBlockSchema>
export type CardsGridColumns = z.infer<typeof cardsGridColumnsSchema>
export type CardsGridMediaType = z.infer<typeof cardsGridMediaTypeSchema>
export type CardsGridGridSpan = z.infer<typeof cardsGridGridSpanSchema>
export type CardsGridImagePosition = z.infer<typeof cardsGridImagePositionSchema>
export type CardsGridImageAlign = z.infer<typeof cardsGridImageAlignSchema>
export type CardsGridImageSectionInput = z.infer<typeof cardsGridImageSectionSchema>
export type CardsGridCardPaddingInput = z.infer<typeof cardsGridCardPaddingSchema>
export type CardsGridContentAlign = z.infer<typeof cardsGridContentAlignSchema>
export type CardsGridContentPosition = z.infer<typeof cardsGridContentPositionSchema>
export type CardsGridContentInput = z.infer<typeof cardsGridContentSchema>
export type CardsGridLinkMode = z.infer<typeof cardsGridLinkModeSchema>
export type CardsGridBackgroundMode = z.infer<typeof cardsGridBackgroundModeSchema>
export type CardsGridButtonInput = z.infer<typeof cardsGridButtonSchema>
export type CardsGridCardInput = z.infer<typeof cardsGridCardSchema>
export type CardsGridBlockInput = z.infer<typeof cardsGridBlockSchema>
export type HomePageBlockInput = z.infer<typeof homePageBlockSchema>
export type HomePageInput = z.infer<typeof homePageSchema>
