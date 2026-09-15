import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { SessionPayload, CurrentUser } from '@/types'
import { UserRole } from '@prisma/client'

import { env } from './env'

const SECRET_KEY = env.AUTH_SECRET
const ENCODED_KEY = new TextEncoder().encode(SECRET_KEY)
const COOKIE_NAME = env.SESSION_COOKIE_NAME
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

/**
 * Sign payload into encrypted JWT string using HS256
 */
export async function encryptToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(ENCODED_KEY)
}

/**
 * Decrypt and verify JWT token string
 */
export async function decryptToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ENCODED_KEY, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

/**
 * Buat session baru di Database (PostgreSQL) dan set HttpOnly cookie
 */
export async function createSession(
  user: { id: string; email: string; role: UserRole },
  reqMeta?: { ipAddress?: string; userAgent?: string }
): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  // 1. Bersihkan sesi lama yang kadaluarsa secara non-blocking
  prisma.session
    .deleteMany({
      where: { expiresAt: { lt: new Date() } },
    })
    .catch(() => {})

  // 2. Simpan sesi ke database PostgreSQL
  const dbSession = await prisma.session.create({
    data: {
      userId: user.id,
      token: crypto.randomUUID(),
      expiresAt,
      ipAddress: reqMeta?.ipAddress,
      userAgent: reqMeta?.userAgent,
    },
  })

  // 2. Buat JWT token untuk cookie browser
  const tokenPayload: SessionPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
    sessionId: dbSession.id,
    expiresAt: expiresAt.toISOString(),
  }

  const jwt = await encryptToken(tokenPayload)

  // 3. Set HttpOnly Cookie di browser
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })

  return jwt
}

/**
 * Verifikasi sesi dari cookie dan database PostgreSQL (Secure Server Check)
 */
export async function getSession(): Promise<{ payload: SessionPayload; user: CurrentUser } | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)?.value

  if (!cookie) return null

  const payload = await decryptToken(cookie)
  if (!payload || !payload.sessionId || !payload.userId) {
    return null
  }

  // Validasi sesi aktif di database PostgreSQL (PRD Sec 28)
  const dbSession = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
    },
  })

  if (!dbSession) {
    // Sesi tidak ada di DB (mis. cookie basi / sudah logout di perangkat lain).
    // Tidak perlu hapus apa-apa — cukup anggap tidak login.
    // Cookie basi dibersihkan saat logoutAction (Server Action).
    return null
  }

  if (dbSession.expiresAt < new Date()) {
    // Sesi kadaluarsa: hapus baris DB saja.
    // PENTING: Jangan panggil deleteSession() di sini karena getSession()
    // dipanggil dari Server Component (cookies read-only).
    // deleteMany tidak throw saat 0 baris (hindari error P2025 + log prisma:error).
    await prisma.session
      .deleteMany({ where: { id: payload.sessionId } })
      .catch(() => {})
    return null
  }

  return {
    payload,
    user: dbSession.user,
  }
}

/**
 * Hapus sesi dari database dan bersihkan cookie (Logout)
 * HANYA panggil dari Server Action atau Route Handler
 * (cookies() read-only di Server Component).
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)?.value

  if (cookie) {
    const payload = await decryptToken(cookie)
    if (payload?.sessionId) {
      // deleteMany: tidak throw P2025 bila baris sudah tidak ada
      await prisma.session
        .deleteMany({ where: { id: payload.sessionId } })
        .catch(() => {})
    }
  }

  cookieStore.delete(COOKIE_NAME)
}
