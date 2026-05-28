import type { ArrayField, Field } from 'payload'

export const headerNavSubItemFields: Field[] = [
  {
    name: 'icon',
    type: 'upload',
    relationTo: 'media',
    label: 'Иконка',
    admin: {
      description: 'SVG отображается встроенным на сайте; PNG/WebP — как изображение.',
    },
  },
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
    label: 'URL',
    required: true,
  },
  {
    name: 'openInNewTab',
    type: 'checkbox',
    label: 'Открыть в новом окне',
    defaultValue: false,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Описание',
    localized: true,
    admin: {
      description: 'Можно использовать &nbsp; для неразрывного пробела.',
    },
  },
]

export const headerNavigationItemFields: Field[] = [
  {
    name: 'icon',
    type: 'upload',
    relationTo: 'media',
    label: 'Иконка',
    admin: {
      description: 'SVG отображается встроенным на сайте; PNG/WebP — как изображение.',
    },
  },
  {
    name: 'mobileMenuOnly',
    type: 'checkbox',
    label: 'Мобильное меню',
    defaultValue: false,
    admin: {
      description: 'Если включено, иконка показывается только в мобильном меню, не в десктопной навигации.',
    },
  },
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
    label: 'URL',
    admin: {
      description: 'Необязательно, если добавлено подменю.',
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox',
    label: 'Открыть в новом окне',
    defaultValue: false,
  },
  {
    name: 'subItems',
    type: 'array',
    label: 'Подменю',
    labels: {
      singular: 'Подпункт',
      plural: 'Подпункты',
    },
    admin: {
      initCollapsed: true,
      description: 'Если добавлены подпункты, пункт отображается как мега-меню.',
      components: {
        RowLabel: './components/admin/fields/NavRowLabel#NavRowLabel',
      },
    },
    fields: headerNavSubItemFields,
  },
]

export function createHeaderNavigationField(): ArrayField {
  return {
    name: 'navigation',
    type: 'array',
    label: 'Навигация',
    labels: {
      singular: 'Пункт меню',
      plural: 'Пункты меню',
    },
    admin: {
      initCollapsed: true,
      // При «Копировать в локаль» может понадобиться «Перезаписать существующие данные» (payloadcms/payload#13374).
      description:
        'Основное меню шапки сайта. Добавляйте пункты с названием и ссылкой; иконку можно показывать в меню или только на мобильных. Подпункты превращают пункт в мега-меню — URL верхнего уровня тогда необязателен.',
      components: {
        RowLabel: './components/admin/fields/NavRowLabel#NavRowLabel',
      },
    },
    fields: headerNavigationItemFields,
  }
}
