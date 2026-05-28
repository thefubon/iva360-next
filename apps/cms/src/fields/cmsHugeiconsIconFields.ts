import type { Field } from 'payload'

type CmsHugeiconsIconFieldsOptions = {
  defaultIconType?: 'none' | 'hugeicons' | 'custom'
  defaultHugeiconsName?: string
}

/** Hugeicons picker + custom upload — same pattern as topbar links. */
export function cmsHugeiconsIconFields({
  defaultIconType = 'hugeicons',
  defaultHugeiconsName = 'Call02Icon',
}: CmsHugeiconsIconFieldsOptions = {}): Field[] {
  return [
    {
      name: 'iconType',
      type: 'select',
      label: 'Иконка',
      defaultValue: defaultIconType,
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
      defaultValue: defaultHugeiconsName,
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
        description: 'Загрузите SVG или изображение для отображения рядом с заголовком.',
        condition: (_, siblingData) => siblingData?.iconType === 'custom',
      },
    },
  ]
}
