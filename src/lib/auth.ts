import { redirect } from 'next/navigation'
import { getSession } from './session'
import { CurrentUser } from '@/types'
import { UserRole } from '@prisma/client'

export * from './authorization'

/**
 * Mendapatkan user yang sedang login saat ini (null jika guest)
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession()
  return session ? session.user : null
}

/**
 * Memastikan user sudah terotentikasi. Jika belum, redirect otomatis ke halaman login.
 */
export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

/**
 * Memastikan user terotentikasi dan memiliki Role ADMIN (PRD Sec 30).
 * Jika role bukan ADMIN, redirect ke dashboard penyewa atau lempar error.
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireAuth()
  if (user.role !== UserRole.ADMIN) {
    redirect('/dashboard')
  }
  return user
}
