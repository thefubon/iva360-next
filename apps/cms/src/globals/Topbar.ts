import type { GlobalConfig } from 'payload'

import { globalEditorAccess } from '../access/globals'
import { createTopbarLinkArrayField } from '../fields/topbarLinkFields'

export const Topbar: GlobalConfig = {
  slug: 'topbar',
  label: 'Топбар',
  admin: {
    group: 'Глобальные настройки',
  },
  access: globalEditorAccess,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Слева',
          fields: [
            createTopbarLinkArrayField({
              name: 'phones',
              description:
                'Список ссылок с подписями и иконками (tel:, mailto:, https: и т.д.).',
            }),
          ],
        },
        {
          label: 'Справа',
          fields: [
            createTopbarLinkArrayField({
              name: 'rightLinks',
              description:
                'Список ссылок с подписями и иконками (tel:, mailto:, https: и т.д.).',
            }),
          ],
        },
      ],
    },
  ],
}
