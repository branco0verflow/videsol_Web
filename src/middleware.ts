import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('admin_token')
  const isLoginPage = pathname === '/Lorem-admin/login'

  // Sin sesión → solo puede ver el login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/Lorem-admin/login', request.url))
  }

  // Con sesión → no tiene sentido volver a ver el login
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/Lorem-admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/Lorem-admin/:path*'],
}
