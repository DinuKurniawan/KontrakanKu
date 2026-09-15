import { paymentAccountRepository } from '@/repositories/payment-account.repository'
import { auditRepository } from '@/repositories/audit.repository'
import {
  paymentAccountSchema,
  updatePaymentAccountSchema,
  PaymentAccountInput,
  UpdatePaymentAccountInput,
} from '@/lib/validations/payment'
import { ActionResult } from '@/types'

export const paymentAccountService = {
  async listAll() {
    return paymentAccountRepository.findAll()
  },

  async listActive() {
    return paymentAccountRepository.findActive()
  },

  async createPaymentAccount(adminUserId: string, input: PaymentAccountInput): Promise<ActionResult> {
    const validated = paymentAccountSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validasi rekening bank gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    try {
      const account = await paymentAccountRepository.create({
        bankName: validated.data.bankName,
        accountNumber: validated.data.accountNumber,
        accountName: validated.data.accountName,
        qrCodeUrl: validated.data.qrCodeUrl,
        isActive: validated.data.isActive,
      })

      await auditRepository.log({
        action: 'PAYMENT_ACCOUNT_CREATED',
        entityType: 'PaymentAccount',
        entityId: account.id,
        userId: adminUserId,
        metadata: { bank: account.bankName, number: account.accountNumber },
      })

      return { success: true, data: account }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menambahkan rekening pembayaran'
      return { success: false, error: message }
    }
  },

  async updatePaymentAccount(
    adminUserId: string,
    id: string,
    input: UpdatePaymentAccountInput
  ): Promise<ActionResult> {
    const validated = updatePaymentAccountSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validasi rekening bank gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    try {
      const account = await paymentAccountRepository.update(id, validated.data)

      await auditRepository.log({
        action: 'PAYMENT_ACCOUNT_UPDATED',
        entityType: 'PaymentAccount',
        entityId: id,
        userId: adminUserId,
        metadata: validated.data,
      })

      return { success: true, data: account }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui rekening pembayaran'
      return { success: false, error: message }
    }
  },

  async toggleAccountStatus(adminUserId: string, id: string): Promise<ActionResult> {
    try {
      const account = await paymentAccountRepository.toggleStatus(id)

      await auditRepository.log({
        action: 'PAYMENT_ACCOUNT_STATUS_CHANGED',
        entityType: 'PaymentAccount',
        entityId: id,
        userId: adminUserId,
        metadata: { isActive: account.isActive },
      })

      return { success: true, data: account }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengubah status rekening'
      return { success: false, error: message }
    }
  },

  async deletePaymentAccount(adminUserId: string, id: string): Promise<ActionResult> {
    try {
      const account = await paymentAccountRepository.delete(id)

      await auditRepository.log({
        action: 'PAYMENT_ACCOUNT_DELETED',
        entityType: 'PaymentAccount',
        entityId: id,
        userId: adminUserId,
      })

      return { success: true, data: account }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus rekening'
      return { success: false, error: message }
    }
  },
}
