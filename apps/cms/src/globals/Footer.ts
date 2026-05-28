import type { GlobalConfig } from 'payload'

import { globalEditorAccess } from '../access/globals'
import { createGlobalLivePreviewConfig, globalVersionsConfig } from '../lib/live-preview'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Подвал',
  admin: {
    group: 'Основные',
    livePreview: createGlobalLivePreviewConfig(),
  },
  versions: globalVersionsConfig,
  access: globalEditorAccess,
  fields: [
    {
      name: 'copyright',
      type: 'text',
      label: 'Копирайт',
      localized: true,
      admin: {
        description: 'Например: © 2026 IVA360. Все права защищены.',
      },
    },
    {
      name: 'links',
      type: 'array',
      label: 'Ссылки',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Название',
          required: true,
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка',
          required: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Соцсети',
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Платформа',
          required: true,
          options: [
            { label: 'ВКонтакте', value: 'vk' },
            { label: 'Telegram', value: 'telegram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Другое', value: 'other' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка',
          required: true,
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Контакты',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Эл. почта',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Телефон',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Адрес',
          localized: true,
        },
      ],
    },
  ],
}
