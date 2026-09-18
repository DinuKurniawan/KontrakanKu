import { prisma } from '@/lib/prisma'
import { RentalStatus, UnitStatus, InvoiceStatus } from '@prisma/client'

export const rentalRepository = {
  async findById(id: string) {
    return prisma.rental.findUnique({
      where: { id },
      include: {
        user: true,
        unit: {
          include: { property: true },
        },
        invoices: {
          orderBy: { dueDate: 'desc' },
        },
      },
    })
  },

  /**
   * Fetch ringan untuk pembuatan tagihan manual: cukup
   * keberadaan + status (tanpa user/unit/invoices penuh).
   */
  async findStatusById(id: string) {
    return prisma.rental.findUnique({
      where: { id },
      select: { id: true, status: true },
    })
  },

  async findActiveByUnitId(unitId: string) {
    return prisma.rental.findFirst({
      where: {
        unitId,
        status: RentalStatus.ACTIVE,
      },
      include: { user: true },
    })
  },

  async findActiveByUserId(userId: string) {
    return prisma.rental.findFirst({
      where: {
        userId,
        status: RentalStatus.ACTIVE,
      },
      include: {
        unit: {
          include: { property: true },
        },
        invoices: {
          orderBy: { dueDate: 'desc' },
        },
      },
    })
  },

  async listAllActive() {
    return prisma.rental.findMany({
      where: { status: RentalStatus.ACTIVE },
      include: {
        user: true,
        unit: { include: { property: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  /**
   * Assign Tenant to Unit with Atomic Database Transaction (PRD Sec 60 Rule 1 & Sec 70)
   */
  async assignTenantTransaction(data: {
    userId: string
    unitId: string
    startDate: Date
    endDate?: Date | null
    monthlyRent: number
    notes?: string | null
    generateInitialInvoice?: boolean
    adminUserId: string
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Validasi Rule 1 (PRD Sec 60): Satu unit tidak boleh memiliki 2 rental aktif
      const existingActiveRental = await tx.rental.findFirst({
        where: {
          unitId: data.unitId,
          status: RentalStatus.ACTIVE,
        },
      })

      if (existingActiveRental) {
        throw new Error('Unit ini sedang dihuni oleh penyewa lain dan tidak dapat disewakan.')
      }

      // 2. Buat Kontrak Rental Baru
      const rental = await tx.rental.create({
        data: {
          userId: data.userId,
          unitId: data.unitId,
          startDate: data.startDate,
          endDate: data.endDate,
          monthlyRent: data.monthlyRent,
          status: RentalStatus.ACTIVE,
          notes: data.notes,
        },
        include: {
          user: true,
          unit: { include: { property: true } },
        },
      })

      // 3. Ubah status Unit menjadi OCCUPIED
      await tx.unit.update({
        where: { id: data.unitId },
        data: { status: UnitStatus.OCCUPIED },
      })

      // 4. Generate tagihan awal (opsional jika diminta).
      // Aturan satu user satu tagihan per periode: lewati jika user sudah
      // punya tagihan aktif periode ini (mis. dari kontrak sebelumnya).
      if (data.generateInitialInvoice) {
        const year = data.startDate.getFullYear()
        const month = String(data.startDate.getMonth() + 1).padStart(2, '0')
        const billingPeriod = `${year}-${month}`

        const alreadyBilled = await tx.invoice.findFirst({
          where: {
            billingPeriod,
            status: { not: InvoiceStatus.CANCELLED },
            rental: { userId: data.userId },
          },
          select: { id: true },
        })

        if (!alreadyBilled) {
          const count = await tx.invoice.count()
          const invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(3, '0')}`

          // Due date: 10 hari setelah start_date
          const dueDate = new Date(data.startDate)
          dueDate.setDate(dueDate.getDate() + 10)

          await tx.invoice.create({
            data: {
              invoiceNumber,
              rentalId: rental.id,
              billingPeriod,
              amount: data.monthlyRent,
              dueDate,
              status: InvoiceStatus.UNPAID,
              notes: 'Tagihan sewa bulan pertama',
            },
          })
        }
      }

      // 5. Catat ke Audit Log
      await tx.auditLog.create({
        data: {
          userId: data.adminUserId,
          action: 'TENANT_ASSIGNED',
          entityType: 'Rental',
          entityId: rental.id,
          metadata: {
            tenantId: data.userId,
            unitId: data.unitId,
            monthlyRent: data.monthlyRent,
          },
        },
      })

      return rental
    })
  },

  /**
   * Selesaikan masa sewa (End Rental) secara Atomik
   */
  async endRentalTransaction(rentalId: string, adminUserId: string, reason?: string) {
    return prisma.$transaction(async (tx) => {
      const rental = await tx.rental.findUnique({
        where: { id: rentalId },
      })

      if (!rental) {
        throw new Error('Data sewa tidak ditemukan.')
      }

      if (rental.status !== RentalStatus.ACTIVE) {
        throw new Error('Sewa ini sudah tidak dalam status aktif.')
      }

      const now = new Date()

      // 1. Update status rental menjadi ENDED
      const updatedRental = await tx.rental.update({
        where: { id: rentalId },
        data: {
          status: RentalStatus.ENDED,
          endDate: now,
        },
      })

      // 2. Kembalikan status unit menjadi AVAILABLE
      await tx.unit.update({
        where: { id: rental.unitId },
        data: { status: UnitStatus.AVAILABLE },
      })

      // 3. Catat ke Audit Log
      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: 'RENTAL_ENDED',
          entityType: 'Rental',
          entityId: rentalId,
          metadata: { reason: reason || 'Sewa selesai' },
        },
      })

      return updatedRental
    })
  },
}
