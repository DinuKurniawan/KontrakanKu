import { z } from 'zod'
import { idSchema, billingPeriodSchema, paginationQuerySchema } from './common'

/**
 * Validasi Filter Katalog & Pencarian Kontrakan (PRD Sec 7 & 67)
 */
export const propertyQuerySchema = paginationQuerySchema.extend({
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
}).refine(
  data => {
    if (data.minPrice && data.maxPrice) {
      return data.minPrice <= data.maxPrice
    }
    return true
  },
  {
    message: 'Harga minimum tidak boleh melebihi harga maksimum',
    path: ['maxPrice'],
  }
)

/**
 * Validasi Filter Unit / Kamar (PRD Sec 11 & 67)
 */
export const unitQuerySchema = paginationQuerySchema.extend({
  propertyId: idSchema.optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'INACTIVE']).optional(),
})

/**
 * Validasi Filter Tagihan Invoice (PRD Sec 15, 17 & 67)
 */
export const invoiceQuerySchema = paginationQuerySchema.extend({
  rentalId: idSchema.optional(),
  status: z.enum(['UNPAID', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
  billingPeriod: billingPeriodSchema.optional(),
})

/**
 * Validasi Filter Verifikasi Pembayaran (PRD Sec 22 & 67)
 */
export const paymentQuerySchema = paginationQuerySchema.extend({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  invoiceId: idSchema.optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export type PropertyQueryInput = z.infer<typeof propertyQuerySchema>
export type UnitQueryInput = z.infer<typeof unitQuerySchema>
export type InvoiceQueryInput = z.infer<typeof invoiceQuerySchema>
export type PaymentQueryInput = z.infer<typeof paymentQuerySchema>
