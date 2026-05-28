import type { CollectionConfig } from 'payload'

import { collectionAuditVersionsConfig } from '../lib/live-preview'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Медиафайл',
    plural: 'Медиа',
  },
  admin: {
    group: 'Контент',
  },
  versions: collectionAuditVersionsConfig,
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
        description: 'Краткое описание изображения для доступности и поисковой оптимизации.',
      },
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'],
  },
}
