import type { TextField, UploadField } from 'payload'

type BrandColorFieldOptions = Partial<Omit<TextField, 'type' | 'hasMany' | 'maxRows' | 'minRows'>> &
  Pick<TextField, 'name'>

/** Text field: Payload ReactSelect from Brand → Цвета. */
export function brandColorField(options: BrandColorFieldOptions): TextField {
  const { admin, ...rest } = options

  return {
    ...rest,
    type: 'text',
    admin: {
      ...admin,
      description:
        admin?.description ?? 'Выберите цвет из библиотеки бренда (Настройки → Бренд → Цвет).',
      components: {
        ...admin?.components,
        Field: './components/admin/fields/BrandColorField#BrandColorField',
      },
    },
  } as TextField
}

type BrandBackgroundFieldOptions = BrandColorFieldOptions & {
  /** Store brand preset id (`id`) or resolved hex (`color`). Default: `color`. */
  storeAs?: 'id' | 'color'
}

/** Text field: Payload ReactSelect from Brand → Фон. */
export function brandBackgroundField(options: BrandBackgroundFieldOptions): TextField {
  const { admin, storeAs = 'color', ...rest } = options

  return {
    ...rest,
    type: 'text',
    custom: { storeAs },
    admin: {
      ...admin,
      description:
        admin?.description ?? 'Выберите фон из библиотеки бренда (Настройки → Бренд → Фон).',
      components: {
        ...admin?.components,
        Field: './components/admin/fields/BrandBackgroundField#BrandBackgroundField',
      },
    },
  } as TextField
}

type BrandIconFieldOptions = Partial<Omit<UploadField, 'type'>> & Pick<UploadField, 'name'>

/** Upload field: pick icon from Brand → Иконки (dropdown only, no upload UI). */
export function brandIconField(options: BrandIconFieldOptions): UploadField {
  const { admin, relationTo = 'media', ...rest } = options

  return {
    ...rest,
    type: 'upload',
    relationTo,
    admin: {
      ...admin,
      description:
        admin?.description ?? 'Выберите иконку из библиотеки бренда (Настройки → Бренд → Иконки).',
      components: {
        ...admin?.components,
        Field: './components/admin/fields/BrandIconSelectField#BrandIconSelectField',
      },
    },
  } as UploadField
}
