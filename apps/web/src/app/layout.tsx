import { defaultLocale } from '@iva360/shared/i18n'
import { headers } from 'next/headers'

import { LOCALE_HEADER } from '@/shared/lib/i18n/constants'

import './assets/css/globals.css'

export const metadata = {
  description: 'Digital Platform for the Future',
  title: 'IVA360',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const headersList = await headers()
  const locale = headersList.get(LOCALE_HEADER) ?? defaultLocale

  return (
    <html lang={locale}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
