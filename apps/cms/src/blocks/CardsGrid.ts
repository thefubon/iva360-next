import { brandBackgroundField } from '@/fields/brandField'
import { colorField } from '@/fields/colorField'
import { heroButtonVariantOptions } from '@/fields/heroButtonVariantOptions'
import type { Block, Field } from 'payload'

const cardItemFields: Field[] = [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Контент',
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Заголовок',
            required: true,
            localized: true,
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
          {
            name: 'content',
            type: 'group',
            label: 'Расположение контента',
            admin: {
              description:
                'Горизонтальное выравнивание текста и вертикальное положение блока контента в карточке.',
            },
            fields: [
              {
                type: 'row',
                fields: [
                  {
                    name: 'align',
                    type: 'select',
                    label: 'Выравнивание контента',
                    defaultValue: 'left',
                    options: [
                      { label: 'Слева', value: 'left' },
                      { label: 'По центру', value: 'center' },
                    ],
                    admin: {
                      width: '50%',
                      description: 'Горизонтальное выравнивание заголовка, описания и кнопки.',
                    },
                  } as Field,
                  {
                    name: 'position',
                    type: 'select',
                    label: 'Позиционирование контента',
                    defaultValue: 'top',
                    options: [
                      { label: 'Сверху', value: 'top' },
                      { label: 'По центру', value: 'center' },
                    ],
                    admin: {
                      width: '50%',
                      description: 'Вертикальное положение блока контента внутри карточки.',
                    },
                  } as Field,
                ],
              },
            ],
          } as Field,
        ],
      },
      {
        label: 'Картинка',
        fields: [
          {
            name: 'img',
            type: 'group',
            label: 'Медиа',
            admin: {
              description:
                'Медиа карточки: иконка над заголовком или картинка слева, справа, сверху или под контентом.',
            },
            fields: [
              {
                name: 'mediaType',
                type: 'select',
                label: 'Тип медиа',
                defaultValue: 'none',
                options: [
                  { label: 'Без картинки', value: 'none' },
                  { label: 'Иконка', value: 'icon' },
                  { label: 'Картинка', value: 'image' },
                ],
                admin: {
                  description:
                    'Без картинки — только текст. Иконка — медиа над заголовком. Картинка — расположение задаётся полем ниже.',
                },
              } as Field,
              {
                name: 'image',
                type: 'upload',
                relationTo: 'media',
                label: 'Медиа',
                admin: {
                  condition: (_, siblingData) =>
                    siblingData?.mediaType === 'icon' || siblingData?.mediaType === 'image',
                  description: 'Иконка или картинка в зависимости от выбранного типа медиа.',
                },
              },
              {
                type: 'row',
                admin: {
                  condition: (_, siblingData) => siblingData?.mediaType === 'image',
                },
                fields: [
                  {
                    name: 'position',
                    type: 'select',
                    label: 'Расположение картинки',
                    defaultValue: 'bottom',
                    options: [
                      { label: 'Слева', value: 'left' },
                      { label: 'Справа', value: 'right' },
                      { label: 'Сверху', value: 'top' },
                      { label: 'Снизу', value: 'bottom' },
                    ],
                    admin: {
                      width: '50%',
                      description:
                        'Где показывать картинку относительно текста: слева/справа (на планшете «слева» — сверху, «справа» — снизу) или сверху/снизу на всех экранах.',
                    },
                  } as Field,
                  {
                    name: 'imageAlign',
                    type: 'select',
                    label: 'Выравнивание в боковой колонке',
                    defaultValue: 'top',
                    options: [
                      { label: 'К верху колонки', value: 'top' },
                      { label: 'К низу колонки', value: 'bottom' },
                      { label: 'Растянуть', value: 'stretch' },
                    ],
                    admin: {
                      width: '50%',
                      condition: (_, siblingData) =>
                        siblingData?.position === 'left' || siblingData?.position === 'right',
                      description:
                        'Только для расположения «Слева» или «Справа»: вертикальное выравнивание картинки внутри колонки.',
                    },
                  } as Field,
                  {
                    name: 'rounded',
                    type: 'checkbox',
                    label: 'Скругление картинки',
                    defaultValue: false,
                    admin: {
                      description: 'На сайте применяется скругление rounded-md у картинки.',
                    },
                  } as Field,
                ],
              },
            ],
          } as Field,
        ],
      },
      {
        label: 'Кнопка',
        fields: [
          {
            name: 'btn',
            type: 'group',
            label: 'Кнопка',
            admin: {
              description:
                'Ссылка в карточке: отдельная кнопка или клик по всей карточке (нужен URL).',
            },
            fields: [
              {
                name: 'linkMode',
                type: 'select',
                label: 'Поведение ссылки',
                defaultValue: 'none',
                options: [
                  { label: 'Без кнопки', value: 'none' },
                  { label: 'Кнопка в карточке', value: 'button' },
                  { label: 'Вся карточка кликабельна', value: 'card' },
                ],
                admin: {
                  description:
                    '«Без кнопки» — карточка без ссылки. «Кнопка в карточке» — ссылка в виде кнопки. «Вся карточка» — переход по клику на карточку.',
                },
              } as Field,
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
                      condition: (_, siblingData) => siblingData?.linkMode === 'button',
                    },
                  },
                  {
                    name: 'url',
                    type: 'text',
                    label: 'Ссылка',
                    admin: {
                      width: '50%',
                      description: 'Относительный (/about) или абсолютный (https://…) URL.',
                      condition: (_, siblingData) =>
                        siblingData?.linkMode === 'button' || siblingData?.linkMode === 'card',
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
                admin: {
                  condition: (_, siblingData) => siblingData?.linkMode === 'button',
                },
              },
              {
                name: 'openInNewTab',
                type: 'checkbox',
                dbName: 'new_tab',
                label: 'Открыть в новом окне',
                defaultValue: false,
                admin: {
                  condition: (_, siblingData) =>
                    siblingData?.linkMode === 'button' || siblingData?.linkMode === 'card',
                },
              } as Field,
            ],
          } as Field,
        ],
      },
      {
        label: 'Настройки',
        fields: [
          {
            name: 'backgroundMode',
            type: 'select',
            label: 'Фон карточки',
            defaultValue: 'default',
            options: [
              { label: 'Базовый фон', value: 'default' },
              { label: 'Брендовый фон', value: 'brand' },
              { label: 'Свой вариант', value: 'custom' },
            ],
            admin: {
              description:
                'Базовый — стандартный фон сайта. Брендовый — пресет из «Настройки → Бренд → Фон». Свой — произвольный цвет.',
            },
          } as Field,
          brandBackgroundField({
            name: 'brandBackgroundId',
            label: 'Брендовый фон',
            storeAs: 'id',
            admin: {
              condition: (_, siblingData) => siblingData?.backgroundMode === 'brand',
              description: 'Пресет из библиотеки бренда (Настройки → Бренд → Фон).',
            },
          }),
          colorField({
            name: 'backgroundColor',
            label: 'Свой цвет',
            admin: {
              condition: (_, siblingData) => siblingData?.backgroundMode === 'custom',
              description: 'Произвольный цвет фона карточки в формате #RRGGBB.',
            },
          }),
          {
            name: 'gridSpan',
            type: 'select',
            label: 'Ширина в сетке',
            dbName: 'grid_span',
            defaultValue: '1',
            options: [
              { label: '1 колонка', value: '1' },
              { label: '2 колонки', value: '2' },
              { label: 'На всю ширину', value: 'full' },
            ],
            admin: {
              description:
                'На сайте карточка занимает указанное число колонок сетки (col-span). На мобильных устройствах карточки всегда на всю ширину.',
            },
          } as Field,
          {
            name: 'padding',
            type: 'group',
            label: 'Отступы',
            admin: {
              description:
                'Внутренние отступы карточки. По умолчанию включены со всех сторон (p-6 / lg:p-12).',
            },
            fields: [
              {
                type: 'row',
                fields: [
                  {
                    name: 'paddingLeft',
                    type: 'checkbox',
                    dbName: 'left',
                    label: 'Слева',
                    defaultValue: true,
                    admin: {
                      width: '25%',
                    },
                  } as Field,
                  {
                    name: 'paddingTop',
                    type: 'checkbox',
                    dbName: 'top',
                    label: 'Сверху',
                    defaultValue: true,
                    admin: {
                      width: '25%',
                    },
                  } as Field,
                  {
                    name: 'paddingRight',
                    type: 'checkbox',
                    dbName: 'right',
                    label: 'Справа',
                    defaultValue: true,
                    admin: {
                      width: '25%',
                    },
                  } as Field,
                  {
                    name: 'paddingBottom',
                    type: 'checkbox',
                    dbName: 'bottom',
                    label: 'Снизу',
                    defaultValue: true,
                    admin: {
                      width: '25%',
                    },
                  } as Field,
                ],
              },
            ],
          } as Field,
        ],
      },
    ],
  },
]

export const CardsGridBlock: Block = {
  slug: 'cardsGrid',
  labels: {
    singular: 'Сетка карточек',
    plural: 'Сетки карточек',
  },
  fields: [
    {
      name: 'columns',
      type: 'select',
      label: 'Колонки на десктопе',
      defaultValue: '2',
      options: [
        { label: '1 колонка', value: '1' },
        { label: '2 колонки', value: '2' },
        { label: '3 колонки', value: '3' },
        { label: '4 колонки', value: '4' },
      ],
      admin: {
        description: 'Количество карточек в ряд на широких экранах.',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Карточки',
      labels: {
        singular: 'Карточка',
        plural: 'Карточки',
      },
      minRows: 1,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: './components/admin/fields/CardRowLabel#CardRowLabel',
        },
      },
      fields: cardItemFields,
    } as Field,
  ],
}
