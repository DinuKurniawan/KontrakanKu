import { invoiceRepository } from '@/repositories/invoice.repository'
import { rentalRepository } from '@/repositories/rental.repository'
import { createInvoiceSchema, generateBatchInvoicesSchema, CreateInvoiceInput, GenerateBatchInvoicesInput } from '@/lib/validations/invoice'
import { ActionResult, CurrentUser } from '@/types'
import { UserRole } from '@prisma/client'

export const billingService = {
  /**
   * Membuat Tagihan Manual Baru untuk Satu Rental (PRD Sec 15 & 17)
   */
  async createInvoice(input: CreateInvoiceInput, adminUserId: string): Promise<ActionResult> {
    const validated = createInvoiceSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Validasi data tagihan gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    const { rentalId, billingPeriod, amount, dueDate, notes } = validated.data

    // Fetch ringan: cukup keberadaan + status (detail penuh tidak dibutuhkan di sini)
    const rental = await rentalRepository.findStatusById(rentalId)
    if (!rental) {
      return { success: false, error: 'Data kontrak sewa tidak ditemukan.' }
    }

    if (rental.status !== 'ACTIVE') {
      return { success: false, error: 'Tagihan hanya dapat dibuat untuk kontrak sewa yang berstatus AKTIF.' }
    }

    try {
      const invoice = await invoiceRepository.create({
        rentalId,
        billingPeriod,
        amount,
        dueDate,
        notes,
        adminUserId,
      })

      return { success: true, data: invoice }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal membuat tagihan'
      return { success: false, error: message }
    }
  },

  /**
   * Generate Tagihan Bulanan Massal untuk Semua Kontrak Sewa Aktif (PRD Sec 17 & 62)
   */
  async generateBatchInvoices(input: GenerateBatchInvoicesInput, adminUserId: string): Promise<ActionResult> {
    const validated = generateBatchInvoicesSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Validasi periode tagihan massal gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    const { billingPeriod, dueDay } = validated.data

    try {
      const results = await invoiceRepository.generateBatchInvoices(billingPeriod, dueDay, adminUserId)
      return {
        success: true,
        data: results,
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghasilkan tagihan bulanan'
      return { success: false, error: message }
    }
  },

  /**
   * Sinkronisasi status tagihan yang telah melewati jatuh tempo (PRD Sec 64)
   */
  async syncOverdueInvoices(): Promise<number> {
    return invoiceRepository.syncOverdueInvoices()
  },

  /**
   * Ambil detail invoice dengan Object-Level Authorization Guard (PRD Sec 31)
   */
  async getInvoiceDetail(invoiceId: string, currentUser: CurrentUser): Promise<ActionResult> {
    try {
      // SATU query: data penuh + cek kepemilikan dari hasil yang sama
      // (bukan assert 1x + findById 1x).
      const invoice = await invoiceRepository.findById(invoiceId)
      if (!invoice) {
        return { success: false, error: 'Tagihan tidak ditemukan.' }
      }
      if (currentUser.role !== UserRole.ADMIN && invoice.rental.user.id !== currentUser.id) {
        return { success: false, error: 'Akses Ditolak: Anda tidak memiliki izin untuk melihat atau membayar tagihan ini.' }
      }
      return { success: true, data: invoice }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Akses ditolak'
      return { success: false, error: message }
    }
  },
}
