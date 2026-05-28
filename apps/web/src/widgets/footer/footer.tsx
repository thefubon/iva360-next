import type { AppLocale } from '@iva360/shared'

import { fetchFooter } from './api/fetch-footer'
import { FooterShell } from './ui/footer-shell'

type FooterProps = {
  locale: AppLocale
}

export async function Footer({ locale }: FooterProps) {
  const footer = await fetchFooter(locale)

  return <FooterShell footer={footer} />
}
