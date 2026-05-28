import type { TextField } from 'payload'

type ColorFieldOptions = Partial<Omit<TextField, 'type' | 'hasMany' | 'maxRows' | 'minRows'>> &
  Pick<TextField, 'name'>

/** Payload text field with native color picker in admin. Stores hex (#RGB or #RRGGBB). */
export function colorField(options: ColorFieldOptions): TextField {
  const { admin, ...rest } = options

  return {
    ...rest,
    type: 'text',
    admin: {
      ...admin,
      components: {
        ...admin?.components,
        Field: './components/admin/fields/ColorField#ColorField',
      },
    },
  } as TextField
}
