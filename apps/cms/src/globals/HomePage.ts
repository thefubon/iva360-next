import type { GlobalConfig } from 'payload'

import { globalEditorAccess } from '../access/globals'
import { CardsGridBlock } from '../blocks/CardsGrid'
import { FeatureSectionBlock } from '../blocks/FeatureSection'
import { HeadingH2Block } from '../blocks/HeadingH2'
import { HeroBlock } from '../blocks/Hero'
import { createSeoFields } from '../fields/seoFields'
import { createGlobalLivePreviewConfig, globalVersionsConfig } from '../lib/live-preview'

export const HomePage: GlobalConfig = {
  slug: 'homePage',
  label: 'Главная',
  admin: {
    group: 'Основные',
    livePreview: createGlobalLivePreviewConfig(),
  },
  versions: globalVersionsConfig,
  access: globalEditorAccess,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Заголовок страницы',
              localized: true,
              admin: {
                description:
                  'Резервный заголовок для метаданных и H1, если блок Hero не задан.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: createSeoFields(),
        },
        {
          label: 'Контент',
          fields: [
            {
              name: 'blocks',
              type: 'blocks',
              label: 'Блоки страницы',
              blocks: [HeroBlock, HeadingH2Block, FeatureSectionBlock, CardsGridBlock],
            },
          ],
        },
      ],
    },
  ],
}
