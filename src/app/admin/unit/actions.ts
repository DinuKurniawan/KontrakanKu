'use server'

import { requireAdmin } from '@/lib/auth'
import { unitService } from '@/services/unit.service'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type UnitActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
}

export async function createUnitAction(
  prevState: UnitActionState | undefined,
  formData: FormData
): Promise<UnitActionState | undefined> {
  const admin = await requireAdmin()

  const facilitiesString = formData.get('facilitiesString') as string
  const raw = {
    propertyId: formData.get('propertyId') as string,
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || undefined,
    monthlyRent: formData.get('monthlyRent') as string,
    status: (formData.get('status') as string) || 'AVAILABLE',
    facilities: facilitiesString
      ? facilitiesString.split(',').map(s => s.trim()).filter(Boolean)
      : [],
  }

  const result = await unitService.createUnit(raw as any, admin.id)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/admin/unit')
  revalidatePath('/admin/kontrakan')
  revalidatePath('/admin')
  return { success: true }
}

export async function updateUnitAction(
  id: string,
  prevState: UnitActionState | undefined,
  formData: FormData
): Promise<UnitActionState | undefined> {
  const admin = await requireAdmin()

  const facilitiesString = formData.get('facilitiesString') as string
  const facilities = facilitiesString
    ? facilitiesString.split(',').map(s => s.trim()).filter(Boolean)
    : undefined

  const raw = {
    name: (formData.get('name') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    monthlyRent: formData.get('monthlyRent') ? (formData.get('monthlyRent') as string) : undefined,
    status: (formData.get('status') as string) || undefined,
    ...(facilities !== undefined && { facilities }),
  }

  const result = await unitService.updateUnit(id, raw as any, admin.id)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  // Handle rental startDate & invoice dueDate updates
  const rentalId = formData.get('rentalId') as string | null
  const invoiceId = formData.get('invoiceId') as string | null
  const startDateStr = formData.get('startDate') as string | null
  const dueDateStr = formData.get('dueDate') as string | null

  try {
    if (rentalId && startDateStr) {
      const startDate = new Date(startDateStr)
      if (!isNaN(startDate.getTime())) {
        await prisma.rental.update({
          where: { id: rentalId },
          data: { startDate },
        })
      }
    }

    if (invoiceId && dueDateStr) {
      const dueDate = new Date(dueDateStr)
      if (!isNaN(dueDate.getTime())) {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { dueDate },
        })
      }
    }
  } catch (err) {
    return {
      error: 'Gagal memperbarui tanggal sewa: ' + (err instanceof Error ? err.message : 'Unknown error'),
    }
  }

  revalidatePath('/admin/unit')
  revalidatePath('/admin/kontrakan')
  revalidatePath('/admin')
  return { success: true }
}
