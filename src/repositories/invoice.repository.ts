import { prisma } from '@/lib/prisma'
import { formatBillingPeriod, formatDateID, formatRupiah } from '@/lib/utils'
import { InvoiceSource, InvoiceStatus, PaymentStatus, RentalStatus } from '@prisma/client'

export const invoiceRepository = {
  async findById(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        rental: {
          include: {
            user: true,
            unit: { include: { property: true } },
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  },

  async findByRentalAndPeriod(rentalId: string, billingPeriod: string) {
    return prisma.invoice.findUnique({
      where: {
        rental_billing_period_unique: {
          rentalId,
          billingPeriod,
        },
      },
    })
  },

  /**
   * Fetch ringan untuk pengajuan pembayaran: cukup status + pemilik.
   * Dipakai agar submit tidak perlu 2x query (auth-check + findById penuh).
   */
  async findStatusForSubmit(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        rental: { select: { userId: true } },
      },
    })
  },

  async create(data: {
    rentalId: string
    billingPeriod: string
    amount: number
    dueDate: Date
    notes?: string | null
    adminUserId: string
  }) {
    return prisma.$transaction(async (tx) => {
      // 0. Ambil userId pemilik rental untuk cek duplikat per user
      const rental = await tx.rental.findUnique({
        where: { id: data.rentalId },
        select: { userId: true },
      })
      if (!rental) {
        throw new Error('Data kontrak sewa tidak ditemukan.')
      }

      // Aturan: satu user hanya boleh punya SATU tagihan aktif per periode
      // (berlaku lintas kontrak; tagihan CANCELLED yang batal tidak dihitung).
      const userDuplicate = await tx.invoice.findFirst({
        where: {
          billingPeriod: data.billingPeriod,
          status: { not: InvoiceStatus.CANCELLED },
          rental: { userId: rental.userId },
        },
        select: { id: true, invoiceNumber: true },
      })
      if (userDuplicate) {
        throw new Error(
          `User ini sudah memiliki tagihan ${userDuplicate.invoiceNumber} untuk periode ${formatBillingPeriod(data.billingPeriod)}. Satu user hanya boleh punya satu tagihan per periode.`
        )
      }

      // 1. Cek duplikasi per rental (PRD Sec 17 & 37 Rule 2)
      const existing = await tx.invoice.findUnique({
        where: {
          rental_billing_period_unique: {
            rentalId: data.rentalId,
            billingPeriod: data.billingPeriod,
          },
        },
      })

      if (existing) {
        throw new Error(
          `Tagihan untuk periode ${data.billingPeriod} pada sewa ini sudah pernah dibuat sebelumnya.`
        )
      }

      const count = await tx.invoice.count()
      const cleanPeriod = data.billingPeriod.replace('-', '')
      const invoiceNumber = `INV-${cleanPeriod}-${String(count + 1).padStart(3, '0')}`

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          rentalId: data.rentalId,
          billingPeriod: data.billingPeriod,
          amount: data.amount,
          dueDate: data.dueDate,
          status: InvoiceStatus.UNPAID,
          source: InvoiceSource.MANUAL,
          notes: data.notes,
        },
        include: {
          rental: {
            include: {
              user: true,
              unit: true,
            },
          },
        },
      })

      await tx.auditLog.create({
        data: {
          userId: data.adminUserId,
          action: 'INVOICE_CREATED',
          entityType: 'Invoice',
          entityId: invoice.id,
          metadata: {
            invoiceNumber,
            billingPeriod: data.billingPeriod,
            amount: data.amount,
          },
        },
      })

      // Kirim notifikasi ke penyewa
      await tx.notification.create({
        data: {
          userId: invoice.rental.userId,
          title: 'Tagihan Baru Diterbitkan',
          message: `Tagihan ${invoiceNumber} untuk unit ${invoice.rental.unit.name} periode ${formatBillingPeriod(data.billingPeriod)} sebesar ${formatRupiah(data.amount)} telah diterbitkan. Jatuh tempo: ${formatDateID(data.dueDate)}.`,
          type: 'INVOICE',
          linkUrl: '/dashboard/tagihan',
        },
      })

      return invoice
    })
  },

  /**
   * Pembuatan Invoice Bulanan Otomatis / Massal (PRD Sec 17 & 62)
   * Hanya membuat invoice untuk rental yang aktif dan belum memiliki invoice di periode tersebut.
   */
  async generateBatchInvoices(billingPeriod: string, dueDay: number, adminUserId: string) {
    // Hanya kolom yang dipakai loop yang diambil (tanpa unit:true / user penuh)
    const activeRentals = await prisma.rental.findMany({
      where: { status: RentalStatus.ACTIVE },
      select: {
        id: true,
        userId: true,
        monthlyRent: true,
        unit: { select: { name: true } },
      },
    })

    const results = {
      created: 0,
      skipped: 0,
      errors: [] as string[],
    }

    const [yearStr, monthStr] = billingPeriod.split('-')
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10)
    const dueDate = new Date(year, month - 1, Math.min(dueDay, 28))

    // Aturan satu user satu tagihan per periode: petakan user yang sudah
    // memiliki tagihan aktif periode ini agar tidak dibuatkan lagi
    // (tagihan CANCELLED yang batal tidak dihitung).
    const alreadyBilled = await prisma.invoice.findMany({
      where: {
        billingPeriod,
        status: { not: InvoiceStatus.CANCELLED },
      },
      include: { rental: { select: { userId: true } } },
    })
    const billedUserIds = new Set(alreadyBilled.map((inv) => inv.rental.userId))

    // SATU count di luar loop (bukan per rental). Nomor di-increment lokal
    // agar unik dalam satu batch tanpa N query berulang.
    const cleanPeriod = billingPeriod.replace('-', '')
    let invoiceSeq = await prisma.invoice.count()

    for (const rental of activeRentals) {
      // Lewati jika user ini sudah punya tagihan periode ini (di kontrak mana pun)
      if (billedUserIds.has(rental.userId)) {
        results.skipped++
        continue
      }

      try {
        invoiceSeq += 1
        const invoiceNumber = `INV-${cleanPeriod}-${String(invoiceSeq).padStart(3, '0')}`

        await prisma.$transaction(async (tx) => {
          const inv = await tx.invoice.create({
            data: {
              invoiceNumber,
              rentalId: rental.id,
              billingPeriod,
              amount: rental.monthlyRent,
              dueDate,
              status: InvoiceStatus.UNPAID,
              source: InvoiceSource.BATCH,
            },
          })

          await tx.auditLog.create({
            data: {
              userId: adminUserId,
              action: 'INVOICE_BATCH_CREATED',
              entityType: 'Invoice',
              entityId: inv.id,
              metadata: { billingPeriod, amount: rental.monthlyRent.toString() },
            },
          })

          // Kirim notifikasi ke penyewa (satu notifikasi per user dalam transaksi yang sama)
          await tx.notification.create({
            data: {
              userId: rental.userId,
              title: 'Tagihan Baru Diterbitkan',
              message: `Tagihan ${invoiceNumber} untuk unit ${rental.unit.name} periode ${formatBillingPeriod(billingPeriod)} sebesar ${formatRupiah(Number(rental.monthlyRent))} telah diterbitkan. Jatuh tempo: ${formatDateID(dueDate)}.`,
              type: 'INVOICE',
              linkUrl: '/dashboard/tagihan',
            },
          })
        })

        results.created++
        billedUserIds.add(rental.userId)
      } catch (err: unknown) {
        // Duplikat (rental, periode) akibat race / data yang masuk di tengah
        // batch dianggap skip, bukan error — tanpa perlu cek findUnique per rental.
        if (typeof err === 'object' && err !== null && 'code' in err && err.code === 'P2002') {
          results.skipped++
          continue
        }
        const message = err instanceof Error ? err.message : 'Unknown error'
        results.errors.push(`Rental ID ${rental.id}: ${message}`)
      }
    }

    return results
  },

  /**
   * Update tagihan yang telah melewati jatuh tempo menjadi OVERDUE (PRD Sec 64)
   */
  async syncOverdueInvoices() {
    const now = new Date()
    const result = await prisma.invoice.updateMany({
      where: {
        status: InvoiceStatus.UNPAID,
        dueDate: { lt: now },
      },
      data: {
        status: InvoiceStatus.OVERDUE,
      },
    })
    return result.count
  },

  /**
   * Hapus tagihan duplikat dan tagihan sampah kontrak berakhir:
   * 1. Lebih dari satu invoice untuk user + periode yang sama (disisakan SATU:
   *    prioritas kontrak AKTIF, lalu yang memiliki bukti pembayaran, lalu yang Lunas).
   * 2. Sisa invoice milik kontrak NON-AKTIF tanpa bukti pembayaran aktif.
   * Invoice yang memiliki pembayaran AKTIF (PENDING/APPROVED) TIDAK PERNAH
   * dihapus. Bukti pembayaran yang sudah DITOLAK ikut dibuang bersama
   * invoice duplikatnya karena datanya sudah mati (void).
   */
  async cleanupDuplicateInvoices(adminUserId: string) {
    const all = await prisma.invoice.findMany({
      include: {
        rental: { select: { id: true, userId: true, status: true } },
        payments: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    const groups = new Map<string, typeof all>()
    for (const inv of all) {
      const key = `${inv.rental.userId}::${inv.billingPeriod}`
      const list = groups.get(key)
      if (list) list.push(inv)
      else groups.set(key, [inv])
    }

    const rank = (inv: (typeof all)[number]) =>
      [
        inv.rental.status === RentalStatus.ACTIVE ? 0 : 1,
        inv.payments.length > 0 ? 0 : 1,
        inv.status === InvoiceStatus.PAID ? 0 : 1,
      ].join('')

    const deletedIds: string[] = []
    const errors: string[] = []
    let skipped = 0
    let groupsAffected = 0
    let deletedRejectedPayments = 0

    const tryDelete = async (inv: (typeof all)[number]) => {
      // Jangan hapus invoice yang memiliki pembayaran aktif
      // (menunggu verifikasi / sudah diverifikasi).
      const activePayments = inv.payments.filter((p) => p.status !== PaymentStatus.REJECTED)
      if (activePayments.length > 0) {
        skipped++
        return
      }
      try {
        // Buang dulu bukti pembayaran yang sudah DITOLAK (data mati),
        // baru hapus invoicenya agar tidak terganjal constraint database.
        if (inv.payments.length > 0) {
          const removed = await prisma.payment.deleteMany({
            where: { id: { in: inv.payments.map((p) => p.id) }, status: PaymentStatus.REJECTED },
          })
          deletedRejectedPayments += removed.count
        }
        await prisma.invoice.delete({ where: { id: inv.id } })
        deletedIds.push(inv.id)
      } catch (err: unknown) {
        skipped++
        const message = err instanceof Error ? err.message.split('\n')[0] : 'Unknown error'
        errors.push(`${inv.invoiceNumber}: ${message}`)
      }
    }

    // Tahap 1: dedupe per user + periode
    for (const [, list] of groups) {
      if (list.length <= 1) continue
      groupsAffected++

      const sorted = [...list].sort((a, b) => {
        const ra = rank(a)
        const rb = rank(b)
        if (ra !== rb) return ra < rb ? -1 : 1
        return a.createdAt.getTime() - b.createdAt.getTime()
      })

      const [, ...dupes] = sorted
      for (const dupe of dupes) {
        await tryDelete(dupe)
      }
    }

    // Tahap 2: sisa invoice kontrak NON-AKTIF tanpa bukti pembayaran aktif
    const endedLeftovers = await prisma.invoice.findMany({
      where: { rental: { status: { not: RentalStatus.ACTIVE } } },
      include: { payments: { select: { id: true, status: true } } },
    })
    let purgedEndedCount = 0
    for (const inv of endedLeftovers) {
      const before = deletedIds.length
      await tryDelete(inv as (typeof all)[number])
      if (deletedIds.length > before) purgedEndedCount++
    }

    if (deletedIds.length > 0) {
      await prisma.auditLog.create({
        data: {
          userId: adminUserId,
          action: 'ADMIN_CLEANUP_DUPLICATE_INVOICES',
          entityType: 'Invoice',
          entityId: deletedIds[0],
          metadata: {
            deletedCount: deletedIds.length,
            deletedIds,
            groupsAffected,
            purgedEndedCount,
            deletedRejectedPayments,
            skipped,
          },
        },
      })
    }

    return {
      groupsAffected,
      deletedCount: deletedIds.length,
      purgedEndedCount,
      deletedRejectedPayments,
      skipped,
      errors: errors.slice(0, 10),
    }
  },
}
