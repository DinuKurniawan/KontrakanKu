import { z } from 'zod'
import { normalizePhoneNumber } from './sanitizer'

/**
 * Validasi CUID / UUID string
 */
export const idSchema = z
  .string()
  .min(1, 'ID tidak boleh kosong')
  .max(128, 'ID terlalu panjang')

/**
 * Validasi Email terstandardisasi (lowercase & trimmed)
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Email wajib diisi')
  .max(255, 'Email maksimal 255 karakter')
  .email('Format alamat email tidak valid')

/**
 * Validasi Nomor Telepon Indonesia (PRD Sec 69: 9-15 digit)
 */
export const phoneSchema = z
  .string()
  .transform(val => normalizePhoneNumber(val))
  .pipe(
    z
      .string()
      .regex(/^08[1-9][0-9]{6,11}$/, 'Nomor telepon harus berformat Indonesia (contoh: 081234567890, 9-14 digit)')
  )

/**
 * Validasi Nominal Mata Uang Rupiah (Positive Amount, maksimal 1 Milyar untuk kewajaran transaksi kontrakan)
 */
export const rupiahAmountSchema = z.coerce
  .number()
  .positive('Nominal pembayaran harus lebih besar dari Rp0')
  .max(1_000_000_000, 'Nominal melebihi batas wajar transaksi')
  .refine(val => Number.isFinite(val), 'Nominal harus berupa angka valid')

/**
 * Validasi Periode Tagihan Bulanan (Format: YYYY-MM)
 */
export const billingPeriodSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Format periode tagihan harus YYYY-MM (contoh: 2026-09)')

/**
 * Validasi Rentang Tanggal (startDate <= endDate)
 */
export const dateRangeSchema = z
  .object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional().nullable(),
  })
  .refine(
    data => {
      if (data.endDate && data.startDate) {
        return data.startDate <= data.endDate
      }
      return true
    },
    {
      message: 'Tanggal akhir sewa tidak boleh mendahului tanggal mulai sewa',
      path: ['endDate'],
    }
  )

/**
 * Validasi Pagination & Query Standar (PRD Sec 67 & 68)
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().max(100).optional(),
  sortBy: z.string().trim().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>

