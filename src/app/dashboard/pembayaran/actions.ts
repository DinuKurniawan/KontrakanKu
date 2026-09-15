'use server'

import { requireAuth } from '@/lib/auth'
import { paymentService } from '@/services/payment.service'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type PaymentActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
}

export async function submitPaymentAction(
  prevState: PaymentActionState | undefined,
  formData: FormData
): Promise<PaymentActionState | undefined> {
  const user = await requireAuth()

  const raw = {
    invoiceId: formData.get('invoiceId') as string,
    paymentAccountId: (formData.get('paymentAccountId') as string) || undefined,
    amount: formData.get('amount') as string,
    transferDate: formData.get('transferDate') as string,
    senderBank: formData.get('senderBank') as string,
    senderName: formData.get('senderName') as string,
    proofFileUrl: formData.get('proofFileUrl') as string,
    notes: (formData.get('notes') as string) || undefined,
  }

  const result = await paymentService.submitPayment(raw as any, user)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/tagihan')
  revalidatePath('/dashboard/riwayat')
  revalidatePath('/admin/pembayaran')
  revalidatePath('/admin/notifikasi')
  revalidatePath('/admin')
  redirect('/dashboard/riwayat')
}

