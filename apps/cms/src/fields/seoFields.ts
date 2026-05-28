import type { Field } from 'payload'

export function createSeoFields(): Field[] {
  return [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title',
      localized: true,
      admin: {
        description: 'Заголовок для поисковых систем и вкладки браузера.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description',
      localized: true,
      admin: {
        description: 'Краткое описание страницы для поисковых систем.',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'OG-изображение',
      admin: {
        description:
          'Изображение для предпросмотра в соцсетях. Рекомендуемый размер: 1200×630 px.',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'Скрыть от поисковых систем',
      defaultValue: false,
      admin: {
        description: 'Если включено, страница не будет индексироваться (noindex).',
      },
    },
  ]
}
