import type { GlobalConfig } from 'payload'

import { globalEditorAccess } from '../access/globals'
import { colorField } from '../fields/colorField'
import { invalidateBrandCacheAfterChange } from '../lib/brand/invalidate-brand-cache'

export const Brand: GlobalConfig = {
  slug: 'brand',
  label: 'Бренд',
  admin: {
    group: 'Настройки',
    description: 'Библиотека логотипов, иконок, фонов и цветов для выбора в других разделах CMS.',
  },
  access: globalEditorAccess,
  hooks: {
    afterChange: [invalidateBrandCacheAfterChange],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Логотипы',
          fields: [
            {
              name: 'logos',
              type: 'array',
              label: false,
              labels: {
                singular: 'логотип',
                plural: 'Логотипы',
              },
              minRows: 0,
              admin: {
                initCollapsed: true,
                description: 'Логотипы из этого списка доступны в полях выбора логотипа бренда.',
                components: {
                  RowLabel: './components/admin/fields/BrandRowLabel#BrandRowLabel',
                },
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Название',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Изображение',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Иконки',
          fields: [
            {
              name: 'icons',
              type: 'array',
              label: false,
              labels: {
                singular: 'иконку',
                plural: 'Иконки',
              },
              minRows: 0,
              admin: {
                initCollapsed: true,
                description: 'Иконки из этого списка доступны в полях выбора иконки бренда.',
                components: {
                  RowLabel: './components/admin/fields/BrandRowLabel#BrandRowLabel',
                },
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Название',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Изображение',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Фон',
          fields: [
            {
              name: 'backgrounds',
              type: 'array',
              label: false,
              labels: {
                singular: 'Фон',
                plural: 'Фоны',
              },
              minRows: 0,
              admin: {
                initCollapsed: true,
                description: 'Фоны из этого списка доступны в полях выбора фона бренда.',
                components: {
                  RowLabel: './components/admin/fields/BrandRowLabel#BrandRowLabel',
                },
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Название',
                  required: true,
                },
                colorField({
                  name: 'color',
                  label: 'Цвет фона',
                  defaultValue: '#FFFFFF',
                  required: true,
                }),
              ],
            },
          ],
        },
        {
          label: 'Цвет',
          fields: [
            {
              name: 'colors',
              type: 'array',
              label: false,
              labels: {
                singular: 'Цвет',
                plural: 'Цвета',
              },
              minRows: 0,
              admin: {
                initCollapsed: true,
                description: 'Цвета из этого списка доступны в полях выбора цвета бренда.',
                components: {
                  RowLabel: './components/admin/fields/BrandRowLabel#BrandRowLabel',
                },
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Название',
                  required: true,
                },
                colorField({
                  name: 'value',
                  label: 'Цвет',
                  required: true,
                  defaultValue: '#000000',
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
}
