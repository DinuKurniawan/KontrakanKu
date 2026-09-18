'use server'

import { requireAdmin } from '@/lib/auth'
import { userService } from '@/services/user.service'
import { rentalService } from '@/services/rental.service'
import { revalidatePath } from 'next/cache'

export type TenantActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
}

export async function adminCreateTenantAction(
  prevState: TenantActionState | undefined,
  formData: FormData
): Promise<TenantActionState | undefined> {
  const admin = await requireAdmin()

  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || undefined,
    initialPassword: (formData.get('initialPassword') as string) || undefined,
    unitId: (formData.get('unitId') as string) || undefined,
    startDate: (formData.get('startDate') as string) || undefined,
  }

  const result = await userService.adminCreateTenant(admin.id, raw as any)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/admin/penyewa')
  revalidatePath('/admin/unit')
  revalidatePath('/admin')
  return { success: true }
}

export async function adminResetPasswordAction(
  prevState: TenantActionState | undefined,
  formData: FormData
): Promise<TenantActionState | undefined> {
  const admin = await requireAdmin()

  const raw = {
    userId: formData.get('userId') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const result = await userService.adminResetPassword(admin.id, raw as any)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/admin/penyewa')
  revalidatePath('/admin')
  return { success: true }
}

export async function assignTenantAction(
  prevState: TenantActionState | undefined,
  formData: FormData
): Promise<TenantActionState | undefined> {
  const admin = await requireAdmin()

  const raw = {
    userId: formData.get('userId') as string,
    unitId: formData.get('unitId') as string,
    startDate: formData.get('startDate') as string,
    endDate: (formData.get('endDate') as string) || undefined,
    monthlyRent: formData.get('monthlyRent') ? formData.get('monthlyRent') : undefined,
    notes: (formData.get('notes') as string) || undefined,
    generateInitialInvoice: formData.get('generateInitialInvoice') !== 'false',
  }

  const result = await rentalService.assignTenant(raw as any, admin.id)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/admin/penyewa')
  revalidatePath('/admin/unit')
  revalidatePath('/admin/tagihan')
  revalidatePath('/admin')
  return { success: true }
}

export async function endRentalAction(
  prevState: TenantActionState | undefined,
  formData: FormData
): Promise<TenantActionState | undefined> {
  const admin = await requireAdmin()

  const raw = {
    rentalId: formData.get('rentalId') as string,
    reason: (formData.get('reason') as string) || undefined,
  }

  const result = await rentalService.endRental(raw as any, admin.id)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/admin/penyewa')
  revalidatePath('/admin/unit')
  revalidatePath('/admin')
  return { success: true }
}
