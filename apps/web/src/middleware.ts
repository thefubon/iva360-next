import { defaultLocale } from '@iva360/shared/i18n'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { LIVE_PREVIEW_COOKIE, LIVE_PREVIEW_QUERY_PARAM } from '@/shared/lib/cms-live-preview'
import { LOCALE_HEADER } from '@/shared/lib/i18n/constants'

function shouldSkipLocaleRouting(pathname: string): boolean {
  return (
    pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/_next')
  )
}

function applyLivePreviewCookie(request: NextRequest, response: NextResponse): NextResponse {
  if (request.nextUrl.searchParams.has(LIVE_PREVIEW_QUERY_PARAM)) {
    response.cookies.set(LIVE_PREVIEW_COOKIE, '1', {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    })
  }

  return response
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
    return applyLivePreviewCookie(request, response)
  }

  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = `/ru${pathname === '/' ? '' : pathname}`

  const response = NextResponse.rewrite(rewriteUrl)
  response.headers.set(LOCALE_HEADER, defaultLocale)
  return applyLivePreviewCookie(request, response)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
