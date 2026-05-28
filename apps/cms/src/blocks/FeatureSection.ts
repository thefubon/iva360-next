import { heroButtonVariantOptions } from '@/fields/heroButtonVariantOptions'
import type { Block } from 'payload'

export const FeatureSectionBlock: Block = {
  slug: 'featureSection',
  labels: {
    singular: 'Сингл карточка',
    plural: 'Сингл карточки',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Контент',
          fields: [
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              label: 'Иконка',
            },
            {
              name: 'title',
              type: 'text',
              label: 'Заголовок',
              required: true,
              localized: true,
            },
            {
              name: 'showBetaBadge',
              type: 'checkbox',
              label: 'Показывать статус Beta',
              defaultValue: false,
              admin: {
                description: 'Отображает бейдж «beta» рядом с заголовком на сайте.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Описание',
              localized: true,
              admin: {
                description: 'Можно использовать &nbsp; для неразрывного пробела.',
              },
            },
          ],
        },
        {
          label: 'Картинка',
          fields: [
            {
              name: 'imageSection',
              type: 'group',
              label: false,
              admin: {
                description: 'Картинка блока и её расположение относительно текста.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Картинка',
                },
                {
                  name: 'roundedImage',
                  type: 'checkbox',
                  label: 'Скругление картинки',
                  defaultValue: false,
                  admin: {
                    description: 'На сайте применяется скругление rounded-md у картинки.',
                  },
                },
                {
                  name: 'position',
                  type: 'select',
                  label: 'Расположение картинки',
                  defaultValue: 'right',
                  options: [
                    { label: 'Справа', value: 'right' },
                    { label: 'Слева', value: 'left' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Кнопка',
          fields: [
            {
              name: 'buttonSection',
              type: 'group',
              label: false,
              admin: {
                description: 'Необязательная кнопка под описанием.',
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
}
