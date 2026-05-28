import type { BrandInput, HomePageBlockInput } from '@iva360/shared'

import { CardsGridBlock } from './cards-grid-block'
import { FeatureSectionBlock } from './feature-section-block'
import { HeadingH2Block } from './heading-h2-block'
import { HeroBlock } from './hero-block'

type HomePageBlockRendererProps = {
  block: HomePageBlockInput
  brand: BrandInput | null
  cmsBaseUrl: string
}

export async function HomePageBlockRenderer({
  block,
  brand,
  cmsBaseUrl,
}: HomePageBlockRendererProps) {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock block={block} cmsBaseUrl={cmsBaseUrl} />
    case 'headingH2':
      return <HeadingH2Block block={block} />
    case 'featureSection':
      return <FeatureSectionBlock block={block} cmsBaseUrl={cmsBaseUrl} />
    case 'cardsGrid':
      return <CardsGridBlock block={block} brand={brand} cmsBaseUrl={cmsBaseUrl} />
    default:
      return null
  }
}

export function getHomePageBlockKey(block: HomePageBlockInput, index: number): string {
  if (block.id) {
    return block.id
  }

  if (block.blockType === 'hero') {
    return `hero-${block.headlineSection.headline}-${index}`
  }

  if (block.blockType === 'headingH2') {
    return `heading-h2-${block.text}-${index}`
  }

  if (block.blockType === 'featureSection') {
    return `feature-section-${block.title}-${index}`
  }

  if (block.blockType === 'cardsGrid') {
    return `cards-grid-${block.id ?? index}`
  }

  return `block-${index}`
}
