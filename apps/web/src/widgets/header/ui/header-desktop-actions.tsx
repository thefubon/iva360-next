'use client'

import { ShoppingCart02Icon } from '@hugeicons/core-free-icons'
import { Button } from '@iva360/ui/components/button'
import Link from 'next/link'

import { HugeiconsIcon } from '@/shared/lib/icons'

/** Placeholder URLs until cart/auth routes are wired in CMS or env. */
const HEADER_ACTION_URLS = {
  cart: '#',
  login: 'https://lk.iva360.ru/login',
} as const

export function HeaderDesktopActions() {
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Button
        nativeButton={false}
        render={<Link href={HEADER_ACTION_URLS.cart} />}
        variant="white"
        size="lg"
      >
        <HugeiconsIcon icon={ShoppingCart02Icon} size={24} className="size-6 shrink-0" aria-hidden />
        Корзина
      </Button>

      <Button
        nativeButton={false}
        render={<a href={HEADER_ACTION_URLS.login} />}
        variant="default"
        size="lg"
      >
        Войти
      </Button>
    </div>
  )
}
