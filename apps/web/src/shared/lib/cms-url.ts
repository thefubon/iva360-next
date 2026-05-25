export function getCmsInternalUrl(): string {
  return process.env.CMS_INTERNAL_URL ?? 'http://localhost:3333'
}
