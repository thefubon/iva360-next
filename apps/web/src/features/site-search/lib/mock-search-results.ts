import type { AppLocale } from '@iva360/shared'

export type MockSearchResult = {
  id: string
  title: string
  description: string
  category: string
}

const mockSearchCatalog: Record<AppLocale, MockSearchResult[]> = {
  ru: [
    {
      id: 'meetings',
      title: 'Встречи',
      description: 'Видеоконференции и вебинары для команд любого размера.',
      category: 'Продукт',
    },
    {
      id: 'messenger',
      title: 'Мессенджер',
      description: 'Корпоративный чат с каналами, файлами и интеграциями.',
      category: 'Продукт',
    },
    {
      id: 'pricing',
      title: 'Тарифы и цены',
      description: 'Сравнение планов подписки и калькулятор стоимости.',
      category: 'Коммерция',
    },
    {
      id: 'demo',
      title: 'Запросить демо',
      description: 'Форма для записи на персональную демонстрацию платформы.',
      category: 'Сервис',
    },
    {
      id: 'support',
      title: 'Техническая поддержка',
      description: 'Круглосуточная помощь пользователям и администраторам.',
      category: 'Сервис',
    },
    {
      id: 'kb',
      title: 'База знаний',
      description: 'Инструкции, FAQ и сценарии использования IVA360.',
      category: 'Документация',
    },
    {
      id: 'security',
      title: 'Безопасность',
      description: 'Шифрование, аудит и политики хранения данных.',
      category: 'Документация',
    },
    {
      id: 'integrations',
      title: 'Интеграции',
      description: 'Подключение CRM, календарей и корпоративных систем.',
      category: 'Продукт',
    },
    {
      id: 'mobile-apps',
      title: 'Мобильные приложения',
      description: 'Клиенты для iOS и Android с полным набором функций.',
      category: 'Продукт',
    },
    {
      id: 'partners',
      title: 'Партнёрская программа',
      description: 'Условия сотрудничества для интеграторов и реселлеров.',
      category: 'Коммерция',
    },
    {
      id: 'events',
      title: 'Мероприятия',
      description: 'Конференции, вебинары и записи прошедших эфиров.',
      category: 'Маркетинг',
    },
    {
      id: 'news',
      title: 'Новости компании',
      description: 'Обновления платформы, релизы и анонсы функций.',
      category: 'Маркетинг',
    },
  ],
  en: [
    {
      id: 'meetings',
      title: 'Meetings',
      description: 'Video conferencing and webinars for teams of any size.',
      category: 'Product',
    },
    {
      id: 'messenger',
      title: 'Messenger',
      description: 'Corporate chat with channels, files, and integrations.',
      category: 'Product',
    },
    {
      id: 'pricing',
      title: 'Pricing',
      description: 'Subscription plans comparison and cost calculator.',
      category: 'Commerce',
    },
    {
      id: 'demo',
      title: 'Request a demo',
      description: 'Book a personal walkthrough of the platform.',
      category: 'Service',
    },
    {
      id: 'support',
      title: 'Technical support',
      description: '24/7 assistance for users and administrators.',
      category: 'Service',
    },
    {
      id: 'kb',
      title: 'Knowledge base',
      description: 'Guides, FAQ, and IVA360 usage scenarios.',
      category: 'Documentation',
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Encryption, audit trails, and data retention policies.',
      category: 'Documentation',
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect CRM, calendars, and enterprise systems.',
      category: 'Product',
    },
    {
      id: 'mobile-apps',
      title: 'Mobile apps',
      description: 'Full-featured clients for iOS and Android.',
      category: 'Product',
    },
    {
      id: 'partners',
      title: 'Partner program',
      description: 'Cooperation terms for integrators and resellers.',
      category: 'Commerce',
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Conferences, webinars, and past session recordings.',
      category: 'Marketing',
    },
    {
      id: 'news',
      title: 'Company news',
      description: 'Platform updates, releases, and feature announcements.',
      category: 'Marketing',
    },
  ],
}

export function filterMockSearchResults(locale: AppLocale, query: string): MockSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return []
  }

  return mockSearchCatalog[locale].filter((item) => {
    const haystack = `${item.title} ${item.description} ${item.category}`.toLowerCase()
    return haystack.includes(normalizedQuery)
  })
}

export const siteSearchLabels: Record<
  AppLocale,
  {
    trigger: string
    placeholder: string
    empty: string
    noResults: string
    close: string
  }
> = {
  ru: {
    trigger: 'Поиск',
    placeholder: 'Поиск по сайту…',
    empty: 'Начните вводить запрос',
    noResults: 'Ничего не найдено',
    close: 'Закрыть поиск',
  },
  en: {
    trigger: 'Search',
    placeholder: 'Search the site…',
    empty: 'Start typing to search',
    noResults: 'No results found',
    close: 'Close search',
  },
}
