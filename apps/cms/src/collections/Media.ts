import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Медиафайл',
    plural: 'Медиа',
  },
  admin: {
    group: 'Контент',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Альтернативный текст',
      localized: true,
      admin: {
        description: 'Краткое описание изображения для доступности и SEO.',
      },
      required: true,
    },
  ],
  upload: true,
}
