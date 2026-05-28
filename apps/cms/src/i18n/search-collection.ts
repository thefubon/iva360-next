import type { Field } from 'payload'

export const SEARCH_COLLECTION_DESCRIPTION =
  'Автоматически созданные результаты для поиска в админке. Откройте «Поиск» в боковом меню и используйте строку поиска над списком — она ищет по заголовку. Записи обновляются при сохранении глобальных настроек и пользователей; после обновления CMS выполняется полная переиндексация.'

const SEARCH_FIELD_LABELS: Record<string, string> = {
  title: 'Заголовок',
  priority: 'Приоритет',
  doc: 'Документ',
}

function hideSearchIndexField(field: Field): Field {
  return {
    ...field,
    admin: {
      ...('admin' in field ? field.admin : undefined),
      hidden: true,
    },
  } as Field
}

export function localizeSearchFields(defaultFields: Field[]): Field[] {
  return defaultFields.map((field) => {
    if (!('name' in field) || typeof field.name !== 'string') {
      return field
    }

    if (field.name === 'doc') {
      return hideSearchIndexField({
        ...field,
        label: SEARCH_FIELD_LABELS.doc,
        required: false,
      } as Field)
    }

    if (field.name === 'docUrl') {
      return hideSearchIndexField(field)
    }

    if (field.name === 'priority') {
      return hideSearchIndexField({
        ...field,
        label: SEARCH_FIELD_LABELS.priority,
      } as Field)
    }

    const label = SEARCH_FIELD_LABELS[field.name]

    return label ? ({ ...field, label } as Field) : field
  })
}
