'use server'

import { requireAdmin } from '@/lib/auth'
import { propertyService } from '@/services/property.service'
import { revalidatePath } from 'next/cache'

export type PropertyActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
}

export async function createPropertyAction(
  prevState: PropertyActionState | undefined,
  formData: FormData
): Promise<PropertyActionState | undefined> {
  const admin = await requireAdmin()

  const rawFacilities = formData.getAll('facilities') as string[]
  const facilitiesString = formData.get('facilitiesString') as string
  const facilities = rawFacilities.length > 0
    ? rawFacilities
    : facilitiesString
    ? facilitiesString.split(',').map(s => s.trim()).filter(Boolean)
    : []

  const coverImageUrls = formData.getAll('coverImageUrls').map(v => String(v)).filter(Boolean) as string[]
  const singleCover = (formData.get('coverImageUrl') as string) || undefined
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    address: formData.get('address') as string,
    description: (formData.get('description') as string) || undefined,
    monthlyPriceFrom: formData.get('monthlyPriceFrom') as string,
    status: (formData.get('status') as string) || 'DRAFT',
    facilities,
    coverImageUrl: singleCover,
    coverImageUrls: coverImageUrls.length > 0 ? coverImageUrls : (singleCover ? [singleCover] : []),
  }

  const result = await propertyService.createProperty(raw as any, admin.id)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/admin/kontrakan')
  revalidatePath('/admin')
  revalidatePath('/kontrakan')
  return { success: true }
}

export async function updatePropertyAction(
  id: string,
  prevState: PropertyActionState | undefined,
  formData: FormData
): Promise<PropertyActionState | undefined> {
  const admin = await requireAdmin()

  const rawFacilities = formData.getAll('facilities') as string[]
  const facilitiesString = formData.get('facilitiesString') as string
  const facilities = rawFacilities.length > 0
    ? rawFacilities
    : facilitiesString
    ? facilitiesString.split(',').map(s => s.trim()).filter(Boolean)
    : undefined

  const coverImageUrls = formData.getAll('coverImageUrls').map(v => String(v)).filter(Boolean) as string[]
  const singleCover = (formData.get('coverImageUrl') as string) || undefined
  const raw = {
    name: (formData.get('name') as string) || undefined,
    slug: (formData.get('slug') as string) || undefined,
    address: (formData.get('address') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    monthlyPriceFrom: formData.get('monthlyPriceFrom') ? (formData.get('monthlyPriceFrom') as string) : undefined,
    status: (formData.get('status') as string) || undefined,
    ...(facilities && { facilities }),
    coverImageUrl: singleCover,
    coverImageUrls: coverImageUrls.length > 0 ? coverImageUrls : (singleCover ? [singleCover] : undefined),
  }

  const result = await propertyService.updateProperty(id, raw as any, admin.id)
  if (!result.success) {
    return {
      error: result.error,
      fieldErrors: result.fieldErrors,
    }
  }

  revalidatePath('/admin/kontrakan')
  revalidatePath('/admin')
  revalidatePath('/kontrakan')
  return { success: true }
}

export async function publishPropertyAction(id: string) {
  const admin = await requireAdmin()
  const result = await propertyService.publishProperty(id, admin.id)
  if (result.success) {
    revalidatePath('/admin/kontrakan')
    revalidatePath('/kontrakan')
    return { success: true }
  }
  return { success: false, error: result.error }
}

export async function archivePropertyAction(id: string) {
  const admin = await requireAdmin()
  const result = await propertyService.archiveProperty(id, admin.id)
  if (result.success) {
    revalidatePath('/admin/kontrakan')
    revalidatePath('/kontrakan')
    return { success: true }
  }
  return { success: false, error: result.error }
}

export async function deletePropertyAction(id: string) {
  const admin = await requireAdmin()
  const result = await propertyService.deleteProperty(id, admin.id)
  if (result.success) {
    revalidatePath('/admin/kontrakan')
    revalidatePath('/admin/unit')
    revalidatePath('/admin')
    revalidatePath('/kontrakan')
    return { success: true }
  }
  return { success: false, error: result.error }
}
