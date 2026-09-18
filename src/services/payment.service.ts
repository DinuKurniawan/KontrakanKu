import { paymentRepository } from '@/repositories/payment.repository'
import { invoiceRepository } from '@/repositories/invoice.repository'
import { submitPaymentSchema, verifyPaymentSchema, SubmitPaymentInput, VerifyPaymentInput } from '@/lib/validations/payment'
import { checkRateLimit, RATE_LIMIT_RULES } from '@/lib/validations/rate-limiter'
import { ActionResult, CurrentUser } from '@/types'
import { InvoiceStatus, UserRole } from '@prisma/client'

export const paymentService = {
  /**
   * Pengajuan Pembayaran Manual oleh Penyewa (PRD Sec 19, 20 & 31)
   */
  async submitPayment(input: SubmitPaymentInput, currentUser: CurrentUser): Promise<ActionResult> {
    // 1. Rate Limiting Pengajuan Pembayaran (PRD Sec 43.4)
    const rateLimitKey = `payment:${currentUser.id}`
    const rateCheck = checkRateLimit(rateLimitKey, RATE_LIMIT_RULES.PAYMENT_SUBMISSION)
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: rateCheck.error || 'Terlalu banyak percobaan submit pembayaran. Mohon tunggu beberapa saat.',
      }
    }

    // 2. Validasi Input Skema Zod
    const validated = submitPaymentSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Data pembayaran tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    const { invoiceId, paymentAccountId, amount, transferDate, senderBank, senderName, proofFileUrl, notes } = validated.data

    // 3. Object-Level Authorization (PRD Sec 31) + status invoice dalam
    // SATU query ringan (bukan assert 1x + findById penuh 1x).
    const invoice = await invoiceRepository.findStatusForSubmit(invoiceId)
    if (!invoice) {
      return { success: false, error: 'Tagihan tidak ditemukan.' }
    }
    if (currentUser.role !== UserRole.ADMIN && invoice.rental.userId !== currentUser.id) {
      return { success: false, error: 'Akses Ditolak: Anda tidak memiliki izin untuk melihat atau membayar tagihan ini.' }
    }

    // 4. Periksa status invoice
    if (invoice.status === InvoiceStatus.PAID) {
      return { success: false, error: 'Tagihan ini sudah lunas diverifikasi.' }
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      return { success: false, error: 'Tagihan ini sudah dibatalkan.' }
    }

    try {
      const payment = await paymentRepository.create({
        invoiceId,
        paymentAccountId,
        amount,
        transferDate,
        senderBank,
        senderName,
        proofFileUrl,
        notes,
        userId: currentUser.id,
      })

      return { success: true, data: payment }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengirim pembayaran'
      return { success: false, error: message }
    }
  },

  /**
   * Verifikasi Persetujuan Pembayaran oleh Admin (PRD Sec 23 & 70)
   */
  async approvePayment(paymentId: string, adminUserId: string): Promise<ActionResult> {
    try {
      const payment = await paymentRepository.approvePayment(paymentId, adminUserId)
      return { success: true, data: payment }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memverifikasi pembayaran'
      return { success: false, error: message }
    }
  },

  /**
   * Penolakan Pembayaran oleh Admin (PRD Sec 24 & 70)
   */
  async rejectPayment(paymentId: string, adminUserId: string, reason: string): Promise<ActionResult> {
    const validated = verifyPaymentSchema.safeParse({
      paymentId,
      action: 'REJECT',
      rejectionReason: reason,
    })

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Alasan penolakan tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    try {
      const payment = await paymentRepository.rejectPayment(paymentId, adminUserId, validated.data.rejectionReason as string)
      return { success: true, data: payment }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menolak pembayaran'
      return { success: false, error: message }
    }
  },

  /**
   * Detail Pembayaran dengan Object-Level Authorization (PRD Sec 31)
   */
  async getPaymentDetail(paymentId: string, currentUser: CurrentUser): Promise<ActionResult> {
    try {
      // SATU query: data penuh + cek kepemilikan dari hasil yang sama
      // (bukan assert 1x + findById 1x).
      const payment = await paymentRepository.findById(paymentId)
      if (!payment) {
        return { success: false, error: 'Data pembayaran tidak ditemukan.' }
      }
      if (currentUser.role !== UserRole.ADMIN && payment.invoice.rental.user.id !== currentUser.id) {
        return { success: false, error: 'Akses Ditolak: Anda tidak memiliki izin untuk melihat transaksi pembayaran ini.' }
      }
      return { success: true, data: payment }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Akses ditolak'
      return { success: false, error: message }
    }
  },
}
