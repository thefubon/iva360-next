'use client'

import { locales, type AppLocale } from '@iva360/shared/i18n'
import { usePathname, useRouter } from 'next/navigation'

import { getLocalizedPathname } from '@/shared/lib/i18n/pathname'
import { ChevronDown } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@iva360/ui/components/dropdown-menu'

const localeTriggerLabels: Record<AppLocale, string> = {
  ru: 'RU',
  en: 'EN',
}

const localeMenuLabels: Record<AppLocale, string> = {
  ru: 'Русский',
  en: 'English',
}

type LanguageSwitcherProps = {
  locale: AppLocale
  triggerClassName?: string
  menuAlign?: 'start' | 'center' | 'end'
}

export function LanguageSwitcher({
  locale,
  triggerClassName: triggerClassNameProp,
  menuAlign = 'end',
}: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(targetLocale: AppLocale) {
    if (targetLocale === locale) {
      return
    }

    router.push(getLocalizedPathname(pathname, targetLocale))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn('group outline-none', triggerClassNameProp)}
        aria-label="Switch language"
      >
        <span>{localeTriggerLabels[locale]}</span>
        <ChevronDown
          size={16}
          className="size-4 shrink-0 text-current transition-transform group-data-popup-open:rotate-180"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={menuAlign} className="w-auto min-w-36">
        <DropdownMenuRadioGroup value={locale}>
          {locales.map((itemLocale) => (
            <DropdownMenuRadioItem
              key={itemLocale}
              value={itemLocale}
              onClick={() => switchLocale(itemLocale)}
            >
              {localeMenuLabels[itemLocale]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
