import type { GlobalConfig } from 'payload'

import { globalEditorAccess } from '../access/globals'
import { createHeaderNavigationField } from '../fields/headerNavigationFields'
import { createTopbarLinkArrayField } from '../fields/topbarLinkFields'
import { createGlobalLivePreviewConfig, globalVersionsConfig } from '../lib/live-preview'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Шапка',
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
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Логотип',
            },
            {
              name: 'siteName',
              type: 'text',
              label: 'Название сайта',
              localized: true,
            },
          ],
        },
        {
          label: 'Навигация',
          fields: [createHeaderNavigationField()],
        },
        {
          label: 'Топбар',
          fields: [
            createTopbarLinkArrayField({
              name: 'phones',
              label: 'Слева',
              description:
                'Список ссылок с подписями и иконками (tel:, mailto:, https: и т.д.).',
            }),
            createTopbarLinkArrayField({
              name: 'rightLinks',
              label: 'Справа',
              defaultHugeiconsName: 'CustomerSupportIcon',
              description:
                'Список ссылок с подписями и иконками (tel:, mailto:, https: и т.д.).',
            }),
          ],
        },
      ],
    },
  ],
}
