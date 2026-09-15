import { unitRepository } from '@/repositories/unit.repository'
import { rentalRepository } from '@/repositories/rental.repository'
import { auditRepository } from '@/repositories/audit.repository'
import { createUnitSchema, updateUnitSchema, CreateUnitInput, UpdateUnitInput } from '@/lib/validations/unit'
import { ActionResult } from '@/types'
import { Prisma, UnitStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const DUPLICATE_NAME_ERROR = 'Nama unit/kamar sudah digunakan di properti ini. Gunakan nama yang berbeda.'

export const unitService = {
  async createUnit(input: CreateUnitInput, adminUserId: string): Promise<ActionResult> {
    const validated = createUnitSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Validasi data unit gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    // Cegah nama ganda dalam satu properti (sumber tagihan ganda)
    const existing = await prisma.unit.findUnique({
      where: {
        property_unit_name_unique: {
          propertyId: validated.data.propertyId,
          name: validated.data.name,
        },
      },
      select: { id: true },
    })
    if (existing) {
      return { success: false, error: DUPLICATE_NAME_ERROR }
    }

    try {
      const unit = await unitRepository.create({
        propertyId: validated.data.propertyId,
        name: validated.data.name,
        description: validated.data.description,
        monthlyRent: validated.data.monthlyRent,
        status: validated.data.status as UnitStatus,
        facilities: validated.data.facilities,
      })

      await auditRepository.log({
        action: 'UNIT_CREATED',
        entityType: 'Unit',
        entityId: unit.id,
        userId: adminUserId,
        metadata: { name: unit.name, propertyId: unit.propertyId },
      })

      return { success: true, data: unit }
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return { success: false, error: DUPLICATE_NAME_ERROR }
      }
      throw err
    }
  },

  async updateUnit(id: string, input: UpdateUnitInput, adminUserId: string): Promise<ActionResult> {
    const validated = updateUnitSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Validasi data unit gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    // Jika ingin mengubah status menjadi AVAILABLE, pastikan tidak ada rental aktif (PRD Sec 60 Rule 1)
    if (validated.data.status === UnitStatus.AVAILABLE) {
      const activeRental = await rentalRepository.findActiveByUnitId(id)
      if (activeRental) {
        return {
          success: false,
          error: 'Unit ini tidak dapat diubah ke AVAILABLE karena masih memiliki kontrak sewa aktif.',
        }
      }
    }

    // Jika nama diubah, pastikan tidak bentrok dengan unit lain di properti yang sama
    if (validated.data.name) {
      const current = await prisma.unit.findUnique({
        where: { id },
        select: { propertyId: true, name: true },
      })
      if (current && validated.data.name !== current.name) {
        const clash = await prisma.unit.findUnique({
          where: {
            property_unit_name_unique: {
              propertyId: current.propertyId,
              name: validated.data.name,
            },
          },
          select: { id: true },
        })
        if (clash) {
          return { success: false, error: DUPLICATE_NAME_ERROR }
        }
      }
    }

    try {
      const unit = await unitRepository.update(id, validated.data as Parameters<typeof unitRepository.update>[1])

      await auditRepository.log({
        action: 'UNIT_UPDATED',
        entityType: 'Unit',
        entityId: id,
        userId: adminUserId,
        metadata: validated.data,
      })

      return { success: true, data: unit }
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return { success: false, error: DUPLICATE_NAME_ERROR }
      }
      throw err
    }
  },
}
