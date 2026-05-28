import type { Block } from 'payload'

export const HeadingH2Block: Block = {
  slug: 'headingH2',
  labels: {
    singular: 'Заголовок',
    plural: 'Заголовки',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      label: 'Текст заголовка',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'spacingTop',
          type: 'number',
          label: 'Отступ сверху',
          defaultValue: 24,
          min: 0,
          max: 128,
          admin: {
            width: '50%',
            step: 1,
            description:
              'Вертикальный отступ над заголовком на десктопе (px). По умолчанию — 24 px.',
          },
        },
        {
          name: 'spacingBottom',
          type: 'number',
          label: 'Отступ снизу',
          defaultValue: 24,
          min: 0,
          max: 128,
          admin: {
            width: '50%',
            step: 1,
            description:
              'Вертикальный отступ под заголовком на десктопе (px). По умолчанию — 24 px.',
          },
        },
      ],
    },
  ],
}
