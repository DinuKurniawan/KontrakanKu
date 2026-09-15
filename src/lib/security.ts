import crypto from 'crypto'

/**
 * Security Utilities & Defense-in-Depth Protections
 * Complies with PRD Sec 42, 43, 44 & OWASP Top 10
 */

/**
 * Ekstraksi IP dan User-Agent secara aman dari HTTP Headers
 * Mengambil client IP pertama dari header X-Forwarded-For untuk mencegah IP Spoofing
 */
export function getClientMeta(headerList: Headers): { ipAddress?: string; userAgent?: string } {
  const forwardedFor = headerList.get('x-forwarded-for')
  let ipAddress: string | undefined

  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim()
    if (firstIp && isValidIp(firstIp)) {
      ipAddress = firstIp
    }
  }

  if (!ipAddress) {
    const realIp = headerList.get('x-real-ip')?.trim()
    if (realIp && isValidIp(realIp)) {
      ipAddress = realIp
    }
  }

  const userAgent = headerList.get('user-agent')?.trim() || undefined

  return { ipAddress, userAgent }
}

/**
 * Validasi format IPv4 / IPv6 sederhana
 */
function isValidIp(ip: string): boolean {
  // Cegah injeksi karakter aneh pada header IP
  return /^[0-9a-fA-F:.]+$/.test(ip) && ip.length <= 45
}

/**
 * Perbandingan string dengan waktu konstan (Constant-Time String Comparison)
 * Mencegah serangan Timing Attack saat memverifikasi API token atau Secret Key
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf-8')
  const bufB = Buffer.from(b, 'utf-8')

  if (bufA.length !== bufB.length) {
    return false
  }

  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * Deteksi upaya Directory Traversal atau manipulasi path
 */
export function hasDirectoryTraversal(input: string): boolean {
  if (!input) return false
  const decoded = decodeURIComponent(input)
  return (
    decoded.includes('..') ||
    decoded.includes('/') ||
    decoded.includes('\\') ||
    decoded.includes('%2e%2e') ||
    decoded.includes('\0')
  )
}
