import type { GlobalConfig } from 'payload'

import { globalEditorAccess } from '../access/globals'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Шапка',
  admin: {
    group: 'Глобальные настройки',
  },
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
          fields: [
            {
              name: 'navigation',
              type: 'array',
              label: 'Навигация',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Название',
                  required: true,
                  localized: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Ссылка',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
