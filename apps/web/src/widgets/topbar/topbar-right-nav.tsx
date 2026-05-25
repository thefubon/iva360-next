import type { AppLocale, TopbarLinkInput } from '@iva360/shared'

import { Search } from '@/shared/lib/icons'

import { topbarLinkClassName } from './lib/constants'
import { LanguageSwitcher } from './language-switcher'
import { TopbarLink } from './topbar-link'

const searchLabels: Record<AppLocale, string> = {
  ru: 'Поиск',
  en: 'Search',
}

type TopbarRightNavProps = {
  links: TopbarLinkInput[]
  cmsBaseUrl: string
  locale: AppLocale
}

export function TopbarRightNav({ links, cmsBaseUrl, locale }: TopbarRightNavProps) {
  return (
    <>
      <a href="#" className={topbarLinkClassName}>
        <Search size={16} className="size-4 shrink-0 text-current" aria-hidden />
        <span>{searchLabels[locale]}</span>
      </a>
      {links.map((link) => (
        <TopbarLink
          key={link.id ?? `${link.number}-${link.url ?? ''}`}
          link={link}
          cmsBaseUrl={cmsBaseUrl}
        />
      ))}
      <LanguageSwitcher locale={locale} />
    </>
  )
}
