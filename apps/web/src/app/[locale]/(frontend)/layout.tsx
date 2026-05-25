import React from 'react'

import { isAppLocale, resolveLocaleParam } from '@iva360/shared/i18n'
import { Topbar } from '@/widgets/topbar'

import { Providers } from '../../providers'

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }]
}

export default async function FrontendLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { children, params } = props
  const { locale: localeParam } = await params
  const locale = isAppLocale(localeParam) ? localeParam : resolveLocaleParam(localeParam)

  return (
    <Providers>
      <Topbar locale={locale} />
      <main className="flex-1">{children}</main>
    </Providers>
  )
}
