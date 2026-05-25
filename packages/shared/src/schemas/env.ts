import { z } from 'zod'

const nonEmpty = z.string().min(1)

export const cmsEnvSchema = z.object({
  DATABASE_URL: nonEmpty,
  PAYLOAD_SECRET: nonEmpty,
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ENDPOINT: z.string().url().optional(),
})

export const webEnvSchema = z.object({
  CMS_INTERNAL_URL: z.string().url().default('http://localhost:3333'),
  CMS_PUBLIC_URL: z.string().url().optional(),
})

export const dockerEnvSchema = z.object({
  POSTGRES_USER: nonEmpty,
  POSTGRES_PASSWORD: nonEmpty,
  POSTGRES_DB: nonEmpty,
  POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
})

export type CmsEnv = z.infer<typeof cmsEnvSchema>
export type WebEnv = z.infer<typeof webEnvSchema>

export function parseCmsEnv(env: NodeJS.ProcessEnv = process.env): CmsEnv {
  return cmsEnvSchema.parse(env)
}

export function parseWebEnv(env: NodeJS.ProcessEnv = process.env): WebEnv {
  return webEnvSchema.parse(env)
}
