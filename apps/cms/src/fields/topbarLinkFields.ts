import type { ArrayField, Field } from 'payload'

export const topbarLinkItemFields: Field[] = [
  {
    name: 'number',
    type: 'text',
    label: 'Подпись',
    required: true,
    localized: true,
  },
  {
    name: 'url',
    type: 'text',
    label: 'URL',
    admin: {
      description:
        'Необязательно. Например: tel:+74951234567, mailto:info@example.com или https://…',
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox',
    label: 'Открыть в новом окне',
    defaultValue: false,
  },
  {
    name: 'iconType',
    type: 'select',
    label: 'Иконка',
    defaultValue: 'hugeicons',
    options: [
      { label: 'Hugeicons', value: 'hugeicons' },
      { label: 'Своя иконка', value: 'custom' },
      { label: 'Без иконки', value: 'none' },
    ],
  },
  {
    name: 'hugeiconsName',
    type: 'text',
    label: 'Иконка Hugeicons',
    defaultValue: 'Call02Icon',
    admin: {
      description:
        'Выберите иконку из бесплатного набора Hugeicons. Используйте поиск по названию.',
      condition: (_, siblingData) => siblingData?.iconType === 'hugeicons',
      components: {
        Field: './components/admin/fields/HugeiconsPicker#HugeiconsPicker',
      },
    },
  },
  {
    name: 'customIcon',
    type: 'upload',
    relationTo: 'media',
    label: 'Своя иконка',
    admin: {
      description: 'Загрузите SVG или изображение для отображения рядом с подписью.',
      condition: (_, siblingData) => siblingData?.iconType === 'custom',
    },
  },
]

type TopbarLinkArrayFieldOptions = {
  name: string
  description?: string
  defaultHugeiconsName?: string
}

function createTopbarLinkItemFields(defaultHugeiconsName: string): Field[] {
  return topbarLinkItemFields.map((field) => {
    if (field.type === 'text' && field.name === 'hugeiconsName') {
      return {
        ...field,
        defaultValue: defaultHugeiconsName,
      }
    }

    return field
  })
}

export function createTopbarLinkArrayField({
  name,
  description,
  defaultHugeiconsName = 'Call02Icon',
}: TopbarLinkArrayFieldOptions): ArrayField {
  return {
    name,
    type: 'array',
    label: 'Ссылки',
    labels: {
      singular: 'Ссылка',
      plural: 'Ссылки',
    },
    admin: {
      initCollapsed: true,
      description,
      components: {
        RowLabel: './components/admin/fields/LinkRowLabel#LinkRowLabel',
      },
    },
    fields: createTopbarLinkItemFields(defaultHugeiconsName),
  }
}
