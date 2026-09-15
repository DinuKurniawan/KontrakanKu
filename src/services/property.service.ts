import { propertyRepository } from '@/repositories/property.repository'
import { auditRepository } from '@/repositories/audit.repository'
import { createPropertySchema, updatePropertySchema, CreatePropertyInput, UpdatePropertyInput } from '@/lib/validations/property'
import { ActionResult } from '@/types'
import { PropertyStatus } from '@prisma/client'

export const propertyService = {
  async createProperty(
    input: CreatePropertyInput,
    adminUserId: string
  ): Promise<ActionResult> {
    const validated = createPropertySchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Validasi data kontrakan gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    const existingSlug = await propertyRepository.findBySlug(validated.data.slug)
    if (existingSlug) {
      return {
        success: false,
        error: `Slug "${validated.data.slug}" sudah digunakan oleh kontrakan lain.`,
      }
    }

    const property = await propertyRepository.create({
      name: validated.data.name,
      slug: validated.data.slug,
      address: validated.data.address,
      description: validated.data.description,
      monthlyPriceFrom: validated.data.monthlyPriceFrom,
      status: validated.data.status as PropertyStatus,
      facilities: validated.data.facilities,
      coverImageUrl: validated.data.coverImageUrl,
      coverImageUrls: validated.data.coverImageUrls,
    })

    await auditRepository.log({
      action: 'PROPERTY_CREATED',
      entityType: 'Property',
      entityId: property.id,
      userId: adminUserId,
      metadata: { name: property.name, slug: property.slug },
    })

    return { success: true, data: property }
  },

  async updateProperty(
    id: string,
    input: UpdatePropertyInput,
    adminUserId: string
  ): Promise<ActionResult> {
    const validated = updatePropertySchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Validasi data kontrakan gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    const property = await propertyRepository.update(id, validated.data as Parameters<typeof propertyRepository.update>[1])

    await auditRepository.log({
      action: 'PROPERTY_UPDATED',
      entityType: 'Property',
      entityId: id,
      userId: adminUserId,
      metadata: validated.data,
    })

    return { success: true, data: property }
  },

  async archiveProperty(id: string, adminUserId: string): Promise<ActionResult> {
    const property = await propertyRepository.setStatus(id, PropertyStatus.ARCHIVED)
    await auditRepository.log({
      action: 'PROPERTY_ARCHIVED',
      entityType: 'Property',
      entityId: id,
      userId: adminUserId,
    })
    return { success: true, data: property }
  },

  async publishProperty(id: string, adminUserId: string): Promise<ActionResult> {
    const property = await propertyRepository.setStatus(id, PropertyStatus.PUBLISHED)
    await auditRepository.log({
      action: 'PROPERTY_PUBLISHED',
      entityType: 'Property',
      entityId: id,
      userId: adminUserId,
    })
    return { success: true, data: property }
  },

  async deleteProperty(id: string, adminUserId: string): Promise<ActionResult> {
    const property = await propertyRepository.findById(id)
    if (!property) {
      return { success: false, error: 'Kontrakan tidak ditemukan.' }
    }

    const rentalCount = await propertyRepository.countRentals(id)
    if (rentalCount > 0) {
      return {
        success: false,
        error: 'Kontrakan tidak dapat dihapus karena masih memiliki riwayat sewa atau penyewa aktif pada unitnya. Anda dapat mengarsipkan kontrakan ini sebagai gantinya.',
      }
    }

    await propertyRepository.delete(id)

    await auditRepository.log({
      action: 'PROPERTY_DELETED',
      entityType: 'Property',
      entityId: id,
      userId: adminUserId,
      metadata: { name: property.name, slug: property.slug },
    })

    return { success: true }
  },
}
