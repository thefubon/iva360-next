import type { TextField } from 'payload'

const DEFAULT_DESCRIPTION = 'Можно вставить неразрывный пробел: Alt+0160 или набрать &nbsp;'

type TiptapFieldOptions = Partial<Omit<TextField, 'type' | 'hasMany' | 'maxRows' | 'minRows'>> &
  Pick<TextField, 'name'>

/** Reusable Payload text field backed by the TipTap admin editor (HTML string). */
export function tiptapField(options: TiptapFieldOptions): TextField {
  const { admin, ...rest } = options

  return {
    ...rest,
    type: 'text',
    admin: {
      ...admin,
      description: admin?.description ?? DEFAULT_DESCRIPTION,
      components: {
        ...admin?.components,
        Field: './components/admin/fields/TiptapField#TiptapField',
      },
    },
  } as TextField
}
