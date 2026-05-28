import type { CollectionConfig } from 'payload'

import { collectionAuditVersionsConfig } from '../lib/live-preview'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Пользователь',
    plural: 'Пользователи',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Администрирование',
  },
  auth: true,
  versions: collectionAuditVersionsConfig,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
