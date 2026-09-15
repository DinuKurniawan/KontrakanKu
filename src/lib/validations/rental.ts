import { z } from 'zod'
import { idSchema, rupiahAmountSchema } from './common'
import { sanitizeText } from './sanitizer'

export const assignTenantSchema = z
  .object({
    userId: idSchema,
    unitId: idSchema,
    startDate: z.coerce.date({ message: 'Tanggal mulai sewa tidak valid' }),
    endDate: z.coerce.date({ message: 'Tanggal akhir sewa tidak valid' }).optional().nullable(),
    monthlyRent: rupiahAmountSchema.optional(),
    notes: z
      .string()
      .max(500, 'Catatan maksimal 500 karakter')
      .nullish()
      .transform(val => (val ? sanitizeText(val) : undefined))
      .optional(),
    generateInitialInvoice: z.boolean().default(true),
  })
  .refine(
    data => {
      if (data.endDate && data.startDate) {
        return data.startDate < data.endDate
      }
      return true
    },
    {
      message: 'Tanggal akhir sewa harus lebih besar dari tanggal mulai sewa',
      path: ['endDate'],
    }
  )

export const endRentalSchema = z.object({
  rentalId: idSchema,
  reason: z
    .string()
    .max(500, 'Alasan maksimal 500 karakter')
    .nullish()
    .transform(val => (val ? sanitizeText(val) : undefined))
    .optional(),
})

export type AssignTenantInput = z.infer<typeof assignTenantSchema>
export type EndRentalInput = z.infer<typeof endRentalSchema>
