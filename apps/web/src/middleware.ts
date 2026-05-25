import { defaultLocale } from '@iva360/shared/i18n'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { LOCALE_HEADER } from '@/i18n/constants'

function shouldSkipLocaleRouting(pathname: string): boolean {
  return (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  )
}

function getLocaleFromPathname(pathname: string): 'en' | null {
  const segment = pathname.split('/')[1]

  if (segment === 'en') {
    return 'en'
  }

  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldSkipLocaleRouting(pathname)) {
    return NextResponse.next()
  }

  const pathLocale = getLocaleFromPathname(pathname)

  if (pathLocale === 'en') {
    const response = NextResponse.next()
    response.headers.set(LOCALE_HEADER, 'en')
    return response
  }

  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = `/ru${pathname === '/' ? '' : pathname}`

  const response = NextResponse.rewrite(rewriteUrl)
  response.headers.set(LOCALE_HEADER, defaultLocale)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
