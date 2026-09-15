import { prisma } from '@/lib/prisma'
import { formatBillingPeriod, formatRupiah } from '@/lib/utils'
import { PaymentStatus, InvoiceStatus, UserRole } from '@prisma/client'

export const paymentRepository = {
  async findById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: {
          include: {
            rental: {
              include: {
                user: true,
                unit: {
                  include: {
                    property: true,
                  },
                },
              },
            },
          },
        },
        paymentAccount: true,
        verifiedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    })
  },

  async listPending() {
    return prisma.payment.findMany({
      where: { status: PaymentStatus.PENDING },
      include: {
        invoice: {
          include: {
            rental: {
              include: {
                user: true,
                unit: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async create(data: {
    invoiceId: string
    paymentAccountId?: string | null
    amount: number
    transferDate: Date
    senderBank: string
    senderName: string
    proofFileUrl: string
    notes?: string | null
    userId?: string
  }) {
    return prisma.$transaction(async (tx) => {
      // Ambil detail tagihan + penyewa untuk isi pesan notifikasi admin
      const invoice = await tx.invoice.findUnique({
        where: { id: data.invoiceId },
        include: {
          rental: { include: { user: true, unit: true } },
        },
      })

      if (!invoice) {
        throw new Error('Tagihan tidak ditemukan.')
      }

      const payment = await tx.payment.create({
        data: {
          invoiceId: data.invoiceId,
          paymentAccountId: data.paymentAccountId,
          amount: data.amount,
          transferDate: data.transferDate,
          senderBank: data.senderBank,
          senderName: data.senderName,
          proofFileUrl: data.proofFileUrl,
          notes: data.notes,
          status: PaymentStatus.PENDING,
        },
      })

      // Update status invoice menjadi WAITING_PAYMENT
      await tx.invoice.update({
        where: { id: data.invoiceId },
        data: { status: InvoiceStatus.WAITING_PAYMENT },
      })

      // Catat ke Audit Log (PRD Sec 41 & 73)
      await tx.auditLog.create({
        data: {
          userId: data.userId || null,
          action: 'PAYMENT_SUBMITTED',
          entityType: 'Payment',
          entityId: payment.id,
          metadata: {
            invoiceId: data.invoiceId,
            amount: data.amount.toString(),
            senderBank: data.senderBank,
            senderName: data.senderName,
          },
        },
      })

      // Kirim notifikasi ke SEMUA admin agar antrean verifikasi terpantau
      const admins = await tx.user.findMany({
        where: { role: UserRole.ADMIN },
        select: { id: true },
      })

      if (admins.length > 0) {
        await tx.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            title: 'Pembayaran Baru Menunggu Verifikasi',
            message: `${invoice.rental.user.name} mengirim bukti pembayaran ${formatRupiah(data.amount)} untuk tagihan ${invoice.invoiceNumber} (unit ${invoice.rental.unit.name}, periode ${formatBillingPeriod(invoice.billingPeriod)}). Segera verifikasi di antrean pembayaran.`,
            type: 'PAYMENT',
            linkUrl: '/admin/pembayaran',
          })),
        })
      }

      return payment
    })
  },

  /**
   * Menyetujui Pembayaran secara Atomik menggunakan PostgreSQL Database Transaction (PRD Sec 23 & 70)
   */
  async approvePayment(paymentId: string, adminUserId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Cek payment saat ini
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { invoice: true },
      })

      if (!payment) {
        throw new Error('Data pembayaran tidak ditemukan.')
      }

      if (payment.status === PaymentStatus.APPROVED) {
        throw new Error('Pembayaran ini sudah disetujui sebelumnya.')
      }

      const now = new Date()

      // 2. Update status pembayaran menjadi APPROVED
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.APPROVED,
          verifiedById: adminUserId,
          verifiedAt: now,
        },
      })

      // 3. Update status invoice menjadi PAID
      await tx.invoice.update({
        where: { id: payment.invoiceId },
        data: {
          status: InvoiceStatus.PAID,
          paidAt: now,
        },
      })

      // 4. Catat ke Audit Log
      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: 'ADMIN_APPROVED_PAYMENT',
          entityType: 'Payment',
          entityId: paymentId,
          metadata: {
            invoiceId: payment.invoiceId,
            amount: payment.amount.toString(),
            verifiedAt: now.toISOString(),
          },
        },
      })

      return updatedPayment
    })
  },

  /**
   * Menolak Pembayaran dengan alasan wajib (PRD Sec 24 & 70)
   */
  async rejectPayment(paymentId: string, adminUserId: string, reason: string) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { invoice: true },
      })

      if (!payment) {
        throw new Error('Data pembayaran tidak ditemukan.')
      }

      if (payment.status === PaymentStatus.APPROVED) {
        throw new Error('Pembayaran yang sudah disetujui tidak dapat ditolak.')
      }

      const now = new Date()

      // 1. Update status pembayaran menjadi REJECTED
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.REJECTED,
          rejectionReason: reason,
          verifiedById: adminUserId,
          verifiedAt: now,
        },
      })

      // 2. Kembalikan status invoice ke UNPAID (atau OVERDUE jika telah lewat jatuh tempo)
      const isOverdue = payment.invoice.dueDate < now
      await tx.invoice.update({
        where: { id: payment.invoiceId },
        data: {
          status: isOverdue ? InvoiceStatus.OVERDUE : InvoiceStatus.UNPAID,
        },
      })

      // 3. Catat ke Audit Log
      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: 'PAYMENT_REJECTED',
          entityType: 'Payment',
          entityId: paymentId,
          metadata: {
            reason,
            invoiceId: payment.invoiceId,
            rejectedAt: now.toISOString(),
          },
        },
      })

      return updatedPayment
    })
  },
}
