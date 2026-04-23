import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function computeSessionToken(): Promise<string> {
  const passcode = process.env.ADMIN_PASSCODE ?? ''
  const encoder = new TextEncoder()
  const data = encoder.encode(`admin:${passcode}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  const session = request.cookies.get('admin_session')?.value
  const expected = await computeSessionToken()

  if (session !== expected) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
