'use server'

import { requireAuth } from '@/lib/auth'
import { userService } from '@/services/user.service'
import { revalidatePath } from 'next/cache'

export type ProfileActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
  message?: string
}

export async function updateProfileAction(
  prevState: ProfileActionState | undefined,
  formData: FormData
): Promise<ProfileActionState | undefined> {
  const user = await requireAuth()

  const raw = {
    name: formData.get('name') as string,
    phone: (formData.get('phone') as string) || undefined,
    avatarUrl: (formData.get('avatarUrl') as string) || undefined,
  }

  const result = await userService.updateProfile(user.id, raw as any)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/dashboard/profil')
  revalidatePath('/dashboard')
  revalidatePath('/admin')
  return { success: true, message: 'Profil berhasil diperbarui.' }
}

export async function changePasswordAction(
  prevState: ProfileActionState | undefined,
  formData: FormData
): Promise<ProfileActionState | undefined> {
  const user = await requireAuth()

  const raw = {
    currentPassword: formData.get('currentPassword') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const result = await userService.changePassword(user.id, raw as any)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  return { success: true, message: 'Kata sandi berhasil diubah.' }
}
