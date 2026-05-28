import type { HomePageInput } from '@iva360/shared'

import { fetchBrand } from '@/shared/api/cms-globals'
import { getCmsInternalUrl } from '@/shared/lib/cms-url'

import { getHomePageBlockKey, HomePageBlockRenderer } from './home-page-block-renderer'

type HomePageContentProps = {
  homePage: HomePageInput | null
}

export async function HomePageContent({ homePage }: HomePageContentProps) {
  const blocks = homePage?.blocks
  const pageTitle = homePage?.title?.trim()

  if (!blocks?.length) {
    if (!pageTitle) {
      return null
    }

    return (
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-fluid-h1 font-semibold tracking-tight">{pageTitle}</h1>
      </section>
    )
  }

  const cmsBaseUrl = getCmsInternalUrl()
  const hasCardsGrid = blocks.some((block) => block.blockType === 'cardsGrid')
  const brand = hasCardsGrid ? await fetchBrand() : null

  return (
    <>
      {await Promise.all(
        blocks.map(async (block, index) => (
          <HomePageBlockRenderer
            key={getHomePageBlockKey(block, index)}
            block={block}
            brand={brand}
            cmsBaseUrl={cmsBaseUrl}
          />
        )),
      )}
    </>
  )
}
