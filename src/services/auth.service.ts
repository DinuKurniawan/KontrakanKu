import { userRepository } from '@/repositories/user.repository'
import { verifyPassword } from '@/lib/password'
import { createSession, deleteSession } from '@/lib/session'
import { loginSchema, LoginInput } from '@/lib/validations/auth'
import { checkRateLimit, RATE_LIMIT_RULES } from '@/lib/validations/rate-limiter'
import { ActionResult } from '@/types'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export const authService = {
  /**
   * Autentikasi Login dengan Proteksi Brute Force (PRD Sec 28 & 43.5)
   */
  async login(
    input: LoginInput,
    meta?: { ipAddress?: string; userAgent?: string }
  ): Promise<ActionResult<{ redirectUrl: string }>> {
    // 1. Rate Limiting / Brute Force Protection (PRD Sec 43.5)
    const rateLimitKey = `login:${meta?.ipAddress || 'unknown'}:${input.email?.toLowerCase()}`
    const rateCheck = checkRateLimit(rateLimitKey, RATE_LIMIT_RULES.LOGIN)
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: rateCheck.error || 'Terlalu banyak percobaan login gagal. Akun Anda ditangguhkan sementara.',
      }
    }

    // 2. Validasi input skema
    const validated = loginSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Data login tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    const { email, password } = validated.data
    const user = await userRepository.findByEmail(email)

    if (!user) {
      // Waktu respon dibuat konsisten untuk mencegah email enumeration attack
      await verifyPassword(password, '$2a$12$e8ZbzKkJxJjKzL5b4q.F4eJz0p8g9Kj5a1b2c3d4e5f6g7h8i9j0k')
      return {
        success: false,
        error: 'Email atau password salah.',
      }
    }

    const isMatch = await verifyPassword(password, user.passwordHash)
    if (!isMatch) {
      return {
        success: false,
        error: 'Email atau password salah.',
      }
    }

    // 3. Buat database session dan cookie
    await createSession(
      { id: user.id, email: user.email, role: user.role },
      meta
    )

    // 4. Catat ke Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      },
    })

    const redirectUrl = user.role === UserRole.ADMIN ? '/admin' : '/dashboard'
    return {
      success: true,
      data: { redirectUrl },
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await deleteSession()
  },
}
