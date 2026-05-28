import { loadRootEnv } from '@iva360/shared/env'

loadRootEnv()

import { postgresAdapter } from '@payloadcms/db-postgres'
import { searchPlugin } from '@payloadcms/plugin-search'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig, type EmailAdapter } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { localizeSearchFields, SEARCH_COLLECTION_DESCRIPTION } from './i18n/search-collection'
import { cmsAdminRu } from './i18n/translations/cms-admin-ru'
import { formatSearchResultDocURL } from './lib/search/format-search-result-doc-url'
import { withGlobalSearchIndex } from './lib/search/global-search-hooks'
import { getGlobalAdminLabel } from './lib/search/search-field-labels'
import { syncGlobalSearchIndex } from './lib/search/sync-global-search-index'
import { Header } from './globals/Header'
import { HomePage } from './globals/HomePage'
import { Footer } from './globals/Footer'
import { Brand } from './globals/Brand'
import { livePreviewBreakpoints } from './lib/live-preview'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const s3Bucket = process.env.S3_BUCKET
const useS3Storage = Boolean(
  s3Bucket && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
)

const cmsPublicUrl = process.env.CMS_PUBLIC_URL || 'http://localhost:3333'

/** Логирует письма в консоль (dev/staging без SMTP). */
const consoleEmailAdapter: EmailAdapter = ({ payload }) => ({
  name: 'console',
  defaultFromAddress: 'noreply@iva360.local',
  defaultFromName: 'IVA360 CMS',
  sendEmail: async (message) => {
    payload.logger.info({
      msg: `[email] Кому: ${JSON.stringify(message.to)}, Тема: ${message.subject ?? ''}`,
    })
  },
})

export default buildConfig({
  serverURL: cmsPublicUrl,
  admin: {
    user: Users.slug,
    theme: 'all',
    livePreview: {
      breakpoints: livePreviewBreakpoints,
    },
    meta: {
      titleSuffix: ' — IVA360',
    },
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, './app/admin/importMap.js'),
    },
    components: {
      Nav: './components/admin/Nav#AdminNav',
      actions: ['./components/admin/search/GlobalReindexButton#GlobalReindexButton'],
      graphics: {
        Logo: './components/admin/graphics/AdminLogo#AdminLogo',
      },
    },
    dashboard: {
      widgets: [
        {
          slug: 'collections',
          Component: './components/admin/dashboard/CollectionCards#CollectionCards',
          minWidth: 'full',
        },
      ],
      defaultLayout: [
        {
          widgetSlug: 'collections',
          width: 'full',
        },
      ],
    },
  },
  collections: [Media, Users],
  globals: [withGlobalSearchIndex(Header), withGlobalSearchIndex(HomePage), withGlobalSearchIndex(Footer), withGlobalSearchIndex(Brand)],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/shared/src/payload-types.ts'),
  },
  i18n: {
    supportedLanguages: { ru },
    fallbackLanguage: 'ru',
    translations: {
      ru: cmsAdminRu,
    },
  },
  localization: {
    locales: [
      {
        code: 'ru',
        label: 'Русский',
      },
      {
        code: 'en',
        label: 'Английский',
      },
    ],
    defaultLocale: 'ru',
    fallback: true,
  },
  email: consoleEmailAdapter,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Schema changes go through migrations (scripts/dev.sh runs payload:migrate).
    // Dev push prompts for data-loss confirmation and conflicts with migrate batch -1.
    push: false,
    migrationDir: path.resolve(dirname, './migrations'),
  }),
  sharp,
  plugins: [
    searchPlugin({
      collections: ['users'],
      defaultPriorities: {
        users: 10,
      },
      beforeSync: ({ collectionSlug, originalDoc, searchDoc }) => {
        if (collectionSlug === 'users') {
          const email =
            typeof originalDoc.email === 'string' ? originalDoc.email.trim() : ''
          if (email) {
            return {
              ...searchDoc,
              title: email,
            }
          }
        }

        return searchDoc
      },
      searchOverrides: {
        labels: {
          singular: 'Поиск',
          plural: 'Поиск',
        },
        admin: {
          group: 'Поиск',
          description: SEARCH_COLLECTION_DESCRIPTION,
          defaultColumns: ['title'],
          formatDocURL: ({ defaultURL, doc, req }) =>
            formatSearchResultDocURL({ defaultURL, doc, req }),
          listSearchableFields: ['title'],
          useAsTitle: 'title',
          components: {
            views: {
              edit: {
                default: {
                  Component:
                    './components/admin/search/SearchResultEditView#SearchResultEditView',
                },
              },
              list: {
                actions: [],
              },
            },
          },
        },
        fields: ({ defaultFields }) => [
          ...localizeSearchFields(defaultFields),
          {
            name: 'globalSlug',
            type: 'text',
            label: 'Глобальная настройка',
            index: true,
            admin: {
              hidden: true,
              readOnly: true,
            },
          },
          {
            name: 'globalFieldKey',
            type: 'text',
            label: 'Ключ поля',
            index: true,
            admin: {
              hidden: true,
              readOnly: true,
            },
          },
        ],
      },
    }),
    ...(useS3Storage
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: s3Bucket!,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
              },
              region: process.env.S3_REGION || 'us-east-1',
              ...(process.env.S3_ENDPOINT
                ? {
                    endpoint: process.env.S3_ENDPOINT,
                    forcePathStyle: true,
                  }
                : {}),
            },
          }),
        ]
      : []),
  ],
  onInit: async (payload) => {
    const globalsToIndex = ['header', 'homePage', 'footer', 'brand'] as const

    for (const slug of globalsToIndex) {
      const label = getGlobalAdminLabel(slug)
      try {
        let doc: Record<string, unknown>

        try {
          doc = (await payload.findGlobal({
            slug,
            depth: 0,
          })) as Record<string, unknown>
        } catch (findError) {
          payload.logger.warn({
            err: findError,
            msg: `Глобальная настройка «${slug}» отсутствует в БД — создаём пустой документ`,
          })
          doc = (await payload.updateGlobal({
            slug,
            data: {},
            depth: 0,
          })) as Record<string, unknown>
        }

        await syncGlobalSearchIndex({
          data: doc,
          globalLabel: label,
          globalSlug: slug,
          payload,
        })
      } catch (error) {
        payload.logger.warn({
          err: error,
          msg: `Не удалось проиндексировать глобальную настройку «${slug}» для поиска`,
        })
      }
    }
  },
})
