import { NextRequest, NextResponse } from 'next/server'
import { decryptToken } from '@/lib/session'

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'kk_session'

// Rute yang membutuhkan otentikasi
const ADMIN_ROUTE_PREFIX = '/admin'
const DASHBOARD_ROUTE_PREFIX = '/dashboard'

// Pola URL scanner / probe yang langsung diblokir
const MALICIOUS_PATTERNS = [
  '/.env',
  '/wp-admin',
  '/wp-login',
  '/phpinfo',
  '/.git',
  '/xmlrpc.php',
]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 0. Pertahanan Terhadap Scanner / Bot Probes
  const lowerPath = pathname.toLowerCase()
  if (MALICIOUS_PATTERNS.some(p => lowerPath.includes(p))) {
    return new NextResponse('Access Denied', { status: 403 })
  }

  // 1. Ambil session cookie
  const cookie = req.cookies.get(COOKIE_NAME)?.value
  const session = cookie ? await decryptToken(cookie) : null
  const isAuthenticated = !!session?.userId

  // 2. Akses ke Admin Routes (/admin/*)
  if (pathname.startsWith(ADMIN_ROUTE_PREFIX)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Role-based protection: jika bukan ADMIN, arahkan ke dashboard penyewa (PRD Sec 30)
    if (session?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // 3. Akses ke User Dashboard Routes (/dashboard/*)
  if (pathname.startsWith(DASHBOARD_ROUTE_PREFIX)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 4. Halaman login SELALU dirender — jangan redirect user ber-cookie ke /admin.
  // Alasan: proxy hanya validasi JWT (tanpa cek DB), sedangkan layout
  // (requireAuth/requireAdmin) wajib cek baris sesi di DB. Cookie basi
  // (JWT valid tapi baris DB hilang) akan menyebabkan redirect loop
  // /login -> /admin -> /login bila di sini ada bounce. Membiarkan /login
  // dirender membuat user bisa login ulang dan cookie segar diterbitkan.

  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

// Konfigurasi matcher rute agar proxy hanya dieksekusi pada rute aplikasi
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
