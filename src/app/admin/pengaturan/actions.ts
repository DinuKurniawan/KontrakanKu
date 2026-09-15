'use server'

import { requireAdmin } from '@/lib/auth'
import { paymentAccountService } from '@/services/payment-account.service'
import { revalidatePath } from 'next/cache'

export type PaymentAccountActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
}

export async function createPaymentAccountAction(
  prevState: PaymentAccountActionState | undefined,
  formData: FormData
): Promise<PaymentAccountActionState | undefined> {
  const admin = await requireAdmin()

  const raw = {
    bankName: formData.get('bankName') as string,
    accountNumber: formData.get('accountNumber') as string,
    accountName: formData.get('accountName') as string,
    qrCodeUrl: (formData.get('qrCodeUrl') as string) || undefined,
    isActive: formData.get('isActive') !== 'false',
  }

  const result = await paymentAccountService.createPaymentAccount(admin.id, raw as any)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/admin/pengaturan')
  revalidatePath('/dashboard/pembayaran')
  return { success: true }
}

export async function updatePaymentAccountAction(
  id: string,
  prevState: PaymentAccountActionState | undefined,
  formData: FormData
): Promise<PaymentAccountActionState | undefined> {
  const admin = await requireAdmin()

  const raw = {
    bankName: (formData.get('bankName') as string) || undefined,
    accountNumber: (formData.get('accountNumber') as string) || undefined,
    accountName: (formData.get('accountName') as string) || undefined,
    qrCodeUrl: (formData.get('qrCodeUrl') as string) || undefined,
    isActive: formData.has('isActive') ? formData.get('isActive') === 'true' : undefined,
  }

  const result = await paymentAccountService.updatePaymentAccount(admin.id, id, raw as any)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/admin/pengaturan')
  revalidatePath('/dashboard/pembayaran')
  return { success: true }
}

export async function togglePaymentAccountAction(id: string) {
  const admin = await requireAdmin()
  const result = await paymentAccountService.toggleAccountStatus(admin.id, id)
  if (result.success) {
    revalidatePath('/admin/pengaturan')
    revalidatePath('/dashboard/pembayaran')
  }
  return result
}

export async function deletePaymentAccountAction(id: string) {
  const admin = await requireAdmin()
  const result = await paymentAccountService.deletePaymentAccount(admin.id, id)
  if (result.success) {
    revalidatePath('/admin/pengaturan')
    revalidatePath('/dashboard/pembayaran')
  }
  return result
}

export async function updateAdminProfileAction(
  prevState: any,
  formData: FormData
) {
  const admin = await requireAdmin()
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string

  const { userService } = await import('@/services/user.service')
  const result = await userService.updateProfile(admin.id, {
    name,
    phone: phone || undefined,
  })

  if (!result.success) {
    return { error: result.error, fieldErrors: result.fieldErrors }
  }

  revalidatePath('/admin/pengaturan')
  revalidatePath('/admin')
  revalidatePath('/kontrakan')
  return { success: true, message: 'Profil dan kontak WhatsApp berhasil disimpan.' }
}

export async function changeAdminPasswordAction(
  prevState: any,
  formData: FormData
) {
  const admin = await requireAdmin()
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const { userService } = await import('@/services/user.service')
  const result = await userService.changePassword(admin.id, {
    currentPassword,
    newPassword,
    confirmPassword,
  })

  if (!result.success) {
    return { error: result.error, fieldErrors: result.fieldErrors }
  }

  return { success: true, message: 'Kata sandi berhasil diubah.' }
}

