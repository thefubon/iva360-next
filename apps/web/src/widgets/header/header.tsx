import type { AppLocale } from '@iva360/shared'

import { getCmsInternalUrl } from '@/shared/lib/cms-url'
import { getHomePath } from '@/shared/lib/i18n/get-home-path'
import { resolveMediaUrl } from '@/shared/lib/resolve-media-url'

import { fetchHeader } from './api/fetch-header'

type HeaderProps = {
  locale: AppLocale
}

export async function Header({ locale }: HeaderProps) {
  const header = await fetchHeader(locale)
  const cmsBaseUrl = getCmsInternalUrl()
  const logoUrl = resolveMediaUrl(header?.logo, cmsBaseUrl)
  const siteName = header?.siteName?.trim() || 'IVA360'
  const homeHref = getHomePath(locale)

  return (
    <header className="sticky top-0 z-50 bg-background shadow-lg shadow-secondary/10">
      <div className="container flex h-16 items-center">
        <a href={homeHref} className="inline-flex shrink-0 items-center">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- CMS media URLs vary by storage backend
            <img src={logoUrl} alt={siteName} className="h-9 w-auto object-contain" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/iva360.svg" alt="IVA360" height={36} width={99} className="h-9 w-fit" />
          )}
        </a>
      </div>
    </header>
  )
}
