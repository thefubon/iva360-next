import { heroButtonVariantOptions } from '@/fields/heroButtonVariantOptions'

import { brandBackgroundField, brandColorField, brandIconField } from '@/fields/brandField'
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  imageURL: '/block-previews/hero.jpg',
  imageAltText: 'Hero',
  labels: {
    singular: 'Главный блок',
    plural: 'Главные блоки',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            {
              name: 'headlineSection',
              type: 'group',
              label: 'Заголовок',
              admin: {
                description: 'Текст заголовка Hero-блока на сайте.',
              },
              fields: [
                {
                  name: 'headline',
                  type: 'text',
                  label: 'Текст заголовка',
                  required: true,
                  localized: true,
                  admin: {
                    description:
                      'Можно использовать &nbsp; для неразрывного пробела между словами.',
                  },
                },
              ],
            },
            {
              name: 'imageSection',
              type: 'group',
              label: 'Картинка',
              admin: {
                description: 'Необязательное изображение справа от текста на сайте.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Картинка',
                },
              ],
            },
          ],
        },
        {
          label: 'Бейджи',
          fields: [
            {
              name: 'subscriptionsSection',
              type: 'group',
              label: false,
              admin: {
                description: 'Необязательные бейджи под заголовком (магазины приложений, сервисы и т.п.).',
              },
              fields: [
                {
                  name: 'badges',
                  type: 'array',
                  label: false,
                  labels: {
                    singular: 'Бейдж',
                    plural: 'Бейджи',
                  },
                  minRows: 0,
                  admin: {
                    initCollapsed: true,
                    components: {
                      RowLabel: './components/admin/fields/NavRowLabel#NavRowLabel',
                    },
                  },
                  fields: [
                    brandIconField({
                      name: 'image',
                      label: 'Иконка',
                    }),
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          label: 'Текст бейджа',
                          localized: true,
                          admin: {
                            width: '50%',
                          },
                        },
                        {
                          name: 'url',
                          type: 'text',
                          label: 'Ссылка',
                          admin: {
                            width: '50%',
                            description: 'Относительный (/about) или абсолютный (https://…) URL.',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        brandBackgroundField({
                          name: 'backgroundColor',
                          label: 'Цвет фона',
                          defaultValue: '#FFFFFF',
                          admin: {
                            width: '50%',
                            description: 'Выберите фон из библиотеки бренда (Настройки → Бренд → Фон).',
                          },
                        }),
                        brandColorField({
                          name: 'textColor',
                          label: 'Цвет текста',
                          defaultValue: '#000000',
                          admin: {
                            width: '50%',
                            description: 'Выберите цвет из библиотеки бренда (Настройки → Бренд → Цвет).',
                          },
                        }),
                      ],
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      label: 'Открыть в новом окне',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Кнопки',
          fields: [
            {
              name: 'buttonsSection',
              type: 'group',
              label: false,
              admin: {
                description: 'Необязательные кнопки призыва к действию под бейджами. Максимум 2.',
              },
              fields: [
                {
                  name: 'buttons',
                  type: 'array',
                  label: false,
                  labels: {
                    singular: 'Кнопка',
                    plural: 'Кнопки',
                  },
                  minRows: 0,
                  maxRows: 2,
                  admin: {
                    initCollapsed: true,
                    components: {
                      RowLabel: './components/admin/fields/NavRowLabel#NavRowLabel',
                    },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          label: 'Текст кнопки',
                          localized: true,
                        },
                        {
                          name: 'url',
                          type: 'text',
                          label: 'Ссылка кнопки',
                          admin: {
                            description: 'Относительный (/about) или абсолютный (https://…) URL.',
                          },
                        },
                      ],
                    },
                    {
                      name: 'variant',
                      type: 'select',
                      label: 'Стиль кнопки',
                      defaultValue: 'primary',
                      options: [...heroButtonVariantOptions],
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      label: 'Открыть в новом окне',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
