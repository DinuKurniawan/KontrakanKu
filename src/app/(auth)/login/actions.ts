'use server'

import { authService } from '@/services/auth.service'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getClientMeta } from '@/lib/security'

export type ActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
  message?: string
  redirectUrl?: string
}

export async function loginAction(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState | undefined> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const headerList = await headers()
  const { ipAddress, userAgent } = getClientMeta(headerList)

  const result = await authService.login(
    { email, password },
    { ipAddress, userAgent }
  )

  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  // Kembalikan success + redirectUrl agar client bisa tampilkan toast
  // sebelum redirect (admin -> /admin, user -> /dashboard).
  const redirectUrl = result.data?.redirectUrl || '/dashboard'
  const isAdmin = redirectUrl.startsWith('/admin')

  return {
    success: true,
    redirectUrl,
    message: isAdmin
      ? 'Login berhasil! Selamat datang, Admin.'
      : 'Login berhasil! Selamat datang kembali.',
  }
}

export async function logoutAction(): Promise<void> {
  await authService.logout()
  redirect('/login')
}
