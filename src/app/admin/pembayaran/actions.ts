'use server'

import { requireAdmin } from '@/lib/auth'
import { paymentService } from '@/services/payment.service'
import { revalidatePath } from 'next/cache'

export async function approvePaymentAction(paymentId: string) {
  const admin = await requireAdmin()
  const result = await paymentService.approvePayment(paymentId, admin.id)
  if (result.success) {
    revalidatePath('/admin/pembayaran')
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    return { success: true }
  }
  return { success: false, error: result.error }
}

export async function rejectPaymentAction(paymentId: string, reason: string) {
  const admin = await requireAdmin()
  const result = await paymentService.rejectPayment(paymentId, admin.id, reason)
  if (result.success) {
    revalidatePath('/admin/pembayaran')
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    return { success: true }
  }
  return { success: false, error: result.error }
}

