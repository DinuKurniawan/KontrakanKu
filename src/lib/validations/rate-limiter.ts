/**
 * In-Memory Sliding-Window Rate Limiter & Brute Force Protection (PRD Sec 43.4 & 43.5)
 */

interface RateLimitRecord {
  count: number
  resetTime: number
}

// Global store memory cache across requests dalam instance Node.js
const rateLimitMap = new Map<string, RateLimitRecord>()

// Pembersihan otomatis setiap 10 menit untuk mencegah memory leak
const cleanupInterval = setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 10 * 60 * 1000)
cleanupInterval.unref?.()

export interface RateLimitConfig {
  maxRequests: number   // Maksimal percobaan dalam satu window
  windowSeconds: number // Durasi window dalam detik
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetInSeconds: number
  error?: string
}

/**
 * Memeriksa apakah suatu identitas (IP / Email / UserID) telah melebihi batas request
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    // Buat record baru
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetInSeconds: config.windowSeconds,
    }
  }

  // Jika masih dalam window
  if (record.count < config.maxRequests) {
    record.count++
    const remaining = config.maxRequests - record.count
    const resetInSeconds = Math.ceil((record.resetTime - now) / 1000)
    return {
      allowed: true,
      remaining,
      resetInSeconds,
    }
  }

  // Melebihi batas (Banned / Rate limited)
  const resetInSeconds = Math.ceil((record.resetTime - now) / 1000)
  return {
    allowed: false,
    remaining: 0,
    resetInSeconds,
    error: `Terlalu banyak percobaan. Silakan coba lagi dalam ${resetInSeconds} detik.`,
  }
}

/**
 * Konfigurasi Standar Aplikasi Sesuai PRD Sec 43.4
 */
export const RATE_LIMIT_RULES = {
  // Login: Maksimal 5 percobaan per 15 menit (PRD Sec 43.5 Brute Force Protection)
  LOGIN: { maxRequests: 5, windowSeconds: 15 * 60 },
  // Payment Submission: Maksimal 10 pengajuan per 10 menit
  PAYMENT_SUBMISSION: { maxRequests: 10, windowSeconds: 10 * 60 },
  // File Upload: Maksimal 20 upload per 10 menit
  FILE_UPLOAD: { maxRequests: 20, windowSeconds: 10 * 60 },
}
