import { z } from 'zod'
import { idSchema, rupiahAmountSchema, billingPeriodSchema } from './common'
import { sanitizeText } from './sanitizer'

export const createInvoiceSchema = z.object({
  rentalId: idSchema,
  billingPeriod: billingPeriodSchema,
  amount: rupiahAmountSchema,
  dueDate: z.coerce.date({ message: 'Tanggal jatuh tempo tidak valid' }),
  notes: z
    .string()
    .max(500, 'Catatan tagihan maksimal 500 karakter')
    .nullish()
    .transform(val => (val ? sanitizeText(val) : undefined))
    .optional(),
})

export const generateBatchInvoicesSchema = z.object({
  billingPeriod: billingPeriodSchema,
  dueDay: z.coerce
    .number()
    .min(1, 'Tanggal jatuh tempo minimal 1')
    .max(28, 'Tanggal jatuh tempo maksimal 28 (agar konsisten setiap bulan)')
    .default(10),
})

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>
export type GenerateBatchInvoicesInput = z.infer<typeof generateBatchInvoicesSchema>
