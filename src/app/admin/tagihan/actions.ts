'use server'

import { requireAdmin } from '@/lib/auth'
import { billingService } from '@/services/billing.service'
import { invoiceRepository } from '@/repositories/invoice.repository'
import { revalidatePath } from 'next/cache'

export type InvoiceActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
  createdCount?: number
  skippedCount?: number
  errors?: string[]
}

export async function createInvoiceAction(
  prevState: InvoiceActionState | undefined,
  formData: FormData
): Promise<InvoiceActionState | undefined> {
  const admin = await requireAdmin()

  const raw = {
    rentalId: formData.get('rentalId') as string,
    billingPeriod: formData.get('billingPeriod') as string,
    amount: formData.get('amount') as string,
    dueDate: formData.get('dueDate') as string,
    notes: (formData.get('notes') as string) || undefined,
  }

  const result = await billingService.createInvoice(raw as any, admin.id)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/admin/tagihan')
  revalidatePath('/admin')
  revalidatePath('/dashboard/tagihan')
  revalidatePath('/dashboard/notifikasi')
  return { success: true }
}

export async function generateBatchInvoicesAction(
  prevState: InvoiceActionState | undefined,
  formData: FormData
): Promise<InvoiceActionState | undefined> {
  const admin = await requireAdmin()

  const raw = {
    billingPeriod: formData.get('billingPeriod') as string,
    dueDay: formData.get('dueDay') ? formData.get('dueDay') : 10,
  }

  const result = await billingService.generateBatchInvoices(raw as any, admin.id)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  // billingService mengembalikan { created, skipped, errors } — bukan array.
  const data = result.data as
    | { created?: number; skipped?: number; errors?: string[] }
    | undefined
  const createdCount = typeof data?.created === 'number' ? data.created : 0
  const skippedCount = typeof data?.skipped === 'number' ? data.skipped : 0
  const errors = Array.isArray(data?.errors) ? data.errors : []

  revalidatePath('/admin/tagihan')
  revalidatePath('/admin')
  revalidatePath('/dashboard/tagihan')
  revalidatePath('/dashboard/notifikasi')
  return { success: true, createdCount, skippedCount, errors }
}

export async function syncOverdueInvoicesAction() {
  await requireAdmin()
  const updatedCount = await billingService.syncOverdueInvoices()
  revalidatePath('/admin/tagihan')
  revalidatePath('/admin')
  revalidatePath('/dashboard/tagihan')
  revalidatePath('/dashboard/notifikasi')
  return { success: true, updatedCount }
}

export type CleanupDuplicatesResult = {
  success: boolean
  groupsAffected?: number
  deletedCount?: number
  purgedEndedCount?: number
  deletedRejectedPayments?: number
  skipped?: number
  errors?: string[]
  error?: string
}

export async function cleanupDuplicateInvoicesAction(): Promise<CleanupDuplicatesResult> {
  const admin = await requireAdmin()
  try {
    const result = await invoiceRepository.cleanupDuplicateInvoices(admin.id)
    revalidatePath('/admin/tagihan')
    revalidatePath('/admin')
    revalidatePath('/dashboard/tagihan')
    revalidatePath('/dashboard/notifikasi')
    return { success: true, ...result }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membersihkan tagihan duplikat'
    return { success: false, error: message }
  }
}
