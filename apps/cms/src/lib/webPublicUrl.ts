/** Публичный URL фронтенда (сайт, не админка CMS). */
export function getWebPublicUrl(): string {
  const fromEnv = process.env.CMS_PUBLIC_URL ?? process.env.WEB_PUBLIC_URL

  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }

  return 'http://localhost:3000'
}
