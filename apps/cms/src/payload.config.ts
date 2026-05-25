import { loadRootEnv } from '@iva360/shared/env'

loadRootEnv()

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig, type EmailAdapter } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Topbar } from './globals/Topbar'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'

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
    meta: {
      titleSuffix: ' — IVA360',
    },
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, './app/admin/importMap.js'),
    },
    components: {
      Nav: './components/admin/Nav#AdminNav',
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
  globals: [Topbar, Header, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/shared/src/payload-types.ts'),
  },
  i18n: {
    supportedLanguages: { ru },
    fallbackLanguage: 'ru',
  },
  localization: {
    locales: [
      {
        code: 'ru',
        label: 'Русский',
      },
      {
        code: 'en',
        label: 'English',
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
    migrationDir: path.resolve(dirname, './migrations'),
  }),
  sharp,
  plugins: [
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
})
